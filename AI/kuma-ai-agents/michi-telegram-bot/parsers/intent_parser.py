import json
import re
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
import google.generativeai as genai
from config import settings

@dataclass
class WorkflowIntent:
    url: Optional[str]
    skills: List[str]
    output_format: str
    publish_targets: List[str]
    options: Dict[str, Any]
    raw_text: str

class IntentParser:
    AVAILABLE_SKILLS = [
        "baoyu-url-to-markdown",
        "baoyu-comic",
        "baoyu-infographic",
        "baoyu-slide-deck",
        "baoyu-post-to-x"
    ]

    EXPENSIVE_SKILLS = [
        "baoyu-comic",
        "baoyu-infographic",
        "baoyu-slide-deck"
    ]

    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        # Using gemini-1.5-flash for better quota limits and stability
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    async def parse(self, user_message: str) -> WorkflowIntent:
        url = self._extract_url(user_message)

        prompt = f"""
Parse this content generation request into JSON:

User: {user_message}

Extract:
- skills: List of skills from: {', '.join(self.AVAILABLE_SKILLS)}
- output_format: "markdown", "comic", "infographic", or "slides"
- publish_targets: List from: ["github", "x", "telegram"]
- options: Dict with style preferences (e.g., art_style, tone, color_scheme)

Rules:
- If "analyze article" or URL present → include "baoyu-url-to-markdown"
- If "comic" or "manga" → include "baoyu-comic"
- If "infographic" → include "baoyu-infographic"
- If "slides" or "presentation" → include "baoyu-slide-deck"
- If "publish to X" or "post to twitter" → include "baoyu-post-to-x" and add "x" to targets
- If "commit" or "push to github" → add "github" to targets
- Default publish_targets: ["github"]

Return ONLY valid JSON:
{{
    "skills": [...],
    "output_format": "...",
    "publish_targets": [...],
    "options": {{}}
}}
"""

        response = await self.model.generate_content_async(prompt)

        try:
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]

            parsed = json.loads(text.strip())
        except (json.JSONDecodeError, IndexError) as e:
            parsed = self._fallback_parse(user_message)

        return WorkflowIntent(
            url=url,
            skills=self._validate_skills(parsed.get("skills", [])),
            output_format=parsed.get("output_format", "markdown"),
            publish_targets=parsed.get("publish_targets", ["github"]),
            options=parsed.get("options", {}),
            raw_text=user_message
        )

    def _extract_url(self, text: str) -> Optional[str]:
        url_pattern = r'https?://[^\s,]+'
        match = re.search(url_pattern, text)
        return match.group(0) if match else None

    def _validate_skills(self, skills: List[str]) -> List[str]:
        valid = [s for s in skills if s in self.AVAILABLE_SKILLS]

        if "baoyu-url-to-markdown" in valid:
            valid.remove("baoyu-url-to-markdown")
            valid.insert(0, "baoyu-url-to-markdown")

        return valid

    def _fallback_parse(self, text: str) -> Dict[str, Any]:
        skills = []

        if self._extract_url(text):
            skills.append("baoyu-url-to-markdown")

        if any(kw in text.lower() for kw in ["comic", "manga"]):
            skills.append("baoyu-comic")

        if "infographic" in text.lower():
            skills.append("baoyu-infographic")

        if any(kw in text.lower() for kw in ["slide", "presentation"]):
            skills.append("baoyu-slide-deck")

        publish_targets = []
        if any(kw in text.lower() for kw in ["commit", "push", "github"]):
            publish_targets.append("github")
        if any(kw in text.lower() for kw in ["publish", "post", "twitter", "x"]):
            publish_targets.append("x")

        return {
            "skills": skills,
            "output_format": "comic" if "baoyu-comic" in skills else "markdown",
            "publish_targets": publish_targets or ["github"],
            "options": {}
        }

    def requires_confirmation(self, intent: WorkflowIntent) -> bool:
        return any(skill in self.EXPENSIVE_SKILLS for skill in intent.skills)
