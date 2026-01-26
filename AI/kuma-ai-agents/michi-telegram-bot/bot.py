import logging
from telegram.ext import Application, CommandHandler
from config import settings
from handlers.command_handler import start_command, help_command, status_command

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

def main():
    logger.info("Starting michi_ai_bot...")

    app = Application.builder().token(settings.telegram_bot_token).build()

    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("status", status_command))

    logger.info("Bot started. Press Ctrl+C to stop.")
    app.run_polling(allowed_updates=["message", "callback_query"])

if __name__ == "__main__":
    main()
