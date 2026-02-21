# Website Foundation

A reusable website template built on **Astro 5**, **Tailwind CSS v4**, and **Cloudflare**. Provides content collections, theming, media generation via fal.ai, email sending, and authentication -- all on Cloudflare infrastructure.

## Tech Stack

- **Astro 5** -- Content Layer API, hybrid SSR/prerender
- **Tailwind CSS v4** -- `@theme` directive, OKLCH colors, class-based dark mode
- **Cloudflare Workers** -- SSR adapter, AI Gateway, Email Routing, Access
- **fal.ai** -- Image generation (Seedream v4.5), video generation (Seedance 1.5 Pro)
- **jose** -- JWT verification for Cloudflare Access
- **Vitest** -- Unit and integration testing

## Quick Start

```bash
git clone <repo-url> my-site
cd my-site
bun install
bun run dev
```

The dev server starts at `http://localhost:4321` with all sample content loaded.

## Project Structure

```
src/
  content.config.ts        # Content collection schemas
  content/
    promoted/              # Hero/promoted content (.md)
    blog/                  # Blog posts (.md)
    gallery/               # Gallery items (.md)
    testimonials/          # Testimonials (.md)
  layouts/
    Base.astro             # Base HTML layout
  components/
    Header.astro           # Responsive nav + mobile menu
    Footer.astro           # Site footer
    ThemeToggle.astro      # Dark/light mode toggle
    Button.astro           # Pill-shaped button (primary/secondary/ghost)
    CloudflareImage.astro  # Cloudflare image optimization wrapper
    PromotedCard.astro     # Promoted content card
    BlogCard.astro         # Blog post card
    GalleryCard.astro      # Gallery item card
    TestimonialCard.astro  # Testimonial card
    ContactForm.astro      # Contact form with client-side JS
  pages/
    index.astro            # Homepage (prerendered)
    blog/                  # Blog listing + detail (prerendered)
    gallery/               # Gallery listing + detail (prerendered)
    contact.astro          # Contact page (prerendered)
    404.astro              # Custom 404 page (prerendered)
    protected/             # Gated area (SSR, Cloudflare Access)
    api/
      contact.ts           # Email sending endpoint
      media/
        generate-image.ts  # Seedream image generation (Access-protected)
        generate-video.ts  # Seedance video generation (Access-protected)
  lib/
    cloudflare-image.ts    # Image transformation URL builder
    email.ts               # Email sending via Cloudflare binding
    media.ts               # fal.ai via AI Gateway (direct fetch)
    access.ts              # Cloudflare Access JWT verification
  styles/
    global.css             # Tailwind theme, fonts, dark mode
public/
  robots.txt               # Crawler directives + sitemap reference
tests/
  unit/                    # Unit tests
  integration/             # Integration tests
```

## Content Collections

Add or edit markdown files in `src/content/`. Each collection has a defined schema in `src/content.config.ts`.

### Promoted

```markdown
---
title: "Project Name"
description: "Short description"
image: "https://example.com/photo.jpg"
link: "https://example.com"
linkText: "View Project"
order: 1
publishedAt: 2025-12-01
---

Optional body text.
```

### Blog

```markdown
---
title: "Post Title"
description: "Post summary"
author: "Author Name"
publishedAt: 2025-12-10
image: "https://example.com/photo.jpg"  # optional
tags: ["astro", "tutorial"]             # optional, default []
draft: false                            # optional, default false
---

Post content in markdown.
```

### Gallery

```markdown
---
title: "Image Title"
description: "Image description"
image: "https://example.com/photo.jpg"
category: "Landscape"
publishedAt: 2025-11-20
tags: ["landscape", "nature"]           # optional, default []
---

Optional description text.
```

### Testimonials

```markdown
---
author: "Person Name"
role: "Job Title"
company: "Company Name"                # optional
avatar: "https://example.com/avatar.jpg" # optional
rating: 5                              # optional, 1-5
publishedAt: 2025-10-15
---

Testimonial text goes here as the body.
```

## Theming

### Colors

The template ships with a neutral gray palette in OKLCH. To add your brand's accent color, edit `src/styles/global.css`:

```css
@theme {
  --color-accent-500: oklch(55% 0.2 250);
  --color-accent-600: oklch(48% 0.2 250);
  /* ... add the full scale */
}
```

