# michi_ai_bot - Telegram Integration for Claude Code

Natural language interface to Claude Code content generation workflows.

## Setup

1. Get bot token from @BotFather
2. Copy .env.example to .env and fill in values
3. Install dependencies: `pip install -r requirements.txt`
4. Get your Telegram user ID: Message @userinfobot
5. Run: `python bot.py`

## Usage

Send natural language instructions:
- "analyze article https://example.com, generate manga comic, commit to github"
- "create infographic from https://paper.pdf, publish to X"

## Features

- LLM-powered instruction parsing
- Multi-step workflow orchestration
- Progress updates in Telegram
- Confirmation for expensive operations
- Git integration with conventional commits
