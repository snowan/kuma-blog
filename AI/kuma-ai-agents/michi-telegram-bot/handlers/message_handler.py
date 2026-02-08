import logging
from telegram import Update
from telegram.ext import ContextTypes
from config import settings
from workflows.orchestrator import WorkflowOrchestrator

logger = logging.getLogger(__name__)

orchestrator = WorkflowOrchestrator()


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle user text messages and pass directly to Claude Code"""

    logger.info(
        f"📨 Received message from user {update.effective_user.id}: {update.message.text[:50]}..."
    )
    logger.info(f"🔑 Expected admin user ID: {settings.telegram_admin_user_id}")

    if update.effective_user.id != settings.telegram_admin_user_id:
        logger.warning(f"⛔ Unauthorized access attempt from user {update.effective_user.id}")
        await update.message.reply_text("⛔ Unauthorized access.")
        return

    user_message = update.message.text
    chat_id = update.effective_chat.id

    status_message = await update.message.reply_text("⏳ Processing with Claude Code...")

    async def progress_callback(msg: str):
        """Update status message with progress"""
        if msg:
            try:
                await status_message.edit_text(f"🤖 {msg}")
            except Exception as e:
                logger.warning(f"Failed to update status: {e}")

    try:
        # Execute workflow (directly calls Claude Code)
        workflow_id = await orchestrator.start_workflow(
            user_message=user_message, chat_id=chat_id, progress_callback=progress_callback
        )

        # Get final results
        workflow = orchestrator.state_manager.get_workflow(workflow_id)

        if workflow["state"].value == "completed":
            await _send_completion_message(update, workflow_id, workflow)
        else:
            await status_message.edit_text(f"❌ Workflow failed. Check logs for details.")

    except Exception as e:
        logger.error(f"Message handling failed: {e}", exc_info=True)
        await status_message.edit_text(f"❌ Error: {str(e)[:200]}")


async def _send_completion_message(update: Update, workflow_id: str, workflow: dict):
    """Send workflow completion summary"""

    results = workflow.get("result_data", {})

    # Collect created files
    all_files = results.get("files_created", [])

    if all_files:
        completion_msg = f"""
🎉 **Task Complete!** (ID: {workflow_id})

**Created files:**
{chr(10).join(f'• {f}' for f in all_files[:10])}
"""
    else:
        # No files created - just show output snippet
        output = results.get("output", "")
        snippet = output[:500] if output else "Task completed successfully"
        completion_msg = f"""
✅ **Task Complete!** (ID: {workflow_id})

{snippet}
"""

    await update.message.reply_text(completion_msg, parse_mode="Markdown")
