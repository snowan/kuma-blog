import asyncio
import json
from unittest.mock import AsyncMock, patch

import pytest

from executors.claude_executor import ClaudeCodeExecutor, extract_file_paths


@pytest.fixture
def executor():
    return ClaudeCodeExecutor()


def _mock_stream_reader(lines):
    """Create an async generator that yields lines, replacing _read_stream_with_timeout."""

    async def fake_reader(stream, timeout=5):
        for line in lines:
            yield line

    return fake_reader


class TestExtractFilePaths:
    def test_created_file(self):
        assert extract_file_paths("Created file: /tmp/output.md") == ["/tmp/output.md"]

    def test_wrote_to(self):
        assert extract_file_paths("Wrote to /tmp/output.md") == ["/tmp/output.md"]

    def test_no_match(self):
        assert extract_file_paths("Just some regular output") == []

    def test_empty_string(self):
        assert extract_file_paths("") == []


class TestFormatProgress:
    def test_text_event(self, executor):
        assert executor._format_progress({"type": "text", "content": "hello"}) == "hello"

    def test_tool_use_event(self, executor):
        result = executor._format_progress({"type": "tool_use", "tool": "read_file"})
        assert "read_file" in result

    def test_file_created_event(self, executor):
        result = executor._format_progress({"type": "file_created", "path": "/tmp/a.md"})
        assert "/tmp/a.md" in result

    def test_unknown_event(self, executor):
        assert executor._format_progress({"type": "unknown_xyz"}) == ""

    def test_empty_event(self, executor):
        assert executor._format_progress({}) == ""


class TestExecuteDirect:
    @pytest.mark.asyncio
    async def test_successful_execution(self, executor, mock_progress):
        mock_proc = AsyncMock()
        mock_proc.returncode = 0
        mock_proc.stderr = AsyncMock()
        mock_proc.wait = AsyncMock()

        with patch("asyncio.create_subprocess_exec", return_value=mock_proc):
            executor._read_stream_with_timeout = _mock_stream_reader(
                [b"line 1\n", b"line 2\n"]
            )
            with patch("asyncio.wait_for", return_value=None):
                result = await executor.execute_direct("test message", mock_progress)

        assert result["success"] is True
        assert "line 1" in result["output"]

    @pytest.mark.asyncio
    async def test_failed_execution(self, executor):
        mock_proc = AsyncMock()
        mock_proc.returncode = 1
        mock_proc.stderr = AsyncMock()
        mock_proc.stderr.read = AsyncMock(return_value=b"some error")
        mock_proc.wait = AsyncMock()

        with patch("asyncio.create_subprocess_exec", return_value=mock_proc):
            executor._read_stream_with_timeout = _mock_stream_reader([b"output\n"])
            with patch("asyncio.wait_for", return_value=None):
                result = await executor.execute_direct("test message")

        assert result["success"] is False
        assert result["error"] == "some error"

    @pytest.mark.asyncio
    async def test_file_extraction_from_output(self, executor):
        mock_proc = AsyncMock()
        mock_proc.returncode = 0
        mock_proc.stderr = AsyncMock()
        mock_proc.wait = AsyncMock()

        with patch("asyncio.create_subprocess_exec", return_value=mock_proc):
            executor._read_stream_with_timeout = _mock_stream_reader(
                [b"Created file: /tmp/output.md\n"]
            )
            with patch("asyncio.wait_for", return_value=None):
                result = await executor.execute_direct("test")

        assert "/tmp/output.md" in result["files_created"]


class TestExecuteSkill:
    @pytest.mark.asyncio
    async def test_json_stream_parsing(self, executor):
        events = [
            json.dumps({"type": "text", "content": "hello"}).encode() + b"\n",
            json.dumps({"type": "file_created", "path": "/tmp/f.md"}).encode() + b"\n",
        ]

        mock_proc = AsyncMock()
        mock_proc.returncode = 0
        mock_proc.stderr = AsyncMock()
        mock_proc.wait = AsyncMock()

        with patch("asyncio.create_subprocess_exec", return_value=mock_proc):
            executor._read_stream_with_timeout = _mock_stream_reader(events)
            with patch("asyncio.wait_for", return_value=None):
                result = await executor.execute_skill("test_skill", "prompt")

        assert result["success"] is True
        assert "/tmp/f.md" in result["files_created"]
