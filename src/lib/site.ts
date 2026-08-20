export const SITE_TITLE = "Kuma Blog";
export const SITE_DESCRIPTION = "Field notes on reliable AI systems.";

export const TOPICS = [
  {
    id: "agents-harnesses",
    label: "Agents and Harnesses",
    description: "Control loops, tools, permissions, state, and recovery.",
  },
  {
    id: "memory-context",
    label: "Memory and Context",
    description: "Retrieval, staleness, durable context, and memory evaluation.",
  },
  {
    id: "evals-reliability",
    label: "Evals and Reliability",
    description: "Failure analysis, held-out tests, and production evidence.",
  },
  {
    id: "inference-systems",
    label: "Inference Systems",
    description: "Serving, batching, scheduling, and model-system tradeoffs.",
  },
] as const;

export const SERIES = [
  { id: "harness-lab", label: "Harness Lab" },
  { id: "memory-lab", label: "Memory Lab" },
  { id: "agent-reliability-notes", label: "Agent Reliability Notes" },
  { id: "agent-standards-map", label: "Agent Standards Map" },
] as const;

export function withBase(path = "/") {
  const relative = path.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${relative}`;
}

export function slugFromId(id: string) {
  return id.split("/").at(-1) ?? id;
}

export function isContentVisible(status: "draft" | "published" | "archived") {
  const localDraftPreview = import.meta.env.DEV && process.env.KUMA_PREVIEW_DRAFTS === "1";
  return status === "published" || (status === "draft" && localDraftPreview);
}

export function formatDate(value?: Date) {
  return value
    ? new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(value)
    : undefined;
}
