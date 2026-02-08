import pytest
from unittest.mock import AsyncMock, patch
from workflows.orchestrator import WorkflowOrchestrator
from workflows.state_manager import WorkflowState


@pytest.fixture
def orchestrator(tmp_db):
    orch = WorkflowOrchestrator()
    from workflows.state_manager import WorkflowStateManager

    orch.state_manager = WorkflowStateManager(db_path=tmp_db)
    return orch


class TestIntentParsing:
    def test_parse_url_from_message(self):
        from parsers.intent_parser import IntentParser

        parser = IntentParser()
        intent = parser.parse("analyze https://www.anthropic.com")
        assert intent.url == "https://www.anthropic.com"
        assert intent.raw_text == "analyze https://www.anthropic.com"

    def test_parse_no_url(self):
        from parsers.intent_parser import IntentParser

        parser = IntentParser()
        intent = parser.parse("just do something")
        assert intent.url is None

    def test_parse_multiple_urls_returns_first(self):
        from parsers.intent_parser import IntentParser

        parser = IntentParser()
        intent = parser.parse("check https://a.com and https://b.com")
        assert intent.url == "https://a.com"
