import os

import pytest


class TestSettingsDefaults:
    def test_required_fields_loaded(self):
        from config import settings

        assert settings.telegram_bot_token == os.environ.get("TELEGRAM_BOT_TOKEN", "test-token-000")
        assert isinstance(settings.telegram_admin_user_id, int)

    def test_default_values(self):
        from config import settings

        assert settings.git_user_name == "Claude Sonnet 4.5"
        assert settings.git_user_email == "noreply@anthropic.com"
        assert settings.git_default_branch == "master"
        assert settings.workflow_timeout_seconds == 1800

    def test_claude_bin_default(self):
        from config import settings

        assert settings.claude_code_bin == "/opt/homebrew/bin/claude"
