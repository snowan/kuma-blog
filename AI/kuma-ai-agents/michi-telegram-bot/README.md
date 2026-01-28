# michi_ai_bot - Telegram Integration for Claude Code

Natural language interface to Claude Code content generation workflows.

**Chat with Claude Code via Telegram!** Send any message to your bot and Claude Code handles the rest - from simple code generation to complex content creation with automatic git commits.

## Quick Start

```bash
# 1. Get bot token from @BotFather on Telegram
# 2. Get your Telegram user ID from @userinfobot
# 3. Setup
cp .env.example .env
nano .env  # Add your bot token and user ID

# 4. Install & Run
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
./start_bot.sh

# 5. Message your bot on Telegram!
```

## Features

- 🤖 **Direct Claude Code CLI integration** - No intermediary LLM, your message goes straight to Claude
- 🎨 **Content generation** - Manga comics, infographics, slides, and more via Claude Code skills
- 📝 **Automatic git commits** - Generated content is automatically committed with conventional messages
- 📊 **Real-time progress updates** - See what Claude is doing as it works
- 🔒 **Single-user authorization** - Only your Telegram account can use your bot
- ⚡ **Simple architecture** - Telegram → Claude Code → Results (no parsing layer!)

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

### Usage Examples with Expected Output

**Example 1: Simple Code Generation**
```
You: create a Python script that prints hello world

Bot: ⏳ Processing with Claude Code...
Bot: 🤖 Processing your request...
Bot: 📄 Created hello_world.py
Bot: ✅ Task Complete! (ID: a1b2c3d4)

     Created files:
     • hello_world.py
```

**Example 2: URL Analysis**
```
You: analyze https://www.anthropic.com

Bot: ⏳ Processing with Claude Code...
Bot: 🤖 Processing your request...
Bot: 📄 Created anthropic-analysis.md
Bot: ✅ Task Complete! (ID: e5f6g7h8)

     Created files:
     • anthropic-analysis.md
```

**Example 3: Complex Workflow**
```
You: analyze article https://example.com/article,
     create infographic, commit to github

Bot: ⏳ Processing with Claude Code...
Bot: 🤖 Processing your request...
Bot: 📄 Created article-analysis.md
Bot: 🎨 Generating infographic...
Bot: 📄 Created infographic.png
Bot: 📝 Committing to GitHub...
Bot: ✅ Committed: 8c521e2
Bot: 🎉 Task Complete! (ID: i9j0k1l2)

     Created files:
     • article-analysis.md
     • infographic.png
```

**Example 4: Using Specific Skills**
```
You: /baoyu-comic create manga about AI agents

Bot: ⏳ Processing with Claude Code...
Bot: 🤖 Processing your request...
Bot: 🎨 Generating comic panels...
Bot: 📄 Created ai-agents-comic/page-1.png
Bot: 📄 Created ai-agents-comic/page-2.png
Bot: ✅ Task Complete! (ID: m3n4o5p6)
```

### Workflow Keywords

Claude Code understands natural language, so you can phrase requests any way you like. Common patterns:

- **Content Analysis**: "analyze", "summarize", "fetch", + URL
- **Code Generation**: "create", "write", "build" + description
- **Image Generation**: "comic", "manga", "infographic", "diagram"
- **Documentation**: "document", "explain", "write docs for"
- **Git Operations**: "commit", "push to github"
- **Publishing**: "publish to X", "post to twitter"

## How It Works

### Simple Architecture

This bot uses a **direct pass-through architecture** - no intermediary LLM for parsing or interpretation. Every message you send goes straight to Claude Code CLI.

```
┌─────────────────┐
│ You send message│
│   via Telegram  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Authorization   │  ← Check: Is sender = admin user ID?
│ Check           │
└────────┬────────┘
         │ ✅ Authorized
         ▼
┌─────────────────┐
│ Claude Code CLI │  ← Execute: claude --print "your message"
│   --print       │    • Interprets your intent
└────────┬────────┘    • Selects appropriate skills
         │              • Generates content
         ▼              • Returns results
┌─────────────────┐
│ Stream Progress │  ← You see: "🤖 Processing...", "⚙️ Running skill..."
│ Updates         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Extract Results │  ← Parse output for:
│ & Files         │    • Created files
└────────┬────────┘    • Generated content
         │              • Error messages
         ▼
┌─────────────────┐
│ Send Completion │  ← "✅ Task Complete! Created files: ..."
│ Message         │
└─────────────────┘
```

### What Happens When You Send a Message

**Step 1: Authorization**
```python
if user_id != TELEGRAM_ADMIN_USER_ID:
    reply "⛔ Unauthorized access"
    return
```
Only messages from your configured Telegram user ID are processed.

**Step 2: Direct Execution**
```bash
# Your message: "create a hello world Python script"
# Bot runs:
claude --print "create a hello world Python script"
```

**Step 3: Live Progress Updates**
As Claude Code works, the bot updates your message in real-time:
- "⏳ Processing with Claude Code..."
- "🤖 Processing your request..."
- "📄 Created hello_world.py"

**Step 4: Results Delivery**
When complete, you receive:
- ✅ Success message with list of files created
- 📊 Output summary or snippets
- ❌ Error message if something failed

### Why This Architecture?

