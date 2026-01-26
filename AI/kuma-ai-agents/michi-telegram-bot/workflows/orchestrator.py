import uuid
import logging
from typing import Callable, Optional, Dict, Any
from parsers.intent_parser import WorkflowIntent, IntentParser
from executors.claude_executor import ClaudeCodeExecutor
from workflows.state_manager import WorkflowStateManager, WorkflowState

logger = logging.getLogger(__name__)

class WorkflowOrchestrator:
    def __init__(self):
        self.parser = IntentParser()
        self.executor = ClaudeCodeExecutor()
        self.state_manager = WorkflowStateManager()

    async def start_workflow(
        self,
        user_message: str,
        chat_id: int,
        progress_callback: Callable
    ) -> str:
        workflow_id = str(uuid.uuid4())[:8]

        try:
            await progress_callback("🤖 Understanding your request...")
            intent = await self.parser.parse(user_message)

            self.state_manager.create_workflow(
                workflow_id=workflow_id,
                chat_id=chat_id,
                intent_data={
                    "url": intent.url,
                    "skills": intent.skills,
                    "output_format": intent.output_format,
                    "publish_targets": intent.publish_targets,
                    "options": intent.options,
                    "raw_text": intent.raw_text
                }
            )

            if self.parser.requires_confirmation(intent):
                self.state_manager.update_workflow_state(
                    workflow_id,
                    WorkflowState.CONFIRMING
                )

                self.state_manager.save_pending_confirmation(
                    workflow_id=workflow_id,
                    chat_id=chat_id,
                    options=self._prepare_confirmation_options(intent)
                )

                return workflow_id
            else:
                return await self.execute_workflow(workflow_id, progress_callback)

        except Exception as e:
            logger.error(f"Workflow start failed: {e}")
            self.state_manager.update_workflow_state(
                workflow_id,
                WorkflowState.FAILED,
                {"error": str(e)}
            )
            raise

    async def execute_workflow(
        self,
        workflow_id: str,
        progress_callback: Callable,
        confirmed_options: Optional[Dict[str, Any]] = None
    ) -> str:
        workflow = self.state_manager.get_workflow(workflow_id)
        if not workflow:
            raise ValueError(f"Workflow {workflow_id} not found")

        intent_data = workflow["intent_data"]
        results = {}

        try:
            self.state_manager.update_workflow_state(
                workflow_id,
                WorkflowState.EXECUTING
            )

            if confirmed_options:
                intent_data["options"].update(confirmed_options)

            for skill in intent_data["skills"]:
                await progress_callback(f"⚙️ Running {skill}...")

                prompt = self._build_skill_prompt(skill, intent_data, results)
                skill_args = self._build_skill_args(skill, intent_data)

                result = await self.executor.execute_skill(
                    skill_name=skill,
                    prompt=prompt,
                    skill_args=skill_args,
                    progress_callback=progress_callback
                )

                if not result["success"]:
                    raise Exception(f"Skill {skill} failed: {result['error']}")

                results[skill] = result

            self.state_manager.update_workflow_state(
                workflow_id,
                WorkflowState.COMPLETED,
                results
            )

            return workflow_id

        except Exception as e:
            logger.error(f"Workflow execution failed: {e}")
            self.state_manager.update_workflow_state(
                workflow_id,
                WorkflowState.FAILED,
                {"error": str(e)}
            )
            raise

    def _prepare_confirmation_options(self, intent: WorkflowIntent) -> Dict[str, Any]:
        options = {
            "skills": intent.skills,
            "estimated_time": self._estimate_time(intent.skills),
            "will_create": self._describe_output(intent)
        }

        if "baoyu-comic" in intent.skills:
            options["art_style"] = intent.options.get("art_style", "auto-select")
            options["tone"] = intent.options.get("tone", "neutral")

        return options

    def _estimate_time(self, skills: list) -> str:
        time_map = {
            "baoyu-url-to-markdown": 10,
            "baoyu-comic": 300,
            "baoyu-infographic": 120,
            "baoyu-slide-deck": 180
        }

        total_seconds = sum(time_map.get(skill, 30) for skill in skills)

        if total_seconds < 60:
            return f"{total_seconds} seconds"
        else:
            return f"{total_seconds // 60} minutes"

    def _describe_output(self, intent: WorkflowIntent) -> str:
        outputs = []

        if "baoyu-comic" in intent.skills:
            outputs.append("manga comic (6-8 pages)")
        if "baoyu-infographic" in intent.skills:
            outputs.append("infographic")
        if "baoyu-slide-deck" in intent.skills:
            outputs.append("slide deck")

        return ", ".join(outputs) if outputs else "markdown analysis"

    def _build_skill_prompt(
        self,
        skill: str,
        intent_data: Dict[str, Any],
        previous_results: Dict[str, Any]
    ) -> str:
        if skill == "baoyu-url-to-markdown":
            return intent_data["url"]

        elif skill == "baoyu-comic":
            if "baoyu-url-to-markdown" in previous_results:
                markdown_files = previous_results["baoyu-url-to-markdown"]["files_created"]
                if markdown_files:
                    return f"Create manga comic from {markdown_files[0]}"

            return f"Create manga comic analyzing: {intent_data['url']}"

        elif skill == "baoyu-post-to-x":
            content_files = []
            for result in previous_results.values():
                content_files.extend(result.get("files_created", []))

            return f"Post analysis with images from {content_files}"

        else:
            return intent_data.get("raw_text", "")

    def _build_skill_args(self, skill: str, intent_data: Dict[str, Any]) -> str:
        options = intent_data.get("options", {})

        if skill == "baoyu-comic":
            args = []
            if "art_style" in options:
                args.append(f"--style {options['art_style']}")
            if "tone" in options:
                args.append(f"--tone {options['tone']}")
            return " ".join(args)

        return ""
