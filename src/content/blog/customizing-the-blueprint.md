---
title: "Five Things to Build Together"
description: "Accent colors, custom fonts, new content collections, alternative page layouts, and API integrations — a practical guide to customizing the foundation with Claude Code."
author: "Website Foundation"
publishedAt: 2026-02-15
image: "/images/blog/customizing-the-blueprint.jpg"
tags: ["customization", "tailwind", "guide"]
draft: false
---

The foundation is designed to be forked and reshaped. Here are the five highest-impact changes you can make — each one a natural conversation with Claude Code.

## 1. Add an Accent Color

**With Claude Code**: "Add a deep teal accent color that works in both light and dark mode."

Claude Code opens `src/styles/global.css`, adds your accent to the `@theme` block, and updates key components — buttons, links, active states — to use it. The gray palette is already tuned to pair well with any hue:

```css
@theme {
  --color-accent-500: oklch(65% 0.19 250);
  --color-accent-600: oklch(55% 0.19 250);
}
```

Then it uses `bg-accent-500`, `text-accent-600`, `ring-accent-500/20` across your components. The neutral grays make any accent color feel deliberate rather than bolted on.

## 2. Swap the Font

**With Claude Code**: "Switch the font to Inter for a more modern feel."

Claude Code replaces the Nunito Sans `@font-face` declarations with your typeface, updates the theme variable, swaps the files in `public/fonts/`, and adjusts the preload hints in `Base.astro`:

```css
@theme {
  --font-sans: "Inter", sans-serif;
}
```

The `font-display: swap` strategy is already wired up — Claude Code just points it at the new files.

## 3. Create New Collections

**With Claude Code**: "I need a 'projects' collection with fields for client name, year, and cover image. Add a listing page and detail pages."

Claude Code defines the new collection in `src/content.config.ts`, creates the Markdown folder under `src/content/projects/`, builds a listing page at `src/pages/projects/index.astro`, and a detail page at `src/pages/projects/[slug].astro`. It follows the same pattern used by blog and gallery:

```typescript
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    year: z.number(),
    image: z.string(),
    publishedAt: z.coerce.date(),
  }),
});
```

One conversation, and you have a fully functional new section — schema-validated, prerendered, and styled to match the rest of the site.

## 4. Rework the Layout

**With Claude Code**: "Remove the gallery and testimonials from the homepage. Add a 'Services' section with three cards and a CTA button."

Claude Code understands the homepage structure — each section is self-contained and queries its own collection. It removes the sections you don't need, creates a new Services section, and keeps the visual rhythm consistent:

```astro
<!-- Swap the order or remove sections entirely -->
<HeroSection />
<ServicesSection />    <!-- your new section -->
<TestimonialsSection />
<!-- Gallery removed -->
```

The `border-t` divider between sections adapts no matter how many you include.

## 5. Wire Up New APIs

**With Claude Code**: "Add a waitlist endpoint that stores email signups in KV and sends a confirmation email."

Claude Code creates the API route following the existing pattern — parse JSON, validate, process, return a typed response — and adds the KV binding configuration:

```typescript
export async function POST(context: APIContext) {
  const env = context.locals.runtime.env;
  let body: { email: string };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Store in KV, send confirmation email, return success
}
```

It writes the tests alongside the implementation, using the same `createMockEnv()` pattern the rest of the codebase uses. Cloudflare bindings give you access to KV, D1, R2, and Queues without any additional configuration.

## Start with a Conversation

You don't have to build everything at once. Pick one of these five, describe what you want, and watch Claude Code implement it across every file that needs to change. Each customization is a clear, testable step — and the foundation is designed so that each step produces a coherent result.
