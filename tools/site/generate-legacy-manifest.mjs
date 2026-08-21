import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseFrontmatter } from "@astrojs/markdown-remark";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const outputPath = join(root, "src/data/legacy-posts.json");
const checkOnly = process.argv.includes("--check");
const inventoryBaseRevision = "f2629d999bb5bfaef91e059c54926380a2061f6a";

const legacyRoots = new Set([
  "AI-blogs",
  "AI-manga-learnings",
  "AI-slide-learnings",
  "AI",
  "Books",
  "Entertainment",
  "Google",
  "Languages",
  "Leetcode",
  "Readings",
  "Setup",
  "travels",
]);

const supportParts = new Set(["prompts", "characters", "docs", "notes"]);
const supportNames = new Set([
  "readme.md",
  "analysis.md",
  "outline.md",
  "prompt.md",
  "source.md",
  "source-link.md",
  "sources.md",
  "storyboard.md",
  "structured-content.md",
]);
const supportStemPrefixes = [
  "analysis",
  "character",
  "outline",
  "prompt",
  "source",
  "storyboard",
  "structured-content",
];

const collections = {
  "AI-blogs": { id: "ai", label: "AI, Agents, and Systems" },
  AI: { id: "ai", label: "AI, Agents, and Systems" },
  "AI-manga-learnings": { id: "visual-learning", label: "Visual Learning" },
  "AI-slide-learnings": { id: "visual-learning", label: "Visual Learning" },
  Leetcode: { id: "algorithms", label: "Algorithms" },
  Google: { id: "algorithms", label: "Algorithms" },
  Books: { id: "books", label: "Books and Readings" },
  Readings: { id: "books", label: "Books and Readings" },
  Setup: { id: "engineering", label: "Engineering Notes" },
  Languages: { id: "engineering", label: "Engineering Notes" },
  Entertainment: { id: "personal", label: "Personal Notes" },
  travels: { id: "personal", label: "Personal Notes" },
};

function trackedMarkdown() {
  const raw = execFileSync(
    "git",
    ["ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", "*.md"],
    { cwd: root },
  ).toString("utf8");
  return raw
    .split("\0")
    .filter(Boolean)
    .filter((path) => legacyRoots.has(path.split("/")[0]));
}

function isReaderFacing(path, text) {
  const parts = path.toLowerCase().split("/");
  const name = basename(path).toLowerCase();
  const stem = name.replace(/\.md$/, "");
  if (parts.some((part) => supportParts.has(part))) return false;
  if (supportNames.has(name)) return false;
  if (supportStemPrefixes.some((prefix) => stem.startsWith(prefix))) return false;
  if (["refactoring_summary.md", "testing.md"].includes(name)) return false;
  return text.trim().length > 0;
}

function cleanInline(value) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function humanize(path) {
  const stem = basename(path).replace(/\.md$/i, "");
  const value = stem.replace(/[._-]+/g, " ").replace(/\s+/g, " ").trim();
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : path;
}

function titleFor(path, frontmatter, content) {
  const frontmatterTitle = typeof frontmatter.title === "string" ? cleanInline(frontmatter.title) : "";
  const heading = cleanInline(content.match(/^#\s+(.+)$/m)?.[1] ?? "");
  const generic = new Set(["problem", "solution", "chapter1", "2024", "2025", "ai", "books"]);
  const selected = frontmatterTitle || heading;
  return selected && !generic.has(selected.toLowerCase()) ? selected : humanize(path);
}

function descriptionFor(frontmatter, content, collectionLabel) {
  if (typeof frontmatter.description === "string" && frontmatter.description.trim()) {
    return truncate(cleanInline(frontmatter.description), 220);
  }
  const withoutCode = content.replace(/```[\s\S]*?```/g, "");
  for (const paragraph of withoutCode.split(/\n\s*\n/)) {
    const cleaned = cleanInline(
      paragraph
        .replace(/^#{1,6}\s+.*$/gm, "")
        .replace(/^[-*+]\s+/gm, "")
        .replace(/^>\s?/gm, "")
        .replace(/^\|.*\|$/gm, ""),
    );
    if (cleaned.length >= 40 && !/^https?:\/\//.test(cleaned)) return truncate(cleaned, 220);
  }
  return `A preserved Kuma Blog note from the ${collectionLabel} collection.`;
}

function truncate(value, maximum) {
  if (value.length <= maximum) return value;
  const shortened = value.slice(0, maximum - 1);
  return `${shortened.replace(/\s+\S*$/, "").trim()}…`;
}

function slugifySegment(value) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "post";
}

function slugFor(path) {
  return path.replace(/\.md$/i, "").split("/").map(slugifySegment).join("/");
}

function topicsFor(path, title) {
  const value = `${path} ${title}`.toLowerCase();
  const topics = [];
  if (/(agent|harness|tool.use|claude.code|codex|orchestrat)/.test(value)) topics.push("agents-harnesses");
  if (/(memory|context|retriev|\brag\b|filesystem)/.test(value)) topics.push("memory-context");
  if (/(eval|reliab|benchmark|postmortem|\btests?\b|\btesting\b)/.test(value)) topics.push("evals-reliability");
  if (/(inference|batch|kv.cache|pagedattention|decod|rate.limit|gpu|serving)/.test(value)) topics.push("inference-systems");
  return topics;
}

function wordCount(value) {
  return value.match(/[A-Za-z0-9][A-Za-z0-9'_-]*/g)?.length ?? 0;
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

function buildManifest() {
  const entries = trackedMarkdown().flatMap((sourcePath) => {
    const text = readFileSync(join(root, sourcePath), "utf8");
    if (!isReaderFacing(sourcePath, text)) return [];
    let parsed;
    try {
      parsed = parseFrontmatter(text, { frontmatter: "remove" });
    } catch {
      parsed = { frontmatter: {}, content: text };
    }
    const collection = collections[sourcePath.split("/")[0]];
    const title = titleFor(sourcePath, parsed.frontmatter, parsed.content);
    return [{
      sourcePath,
      slug: slugFor(sourcePath),
      title,
      description: descriptionFor(parsed.frontmatter, parsed.content, collection.label),
      collection: collection.id,
      collectionLabel: collection.label,
      topics: topicsFor(sourcePath, title),
      words: wordCount(parsed.content),
      digest: digest(text),
    }];
  });
  entries.sort((left, right) =>
    left.collectionLabel.localeCompare(right.collectionLabel) || left.title.localeCompare(right.title),
  );
  const slugs = new Set();
  for (const entry of entries) {
    if (slugs.has(entry.slug)) throw new Error(`Duplicate legacy slug: ${entry.slug}`);
    slugs.add(entry.slug);
  }
  return { schemaVersion: 1, sourceRevision: inventoryBaseRevision, count: entries.length, entries };
}

const rendered = `${JSON.stringify(buildManifest(), null, 2)}\n`;
if (checkOnly) {
  const existing = readFileSync(outputPath, "utf8");
  if (existing !== rendered) {
    console.error("legacy-manifest: src/data/legacy-posts.json is stale; run pnpm content:manifest");
    process.exit(1);
  }
  console.log(`legacy-manifest: ${JSON.parse(existing).count} approved legacy posts passed`);
} else {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, rendered);
  console.log(`legacy-manifest: wrote ${relative(root, outputPath)} with ${JSON.parse(rendered).count} posts`);
}
