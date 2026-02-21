import { describe, it, expect } from "vitest";
import { z } from "astro/zod";

// Test schemas independently — validates that our schema definitions work correctly
// with the sample content frontmatter patterns

const promotedSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  link: z.string().url(),
  linkText: z.string(),
  order: z.number(),
  publishedAt: z.coerce.date(),
});

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const gallerySchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  category: z.string(),
  publishedAt: z.coerce.date(),
  tags: z.array(z.string()).default([]),
});

const testimonialSchema = z.object({
  author: z.string(),
  role: z.string(),
  company: z.string().optional(),
  avatar: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  publishedAt: z.coerce.date(),
});

describe("content collection schemas", () => {
  describe("promoted schema", () => {
    it("validates valid promoted content", () => {
      const result = promotedSchema.safeParse({
        title: "Featured Project",
        description: "A great project",
        image: "https://example.com/photo.jpg",
        link: "https://example.com",
        linkText: "View Project",
        order: 1,
        publishedAt: "2025-12-01",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid link URL", () => {
      const result = promotedSchema.safeParse({
        title: "Test",
        description: "Test",
        image: "photo.jpg",
        link: "not-a-url",
        linkText: "Click",
        order: 1,
        publishedAt: "2025-01-01",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("blog schema", () => {
    it("validates valid blog post", () => {
      const result = blogSchema.safeParse({
        title: "Test Post",
        description: "A test post",
        author: "Jane",
        publishedAt: "2025-12-10",
        tags: ["test"],
      });
      expect(result.success).toBe(true);
    });

    it("applies default values", () => {
      const result = blogSchema.parse({
        title: "Test",
        description: "Test",
        author: "Jane",
        publishedAt: "2025-01-01",
      });
      expect(result.tags).toEqual([]);
      expect(result.draft).toBe(false);
    });

    it("coerces date strings", () => {
      const result = blogSchema.parse({
        title: "Test",
        description: "Test",
        author: "Jane",
        publishedAt: "2025-12-10",
      });
      expect(result.publishedAt).toBeInstanceOf(Date);
    });
  });

  describe("gallery schema", () => {
    it("validates valid gallery item", () => {
      const result = gallerySchema.safeParse({
        title: "Mountain Sunrise",
        description: "A beautiful sunrise",
        image: "https://example.com/photo.jpg",
        category: "Landscape",
        publishedAt: "2025-11-20",
        tags: ["landscape"],
      });
      expect(result.success).toBe(true);
    });
  });

  describe("testimonial schema", () => {
    it("validates valid testimonial", () => {
      const result = testimonialSchema.safeParse({
        author: "Sarah Chen",
        role: "CTO",
        company: "TechForward",
        rating: 5,
        publishedAt: "2025-10-15",
      });
      expect(result.success).toBe(true);
    });

    it("rejects rating out of range", () => {
      const result = testimonialSchema.safeParse({
        author: "Test",
        role: "Developer",
        rating: 6,
        publishedAt: "2025-01-01",
      });
      expect(result.success).toBe(false);
    });

    it("allows optional fields", () => {
      const result = testimonialSchema.safeParse({
        author: "Test",
        role: "Developer",
        publishedAt: "2025-01-01",
      });
      expect(result.success).toBe(true);
    });
  });
});
