import pytest
from executors.git_executor import GitExecutor


@pytest.fixture
def git_exec():
    return GitExecutor()


class TestGenerateCommitMessage:
    def test_comic_workflow(self, git_exec):
        msg = git_exec.generate_commit_message(
            workflow_type="comic",
            url="https://example.com",
            files_created=["AI-manga-learnings/test-project/page1.png"],
        )
        assert "test-project" in msg
        assert "comic" in msg

    def test_content_workflow(self, git_exec):
        msg = git_exec.generate_commit_message(
            workflow_type="content",
            url="https://example.com/article",
            files_created=["content/analysis.md"],
        )
        assert "content" in msg

    def test_infographic_workflow(self, git_exec):
        msg = git_exec.generate_commit_message(
            workflow_type="infographic",
            files_created=["output/project/info.png"],
        )
        assert "infographic" in msg

    def test_slides_workflow(self, git_exec):
        msg = git_exec.generate_commit_message(
            workflow_type="slides",
            files_created=["output/deck/slide1.png"],
        )
        assert "slide" in msg

    def test_url_appended(self, git_exec):
        msg = git_exec.generate_commit_message(
            workflow_type="content",
            url="https://example.com",
            files_created=["content/a.md"],
        )
        assert "https://example.com" in msg

    def test_no_url(self, git_exec):
        msg = git_exec.generate_commit_message(
            workflow_type="content",
            files_created=["content/a.md"],
        )
        assert "Source:" not in msg

    def test_no_files(self, git_exec):
        msg = git_exec.generate_commit_message(workflow_type="content")
        assert "content" in msg
