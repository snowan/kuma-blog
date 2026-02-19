import os
import json
from datetime import datetime

UI_PATH = "/Users/xiaowei.wan/clawd/skills/mission-control/ui.html"
LOG_FILE = "/Users/xiaowei.wan/clawd/memory/mission-control.json"

def update_ui(token_count, logs):
    if not os.path.exists(UI_PATH):
        return
    
    with open(UI_PATH, 'r') as f:
        content = f.read()

    # Update Token Count
    content = content.replace('id="token-count">20,419', f'id="token-count">{token_count:,}')
    
    # Update Logs
    new_logs = ""
    for entry in logs[-5:]:
        new_logs += f"[{datetime.now().strftime('%H:%M')}] {entry}<br>"
    
    content = content.replace('<!-- LOGS -->', new_logs)

    with open(UI_PATH, 'w') as f:
        f.write(content)

if __name__ == "__main__":
    # Example update
    update_ui(25000, ["Scanning GitHub trends...", "Viking-LOD indexing complete.", "Mission Control UI Updated."])