**Before (Complex):**
```
Telegram → Gemini Parser → Skill Selector → Claude Code → Results
           (parse intent)   (choose skill)
```
- Required Gemini API key
- Two LLM calls per request
- Potential parsing errors
- API quotas and rate limits

**Now (Simple):**
```
Telegram → Claude Code → Results
           (understands everything)
```
- ✅ No external API dependencies
- ✅ Single LLM call
- ✅ Claude Code handles all interpretation
- ✅ More reliable and predictable

### Key Components

**1. Message Handler** (`handlers/message_handler.py`)
- Receives all text messages
- Checks authorization
- Forwards to orchestrator

**2. Orchestrator** (`workflows/orchestrator.py`)
- Creates workflow tracking ID
- Calls Claude Code executor
- Manages state in SQLite

**3. Claude Executor** (`executors/claude_executor.py`)
- Runs: `claude --print "user message"`
- Streams output line by line
- Extracts file paths from output
- Reports progress via callback

**4. State Manager** (`workflows/state_manager.py`)
- Stores workflow in SQLite database
- Tracks: message, status, results, timestamps
- Enables debugging and history

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

### Bot doesn't respond to messages

**Problem:** You send messages but get no response.

**Diagnosis Steps:**

1. **Check bot is running:**
   ```bash
   ps aux | grep "python.*bot.py"
   ```
   If no output, bot is not running. Start it with `./start_bot.sh`

2. **Verify your Telegram user ID:**
   - Message @userinfobot on Telegram
   - Compare the ID it gives you with `TELEGRAM_ADMIN_USER_ID` in your `.env` file
   - If they don't match, update `.env` and restart bot

3. **Check bot logs for authorization errors:**
   ```bash
   # Find the latest bot output file
   ls -lt /private/tmp/claude/-Users-xiaowei-wan-code-kuma-blog/tasks/*.output | head -1

   # Watch logs in real-time
   tail -f /private/tmp/claude/-Users-xiaowei-wan-code-kuma-blog/tasks/[TASK_ID].output
   ```

   Look for:
   - `📨 Received message from user [ID]` - confirms message received
   - `⛔ Unauthorized access` - means your user ID doesn't match
   - `🔑 Expected admin user ID: [ID]` - shows configured admin ID

4. **Verify bot token:**
   ```bash
   grep TELEGRAM_BOT_TOKEN .env
   ```
   Check this matches the token from @BotFather

5. **Test Claude Code CLI:**
   ```bash
   claude --print "what is 2+2?"
   ```
   Should return "4". If it fails, Claude Code is not installed or authenticated.

**Common Fixes:**

```bash
# Fix 1: Update user ID
nano .env
# Change TELEGRAM_ADMIN_USER_ID to your actual ID
# Save and restart bot

# Fix 2: Restart bot with correct directory
pkill -f "python.*bot.py"
cd /Users/xiaowei.wan/code/kuma-blog/AI/kuma-ai-agents/michi-telegram-bot
./start_bot.sh

# Fix 3: Check you're messaging the correct bot
# Go to @BotFather and use /mybots to see all your bots
# Make sure you're messaging the one with the token in your .env
```

### Bot responds but Claude Code fails

**Problem:** Bot says "⏳ Processing..." but then errors out.

**Diagnosis:**

1. **Test Claude Code directly:**
   ```bash
   cd /Users/xiaowei.wan/code/kuma-blog
   claude --print "help me test"
   ```

2. **Check Claude Code is authenticated:**
   ```bash
   claude --version  # Should show version
   claude auth status  # Check authentication
   ```

3. **Verify working directory:**
   ```bash
   ls -la /Users/xiaowei.wan/code/kuma-blog
   # Should be a valid directory with .git folder
   ```

**Fixes:**

```bash
# Install Claude Code if missing
brew install claude

# Authenticate Claude Code
claude auth login

# Update working directory in .env if needed
nano .env
# Set CLAUDE_CODE_WORKING_DIR to a valid git repository path
```

### Bot works but no files are created

**Problem:** Bot says task complete but no files appear.

**Check:**

1. **Verify working directory:**
   ```bash
   echo $CLAUDE_CODE_WORKING_DIR
   ls -la /Users/xiaowei.wan/code/kuma-blog
   ```

2. **Check workflow results in database:**
   ```bash
   sqlite3 bot_state.db "SELECT * FROM workflows ORDER BY created_at DESC LIMIT 1;"
   ```

3. **Look for file paths in bot output:**
   Files created by Claude Code should appear in the working directory.

### Git commit fails

**Problem:** Files are created but git commit fails.

**Fixes:**

```bash
# Configure git if not set
git config user.name "Your Name"
git config user.email "your@email.com"

# Check you're in a git repository
cd /Users/xiaowei.wan/code/kuma-blog
git status  # Should show git info, not "not a git repository"

# Check for conflicts
git status
# Resolve any merge conflicts or uncommitted changes
```

### Debug Mode

Enable detailed logging by monitoring the bot output:

```bash
# Find current bot task ID
ps aux | grep "python.*bot.py"

# Watch logs live
tail -f /private/tmp/claude/-Users-xiaowei-wan-code-kuma-blog/tasks/[TASK_ID].output

# Send a test message to your bot
# You should see:
# - 📨 Received message from user [ID]: [message]
# - 🔑 Expected admin user ID: [ID]
# - executors.claude_executor - INFO - Executing Claude Code with message: [message]
```


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
