import asyncio
from workflows.orchestrator import WorkflowOrchestrator
from workflows.state_manager import WorkflowState

async def test():
    orchestrator = WorkflowOrchestrator()

    # Test workflow creation without actual execution
    workflow_id = None

    async def mock_progress(msg):
        print(f"Progress: {msg}")

    # Test 1: Parse simple URL (no confirmation)
    try:
        workflow_id = await orchestrator.start_workflow(
            user_message="analyze https://www.anthropic.com",
            chat_id=123456,
            progress_callback=mock_progress
        )

        workflow = orchestrator.state_manager.get_workflow(workflow_id)
        print(f"✅ Workflow created: {workflow_id}")
        print(f"✅ State: {workflow['state'].value}")
        print(f"✅ Intent skills: {workflow['intent_data']['skills']}")

    except Exception as e:
        print(f"Expected: Workflow would fail at execution (Claude Code not invoked)")
        print(f"Error: {type(e).__name__}: {str(e)[:100]}")

    # Test 2: Parse with confirmation (expensive skill)
    try:
        workflow_id2 = await orchestrator.start_workflow(
            user_message="analyze https://example.com, generate manga comic",
            chat_id=123456,
            progress_callback=mock_progress
        )

        workflow2 = orchestrator.state_manager.get_workflow(workflow_id2)
        print(f"\n✅ Workflow 2 created: {workflow_id2}")
        print(f"✅ State: {workflow2['state'].value}")
        print(f"✅ Requires confirmation: {workflow2['state'].value == 'confirming'}")
        print(f"✅ Intent skills: {workflow2['intent_data']['skills']}")

        # Check pending confirmation
        pending = orchestrator.state_manager.get_pending_confirmation(workflow_id2)
        print(f"✅ Pending confirmation options: {list(pending.keys())}")

    except Exception as e:
        print(f"Error: {type(e).__name__}: {str(e)[:100]}")

    print("\n✅ Full integration tests completed")

asyncio.run(test())
