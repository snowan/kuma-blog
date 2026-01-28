# michi_ai_bot - Telegram Integration for Claude Code

Natural language interface to Claude Code content generation workflows.

## Features

- 🤖 Direct Claude Code CLI integration for all query handling
- 🎨 Content generation: manga comics, infographics, slides, and more
- 📝 Automatic git commits with conventional messages
- 📊 Real-time progress updates from Claude
- 🔒 Single-user authorization
- ⚡ Simple architecture - Telegram message → Claude Code → Results

## Setup

### 1. Get Telegram Bot Token

1. Message @BotFather on Telegram
2. Create new bot: `/newbot`
3. Choose name: "Michi AI Bot"
4. Choose username: `michi_ai_bot`
5. Copy token: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### 2. Get Your Telegram User ID

1. Message @userinfobot
2. Copy your user ID (e.g., `123456789`)

### 3. Configure Environment

```bash
cd /Users/xiaowei.wan/code/kuma-blog/AI/kuma-ai-agents/michi-telegram-bot
cp .env.example .env
nano .env  # Edit with your values
```

Fill in:
- `TELEGRAM_BOT_TOKEN`: From @BotFather
- `TELEGRAM_ADMIN_USER_ID`: From @userinfobot
- Other values should be correct by default (Claude Code binary path and working directory)

### 4. Install Dependencies

```bash
python3 -m venv venv
source venv/bin/activate  # On Mac/Linux
pip install -r requirements.txt
```

### 5. Run Bot

**Easy way (recommended):**
```bash
./start_bot.sh
```

**Manual way:**
```bash
source venv/bin/activate
python bot.py
```

Expected output:
```
✅ Virtual environment activated
🤖 Starting michi_ai_bot...
2026-01-26 10:00:00 - __main__ - INFO - Starting michi_ai_bot...
2026-01-26 10:00:00 - __main__ - INFO - Bot started. Press Ctrl+C to stop.
```

## Usage

### Basic Commands

- `/start` - Show welcome message
- `/help` - Show help
- `/status` - Check bot status

### Natural Language Instructions

**Example 1: Simple analysis**
```
analyze article https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
```

**Example 2: Generate comic**
```
analyze https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents,
generate manga comic, commit to github
```

**Example 3: Create infographic**
```
create infographic from https://example.com/paper.pdf, publish to X
```

### Workflow Keywords

- **Fetch content**: "analyze", "fetch", URL
- **Generate comic**: "comic", "manga"
- **Generate infographic**: "infographic"
- **Generate slides**: "slides", "presentation"
- **Commit**: "commit", "push", "github"
- **Publish**: "publish to X", "post to twitter"

## Architecture

**Simplified Direct Integration:**

```
Telegram Message
      ↓
Message Handler (Authorization Check)
      ↓
Claude Code CLI --print
  (Handles ALL interpretation & execution)
      ↓
Stream Results → Telegram Progress Updates
      ↓
Git Commit (Optional)
      ↓
Completion Message
```

**No intermediary LLM!** Your message goes directly to Claude Code which:
- Understands your intent
- Executes appropriate skills
- Generates content
- Returns results

## File Structure

```
michi-telegram-bot/
├── bot.py                    # Main entry point
├── config.py                 # Configuration
├── handlers/
│   ├── command_handler.py    # /start, /help, /status
│   ├── message_handler.py    # Natural language messages
│   └── callback_handler.py   # Confirmation buttons
├── parsers/
│   └── intent_parser.py      # LLM-based parsing
├── executors/
│   ├── claude_executor.py    # Claude Code CLI wrapper
│   └── git_executor.py       # Git operations
├── workflows/
│   ├── orchestrator.py       # Workflow state machine
│   └── state_manager.py      # SQLite persistence
└── bot_state.db              # Workflow database
```

## Troubleshooting

### Bot doesn't respond
- Check `TELEGRAM_ADMIN_USER_ID` matches your user ID
- Verify bot token is correct
- Check bot.py is running

### "Claude Code execution failed"
- Verify Claude Code is installed: `which claude`
- Check working directory exists and is correct
- Ensure you're authenticated: `claude --version`
- Try running Claude Code manually to test: `claude "help me test"`

### Git commit fails
- Check git is configured: `git config user.name`
- Verify you're in a git repository
- Ensure working directory has no conflicts


## Development

### Run in background (tmux)

```bash
tmux new -s michi-bot
cd /Users/xiaowei.wan/code/kuma-blog/AI/kuma-ai-agents/michi-telegram-bot
source venv/bin/activate
python bot.py

# Detach: Ctrl+B, then D
# Reattach: tmux attach -t michi-bot
```

### View logs

```bash
tail -f bot_state.db  # Database changes
# Console output shows all progress
```

## Future Enhancements

- [ ] Multi-user support with authorization
- [ ] Webhook deployment for lower latency
- [ ] Voice message input → transcription
- [ ] Scheduled workflows (daily newsletter)
- [ ] Integration with more skills (slides, xhs-images)
- [ ] Analytics dashboard