### Dark Mode

Dark mode uses Tailwind v4's `@custom-variant` with class-based toggling. The theme preference is stored in `localStorage` and defaults to the user's system preference. An inline script in `<head>` prevents flash of wrong theme.

### Fonts

Nunito Sans variable fonts are self-hosted in `public/fonts/` and preloaded. To change the font, replace the TTF files and update the `@font-face` declarations in `global.css`.

## Cloudflare Setup

### AI Gateway (fal.ai media generation)

1. Go to Cloudflare dashboard > AI > AI Gateway
2. Create a gateway named `website-foundation`
3. Add a provider: select "fal" and configure BYOK with your fal.ai API key
4. The `AI` binding in `wrangler.jsonc` connects automatically

No `FAL_KEY` environment variable needed -- AI Gateway handles authentication via BYOK.

### Email Routing

1. Enable Email Routing in your Cloudflare domain dashboard
2. Set the `CONTACT_EMAIL` variable in your Cloudflare Worker settings (or `.dev.vars` for local dev)
3. Update the `destination_address` in `wrangler.jsonc` if needed

### Cloudflare Access (protected pages)

1. Go to Cloudflare dashboard > Zero Trust > Access > Applications
2. Create a self-hosted application pointing to your domain + `/protected/*`
3. Set up an access policy (e.g., email allowlist, SSO)
4. Copy the **Application Audience (AUD) Tag** and your **Team Domain**
5. Set environment variables:
   - `POLICY_AUD` -- the AUD tag from step 4
   - `TEAM_DOMAIN` -- your team domain (e.g., `myteam`)

### Cloudflare Images

Image transformations work automatically on Cloudflare-hosted domains. The `CloudflareImage` component and `buildImageUrl()` helper generate `/cdn-cgi/image/` URLs for on-the-fly resizing.

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `CONTACT_EMAIL` | Worker vars | Destination email for contact form |
| `POLICY_AUD` | Worker vars | Cloudflare Access application AUD tag |
| `TEAM_DOMAIN` | Worker vars | Cloudflare Access team domain |
| `AI_GATEWAY_NAME` | `wrangler.jsonc` | AI Gateway name (default: `website-foundation`) |

For local development, create a `.dev.vars` file:

```
CONTACT_EMAIL=you@example.com
POLICY_AUD=your-aud-tag
TEAM_DOMAIN=your-team
```

## API Endpoints

### POST /api/contact

Send a contact form email.

```json
{ "name": "Jane", "email": "jane@example.com", "message": "Hello!" }
```

### POST /api/media/generate-image

> Requires Cloudflare Access authentication (`Cf-Access-Jwt-Assertion` header).

Generate an image using Seedream v4.5.

```json
{ "prompt": "a sunset over the ocean", "imageSize": "auto_2K" }
```

### POST /api/media/generate-video

> Requires Cloudflare Access authentication (`Cf-Access-Jwt-Assertion` header).

Generate a video using Seedance 1.5 Pro.

```json
{ "prompt": "a bird flying", "aspectRatio": "16:9", "resolution": "720p", "duration": "5" }
```

## Using with Claude Code

This template is designed to work well from Claude Code on web, iOS, and desktop:

1. **Clone the repo** and open it in Claude Code
2. **Add content** -- ask Claude to create new blog posts, gallery items, or testimonials as markdown files in `src/content/`
3. **Customize theming** -- ask Claude to add your brand colors to `global.css`
4. **Modify components** -- ask Claude to adjust layouts, add sections, or create new components
5. **Generate media** -- use the API endpoints to generate images and videos for your content
6. **Deploy** -- run `bunx wrangler deploy` to publish to Cloudflare

## Commands

| Command | Action |
|---------|--------|
| `bun install` | Install dependencies |
| `bun run dev` | Start dev server at `localhost:4321` |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build locally |
| `bun run check` | Run TypeScript checks |
| `bun run test` | Run tests |
| `bun run test:watch` | Run tests in watch mode |
| `bunx wrangler deploy` | Deploy to Cloudflare |

## Deployment

```bash
bun run build
bunx wrangler deploy
```

The Cloudflare adapter handles building the Worker and static assets automatically.
