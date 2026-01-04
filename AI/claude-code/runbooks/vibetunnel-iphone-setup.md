# VibeTunnel: Running Claude Code on iPhone

This runbook covers setting up VibeTunnel to access Claude Code from your iPhone via Tailscale.

## Prerequisites

- Apple Silicon Mac (M1+) with macOS 14.0+
- Homebrew installed
- Tailscale account
- iPhone with Tailscale app installed

## Quick Reference

| Item | Value |
|------|-------|
| Dashboard URL | `http://<tailscale-ip>:4020` |
| Username | Your Mac username |
| Password | Your Mac login password |
| Start session | `vt claude` |
| Check status | `vt status` |

---

## Step-by-Step Setup

### Step 1: Install VibeTunnel

```bash
brew install --cask vibetunnel
```

Verify installation:
```bash
which vt
```

### Step 2: Install Tailscale (if not installed)

```bash
brew install --cask tailscale
```

### Step 3: Configure Tailscale on Mac

1. Log out of any stale session:
   ```bash
   tailscale logout
   ```

2. Log in:
   ```bash
   tailscale login
   ```
   This opens a browser for authentication.

3. Verify connection and get your Tailscale IP:
   ```bash
   tailscale status
   ```
   Note the IP address (e.g., `100.x.x.x`).

### Step 4: Start VibeTunnel

1. Launch the VibeTunnel app:
   ```bash
   open -a VibeTunnel
   ```

2. Verify the server is running:
   ```bash
   vt status
   ```

   Expected output:
   ```
   VibeTunnel Server Status:
     Running: Yes
     Port: 4020
     URL: http://localhost:4020
   ```

### Step 5: Start Claude Code Session

```bash
vt claude
```

This starts Claude Code with VibeTunnel monitoring, making it visible in the dashboard.

### Step 6: Configure iPhone

1. Install **Tailscale** from the App Store
2. Log in with the **same Tailscale account** as your Mac
3. Enable the VPN connection when prompted
4. Open Safari and navigate to:
   ```
   http://<your-tailscale-ip>:4020
   ```
   Example: `http://100.x.x.x:4020`

### Step 7: Authenticate

When prompted for credentials:
- **Username:** Your Mac username (e.g., `michi`)
- **Password:** Your Mac login password

---

## Common Issues and Solutions

### Issue 1: Tailscale Login Fails - "Device already exists"

**Error:**
```
Authorization failed
device with nodekey:xxxx already exists; please log out explicitly and try logging in again.
```

**Solution:**
```bash
tailscale logout
tailscale login
```

---

### Issue 2: VibeTunnel Server Not Running

**Symptom:**
```bash
vt status
# Output: Running: No
```

**Solution:**

1. Kill any existing VibeTunnel processes:
   ```bash
   killall VibeTunnel
   ```

2. Relaunch the app:
   ```bash
   open /Applications/VibeTunnel.app
   ```

3. Wait a few seconds and check status:
   ```bash
   sleep 3 && vt status
   ```

---

### Issue 3: Menu Bar Icon Not Visible

**Symptom:** VibeTunnel app is running but no menu bar icon appears.

**Solution:**

1. The app may be running without the GUI component. Check processes:
   ```bash
   ps aux | grep -i vibetunnel | grep -v grep
   ```

2. Kill and restart:
   ```bash
   killall VibeTunnel
   open -a VibeTunnel
   ```

3. Wait for the server to start (may take a few seconds).

---

### Issue 4: Cannot Connect from iPhone

**Symptom:** Safari shows "cannot connect to server"

**Checklist:**

1. Verify Tailscale is connected on both devices:
   - Mac: `tailscale status`
   - iPhone: Check Tailscale app shows "Connected"

2. Verify both devices use the **same Tailscale account**

3. Verify VibeTunnel is running:
   ```bash
   vt status
   ```

4. Test local access first:
   ```bash
   curl http://localhost:4020
   ```

5. Verify the correct IP:
   ```bash
   tailscale status | grep $(hostname)
   ```

---

### Issue 5: "Invalid Username or Password"

**Symptom:** Login page rejects credentials.

**Solution:**

VibeTunnel uses your **Mac system credentials**, not Tailscale or Google account.

- **Username:** Your Mac username (run `whoami` to check)
- **Password:** Your Mac login password (the one used to unlock your Mac)

To find your username:
```bash
whoami
```

---

### Issue 6: Dashboard Loads but No Sessions Visible

**Symptom:** Dashboard is accessible but shows no terminal sessions.

**Solution:**

Sessions must be started with the `vt` wrapper:

```bash
# Start Claude Code with VibeTunnel
vt claude

# Start any command with VibeTunnel
vt <command>

# Start an interactive shell
vt -i
```

---

### Issue 7: Session Disconnects or Freezes

**Solution:**

1. Check if the Mac went to sleep (disable sleep during long sessions)

2. Verify Tailscale connection is still active:
   ```bash
   tailscale status
   ```

3. Restart the session:
   ```bash
   vt claude
   ```

---

## Managing Multiple Sessions

### Running Multiple Claude Code Sessions

Start multiple sessions from different terminal windows on your Mac:

```bash
# Terminal 1
vt claude

# Terminal 2 (new terminal window)
vt claude
```

### Naming Sessions for Easy Identification

From within an active `vt` session, rename it:

```bash
vt title "Project A"
```

### Switching Sessions on iPhone

1. Open the VibeTunnel dashboard in Safari
2. You'll see a **list of all active sessions** with their names and status
3. **Tap on any session** to switch to it
4. Sessions show activity status (active/idle) to help identify which is which

### Keyboard Shortcuts (iPad with keyboard)

| Shortcut | Action |
|----------|--------|
| `Cmd + 1` | Switch to session 1 |
| `Cmd + 2` | Switch to session 2 |
| `Cmd + 3-9` | Switch to sessions 3-9 |

### Tips for Multiple Sessions

- **Name your sessions** with `vt title` to easily identify them
- Sessions persist even if you close the browser - just reconnect to the dashboard
- Each session runs independently - you can have different projects in each

### Issue: All Sessions Show Same Name

**Symptom:** Running Claude Code from different directories but all sessions show the same name (e.g., all show `~/.claude`).

**Cause:** VibeTunnel uses the command name (`claude`) as the default title, not the working directory.

**Solution:** Rename each session from within it:

```bash
# From within the session (in Claude Code, use /run)
vt title "project-name"

# Or from the Mac terminal running that session
vt title "kuma-blog"
```

After renaming, refresh the iPhone dashboard to see the updated names.

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `vt status` | Check server status and follow mode |
| `vt claude` | Start Claude Code with monitoring |
| `vt -i` | Start interactive shell |
| `vt <command>` | Run any command with monitoring |
| `vt title "Name"` | Rename current session |
| `tailscale status` | Check Tailscale connection |
| `tailscale ip` | Show your Tailscale IP |

---

## Architecture Overview

```
┌─────────────────┐     Tailscale      ┌─────────────────┐
│     iPhone      │◄──────────────────►│       Mac       │
│                 │     (encrypted)    │                 │
│  Safari Browser │                    │  VibeTunnel     │
│                 │                    │  (port 4020)    │
└─────────────────┘                    │       │         │
                                       │       ▼         │
                                       │  Claude Code    │
                                       │  (via vt)       │
                                       └─────────────────┘
```

---

## References

- VibeTunnel GitHub: https://github.com/amantus-ai/vibetunnel
- VibeTunnel Docs: https://docs.vibetunnel.sh
- Tailscale: https://tailscale.com

---

*Last updated: 2026-01-03*
