import logging
from telegram import Update
from telegram.ext import ContextTypes
from config import settings
from workflows.orchestrator import WorkflowOrchestrator

logger = logging.getLogger(__name__)

orchestrator = WorkflowOrchestrator()

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id != settings.telegram_admin_user_id:
        await update.message.reply_text("⛔ Unauthorized access.")
        return

    user_message = update.message.text
    chat_id = update.effective_chat.id

    status_message = await update.message.reply_text("⏳ Processing...")

    async def progress_callback(msg: str):
        if msg:
            try:
                await status_message.edit_text(msg)
            except Exception as e:
                logger.warning(f"Failed to update status: {e}")

    try:
        workflow_id = await orchestrator.start_workflow(
            user_message=user_message,
            chat_id=chat_id,
            progress_callback=progress_callback
        )

        workflow = orchestrator.state_manager.get_workflow(workflow_id)

        if workflow["state"].value == "confirming":
            options = orchestrator.state_manager.get_pending_confirmation(workflow_id)

            confirmation_msg = f"""
📊 **Workflow Plan** (ID: {workflow_id})

**Skills:** {', '.join(options['skills'])}
**Estimated time:** {options['estimated_time']}
**Will create:** {options['will_create']}

**Options:**
Art style: {options.get('art_style', 'default')}
Tone: {options.get('tone', 'neutral')}

Confirm to proceed?
"""

            from telegram import InlineKeyboardButton, InlineKeyboardMarkup

            keyboard = [
                [
                    InlineKeyboardButton("✅ Confirm", callback_data=f"confirm_{workflow_id}"),
                    InlineKeyboardButton("❌ Cancel", callback_data=f"cancel_{workflow_id}")
                ]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)

            await status_message.edit_text(
                confirmation_msg,
                reply_markup=reply_markup,
                parse_mode="Markdown"
            )

        elif workflow["state"].value == "completed":
            await _send_completion_message(update, workflow_id, workflow)

    except Exception as e:
        logger.error(f"Message handling failed: {e}", exc_info=True)
        await status_message.edit_text(f"❌ Error: {str(e)}")

async def _send_completion_message(update: Update, workflow_id: str, workflow: dict):
    results = workflow.get("result_data", {})

    all_files = []
    for result in results.values():
        if isinstance(result, dict):
            all_files.extend(result.get("files_created", []))

    completion_msg = f"""
🎉 **Workflow Complete!** (ID: {workflow_id})

**Created files:**
{chr(10).join(f'• {f}' for f in all_files)}

**Next steps:**
• Review the generated content
• Commit to GitHub
• Publish to X
"""

    await update.message.reply_text(completion_msg, parse_mode="Markdown")
