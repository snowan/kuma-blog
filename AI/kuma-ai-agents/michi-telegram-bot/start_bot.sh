#!/bin/bash

# Michi AI Bot Startup Script

cd "$(dirname "$0")"

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✅ Virtual environment activated"
else
    echo "❌ Virtual environment not found. Run: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Copy .env.example to .env and fill in your credentials."
    exit 1
fi

# Start the bot
echo "🤖 Starting michi_ai_bot..."
python bot.py
