import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const dist = join(root, "dist");

function fail(message) {
  console.error(`verify-dist: ${message}`);
  process.exitCode = 1;
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

if (!existsSync(dist) || !statSync(dist).isDirectory()) {
  fail("dist/ does not exist; run pnpm build first.");
  process.exit();
}

const required = [
  "index.html",
  "404.html",
  "about/index.html",
  "archive/index.html",
  "design-system/control/index.html",
  "design-system/index.html",
  "design-system/journal/index.html",
  "design-system/mori/index.html",
  "lab-notes/index.html",
  "methodology/index.html",
  "rss.xml",
  "search/index.html",
  "series/index.html",
  "topics/index.html",
  "visuals/index.html",
  "writing/index.html",
  "pagefind/pagefind.js",
  "pagefind/pagefind-component-ui.js",
  "sitemap-index.xml",
];

for (const path of required) {
  if (!existsSync(join(dist, path))) {
    fail(`missing required artifact: ${path}`);
  }
}

const files = walk(dist);
const relativeFiles = files.map((path) => relative(dist, path));
const forbiddenPrefixes = [
  ".git/",
  ".github/",
  "AI/",
  "AI-blogs/",
  "archive/leetcode/",
  "studio/",
  "node_modules/",
];

for (const path of relativeFiles) {
  if (forbiddenPrefixes.some((prefix) => path.startsWith(prefix))) {
    fail(`forbidden repository content in dist: ${path}`);
  }
  if (path.endsWith(".tgz")) {
    fail(`dependency archive in dist: ${path}`);
  }
}

const htmlFiles = files.filter((path) => path.endsWith(".html"));
for (const path of htmlFiles) {
  const html = readFileSync(path, "utf8");
  if (/\b(?:href|src)=["']\/(?!kuma-blog\/|\/)/.test(html)) {
    fail(`root-relative URL without /kuma-blog/ base in ${relative(dist, path)}`);
  }

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  if (!canonical?.startsWith("https://snowan.github.io/kuma-blog/")) {
    fail(`missing project-site canonical URL in ${relative(dist, path)}`);
  }

  for (const [, rawUrl] of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    if (!rawUrl.startsWith("/kuma-blog/")) continue;
    const pathname = new URL(rawUrl, "https://snowan.github.io").pathname;
    const siteRelative = decodeURIComponent(pathname.slice("/kuma-blog/".length));
    const candidate = siteRelative.endsWith("/")
      ? join(dist, siteRelative, "index.html")
      : join(dist, siteRelative);
    if (!existsSync(candidate)) {
      fail(`broken generated URL in ${relative(dist, path)}: ${rawUrl}`);
    }
  }
}

const index = readFileSync(join(dist, "index.html"), "utf8");
for (const expected of [
  'href="/kuma-blog/writing/"',
  'href="/kuma-blog/topics/"',
  'href="/kuma-blog/search/"',
  'href="https://snowan.github.io/kuma-blog/"',
]) {
  if (!index.includes(expected)) {
    fail(`homepage is missing ${expected}`);
  }
}

const search = readFileSync(join(dist, "search/index.html"), "utf8");
for (const expected of [
  'bundle-path="/kuma-blog/pagefind/"',
  'base-url="/kuma-blog/"',
  'src="/kuma-blog/pagefind/pagefind-component-ui.js"',
]) {
  if (!search.includes(expected)) {
    fail(`search page is missing ${expected}`);
  }
}

const notFound = readFileSync(join(dist, "404.html"), "utf8");
if (!notFound.includes('<meta name="robots" content="noindex">')) {
  fail("404 page is missing noindex metadata");
}

const rss = readFileSync(join(dist, "rss.xml"), "utf8");
if (!rss.includes("<link>https://snowan.github.io/kuma-blog/</link>")) {
  fail("RSS channel link does not include the project base path");
}

const sitemap = readFileSync(join(dist, "sitemap-0.xml"), "utf8");
if (sitemap.includes("/404")) {
  fail("404 route leaked into sitemap");
}
if (sitemap.includes("/design-system/")) {
  fail("noindex design previews leaked into sitemap");
}

for (const presentation of ["journal", "control", "mori"]) {
  const preview = readFileSync(join(dist, `design-system/${presentation}/index.html`), "utf8");
  for (const expected of [
    `data-presentation="${presentation}"`,
    '<meta name="robots" content="noindex">',
    "From model call to reliable agent",
    "A bounded agent run",
    'aria-label="On this page"',
  ]) {
    if (!preview.includes(expected)) {
      fail(`${presentation} design preview is missing ${expected}`);
    }
  }
}

if (
  relativeFiles.some(
    (path) => path.includes("foundation-fixture") || path.includes("foundation-placeholder"),
  )
) {
  fail("draft fixtures leaked into dist");
}

const unpublishedDrafts = [
  "demystifying-agent-harness",
  "how-to-build-agent-harness",
  "agent-harness-control-loop",
  "context-engineering",
  "filesystem-context-engineering",
  "agent-memory-survey",
  "agent-memory-deep-dive",
  "agent-memory-learning-series",
  "agent-evals-that-diagnose-failure",
  "llm-serving-control-plane",
  "llm-admission-control",
];
for (const slug of unpublishedDrafts) {
  if (relativeFiles.some((path) => path.includes(slug))) {
    fail(`unpublished draft leaked into dist: ${slug}`);
  }
  if (rss.includes(slug) || sitemap.includes(slug)) {
    fail(`unpublished draft leaked into a discovery feed: ${slug}`);
  }
}

if (!process.exitCode) {
  console.log(`verify-dist: ${relativeFiles.length} generated files passed`);
}
