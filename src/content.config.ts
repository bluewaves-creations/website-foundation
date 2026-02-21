import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const promoted = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/promoted" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    link: z.string(),
    linkText: z.string(),
    order: z.number(),
    publishedAt: z.coerce.date(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/gallery" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    category: z.string(),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/testimonials" }),
  schema: z.object({
    author: z.string(),
    role: z.string(),
    company: z.string().optional(),
    avatar: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    publishedAt: z.coerce.date(),
  }),
});

export const collections = { promoted, blog, gallery, testimonials };
