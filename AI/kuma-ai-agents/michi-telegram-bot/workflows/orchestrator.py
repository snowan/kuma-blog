import uuid
import logging
from typing import Callable, Optional, Dict, Any
from parsers.intent_parser import IntentParser
from executors.claude_executor import ClaudeCodeExecutor
from executors.git_executor import GitExecutor
from workflows.state_manager import WorkflowStateManager, WorkflowState

logger = logging.getLogger(__name__)

class WorkflowOrchestrator:
    """Simplified orchestrator that passes requests directly to Claude Code"""

    def __init__(self):
        self.parser = IntentParser()
        self.executor = ClaudeCodeExecutor()
        self.git_executor = GitExecutor()
        self.state_manager = WorkflowStateManager()

    async def start_workflow(
        self,
        user_message: str,
        chat_id: int,
        progress_callback: Callable
    ) -> str:
        """
        Start workflow by passing user message directly to Claude Code

        Returns:
            workflow_id for tracking
        """
        workflow_id = str(uuid.uuid4())[:8]

        try:
            await progress_callback("🤖 Processing your request...")

            # Parse to extract URL (simple)
            intent = self.parser.parse(user_message)

            # Save workflow
            self.state_manager.create_workflow(
                workflow_id=workflow_id,
                chat_id=chat_id,
                intent_data={
                    "raw_text": intent.raw_text,
                    "url": intent.url
                }
            )

            # Execute directly with Claude Code
            return await self.execute_workflow(workflow_id, progress_callback)

        except Exception as e:
            logger.error(f"Workflow start failed: {e}")
            self.state_manager.update_workflow_state(
                workflow_id,
                WorkflowState.FAILED,
                {"error": str(e)}
            )
            raise

    async def execute_workflow(
        self,
        workflow_id: str,
        progress_callback: Callable,
        confirmed_options: Optional[Dict[str, Any]] = None
    ) -> str:
        """Execute workflow by calling Claude Code CLI directly"""

        workflow = self.state_manager.get_workflow(workflow_id)
        if not workflow:
            raise ValueError(f"Workflow {workflow_id} not found")

        intent_data = workflow["intent_data"]
        user_message = intent_data["raw_text"]

        try:
            self.state_manager.update_workflow_state(
                workflow_id,
                WorkflowState.EXECUTING
            )

            await progress_callback("⚙️ Executing with Claude Code...")

            # Execute Claude Code with user's raw message
            # Claude Code will handle all interpretation and skill execution
            result = await self.executor.execute_direct(
                user_message=user_message,
                progress_callback=progress_callback
            )

            if not result["success"]:
                raise Exception(f"Execution failed: {result['error']}")

            # Store results
            self.state_manager.update_workflow_state(
                workflow_id,
                WorkflowState.COMPLETED,
                result
            )

            return workflow_id

        except Exception as e:
            logger.error(f"Workflow execution failed: {e}")
            self.state_manager.update_workflow_state(
                workflow_id,
                WorkflowState.FAILED,
                {"error": str(e)}
            )
            raise

    async def commit_workflow_results(
        self,
        workflow_id: str,
        progress_callback: Callable
    ) -> bool:
        """Commit generated files to git"""

        workflow = self.state_manager.get_workflow(workflow_id)
        if not workflow:
            return False

        results = workflow.get("result_data", {})
        intent_data = workflow["intent_data"]

        # Collect all created files
        all_files = results.get("files_created", [])

        if not all_files:
            logger.warning("No files to commit")
            return False

        await progress_callback("📝 Committing to GitHub...")

        # Generate commit message
        commit_message = self.git_executor.generate_commit_message(
            workflow_type="content",
            url=intent_data.get("url"),
            files_created=all_files
        )

        # Add co-author
        co_author = "Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

        # Commit and push
        git_result = await self.git_executor.commit_and_push(
            files=all_files,
            commit_message=commit_message,
            co_author=co_author
        )

        if git_result["success"]:
            await progress_callback(f"✅ Committed: {git_result['commit_hash'][:8]}")
            return True
        else:
            await progress_callback(f"❌ Commit failed: {git_result['error']}")
            return False
