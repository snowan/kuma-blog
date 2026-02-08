import os
import sqlite3
import tempfile
from pathlib import Path
from unittest.mock import AsyncMock

import pytest

os.environ.setdefault("TELEGRAM_BOT_TOKEN", "test-token-000")
os.environ.setdefault("TELEGRAM_ADMIN_USER_ID", "12345")
os.environ.setdefault("CLAUDE_CODE_WORKING_DIR", "/tmp/test-workdir")


@pytest.fixture
def tmp_db(tmp_path):
    db_path = tmp_path / "test_state.db"
    yield str(db_path)
    if db_path.exists():
        db_path.unlink()


@pytest.fixture
def state_manager(tmp_db):
    from workflows.state_manager import WorkflowStateManager

    mgr = WorkflowStateManager(db_path=tmp_db)
    yield mgr
    mgr.close()


@pytest.fixture
def mock_progress():
    return AsyncMock()
