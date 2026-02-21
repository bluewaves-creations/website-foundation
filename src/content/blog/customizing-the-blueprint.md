---
title: "Five Ways to Make the Blueprint Your Own"
description: "Accent colors, custom fonts, new content collections, alternative page layouts, and API integrations — a practical guide to customizing the blueprint."
author: "Wave Artisans"
publishedAt: 2026-02-15
image: "/images/blog/customizing-the-blueprint.jpg"
tags: ["customization", "tailwind", "guide"]
draft: false
---

The blueprint is designed to be forked and reshaped. Here are the five highest-impact changes you can make in an afternoon.

## 1. Add an Accent Color

Open `src/styles/global.css` and add your brand color to the `@theme` block. The gray palette is already tuned to pair well with any hue:

```css
@theme {
  --color-accent-500: oklch(65% 0.19 250);
  --color-accent-600: oklch(55% 0.19 250);
}
```

Then use it in your components — `bg-accent-500`, `text-accent-600`, `ring-accent-500/20`. The neutral grays make any accent color feel deliberate rather than bolted on.

## 2. Swap the Font

Replace the Nunito Sans `@font-face` declarations with your typeface of choice. Update the theme variable and swap the files:

```css
@theme {
  --font-sans: "Inter", sans-serif;
}
```

The `font-display: swap` strategy and `<link rel="preload">` hints in `Base.astro` are already wired up — just point them at your new font files in `public/fonts/`.

## 3. Create New Collections

Need a "projects" or "recipes" section? Define a new collection in `src/content.config.ts`:

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

Add a Markdown folder under `src/content/projects/`, create a listing page at `src/pages/projects/index.astro`, and a detail page at `src/pages/projects/[slug].astro`. The pattern is identical for every collection.

## 4. Rework the Layout

The homepage is a vertical stack of sections — hero, blog, gallery, testimonials. Each section is self-contained and queries its own collection. Reorder them, remove what you don't need, or add new ones:

```astro
<!-- Swap the order or remove sections entirely -->
<HeroSection />
<ProjectsSection />    <!-- your new section -->
<TestimonialsSection />
<!-- Blog and Gallery removed -->
```

The `border-t` divider between sections keeps the rhythm consistent no matter how many you include.

## 5. Wire Up New APIs

The `src/pages/api/` directory is ready for new endpoints. Need a webhook receiver? Follow the existing pattern:

```typescript
export async function POST(context: APIContext) {
  const env = context.locals.runtime.env;
  let body: { event: string; payload: unknown };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Process the webhook...
  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
```

Every API route has the same shape: parse JSON, validate, process, return a typed response. Cloudflare bindings give you access to KV, D1, R2, and Queues without any additional configuration.

## Start Small

You don't have to change everything at once. The blueprint is intentionally minimal so that each customization is a clear, isolated step. Pick one of these five, ship it, and come back for the next.
