from enum import Enum


class WorkflowState(Enum):
    PARSING = "parsing"
    CONFIRMING = "confirming"
    EXECUTING = "executing"
    COMMITTING = "committing"
    PUBLISHING = "publishing"
    COMPLETED = "completed"
    FAILED = "failed"
