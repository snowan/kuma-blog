from telegram import Update
from telegram.ext import ContextTypes
from config import settings


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id

    if user_id != settings.telegram_admin_user_id:
        await update.message.reply_text("⛔ Unauthorized. This bot is private.")
        return

    welcome_msg = """
🤖 **michi_ai_bot** - Claude Code Automation

Send natural language instructions to generate content:

Example:
"analyze article https://example.com, generate manga comic, commit to github"

Available workflows:
• Article analysis → markdown
• Comic generation (manga/ligne-claire/vintage)
• Infographic creation
• Slide deck generation
• Git commit & push
• Publish to X (Twitter)

Commands:
/help - Show this message
/status - Check bot status
    """

    await update.message.reply_text(welcome_msg, parse_mode="Markdown")


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await start_command(update, context)


async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.effective_user.id != settings.telegram_admin_user_id:
        return

    status_msg = """
✅ **Bot Status**

Claude Code: Available
Gemini Parser: Available
Git: Ready
Working Dir: {working_dir}

Active workflows: 0
    """.format(working_dir=settings.claude_code_working_dir)

    await update.message.reply_text(status_msg, parse_mode="Markdown")
