import asyncio
import logging
import subprocess
from pathlib import Path
from typing import List, Optional
from config import settings

logger = logging.getLogger(__name__)

class GitExecutor:
    def __init__(self):
        self.working_dir = Path(settings.claude_code_working_dir)
        self.user_name = settings.git_user_name
        self.user_email = settings.git_user_email
        self.default_branch = settings.git_default_branch

    async def commit_and_push(
        self,
        files: List[str],
        commit_message: str,
        co_author: Optional[str] = None
    ) -> dict:
        result = {
            "success": False,
            "commit_hash": None,
            "error": None
        }

        try:
            # Stage files
            for file_path in files:
                await self._run_git_command(["add", file_path])

            logger.info(f"Staged {len(files)} files")

            # Build commit message with co-author
            full_message = commit_message
            if co_author:
                full_message += f"\n\n{co_author}"

            # Commit
            await self._run_git_command([
                "commit",
                "-m", full_message
            ])

            # Get commit hash
            commit_hash = await self._run_git_command([
                "rev-parse", "HEAD"
            ])
            result["commit_hash"] = commit_hash.strip()

            logger.info(f"Created commit {result['commit_hash'][:8]}")

            # Push to remote
            await self._run_git_command([
                "push", "origin", self.default_branch
            ])

            logger.info("Pushed to remote")

            result["success"] = True

        except (subprocess.SubprocessError, OSError) as e:
            result["error"] = str(e)
            logger.error(f"Git operation failed: {e}")

        return result

    async def _run_git_command(self, args: List[str]) -> str:
        cmd = ["git"] + args

        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=str(self.working_dir)
        )

        stdout, stderr = await process.communicate()

        if process.returncode != 0:
            raise subprocess.SubprocessError(f"Git command failed: {stderr.decode()}")

        return stdout.decode()

    def generate_commit_message(
        self,
        workflow_type: str,
        url: Optional[str] = None,
        files_created: List[str] = []
    ) -> str:
        # Extract project name from files
        project_name = "content"
        if files_created:
            # Try to extract from path like AI-manga-learnings/project-name/
            parts = files_created[0].split("/")
            if len(parts) > 2:
                project_name = parts[-2]

        if workflow_type == "comic":
            msg = f"feat: Add {project_name} comic analysis"
        elif workflow_type == "infographic":
            msg = f"feat: Add {project_name} infographic"
        elif workflow_type == "slides":
            msg = f"feat: Add {project_name} slide deck"
        else:
            msg = f"feat: Add {project_name} analysis"

        if url:
            msg += f"\n\nSource: {url}"

        return msg
