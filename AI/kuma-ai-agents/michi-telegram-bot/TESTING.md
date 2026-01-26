# Testing Guide

## Environment Setup

1. Create test .env file:
```bash
cp .env.example .env
# Fill in actual tokens
```

2. Get Telegram user ID:
   - Message @userinfobot
   - Copy your user ID to TELEGRAM_ADMIN_USER_ID

## Test Cases

### Test 1: Simple URL Fetch
Message: "fetch https://www.anthropic.com"
Expected: Bot converts to markdown, no confirmation needed

### Test 2: Comic Generation with Confirmation
Message: "analyze https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents, generate manga comic"
Expected:
1. Bot shows confirmation with options
2. Click Confirm
3. Progress updates appear
4. Comic files created in AI-manga-learnings/

### Test 3: Full Workflow with Git
Message: "analyze https://example.com/article, create comic, commit to github"
Expected:
1. Confirmation shown
2. Execution with progress
3. Git commit with conventional message
4. Success message with commit hash

### Test 4: Error Handling
Message: "analyze https://invalid-url-404"
Expected: Error message explaining URL fetch failed

### Test 5: Unauthorized User
From different Telegram account, send: "test"
Expected: "⛔ Unauthorized access."

## Manual Verification

After each test, check:
- Files created in expected locations
- Git commit appears in history
- bot_state.db contains workflow records
- No errors in console logs
