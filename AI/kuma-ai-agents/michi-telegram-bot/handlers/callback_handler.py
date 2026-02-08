import logging
from telegram import Update
from telegram.ext import ContextTypes
from config import settings
from workflows.orchestrator import WorkflowOrchestrator

logger = logging.getLogger(__name__)

orchestrator = WorkflowOrchestrator()


async def handle_callback_query(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if update.effective_user.id != settings.telegram_admin_user_id:
        await query.edit_message_text("⛔ Unauthorized.")
        return

    data = query.data

    if data.startswith("confirm_"):
        workflow_id = data.replace("confirm_", "")
        await _handle_confirmation(query, workflow_id)

    elif data.startswith("cancel_"):
        workflow_id = data.replace("cancel_", "")
        await _handle_cancellation(query, workflow_id)


async def _handle_confirmation(query, workflow_id: str):
    await query.edit_message_text("⚙️ Starting workflow execution...")

    workflow = orchestrator.state_manager.get_workflow(workflow_id)
    if not workflow:
        await query.edit_message_text(f"❌ Workflow {workflow_id} not found.")
        return

    confirmed_options = orchestrator.state_manager.get_pending_confirmation(workflow_id)
    orchestrator.state_manager.clear_pending_confirmation(workflow_id)

    async def progress_callback(msg: str):
        try:
            await query.edit_message_text(msg)
        except Exception as e:
            logger.warning(f"Failed to update progress: {e}")

    try:
        await orchestrator.execute_workflow(
            workflow_id=workflow_id,
            progress_callback=progress_callback,
            confirmed_options=confirmed_options,
        )

        final_workflow = orchestrator.state_manager.get_workflow(workflow_id)
        results = final_workflow.get("result_data", {})

        all_files = []
        for result in results.values():
            if isinstance(result, dict):
                all_files.extend(result.get("files_created", []))

        completion_msg = f"""
🎉 **Workflow Complete!** (ID: {workflow_id})

**Created files:**
{chr(10).join(f'• {f}' for f in all_files[:10])}

Ready to commit or publish.
"""

        await query.edit_message_text(completion_msg, parse_mode="Markdown")

    except Exception as e:
        logger.error(f"Workflow execution failed: {e}", exc_info=True)
        await query.edit_message_text(f"❌ Execution failed: {str(e)}")


async def _handle_cancellation(query, workflow_id: str):
    from workflows.state_manager import WorkflowState

    orchestrator.state_manager.update_workflow_state(
        workflow_id, WorkflowState.FAILED, {"error": "User cancelled"}
    )
    orchestrator.state_manager.clear_pending_confirmation(workflow_id)

    await query.edit_message_text(f"❌ Workflow {workflow_id} cancelled.")
