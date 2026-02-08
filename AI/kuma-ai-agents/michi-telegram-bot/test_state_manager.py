import pytest
from workflows.state_manager import WorkflowStateManager, WorkflowState


class TestWorkflowCreation:
    def test_create_and_get_workflow(self, state_manager):
        state_manager.create_workflow("wf-1", chat_id=100, intent_data={"raw_text": "hello"})
        wf = state_manager.get_workflow("wf-1")

        assert wf is not None
        assert wf["workflow_id"] == "wf-1"
        assert wf["chat_id"] == 100
        assert wf["state"] == WorkflowState.PARSING
        assert wf["intent_data"]["raw_text"] == "hello"

    def test_get_nonexistent_workflow(self, state_manager):
        assert state_manager.get_workflow("nope") is None


class TestStateTransitions:
    def test_update_state(self, state_manager):
        state_manager.create_workflow("wf-2", chat_id=100, intent_data={})
        state_manager.update_workflow_state("wf-2", WorkflowState.EXECUTING)

        wf = state_manager.get_workflow("wf-2")
        assert wf["state"] == WorkflowState.EXECUTING

    def test_update_state_with_result_data(self, state_manager):
        state_manager.create_workflow("wf-3", chat_id=100, intent_data={})
        state_manager.update_workflow_state(
            "wf-3", WorkflowState.COMPLETED, {"output": "done", "files_created": ["a.md"]}
        )

        wf = state_manager.get_workflow("wf-3")
        assert wf["state"] == WorkflowState.COMPLETED
        assert wf["result_data"]["files_created"] == ["a.md"]

    def test_full_lifecycle(self, state_manager):
        state_manager.create_workflow("wf-lc", chat_id=100, intent_data={"url": "https://x.com"})

        for target_state in [WorkflowState.EXECUTING, WorkflowState.COMMITTING, WorkflowState.COMPLETED]:
            state_manager.update_workflow_state("wf-lc", target_state)
            assert state_manager.get_workflow("wf-lc")["state"] == target_state


class TestPendingConfirmations:
    def test_save_and_get_confirmation(self, state_manager):
        state_manager.create_workflow("wf-c", chat_id=100, intent_data={})
        state_manager.save_pending_confirmation("wf-c", 100, {"skill": "comic"})

        pending = state_manager.get_pending_confirmation("wf-c")
        assert pending["skill"] == "comic"

    def test_clear_confirmation(self, state_manager):
        state_manager.create_workflow("wf-cc", chat_id=100, intent_data={})
        state_manager.save_pending_confirmation("wf-cc", 100, {"skill": "comic"})
        state_manager.clear_pending_confirmation("wf-cc")

        assert state_manager.get_pending_confirmation("wf-cc") is None

    def test_get_nonexistent_confirmation(self, state_manager):
        assert state_manager.get_pending_confirmation("nope") is None


class TestActiveWorkflows:
    def test_get_active_workflows(self, state_manager):
        state_manager.create_workflow("wf-a1", chat_id=200, intent_data={})
        state_manager.create_workflow("wf-a2", chat_id=200, intent_data={})
        state_manager.create_workflow("wf-a3", chat_id=200, intent_data={})
        state_manager.update_workflow_state("wf-a3", WorkflowState.COMPLETED)

        active = state_manager.get_active_workflows(200)
        active_ids = [w["workflow_id"] for w in active]
        assert "wf-a1" in active_ids
        assert "wf-a2" in active_ids
        assert "wf-a3" not in active_ids

    def test_active_workflows_different_chat(self, state_manager):
        state_manager.create_workflow("wf-x", chat_id=300, intent_data={})
        assert state_manager.get_active_workflows(999) == []
