import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const status = z.enum(["draft", "published", "archived"]).default("draft");
const presentation = z.enum(["journal", "control", "mori"]).default("journal");
const topic = z.enum([
  "agents-harnesses",
  "memory-context",
  "evals-reliability",
  "inference-systems",
]);

const sharedArticleFields = {
  title: z.string().min(1),
  description: z.string().min(1).max(240),
  publishedAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lastVerified: z.coerce.date().optional(),
  status,
  presentation,
  topic,
  series: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).default([]),
  featured: z.boolean().default(false),
  canonicalUrl: z.url().optional(),
};

function requirePublishedDate(
  value: {
    status: "draft" | "published" | "archived";
    publishedAt?: Date | undefined;
  },
  context: z.RefinementCtx,
) {
  if (value.status === "published" && !value.publishedAt) {
    context.addIssue({
      code: "custom",
      path: ["publishedAt"],
      message: "Published entries require publishedAt.",
    });
  }
}

const writing = defineCollection({
  loader: glob({ base: "./src/content/writing", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z
      .object({
        ...sharedArticleFields,
        type: z.enum(["essay", "guide"]),
        cover: z
          .object({
            src: image(),
            alt: z.string().min(1),
          })
          .optional(),
      })
      .superRefine(requirePublishedDate),
});

const labNotes = defineCollection({
  loader: glob({ base: "./src/content/lab-notes", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z
      .object({
        ...sharedArticleFields,
        type: z.enum(["experiment", "field-note", "guide"]),
        cover: z
          .object({
            src: image(),
            alt: z.string().min(1),
          })
          .optional(),
      })
      .superRefine(requirePublishedDate),
});

const visuals = defineCollection({
  loader: glob({ base: "./src/content/visuals", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z
      .object({
        ...sharedArticleFields,
        type: z.enum(["visual-explainer", "field-note"]),
        cover: z
          .object({
            src: image(),
            alt: z.string().min(1),
          })
          .optional(),
      })
      .superRefine((value, context) => {
        requirePublishedDate(value, context);
        if (value.status === "published" && !value.cover) {
          context.addIssue({
            code: "custom",
            path: ["cover"],
            message: "Published visual entries require a cover and alt text.",
          });
        }
      }),
});

const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(240),
    updatedAt: z.coerce.date().optional(),
    status,
    presentation,
  }),
});

export const collections = { writing, labNotes, visuals, pages };
