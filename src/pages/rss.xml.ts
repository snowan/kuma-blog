import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE_DESCRIPTION, SITE_TITLE, slugFromId } from "../lib/site";

export async function GET(context: APIContext) {
  if (!context.site) {
    throw new Error("The RSS feed requires astro.config.mjs site configuration.");
  }

  const [writing, labNotes, visuals] = await Promise.all([
    getCollection("writing", ({ data }) => data.status === "published"),
    getCollection("labNotes", ({ data }) => data.status === "published"),
    getCollection("visuals", ({ data }) => data.status === "published"),
  ]);

  const items = [
    ...writing.map((entry) => ({ entry, route: "writing" })),
    ...labNotes.map((entry) => ({ entry, route: "lab-notes" })),
    ...visuals.map((entry) => ({ entry, route: "visuals" })),
  ]
    .sort(
      (left, right) =>
        (right.entry.data.publishedAt?.getTime() ?? 0) -
        (left.entry.data.publishedAt?.getTime() ?? 0),
    )
    .map(({ entry, route }) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedAt,
      link: `${route}/${slugFromId(entry.id)}/`,
    }));

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: new URL(import.meta.env.BASE_URL, context.site),
    items,
    customData: "<language>en-us</language>",
  });
}
