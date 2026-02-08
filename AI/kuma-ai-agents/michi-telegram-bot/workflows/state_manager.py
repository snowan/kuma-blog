import sqlite3
import json
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
from pathlib import Path

from models import WorkflowState

logger = logging.getLogger(__name__)


class WorkflowStateManager:
    def __init__(self, db_path: str = "bot_state.db"):
        self.db_path = Path(db_path)
        self.conn = sqlite3.connect(str(self.db_path), check_same_thread=False)
        self._create_tables()

    def _create_tables(self):
        cursor = self.conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS workflows (
                workflow_id TEXT PRIMARY KEY,
                chat_id INTEGER NOT NULL,
                state TEXT NOT NULL,
                intent_data TEXT,
                result_data TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS pending_confirmations (
                workflow_id TEXT PRIMARY KEY,
                chat_id INTEGER NOT NULL,
                options_data TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (workflow_id) REFERENCES workflows(workflow_id)
            )
        """)

        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_workflows_chat_id
            ON workflows(chat_id)
        """)

        self.conn.commit()

    def create_workflow(self, workflow_id: str, chat_id: int, intent_data: Dict[str, Any]):
        cursor = self.conn.cursor()
        now = datetime.now(timezone.utc).isoformat()

        cursor.execute(
            """
            INSERT INTO workflows (workflow_id, chat_id, state, intent_data, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """,
            (workflow_id, chat_id, WorkflowState.PARSING.value, json.dumps(intent_data), now, now),
        )

        self.conn.commit()
        logger.info(f"Created workflow {workflow_id} for chat {chat_id}")

    def update_workflow_state(
        self, workflow_id: str, state: WorkflowState, result_data: Optional[Dict[str, Any]] = None
    ):
        cursor = self.conn.cursor()
        now = datetime.now(timezone.utc).isoformat()

        if result_data:
            cursor.execute(
                """
                UPDATE workflows
                SET state = ?, result_data = ?, updated_at = ?
                WHERE workflow_id = ?
            """,
                (state.value, json.dumps(result_data), now, workflow_id),
            )
        else:
            cursor.execute(
                """
                UPDATE workflows
                SET state = ?, updated_at = ?
                WHERE workflow_id = ?
            """,
                (state.value, now, workflow_id),
            )

        self.conn.commit()
        logger.info(f"Updated workflow {workflow_id} to state {state.value}")

    def get_workflow(self, workflow_id: str) -> Optional[Dict[str, Any]]:
        cursor = self.conn.cursor()

        cursor.execute(
            """
            SELECT workflow_id, chat_id, state, intent_data, result_data, created_at, updated_at
            FROM workflows
            WHERE workflow_id = ?
        """,
            (workflow_id,),
        )

        row = cursor.fetchone()
        if not row:
            return None

        return {
            "workflow_id": row[0],
            "chat_id": row[1],
            "state": WorkflowState(row[2]),
            "intent_data": json.loads(row[3]) if row[3] else None,
            "result_data": json.loads(row[4]) if row[4] else None,
            "created_at": row[5],
            "updated_at": row[6],
        }

    def save_pending_confirmation(self, workflow_id: str, chat_id: int, options: Dict[str, Any]):
        cursor = self.conn.cursor()
        now = datetime.now(timezone.utc).isoformat()

        cursor.execute(
            """
            INSERT OR REPLACE INTO pending_confirmations
            (workflow_id, chat_id, options_data, created_at)
            VALUES (?, ?, ?, ?)
        """,
            (workflow_id, chat_id, json.dumps(options), now),
        )

        self.conn.commit()
        logger.info(f"Saved pending confirmation for workflow {workflow_id}")

    def get_pending_confirmation(self, workflow_id: str) -> Optional[Dict[str, Any]]:
        cursor = self.conn.cursor()

        cursor.execute(
            """
            SELECT options_data FROM pending_confirmations
            WHERE workflow_id = ?
        """,
            (workflow_id,),
        )

        row = cursor.fetchone()
        return json.loads(row[0]) if row else None

    def clear_pending_confirmation(self, workflow_id: str):
        cursor = self.conn.cursor()
        cursor.execute("DELETE FROM pending_confirmations WHERE workflow_id = ?", (workflow_id,))
        self.conn.commit()

    def get_active_workflows(self, chat_id: int) -> List[Dict[str, Any]]:
        cursor = self.conn.cursor()

        cursor.execute(
            """
            SELECT workflow_id, state, created_at
            FROM workflows
            WHERE chat_id = ? AND state NOT IN (?, ?)
            ORDER BY created_at DESC
        """,
            (chat_id, WorkflowState.COMPLETED.value, WorkflowState.FAILED.value),
        )

        return [
            {"workflow_id": row[0], "state": row[1], "created_at": row[2]}
            for row in cursor.fetchall()
        ]

    def close(self) -> None:
        self.conn.close()
