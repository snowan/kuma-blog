import pytest
from workflows.orchestrator import WorkflowOrchestrator
from executors.git_executor import GitExecutor


class TestOrchestratorGitIntegration:
    def test_has_git_executor(self):
        orch = WorkflowOrchestrator()
        assert hasattr(orch, "git_executor")
        assert isinstance(orch.git_executor, GitExecutor)

    def test_has_commit_method(self):
        orch = WorkflowOrchestrator()
        assert hasattr(orch, "commit_workflow_results")
        assert callable(orch.commit_workflow_results)
