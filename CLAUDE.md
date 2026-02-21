# CLAUDE.md

Astro 5 + Tailwind CSS v4 + Cloudflare Workers website template. Hybrid SSR/prerender, content collections, AI Gateway media generation, email sending, Cloudflare Access auth. Package manager: **bun** (no npm/npx).

## Cloud Environment (Web / iOS)

When opened in a cloud sandbox (Claude Code web or iOS), browser-based `bunx wrangler login`
does not work. Use a Cloudflare API Token instead:
- Create at dash.cloudflare.com/profile/api-tokens → Custom Token
- Required permissions: Workers Scripts (Edit), Workers AI (Edit),
  Access: Apps and Policies (Edit), Email Routing Addresses (Edit)
- Set as env var: `CLOUDFLARE_API_TOKEN`
- Secrets use non-interactive form: `echo "value" | bunx wrangler secret put SECRET_NAME`

For complete setup, deployment, and media generation guides, read `docs/GUIDE.md`.

## Commands

```bash
bun run dev          # Dev server at localhost:4321
bun run build        # Production build
bun run preview      # Preview production build
bun run check        # TypeScript checks (astro check)
bun run test         # Vitest (42 tests, 7 files)
bun run test:watch   # Vitest in watch mode
bun run deploy     # Build + deploy to Cloudflare
```

## Architecture

- **Hybrid SSR**: `output: "server"` in `astro.config.mjs`. Static pages must export `export const prerender = true`
- **Content Layer API**: `src/content.config.ts` uses `glob` from `astro/loaders` + `z` from `astro/zod`
- **Collections**: promoted, blog, gallery, testimonials — all markdown in `src/content/<collection>/`
- **Lib modules**: accept `env` as first parameter for testability (e.g., `sendEmail(env, options)`)
- **Cloudflare bindings in API routes**: `const env = context.locals.runtime.env`
- **Cloudflare bindings in pages**: `const env = Astro.locals.runtime.env`

## Key Patterns

### File naming
- **Components**: PascalCase (`PromotedCard.astro`, `Button.astro`)
- **API routes**: kebab-case (`generate-image.ts`, `generate-video.ts`)
- **Lib modules**: camelCase (`cloudflare-image.ts`, `email.ts`)

### Component props
```astro
---
interface Props {
  variant?: "primary" | "secondary";
}
const { variant = "primary" } = Astro.props;
---
```

### API routes
```ts
import type { APIContext } from "astro";

export async function POST(context: APIContext) {
  const env = context.locals.runtime.env;
  let body: { ... };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  // ...validate, process, return Response with Content-Type: application/json
}
```

### Content queries
```ts
const posts = (await getCollection("blog"))
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
```

### Dark mode
- Tailwind v4: `@custom-variant dark (&:where(.dark, .dark *));` in `global.css`
- Theme toggle sets `class="dark"` on `<html>` + persists to `localStorage.theme`
- Inline `<script is:inline>` in `<head>` prevents flash of wrong theme

### Styling
- Tailwind utility classes everywhere, no custom CSS beyond `global.css`
- OKLCH gray palette (`--color-gray-50` through `--color-gray-950`)
- Cards: `rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800`
- Buttons: `rounded-full` pill shape
- Layout: `mx-auto max-w-6xl px-4 py-16`

### Media Generation (via AI Gateway → fal.ai)

Gateway URL pattern (async — must await):
```ts
const gatewayUrl = await env.AI.gateway(env.AI_GATEWAY_NAME).getUrl("fal");
```

Models and endpoints:
- **Text-to-image:** `fal-ai/bytedance/seedream/v4.5/text-to-image` ($0.04/image)
- **Image editing:** `fal-ai/bytedance/seedream/v4.5/edit` ($0.04/image)
- **Text-to-video:** `fal-ai/bytedance/seedance/v1.5/pro/text-to-video` (~$0.26/5s 720p)
- **Image-to-video:** same endpoint as text-to-video + `image_url` parameter

Existing lib: `src/lib/media.ts` — `generateImage()`, `generateVideo()`
Full API schemas and payloads: `docs/GUIDE.md` § Media Generation

### Email
```ts
import { EmailMessage } from "cloudflare:email";
await sendEmail(env, { from, to, subject, body });
```

### Cloudflare Access
```ts
const user = await verifyAccessJwt(request, env);
// Returns AccessPayload (with .email) or null
```

## Testing

- **Framework**: Vitest with `getViteConfig()` from `astro/config` (`vitest.config.ts`)
- **Mock helpers**: `tests/setup.ts` exports `createMockEnv()` and `createMockContext(request, env?)`
- **Mock Cloudflare modules**: `vi.mock("cloudflare:email", ...)` before importing
- **Test locations**: `tests/unit/*.test.ts`, `tests/integration/**/*.test.ts`
- **Schema tests**: use `z.safeParse()` directly on schema objects — no Astro runtime needed

## Gotchas

- Pages without `export const prerender = true` are SSR by default — add it for static pages
- `Astro.site` can be undefined: use `Astro.site ? new URL(Astro.url.pathname, Astro.site) : Astro.url`
- Wrap `request.json()` in try-catch — throws on invalid body
- `env.AI.gateway(name).getUrl(provider)` is **async** — must `await`
- Image transforms (`/cdn-cgi/image/`) only work on Cloudflare-served domains
- Client-side `<script>` tags are bundled by Astro; use `is:inline` to prevent bundling

## Complete Operations Guide

For first-time Cloudflare setup, AI Gateway configuration, environment variables,
media generation API payloads, deployment procedures, content creation templates,
and troubleshooting: read `docs/GUIDE.md`.

## Verification

After making changes, confirm:
1. `bun run build` succeeds
2. `bun run test` passes (42 tests across 7 files)
3. `bun run check` has no errors
