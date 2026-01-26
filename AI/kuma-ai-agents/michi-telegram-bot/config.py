from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

class Settings(BaseSettings):
    telegram_bot_token: str
    telegram_admin_user_id: int

    claude_code_bin: str = "/opt/homebrew/bin/claude"
    claude_code_working_dir: str

    gemini_api_key: str

    git_user_name: str = "Claude Sonnet 4.5"
    git_user_email: str = "noreply@anthropic.com"
    git_default_branch: str = "master"

    workflow_timeout_seconds: int = 1800

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )

settings = Settings()
