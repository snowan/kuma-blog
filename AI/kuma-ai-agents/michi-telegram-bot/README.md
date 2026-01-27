# michi_ai_bot - Telegram Integration for Claude Code

Natural language interface to Claude Code content generation workflows.

## Features

- 🤖 Natural language instruction parsing via Gemini LLM
- 🎨 Content generation: manga comics, infographics, slides
- 📝 Automatic git commits with conventional messages
- ✅ Confirmation flow for expensive operations
- 📊 Real-time progress updates
- 🔒 Single-user authorization

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
- `GEMINI_API_KEY`: From https://makersuite.google.com/app/apikey
- Other values should be correct by default

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

```
Telegram Message
  ↓
Intent Parser (Gemini) → WorkflowIntent
  ↓
Workflow Orchestrator → Confirmation (if needed)
  ↓                              ↓
  ↓                        User confirms
  ↓                              ↓
Claude Code Executor ←───────────┘
  ↓
Git Executor → Commit & Push
  ↓
Completion Message
```

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
- Ensure skills are available: `claude --list-skills`

### Git commit fails
- Check git is configured: `git config user.name`
- Verify you're in a git repository
- Ensure working directory has no conflicts

### Gemini API errors
- Verify API key is valid
- Check you have Gemini API quota
- Try regenerating key at https://makersuite.google.com

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
