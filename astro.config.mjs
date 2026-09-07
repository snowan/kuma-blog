import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://snowan.github.io",
  base: "/kuma-blog",
  output: "static",
  trailingSlash: "always",
  integrations: [
    mdx(),
    sitemap({
      customPages: [
        "https://snowan.github.io/kuma-blog/learn/pi-design-lab/",
        "https://snowan.github.io/kuma-blog/learn/codex-context-experiments/",
        "https://snowan.github.io/kuma-blog/learn/codex-context-experiments/overview.html",
      ],
      filter: (page) => !page.endsWith("/404/") && !page.includes("/design-system/"),
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
      wrap: true,
    },
  },
});
