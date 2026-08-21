import { readFileSync } from "node:fs";
import { join, posix, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createMarkdownProcessor, parseFrontmatter } from "@astrojs/markdown-remark";
import manifest from "../data/legacy-posts.json";
import { withBase } from "./site";

export interface LegacyPost {
  sourcePath: string;
  slug: string;
  title: string;
  description: string;
  collection: string;
  collectionLabel: string;
  topics: string[];
  words: number;
  digest: string;
}

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  depth?: number;
}

const root = resolve(process.cwd());
export const legacyPosts = manifest.entries as LegacyPost[];
export const legacyPostCount = legacyPosts.length;
const routeBySource = new Map(legacyPosts.map((post) => [post.sourcePath, post.slug]));

export const legacyCollections = Array.from(
  legacyPosts.reduce((collections, post) => {
    const current = collections.get(post.collection) ?? {
      id: post.collection,
      label: post.collectionLabel,
      count: 0,
    };
    current.count += 1;
    collections.set(post.collection, current);
    return collections;
  }, new Map<string, { id: string; label: string; count: number }>()),
  ([, collection]) => collection,
).sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));

function walk(tree: HastNode, visit: (node: HastNode) => void) {
  visit(tree);
  tree.children?.forEach((child) => walk(child, visit));
}

function demoteBodyTitle() {
  return (tree: HastNode) => {
    walk(tree, (node) => {
      if (node.type === "heading" && node.depth === 1) node.depth = 2;
    });
  };
}

function encodeRepositoryPath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function splitReference(value: string) {
  const match = value.match(/^([^?#]*)([?#].*)?$/);
  return { path: match?.[1] ?? value, suffix: match?.[2] ?? "" };
}

function repositoryTarget(sourcePath: string, target: string) {
  const { path, suffix } = splitReference(target);
  let decoded = path;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    // Preserve malformed legacy escapes and let the GitHub source view explain them.
  }
  const resolved = posix
    .normalize(decoded.startsWith("/")
      ? decoded.slice(1)
      : posix.join(posix.dirname(sourcePath), decoded))
    .replace(/^\.\//, "")
    .replace(/^(?:\.\.\/)+/, "");
  return { resolved, suffix };
}

function rewriteLegacyUrls(sourcePath: string) {
  return () => (tree: HastNode) => {
    walk(tree, (node) => {
      if (node.type !== "element" || !node.properties) return;

      if (node.tagName === "img" && typeof node.properties.src === "string") {
        const src = node.properties.src;
        if (/^(?:https?:|data:|\/\/)/i.test(src)) return;
        const { resolved, suffix } = repositoryTarget(sourcePath, src);
        node.properties.src = `https://raw.githubusercontent.com/snowan/kuma-blog/master/${encodeRepositoryPath(resolved)}${suffix}`;
        node.properties.loading = "lazy";
        node.properties.decoding = "async";
        return;
      }

      if (node.tagName !== "a" || typeof node.properties.href !== "string") return;
      const href = node.properties.href;
      if (href.startsWith("#") || /^(?:https?:|mailto:|tel:|\/\/)/i.test(href)) return;
      if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
        delete node.properties.href;
        return;
      }

      const { resolved, suffix } = repositoryTarget(sourcePath, href);
      const candidates = [resolved, `${resolved}.md`, posix.join(resolved, "README.md")];
      const route = candidates.map((candidate) => routeBySource.get(candidate)).find(Boolean);
      node.properties.href = route
        ? `${withBase(`library/${route}/`)}${suffix}`
        : `https://github.com/snowan/kuma-blog/blob/master/${encodeRepositoryPath(resolved)}${suffix}`;
    });
  };
}

export function legacySourceUrl(post: LegacyPost) {
  return `https://github.com/snowan/kuma-blog/blob/master/${encodeRepositoryPath(post.sourcePath)}`;
}

export async function renderLegacyPost(post: LegacyPost) {
  const absolutePath = join(root, post.sourcePath);
  const source = readFileSync(absolutePath, "utf8");
  const parsed = parseFrontmatter(source, { frontmatter: "remove" });
  const processor = await createMarkdownProcessor({
    remarkPlugins: [demoteBodyTitle],
    rehypePlugins: [rewriteLegacyUrls(post.sourcePath)],
    remarkRehype: { allowDangerousHtml: false },
    shikiConfig: { theme: "github-dark-default", wrap: true },
  });
  const rendered = await processor.render(parsed.content, {
    fileURL: pathToFileURL(absolutePath),
    frontmatter: parsed.frontmatter,
  });
  return { html: rendered.code, headings: rendered.metadata.headings ?? [] };
}
