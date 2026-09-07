import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";

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
  "library/index.html",
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
  ".agents/",
  ".claude/",
  "AI/",
  "AI-blogs/",
  "AI-manga-learnings/",
  "AI-slide-learnings/",
  "Books/",
  "Entertainment/",
  "Google/",
  "Languages/",
  "Leetcode/",
  "Readings/",
  "Setup/",
  "assets/",
  "archive/ai-news-digests/",
  "archive/books/",
  "archive/legacy-ai/",
  "archive/leetcode/",
  "archive/personal/",
  "archive/setup/",
  "archive/system-design/",
  "designs/",
  "docs/",
  "kubernetes/",
  "labs/",
  "studio/",
  "src/",
  "tests/",
  "tools/",
  "travels/",
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
  'href="/kuma-blog/library/"',
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
const rssItemCount = rss.match(/<item>/g)?.length ?? 0;
if (rssItemCount !== 13) {
  fail(`RSS should contain 13 reviewed items, found ${rssItemCount}`);
}

const sitemap = readFileSync(join(dist, "sitemap-0.xml"), "utf8");
if (sitemap.includes("/404")) {
  fail("404 route leaked into sitemap");
}
if (sitemap.includes("/design-system/")) {
  fail("noindex design previews leaked into sitemap");
}

const canonicalRoutes = [
  "writing/demystifying-agent-harness",
  "writing/how-to-build-agent-harness",
  "writing/agent-evals-that-diagnose-failure",
  "writing/llm-admission-control",
  "writing/llm-serving-control-plane",
  "writing/agent-memory-deep-dive",
  "writing/agent-memory-survey",
  "writing/context-engineering",
  "writing/filesystem-context-engineering",
  "visuals/agent-harness-control-loop",
  "visuals/agent-memory-learning-series",
  "visuals/codex-context-experiments",
];

const lessonRoute = "learn/codex-context-experiments/";
const lessonArticleRoute = "visuals/codex-context-experiments/";
for (const asset of ["index.html", "styles.css", "app.js", "sources.md", "README.md", "overview.html", "overview.css", "overview.js"]) {
  if (!existsSync(join(dist, lessonRoute, asset))) fail(`missing interactive lesson asset: ${asset}`);
}
if (!sitemap.includes(`https://snowan.github.io/kuma-blog/${lessonRoute}`)) {
  fail("interactive lesson is missing from sitemap");
}
if (!rss.includes(`/${lessonArticleRoute}`)) fail("lesson introduction is missing from RSS");
if (!sitemap.includes(`https://snowan.github.io/kuma-blog/${lessonRoute}overview.html`)) fail("architecture overview is missing from sitemap");
if (!readFileSync(join(dist, lessonRoute, "index.html"), "utf8").includes('href="./overview.html"')) fail("course is missing architecture overview navigation");
for (const page of ["index.html", "visuals/index.html", "library/index.html", "topics/memory-context/index.html"]) {
  if (!readFileSync(join(dist, page), "utf8").includes(`/kuma-blog/${lessonArticleRoute}`)) {
    fail(`lesson is missing from discovery page: ${page}`);
  }
}
for (const [slug, label] of [["ai", "AI"], ["agents", "Agents"], ["context-compaction", "Context compaction"]]) {
  const tagPath = join(dist, `tags/${slug}/index.html`);
  if (!existsSync(tagPath) || !readFileSync(tagPath, "utf8").includes(`/kuma-blog/${lessonArticleRoute}`)) {
    fail(`lesson is missing from tag: ${label}`);
  }
  for (const route of [lessonRoute, lessonArticleRoute]) {
    const html = readFileSync(join(dist, route, "index.html"), "utf8");
    if (!html.includes(`href="/kuma-blog/tags/${slug}/"`) || !html.includes(`property="article:tag" content="${label}"`)) {
      fail(`${route} is missing linked tag and metadata: ${label}`);
    }
  }
}
if (existsSync(join(dist, "tags/fixture/index.html"))) fail("draft-only tag leaked into public routes");

for (const route of canonicalRoutes) {
  if (!existsSync(join(dist, route, "index.html"))) {
    fail(`missing canonical publication route: ${route}`);
  }
  if (!sitemap.includes(`https://snowan.github.io/kuma-blog/${route}/`)) {
    fail(`canonical publication route is missing from sitemap: ${route}`);
  }
}

const legacyManifest = JSON.parse(
  readFileSync(join(root, "src/data/legacy-posts.json"), "utf8"),
);
if (legacyManifest.count !== 172 || legacyManifest.entries.length !== 172) {
  fail(`legacy manifest should contain 172 approved posts, found ${legacyManifest.entries.length}`);
}

for (const entry of legacyManifest.entries) {
  const route = join("library", ...entry.slug.split("/"), "index.html");
  const output = join(dist, route);
  if (!existsSync(output)) {
    fail(`missing approved legacy route: ${route}`);
    continue;
  }
  const html = readFileSync(output, "utf8");
  for (const expected of [
    "Preserved legacy note",
    "data-pagefind-body",
    "View the original Markdown on GitHub",
  ]) {
    if (!html.includes(expected)) fail(`legacy route ${route} is missing ${expected}`);
  }
  const publicUrl = new URL(`library/${entry.slug}/`, "https://snowan.github.io/kuma-blog/").toString();
  if (!sitemap.includes(publicUrl)) {
    fail(`approved legacy route is missing from sitemap: ${publicUrl}`);
  }
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

const publicCollections = [
  { directory: join(root, "src/content/writing"), route: "writing" },
  { directory: join(root, "src/content/lab-notes"), route: "lab-notes" },
  { directory: join(root, "src/content/visuals"), route: "visuals" },
];

for (const { directory, route } of publicCollections) {
  for (const source of walk(directory).filter((path) => /\.mdx?$/.test(path))) {
    const text = readFileSync(source, "utf8");
    const frontmatter = text.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] ?? "";
    const status = frontmatter.match(/^status:\s*["']?([a-z-]+)["']?\s*$/m)?.[1];
    if (!status) {
      fail(`content entry is missing a readable status: ${relative(root, source)}`);
      continue;
    }
    if (status === "published") continue;

    const slug = basename(source).replace(/\.mdx?$/, "");
    const generatedRoute = `${route}/${slug}/index.html`;
    if (relativeFiles.includes(generatedRoute)) {
      fail(`${status} entry leaked into dist: ${generatedRoute}`);
    }
    if (rss.includes(`/${route}/${slug}/`) || sitemap.includes(`/${route}/${slug}/`)) {
      fail(`${status} entry leaked into a discovery feed: ${route}/${slug}`);
    }
  }
}


// Pi publication must remain reachable through the curated site.
const piCourse = "learn/pi-design-lab/";
const piArticle = "visuals/pi-design-lab/";
for (const route of [piCourse, piArticle]) {
  if (!existsSync(join(dist, route, "index.html"))) fail(`missing Pi route: ${route}`);
  if (!sitemap.includes(`https://snowan.github.io/kuma-blog/${route}`)) fail(`Pi route missing from sitemap: ${route}`);
}
if (!rss.includes(`/${piArticle}`)) fail("Pi introduction missing from RSS");
for (const page of ["index.html", "visuals/index.html", "library/index.html", "tags/pi/index.html", "topics/memory-context/index.html"]) {
  if (!existsSync(join(dist, page)) || !readFileSync(join(dist, page), "utf8").includes(`/kuma-blog/${piArticle}`)) fail(`Pi introduction missing from ${page}`);
}

if (!process.exitCode) {
  console.log(`verify-dist: ${relativeFiles.length} generated files passed`);
}
