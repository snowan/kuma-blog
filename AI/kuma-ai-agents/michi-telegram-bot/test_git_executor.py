import asyncio
from executors.git_executor import GitExecutor

async def test():
    git_exec = GitExecutor()

    # Test commit message generation
    msg1 = git_exec.generate_commit_message(
        workflow_type="comic",
        url="https://example.com",
        files_created=["AI-manga-learnings/test-project/page1.png"]
    )
    print(f"Comic commit message: {msg1}")
    assert "test-project" in msg1
    assert "comic" in msg1

    msg2 = git_exec.generate_commit_message(
        workflow_type="content",
        url="https://example.com/article",
        files_created=["content/analysis.md"]
    )
    print(f"Content commit message: {msg2}")
    assert "content" in msg2

    print("✅ Git executor tests passed")

asyncio.run(test())
