import { getCollection } from "astro:content";

export function tagSlug(tag: string) {
  return tag.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
}

export function tagLabel(tag: string) {
  const labels: Record<string, string> = {
    ai: "AI",
    agents: "Agents",
    "context-compaction": "Context compaction",
  };
  return labels[tagSlug(tag)] ?? tag.replaceAll("-", " ");
}

export async function getTaggedArticles() {
  const [writing, labNotes, visuals] = await Promise.all([
    getCollection("writing", ({ data }) => data.status === "published"),
    getCollection("labNotes", ({ data }) => data.status === "published"),
    getCollection("visuals", ({ data }) => data.status === "published"),
  ]);
  return [
    ...writing.map((entry) => ({ entry, route: "writing" as const })),
    ...labNotes.map((entry) => ({ entry, route: "lab-notes" as const })),
    ...visuals.map((entry) => ({ entry, route: "visuals" as const })),
  ].sort((a, b) => (b.entry.data.publishedAt?.getTime() ?? 0) - (a.entry.data.publishedAt?.getTime() ?? 0));
}
