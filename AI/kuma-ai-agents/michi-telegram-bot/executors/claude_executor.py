import asyncio
import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional
from config import settings

logger = logging.getLogger(__name__)

class ClaudeCodeExecutor:
    def __init__(self):
        self.claude_bin = settings.claude_code_bin
        self.working_dir = Path(settings.claude_code_working_dir)
        self.timeout = settings.workflow_timeout_seconds

    async def execute_skill(
        self,
        skill_name: str,
        prompt: str,
        skill_args: str = "",
        progress_callback=None
    ) -> Dict[str, Any]:
        logger.info(f"Executing skill: {skill_name}")

        cmd = [
            self.claude_bin,
            "--print",
            "--output-format", "stream-json",
            f"/{skill_name} {skill_args}",
            prompt
        ]

        result = {
            "success": False,
            "output": [],
            "files_created": [],
            "error": None
        }

        try:
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=str(self.working_dir)
            )

            async for line in self._read_stream_with_timeout(process.stdout):
                try:
                    event = json.loads(line.decode().strip())
                    result["output"].append(event)

                    if progress_callback:
                        await progress_callback(self._format_progress(event))

                    if event.get("type") == "file_created":
                        result["files_created"].append(event.get("path"))

                except json.JSONDecodeError:
                    logger.debug(f"Non-JSON output: {line.decode()}")

            await asyncio.wait_for(process.wait(), timeout=self.timeout)

            result["success"] = process.returncode == 0

            if not result["success"]:
                stderr = await process.stderr.read()
                result["error"] = stderr.decode()

        except asyncio.TimeoutError:
            result["error"] = f"Skill execution timed out after {self.timeout}s"
            logger.error(result["error"])
            process.kill()
        except Exception as e:
            result["error"] = str(e)
            logger.error(f"Skill execution failed: {e}")

        return result

    async def _read_stream_with_timeout(self, stream, timeout=5):
        while True:
            try:
                line = await asyncio.wait_for(stream.readline(), timeout=timeout)
                if not line:
                    break
                yield line
            except asyncio.TimeoutError:
                continue

    def _format_progress(self, event: Dict[str, Any]) -> str:
        event_type = event.get("type", "")

        if event_type == "text":
            return event.get("content", "")
        elif event_type == "tool_use":
            tool = event.get("tool", "")
            return f"⚙️ Using {tool}..."
        elif event_type == "file_created":
            path = event.get("path", "")
            return f"📄 Created {path}"
        elif event_type == "skill_progress":
            step = event.get("step", "")
            return f"⏳ {step}"
        else:
            return ""
