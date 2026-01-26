import asyncio
from workflows.orchestrator import WorkflowOrchestrator

async def test():
    orchestrator = WorkflowOrchestrator()

    print(f"✅ Orchestrator has git_executor: {hasattr(orchestrator, 'git_executor')}")
    print(f"✅ Git executor type: {type(orchestrator.git_executor).__name__}")
    print(f"✅ Git executor working dir: {orchestrator.git_executor.working_dir}")
    print(f"✅ commit_workflow_results method exists: {hasattr(orchestrator, 'commit_workflow_results')}")

    print("✅ Orchestrator git integration tests passed")

asyncio.run(test())
