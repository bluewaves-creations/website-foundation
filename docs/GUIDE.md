# Website Foundation — Complete Operations Guide

This guide contains everything you need to set up, configure, deploy, and extend the Website Foundation template. It consolidates all operational knowledge — Cloudflare setup, media generation APIs, deployment procedures, content creation, and troubleshooting — into one reference.

**When to read this:** When doing first-time setup, configuring Cloudflare services, generating media, deploying, creating content, or troubleshooting. The main `CLAUDE.md` has quick-reference patterns for everyday coding.

---

## Table of Contents

1. [Cloud Environment Setup](#1-cloud-environment-setup)
2. [First-Time Setup](#2-first-time-setup)
3. [Cloudflare Services Configuration](#3-cloudflare-services-configuration)
4. [Environment Variables & Secrets](#4-environment-variables--secrets)
5. [Media Generation — Complete API Reference](#5-media-generation--complete-api-reference)
6. [Deployment](#6-deployment)
7. [Content Creation](#7-content-creation)
8. [Rebranding Checklist](#8-rebranding-checklist)
9. [Creating New Pages, Components, and API Routes](#9-creating-new-pages-components-and-api-routes)
10. [Testing](#10-testing)

---

## 1. Cloud Environment Setup

When using Claude Code on **web or iOS**, the session runs in a cloud sandbox where browser-based `bunx wrangler login` does not work. You must authenticate using a Cloudflare API Token instead.

### Create an API Token

1. Go to **dash.cloudflare.com → Profile → API Tokens**
2. Click **Create Token → Custom Token**
3. Set the following permissions:

| Permission | Access |
|------------|--------|
| Account — Workers Scripts | Edit |
| Account — Workers AI | Edit |
| Account — Access: Apps and Policies | Edit |
| Zone — Email Routing Addresses | Edit |

4. (Optional) Restrict to your specific account and zone for security

### Set the Token

```bash
# Set as environment variable (cloud sandbox)
export CLOUDFLARE_API_TOKEN=your-token-here

# Verify authentication works
bunx wrangler whoami
```

### Non-Interactive Secret Management

In cloud sandboxes, interactive prompts don't work. Use the pipe form:

```bash
# Set a secret (non-interactive)
echo "your-secret-value" | bunx wrangler secret put SECRET_NAME

# Examples
echo "you@example.com" | bunx wrangler secret put CONTACT_EMAIL
echo "your-aud-tag" | bunx wrangler secret put POLICY_AUD
echo "your-team-name" | bunx wrangler secret put TEAM_DOMAIN
```

### Verify Setup

```bash
bunx wrangler whoami           # Should show your account
bunx wrangler secret list      # Should list configured secrets
```

---

## 2. First-Time Setup

### Prerequisites

- **Bun** (package manager): install from [bun.sh](https://bun.sh)
- **Cloudflare account**: free tier is sufficient
- **Wrangler** (included as dev dependency — no global install needed)

### Steps

#### 1. Clone and install

```bash
# Use as template from GitHub, or clone directly
git clone <repo-url> my-site
cd my-site
bun install
```

#### 2. Configure local secrets

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your values:

```env
CONTACT_EMAIL=you@example.com
POLICY_AUD=your-access-application-aud-tag
TEAM_DOMAIN=your-cloudflare-access-team-name
```

These are Cloudflare Worker secrets used only for local development. They are `.gitignore`d.

#### 3. Configure wrangler.jsonc

Edit `wrangler.jsonc`:

- **`name`**: Your worker name (e.g., `"my-website"`)
- **`send_email[0].destination_address`**: Your verified email address
- **`vars.AI_GATEWAY_NAME`**: Your AI Gateway name (default: `"website-foundation"`)

#### 4. Configure astro.config.mjs

Edit `astro.config.mjs`:

- **`site`**: Your production URL (e.g., `"https://mysite.com"`)

#### 5. Start dev server

```bash
bun run dev
```

Visit `http://localhost:4321` to verify everything works.

#### 6. Verification checklist

- [ ] `bun run dev` starts without errors
- [ ] Homepage loads at localhost:4321
- [ ] `bun run build` succeeds
- [ ] `bun run test` passes (42 tests)
- [ ] `bun run check` has no TypeScript errors

---

## 3. Cloudflare Services Configuration

### 3a. AI Gateway (for Media Generation)

AI Gateway proxies requests to fal.ai so your Worker never needs the fal.ai API key directly — the key is stored securely in the gateway (BYOK = Bring Your Own Key).

#### Setup steps

1. **Cloudflare Dashboard** → AI → AI Gateway → **Create Gateway**
2. Name it `website-foundation` (must match `vars.AI_GATEWAY_NAME` in `wrangler.jsonc`)
3. **Settings** → Enable **Authenticated Gateway**
4. **Provider Keys** → **Add Provider Key**:
   - Provider: `fal`
   - API Key: paste your fal.ai API key (get one at [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys))
5. Save

#### How it works

The `ai` binding in `wrangler.jsonc` gives your Worker access to the gateway:

```jsonc
// wrangler.jsonc
"ai": {
  "binding": "AI",
  "remote": true
}
```

In code, you get the gateway URL and fetch through it:

```ts
const gatewayUrl = await env.AI.gateway(env.AI_GATEWAY_NAME).getUrl("fal");
// gatewayUrl → https://gateway.ai.cloudflare.com/v1/{account}/{gateway}/fal

const response = await fetch(`${gatewayUrl}/fal-ai/model/endpoint`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: "..." }),
});
```

No API key is needed in your code — the gateway injects it automatically.

### 3b. Email Routing (for Contact Form)

The contact form at `/contact` sends emails using Cloudflare Email Routing.

#### Setup steps

1. **Cloudflare Dashboard** → Email → Email Routing → **Enable**
2. **Destination addresses** → Add and verify your email address
3. Edit `wrangler.jsonc` → set `send_email[0].destination_address` to your verified email
4. Set the `CONTACT_EMAIL` secret:

```bash
# CLI
bunx wrangler secret put CONTACT_EMAIL
# Enter: you@example.com

# Cloud sandbox (non-interactive)
echo "you@example.com" | bunx wrangler secret put CONTACT_EMAIL
```

#### How it works

The `send_email` binding in `wrangler.jsonc` provides an `env.SEND_EMAIL` object:

```jsonc
// wrangler.jsonc
"send_email": [
  {
    "name": "SEND_EMAIL",
    "destination_address": "you@example.com"
  }
]
```

The `src/lib/email.ts` module uses `cloudflare:email` to construct and send MIME messages through this binding.

### 3c. Cloudflare Access (for Protected Pages)

Media generation API routes (`/api/media/*`) are protected by Cloudflare Access, which verifies a JWT in the `Cf-Access-Jwt-Assertion` header.

#### Setup steps

1. **Cloudflare Dashboard** → Zero Trust → Access → Applications → **Add an application**
2. Type: **Self-hosted**
3. Configure:
   - Application name: e.g., `"My Website Admin"`
   - Application domain: your domain + path (e.g., `mysite.com/api/media/*`)
4. Add a policy (e.g., One-time PIN to your email)
5. After creation, copy the **Application Audience (AUD) tag**
6. Note your **Team domain** (e.g., `myteam` from `myteam.cloudflareaccess.com`)
7. Set secrets:

```bash
# CLI
bunx wrangler secret put POLICY_AUD
# Enter: your-aud-tag

bunx wrangler secret put TEAM_DOMAIN
# Enter: your-team-name

# Cloud sandbox (non-interactive)
echo "your-aud-tag" | bunx wrangler secret put POLICY_AUD
echo "your-team-name" | bunx wrangler secret put TEAM_DOMAIN
```

#### How it works

The `src/lib/access.ts` module uses the `jose` library to:
1. Extract the JWT from the `Cf-Access-Jwt-Assertion` header
2. Fetch Cloudflare's public keys from `https://{TEAM_DOMAIN}.cloudflareaccess.com/cdn-cgi/access/certs`
3. Verify the JWT signature and audience claim
4. Return the user's email (or `null` if unauthorized)

```ts
const user = await verifyAccessJwt(request, env);
if (!user) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 403 });
}
// user.email is available
```

### 3d. Custom Domain

1. **Cloudflare Dashboard** → Workers & Pages → your worker → Settings → **Domains & Routes**
2. Add your custom domain (must be on Cloudflare DNS)
3. Update `site` in `astro.config.mjs` to match:

```js
site: "https://yourdomain.com",
```

4. Redeploy: `bun run deploy`

---

## 4. Environment Variables & Secrets

### Complete Variable Reference

| Variable | Required | Where Used | How to Set | Description |
|----------|----------|------------|------------|-------------|
| `CONTACT_EMAIL` | Yes (for contact form) | `src/pages/api/contact.ts` | Secret | Destination email for contact form submissions |
| `POLICY_AUD` | Yes (for auth) | `src/lib/access.ts` | Secret | Cloudflare Access Application Audience tag |
| `TEAM_DOMAIN` | Yes (for auth) | `src/lib/access.ts` | Secret | Cloudflare Access team name (without `.cloudflareaccess.com`) |
| `AI_GATEWAY_NAME` | Yes (for media) | `src/lib/media.ts` | `wrangler.jsonc` vars | Name of AI Gateway (default: `"website-foundation"`) |

### Bindings (configured in wrangler.jsonc, not secrets)

| Binding | Name | Purpose |
|---------|------|---------|
| `ai` | `AI` | AI Gateway access for media generation |
| `send_email` | `SEND_EMAIL` | Email Routing for contact form |
| `assets` | `ASSETS` | Static asset serving |

### Local Development

Secrets go in `.dev.vars` (git-ignored):

```env
CONTACT_EMAIL=you@example.com
POLICY_AUD=your-access-application-aud-tag
TEAM_DOMAIN=your-cloudflare-access-team-name
```

Bindings (`AI`, `SEND_EMAIL`, `ASSETS`) are automatically available via `platformProxy` in `astro.config.mjs`.

### Production Secrets

```bash
# Interactive (CLI terminal)
bunx wrangler secret put CONTACT_EMAIL
bunx wrangler secret put POLICY_AUD
bunx wrangler secret put TEAM_DOMAIN

# Non-interactive (cloud sandbox)
echo "value" | bunx wrangler secret put SECRET_NAME
```

List current secrets:

```bash
bunx wrangler secret list
```

---

## 5. Media Generation — Complete API Reference

### 5a. Architecture

The media generation system uses **Cloudflare AI Gateway** as a proxy to **fal.ai**. This architecture means:

- No fal.ai API key in your code or secrets
- The key is stored in AI Gateway (BYOK — Bring Your Own Key)
- Requests flow: **Your Worker → AI Gateway → fal.ai**
- AI Gateway provides logging, caching, rate limiting, and analytics

#### Gateway URL Pattern

```ts
// IMPORTANT: getUrl() is async — must await
const gatewayUrl = await env.AI.gateway(env.AI_GATEWAY_NAME).getUrl("fal");
```

#### Existing Library

`src/lib/media.ts` exports two functions:

- **`generateImage(env, prompt, options?)`** — Text-to-image via Seedream v4.5
- **`generateVideo(env, prompt, options?)`** — Text-to-video via Seedance 1.5 Pro

Both return the raw `Response` from fal.ai (via the gateway).

#### Existing API Routes

- **`POST /api/media/generate-image`** — Protected by Cloudflare Access. Body: `{ prompt, imageSize? }`
- **`POST /api/media/generate-video`** — Protected by Cloudflare Access. Body: `{ prompt, aspectRatio?, resolution?, duration? }`

### 5b. Seedream v4.5 — Text-to-Image

Generate images from text prompts. Supports text rendering within images.

**Model ID:** `fal-ai/bytedance/seedream/v4.5/text-to-image`
**Cost:** $0.04 per image

#### Input Schema

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | — | Text prompt describing the desired image |
| `image_size` | string or `{width, height}` | No | `{width: 2048, height: 2048}` | Output size. Use `"auto_2K"`, `"auto_4K"`, or `{width, height}` (range: 1920–4096 per side) |
| `num_images` | integer | No | `1` | Number of images to generate (1–6) |
| `max_images` | integer | No | `1` | Multi-image mode: up to this many per generation (1–6) |
| `seed` | integer | No | random | Seed for reproducibility |
| `sync_mode` | boolean | No | `false` | If true, returns data URI instead of URL |
| `enable_safety_checker` | boolean | No | `true` | Safety content filter |

#### Output Schema

```json
{
  "images": [
    { "url": "https://..." }
  ],
  "seed": 42
}
```

#### Complete JSON Payload Example

```json
{
  "prompt": "A modern coffee shop interior with warm lighting, wooden tables, and plants hanging from the ceiling. Shot on 35mm film.",
  "image_size": "auto_2K",
  "num_images": 1,
  "enable_safety_checker": true
}
```

#### Usage via Library

```ts
import { generateImage } from "../lib/media";

const response = await generateImage(env, "A sunset over the ocean", {
  imageSize: "auto_2K",
});
const data = await response.json();
// data.images[0].url — the generated image URL
```

### 5c. Seedream v4.5 — Image Editing

Edit existing images using text instructions. Reference input images as "Figure 1", "Figure 2", etc.

**Model ID:** `fal-ai/bytedance/seedream/v4.5/edit`
**Cost:** $0.04 per image

#### Input Schema

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | — | Editing instructions. Reference images as "Figure 1", "Figure 2", etc. |
| `image_urls` | string[] | Yes | — | URLs of input images (up to 10) |
| `image_size` | string or `{width, height}` | No | `{width: 2048, height: 2048}` | Output size |
| `num_images` | integer | No | `1` | Number of output images (1–6) |
| `max_images` | integer | No | `1` | Multi-image mode (total inputs + outputs must not exceed 15) |
| `seed` | integer | No | random | Seed for reproducibility |
| `sync_mode` | boolean | No | `false` | If true, returns data URI |
| `enable_safety_checker` | boolean | No | `true` | Safety content filter |

#### Output Schema

```json
{
  "images": [
    { "url": "https://..." }
  ]
}
```

#### Complete JSON Payload Example

```json
{
  "prompt": "Replace the background in Figure 1 with a tropical beach at sunset. Keep the subject unchanged.",
  "image_urls": [
    "https://example.com/photo.jpg"
  ],
  "image_size": "auto_2K",
  "num_images": 1,
  "enable_safety_checker": true
}
```

#### Multi-Image Editing Example

```json
{
  "prompt": "Replace the product in Figure 1 with that in Figure 2. Copy the text style from Figure 3 to the top of the image.",
  "image_urls": [
    "https://example.com/background.jpg",
    "https://example.com/product.jpg",
    "https://example.com/text-reference.jpg"
  ],
  "image_size": "auto_4K"
}
```

#### Adding an Image Editing API Route

Image editing is not yet wired as an API route. To add it, create `src/pages/api/media/edit-image.ts`:

```ts
import type { APIContext } from "astro";
import { verifyAccessJwt } from "../../../lib/access";

export async function POST(context: APIContext) {
  const env = context.locals.runtime.env;

  const user = await verifyAccessJwt(context.request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { prompt?: string; imageUrls?: string[]; imageSize?: string };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { prompt, imageUrls, imageSize } = body;

  if (!prompt || !imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: prompt, imageUrls" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const gatewayUrl = await env.AI.gateway(env.AI_GATEWAY_NAME).getUrl("fal");
    const response = await fetch(
      `${gatewayUrl}/fal-ai/bytedance/seedream/v4.5/edit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          image_urls: imageUrls,
          image_size: imageSize ?? "auto_2K",
          num_images: 1,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Image editing failed", details: data }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Image editing error:", err);
    return new Response(
      JSON.stringify({ error: "Image editing failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
```

### 5d. Seedance 1.5 Pro — Text-to-Video

Generate videos with optional audio from text prompts.

**Model ID:** `fal-ai/bytedance/seedance/v1.5/pro/text-to-video`
**Cost:** ~$0.26 per 5s video at 720p with audio

Pricing formula: 1 million video tokens with audio = $2.40, without audio = $1.20.
Token count: `tokens = (height x width x FPS x duration) / 1024`

#### Input Schema

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | — | Text prompt describing the video |
| `aspect_ratio` | string | No | `"16:9"` | Options: `"21:9"`, `"16:9"`, `"4:3"`, `"1:1"`, `"3:4"`, `"9:16"` |
| `resolution` | string | No | `"720p"` | Options: `"480p"`, `"720p"`, `"1080p"` |
| `duration` | string | No | `"5"` | Seconds: `"4"` through `"12"` |
| `camera_fixed` | boolean | No | `false` | Lock camera position |
| `seed` | integer | No | random | Seed for reproducibility (-1 for random) |
| `enable_safety_checker` | boolean | No | `true` | Safety content filter |
| `generate_audio` | boolean | No | `true` | Generate audio track |

#### Output Schema

```json
{
  "video": {
    "url": "https://..."
  },
  "seed": 42
}
```

#### Complete JSON Payload Example

```json
{
  "prompt": "A drone shot flying over a coastal city at golden hour, waves crashing against the shore, seagulls calling, wind sounds",
  "aspect_ratio": "16:9",
  "resolution": "720p",
  "duration": "5",
  "generate_audio": true,
  "enable_safety_checker": true
}
```

#### Usage via Library

```ts
import { generateVideo } from "../lib/media";

const response = await generateVideo(env, "A timelapse of clouds over mountains", {
  aspectRatio: "16:9",
  resolution: "720p",
  duration: "5",
});
const data = await response.json();
// data.video.url — the generated video URL
```

### 5e. Seedance 1.5 Pro — Image-to-Video

Animate a reference image into a video. Uses the **same endpoint** as text-to-video, with an additional `image_url` parameter.

**Model ID:** `fal-ai/bytedance/seedance/v1.5/pro/text-to-video` (same endpoint)
**Cost:** Same as text-to-video

#### Additional Parameter

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image_url` | string | Yes | URL of the reference image to animate |

All other parameters are the same as text-to-video (section 5d).

#### Complete JSON Payload Example

```json
{
  "prompt": "The person in the image slowly turns to face the camera and smiles, gentle breeze in their hair",
  "image_url": "https://example.com/portrait.jpg",
  "aspect_ratio": "16:9",
  "resolution": "720p",
  "duration": "5",
  "generate_audio": true
}
```

#### Extending the Library for Image-to-Video

Image-to-video is not yet wired. To add support, extend `generateVideo()` in `src/lib/media.ts`:

```ts
export interface GenerateVideoOptions {
  aspectRatio?: string;
  resolution?: string;
  duration?: string;
  imageUrl?: string;  // Add this
}

export async function generateVideo(
  env: { AI: AiBinding; AI_GATEWAY_NAME: string },
  prompt: string,
  options: GenerateVideoOptions = {},
): Promise<Response> {
  const gatewayUrl = await env.AI.gateway(env.AI_GATEWAY_NAME).getUrl("fal");

  const body: Record<string, unknown> = {
    prompt,
    aspect_ratio: options.aspectRatio ?? "16:9",
    resolution: options.resolution ?? "720p",
    duration: options.duration ?? "5",
    generate_audio: true,
  };

  if (options.imageUrl) {
    body.image_url = options.imageUrl;
  }

  const response = await fetch(
    `${gatewayUrl}/fal-ai/bytedance/seedance/v1.5/pro/text-to-video`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  return response;
}
```

### 5f. Prompt Tips

**For images (Seedream v4.5):**
- Be specific about subject, setting, lighting, and style
- Supports text rendering — include quoted text in the prompt (e.g., `The text "Hello" in bold lettering`)
- Mention camera angle and film stock for photographic styles
- Keep prompts descriptive but under 500 characters

**For videos (Seedance 1.5 Pro):**
- Describe the action and camera movement explicitly
- Include audio cues when `generate_audio: true` (e.g., "waves crashing, seagulls calling")
- Shorter durations (4–5s) produce higher quality than longer ones
- Use `camera_fixed: true` for static scenes
- Keep prompts under 500 characters

---

## 6. Deployment

### Pre-Deploy Checklist

Run these in order — each must pass before proceeding:

```bash
bun run check    # TypeScript type checking
bun run test     # 42 tests across 7 files
bun run build    # Production build
```

### Deploy

```bash
bun run deploy   # Runs: astro build && wrangler deploy
```

This builds the Astro site and deploys the Worker to Cloudflare.

### Cloud Environment Deploy

In a cloud sandbox where `bunx wrangler login` doesn't work:

```bash
# Set API token
export CLOUDFLARE_API_TOKEN=your-token-here

# Verify auth
bunx wrangler whoami

# Deploy
bun run deploy
```

### Post-Deploy Verification

1. Visit your production URL — homepage should load
2. Check the contact form sends emails (if Email Routing is configured)
3. Test media generation endpoints (if AI Gateway is configured)
4. Verify Cloudflare Access protects `/api/media/*` (if Access is configured)

### Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `wrangler: command not found` | Wrangler not installed | Run `bun install` — it's a dev dependency |
| `Authentication error` | Not logged in | Run `bunx wrangler login` (CLI) or set `CLOUDFLARE_API_TOKEN` (cloud) |
| `Worker not found` | First deploy or wrong name | Check `name` in `wrangler.jsonc` matches |
| `Script too large` | Build output exceeds limit | Check for accidentally bundled large files |
| `AI binding error` | AI Gateway not configured | Set up AI Gateway in dashboard (section 3a) |
| `Gateway URL undefined` | Missing `await` on `getUrl()` | `getUrl()` is async — must `await` it |
| `Email send failed` | Email Routing not configured | Set up Email Routing (section 3b) and verify destination address |
| `SEND_EMAIL binding error` | `destination_address` not verified | Verify the email in Cloudflare Dashboard → Email Routing |
| `403 Unauthorized` on media APIs | Access JWT missing or invalid | Configure Cloudflare Access (section 3c) and set `POLICY_AUD`/`TEAM_DOMAIN` |
| `Astro.site is undefined` | `site` not set in config | Set `site` in `astro.config.mjs` |
| `Image transforms not working` | Not on Cloudflare domain | `/cdn-cgi/image/` transforms only work on Cloudflare-served domains |
| `Build fails with type errors` | TypeScript issues | Run `bun run check` to see specific errors |
| `Tests fail after changes` | Broken functionality | Run `bun run test` and fix failures before deploying |

---

## 7. Content Creation

All content lives in `src/content/<collection>/` as Markdown files with YAML frontmatter. File names should be **kebab-case** (e.g., `my-first-post.md`). The file name (without extension) becomes the content slug/ID.

### Blog Posts

**Location:** `src/content/blog/`

#### Frontmatter Template

```yaml
---
title: "Your Post Title"
description: "A brief summary for SEO and listing pages."
author: "Author Name"
publishedAt: 2026-02-21
updatedAt: 2026-02-21        # optional
image: "/images/blog/slug.jpg"  # optional
tags: ["tag1", "tag2"]        # optional, defaults to []
draft: false                   # optional, defaults to false
---

Your markdown content here.
```

#### Schema (from `src/content.config.ts`)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | Yes | — | Post title |
| `description` | string | Yes | — | Summary for SEO/listings |
| `author` | string | Yes | — | Author name |
| `publishedAt` | date | Yes | — | Publication date (YYYY-MM-DD) |
| `updatedAt` | date | No | — | Last updated date |
| `image` | string | No | — | Hero image path |
| `tags` | string[] | No | `[]` | Tags for filtering |
| `draft` | boolean | No | `false` | If true, excluded from listings |

### Gallery Items

**Location:** `src/content/gallery/`

#### Frontmatter Template

```yaml
---
title: "Gallery Item Title"
description: "Description of this gallery piece."
image: "/images/gallery/slug.jpg"
category: "Category Name"
publishedAt: 2026-02-21
tags: ["tag1", "tag2"]        # optional, defaults to []
---

Optional markdown body with additional details.
```

#### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | Yes | — | Item title |
| `description` | string | Yes | — | Item description |
| `image` | string | Yes | — | Image path (required) |
| `category` | string | Yes | — | Category for grouping |
| `publishedAt` | date | Yes | — | Publication date |
| `tags` | string[] | No | `[]` | Tags for filtering |

### Testimonials

**Location:** `src/content/testimonials/`

#### Frontmatter Template

```yaml
---
author: "Person Name"
role: "Job Title"
company: "Company Name"       # optional
avatar: "/images/avatars/person.jpg"  # optional
rating: 5                      # optional, 1-5
publishedAt: 2026-02-21
---

The testimonial quote text goes here as markdown body.
```

#### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `author` | string | Yes | — | Person's name |
| `role` | string | Yes | — | Job title |
| `company` | string | No | — | Company name |
| `avatar` | string | No | — | Avatar image path |
| `rating` | number | No | — | Rating 1–5 |
| `publishedAt` | date | Yes | — | Publication date |

### Promoted Items

**Location:** `src/content/promoted/`

#### Frontmatter Template

```yaml
---
title: "Promoted Item Title"
description: "Description for the promoted card."
image: "/images/promoted/slug.jpg"
link: "/blog/related-post"
linkText: "Read More"
order: 1
publishedAt: 2026-02-21
---

Optional markdown body content.
```

#### Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | Yes | — | Card title |
| `description` | string | Yes | — | Card description |
| `image` | string | Yes | — | Card image path |
| `link` | string | Yes | — | Destination URL |
| `linkText` | string | Yes | — | CTA button text |
| `order` | number | Yes | — | Sort order (lower = first) |
| `publishedAt` | date | Yes | — | Publication date |

### Query Patterns

```ts
import { getCollection } from "astro:content";

// Blog posts — filtered and sorted by date (newest first)
const posts = (await getCollection("blog"))
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

// Gallery items — sorted by date
const items = (await getCollection("gallery"))
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

// Promoted items — sorted by order field
const promoted = (await getCollection("promoted"))
  .sort((a, b) => a.data.order - b.data.order);

// Testimonials — all
const testimonials = await getCollection("testimonials");

// Single item by slug (for dynamic routes)
const post = (await getCollection("blog")).find((p) => p.id === slug);
```

### Rendering Content

```astro
---
import { render } from "astro:content";
const { Content } = await render(post);
---

<Content />
```

---

## 8. Rebranding Checklist

To rebrand the template for your own project, update these files:

### Configuration Files

| File | What to Change |
|------|---------------|
| `wrangler.jsonc` | `name` (worker name), `destination_address` (email), `vars.AI_GATEWAY_NAME` |
| `astro.config.mjs` | `site` (your production URL) |
| `package.json` | `name` (package name) |

### Text Content

| File | What to Change |
|------|---------------|
| `src/components/Header.astro` | Logo image `src` and `alt` text in the `<img>` tag |
| `src/components/Footer.astro` | Company name, links, copyright text |
| `src/pages/index.astro` | Hero headline, description, and CTA text |
| `src/pages/contact.astro` | Contact page heading and description |
| `src/pages/about.astro` | About page content (if it exists) |

### Visual Assets

| File | What to Change |
|------|---------------|
| `public/wave-artisan-logo.svg` | Replace with your logo |
| `public/favicon.svg` | Replace with your favicon |
| `public/images/` | Replace placeholder images |
| `src/styles/global.css` | Update brand colors (OKLCH gray palette) |

### Content

Replace the sample content in all collections:

- `src/content/blog/` — Remove sample posts, add yours
- `src/content/gallery/` — Remove sample items, add yours
- `src/content/testimonials/` — Remove samples, add yours
- `src/content/promoted/` — Remove samples, add yours

### Step-by-Step

1. Update `wrangler.jsonc`: change `name` and `destination_address`
2. Update `astro.config.mjs`: change `site` to your URL
3. Replace `public/wave-artisan-logo.svg` with your logo
4. Replace `public/favicon.svg` with your favicon
5. Edit `Header.astro`: update the logo `<img>` src and alt
6. Edit `Footer.astro`: update company name and links
7. Edit `src/pages/index.astro`: update hero content
8. Replace content in `src/content/` directories
9. Update colors in `src/styles/global.css` if desired
10. Run `bun run build && bun run test` to verify nothing broke

---

## 9. Creating New Pages, Components, and API Routes

### New Page (Static / Prerendered)

Create `src/pages/my-page.astro`:

```astro
---
import Layout from "../layouts/Layout.astro";

export const prerender = true;
---

<Layout title="My Page" description="Page description for SEO.">
  <section class="mx-auto max-w-6xl px-4 py-16">
    <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
      My Page
    </h1>
    <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
      Page content here.
    </p>
  </section>
</Layout>
```

**Important:** Add `export const prerender = true` for static pages. Without it, the page is SSR (rendered on every request).

### New Page (SSR / Dynamic)

For pages that need Cloudflare bindings or per-request data, omit `prerender`:

```astro
---
import Layout from "../layouts/Layout.astro";

const env = Astro.locals.runtime.env;
// Use env bindings here
---

<Layout title="Dynamic Page" description="Server-rendered page.">
  <!-- Content -->
</Layout>
```

### New Component

Create `src/components/MyComponent.astro`:

```astro
---
interface Props {
  title: string;
  variant?: "primary" | "secondary";
}

const { title, variant = "primary" } = Astro.props;
---

<div class:list={[
  "rounded-2xl p-6 shadow-sm ring-1",
  variant === "primary"
    ? "bg-white ring-gray-200 dark:bg-gray-900 dark:ring-gray-800"
    : "bg-gray-50 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700",
]}>
  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
    {title}
  </h3>
  <slot />
</div>
```

### New API Route

Create `src/pages/api/my-endpoint.ts`:

```ts
import type { APIContext } from "astro";

export async function POST(context: APIContext) {
  const env = context.locals.runtime.env;

  let body: { field1?: string; field2?: string };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { field1, field2 } = body;

  if (!field1) {
    return new Response(
      JSON.stringify({ error: "Missing required field: field1" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Process the request...

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
```

### Adding Navigation Links

Edit `src/components/Header.astro` — add to the `navLinks` array:

```ts
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/my-page", label: "My Page" },  // Add here
];
```

Both desktop and mobile navigation will update automatically.

---

## 10. Testing

### Running Tests

```bash
bun run test          # Run all tests once
bun run test:watch    # Run in watch mode (re-runs on file changes)
```

### Test Configuration

Tests use Vitest with Astro's `getViteConfig()` wrapper (`vitest.config.ts`):

```ts
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
```

Test files live in:
- `tests/unit/*.test.ts` — Unit tests
- `tests/integration/**/*.test.ts` — Integration tests

### Mock Helpers

`tests/setup.ts` provides two helpers:

#### `createMockEnv()`

Creates a mock Cloudflare runtime environment with all bindings:

```ts
import { createMockEnv } from "../setup";

const env = createMockEnv();
// env.AI.gateway("name").getUrl("fal") → resolves to mock URL
// env.SEND_EMAIL.send() → mock function
// env.CONTACT_EMAIL → "test@example.com"
// env.TEAM_DOMAIN → "test-team"
// env.POLICY_AUD → "test-aud-1234"
// env.AI_GATEWAY_NAME → "website-foundation"
```

#### `createMockContext(request, env?)`

Creates a mock Astro API context for testing endpoints:

```ts
import { createMockContext } from "../setup";

const request = new Request("https://example.com/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Test", email: "test@test.com", message: "Hello" }),
});

const context = createMockContext(request);
// context.request — the Request object
// context.locals.runtime.env — the mock env
// context.url — parsed URL
```

### Test Patterns

#### Testing API Routes

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock cloudflare:email before importing modules that use it
vi.mock("cloudflare:email", () => ({
  EmailMessage: vi.fn().mockImplementation((from, to, raw) => ({ from, to, raw })),
}));

import { POST } from "../../src/pages/api/contact";
import { createMockContext } from "../setup";

describe("POST /api/contact", () => {
  it("returns 400 for missing fields", async () => {
    const request = new Request("https://example.com/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test" }), // missing email and message
    });

    const context = createMockContext(request);
    const response = await POST(context as any);

    expect(response.status).toBe(400);
  });
});
```

#### Testing Lib Functions

```ts
import { describe, it, expect } from "vitest";
import { createMockEnv } from "../setup";
import { generateImage } from "../../src/lib/media";

describe("generateImage", () => {
  it("calls the correct endpoint", async () => {
    const env = createMockEnv();

    // Mock fetch
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ images: [{ url: "https://..." }] })),
    );

    await generateImage(env, "A sunset");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("fal-ai/bytedance/seedream/v4.5/text-to-image"),
      expect.any(Object),
    );
  });
});
```

#### Testing Zod Schemas

Schemas can be tested directly without the Astro runtime:

```ts
import { describe, it, expect } from "vitest";
import { z } from "astro/zod";

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string(),
  publishedAt: z.coerce.date(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

describe("blog schema", () => {
  it("accepts valid frontmatter", () => {
    const result = blogSchema.safeParse({
      title: "Test Post",
      description: "A test",
      author: "Tester",
      publishedAt: "2026-01-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = blogSchema.safeParse({
      description: "A test",
      author: "Tester",
      publishedAt: "2026-01-01",
    });
    expect(result.success).toBe(false);
  });
});
```

### Extending Mocks for New Bindings

If you add new Cloudflare bindings, update `createMockEnv()` in `tests/setup.ts`:

```ts
export function createMockEnv() {
  return {
    // ... existing bindings ...

    // Add your new binding mock
    MY_KV_NAMESPACE: {
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    },
  };
}
```
