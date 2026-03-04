# Content Collection Schemas

Verbatim Zod schemas from `src/content.config.ts` with field-by-field documentation.

## Blog Schema

```ts
z.object({
  title: z.string(),           // Post title — displayed in cards and page header
  description: z.string(),     // Short summary — used in cards, meta description, OG tags
  author: z.string(),          // Author name — displayed in post header and cards
  publishedAt: z.coerce.date(),// Publication date — YYYY-MM-DD string coerced to Date
  updatedAt: z.coerce.date().optional(), // Last update date — shown if present
  image: z.string().optional(),// Hero image URL — displayed above post body
  tags: z.array(z.string()).default([]), // Tag labels — displayed as pills
  draft: z.boolean().default(false),     // Draft flag — drafts excluded from queries
})
```

## Gallery Schema

```ts
z.object({
  title: z.string(),           // Item title — displayed on hover overlay
  description: z.string(),     // Short description — shown on detail page
  image: z.string(),           // Image URL (required) — the gallery visual
  category: z.string(),        // Category label — used for filtering
  publishedAt: z.coerce.date(),// Publication date — used for sort order
  tags: z.array(z.string()).default([]), // Tag labels
})
```

## Testimonials Schema

```ts
z.object({
  author: z.string(),          // Person's name
  role: z.string(),            // Job title or role description
  company: z.string().optional(), // Company name — displayed after role
  avatar: z.string().optional(),  // Avatar image URL
  rating: z.number().min(1).max(5).optional(), // Star rating 1-5
  publishedAt: z.coerce.date(),// Date — used for ordering
})
```

The markdown body of a testimonial file is the quote text itself (no quotation marks needed).

## Promoted Schema

```ts
z.object({
  title: z.string(),           // Card title — keep under 60 characters
  description: z.string(),     // Card description — keep under 120 characters
  image: z.string(),           // Card image URL
  link: z.string(),            // Destination URL when card is clicked
  linkText: z.string(),        // Button/CTA text (e.g., "Learn more")
  order: z.number(),           // Display order — lower numbers appear first
  publishedAt: z.coerce.date(),// Publication date
})
```
