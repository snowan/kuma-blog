import re
from typing import Optional
from dataclasses import dataclass


@dataclass
class WorkflowIntent:
    """Simple intent structure for direct Claude Code execution"""

    raw_text: str
    url: Optional[str] = None


class IntentParser:
    """Simplified parser that extracts URL and passes raw text to Claude Code"""

    def __init__(self):
        pass

    def parse(self, user_message: str) -> WorkflowIntent:
        """
        Parse user message - simply extracts URL and returns raw text.
        Claude Code will handle all intent understanding.
        """
        url = self._extract_url(user_message)

        return WorkflowIntent(raw_text=user_message, url=url)

    def _extract_url(self, text: str) -> Optional[str]:
        """Extract URL from text"""
        url_pattern = r"https?://[^\s,]+"
        match = re.search(url_pattern, text)
        return match.group(0) if match else None
