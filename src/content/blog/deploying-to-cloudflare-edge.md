---
title: "From Local to Global in One Command"
description: "Wrangler setup, environment bindings, AI Gateway configuration, and email routing — everything you need to deploy the blueprint to Cloudflare's edge."
author: "Wave Artisans"
publishedAt: 2026-02-18
image: "/images/blog/deploying-to-cloudflare.jpg"
tags: ["cloudflare", "deployment", "workers"]
draft: false
---

The blueprint runs on Cloudflare Workers, which means your site is served from data centers in over 300 cities worldwide. Getting there takes one command — but understanding the pieces helps you make the most of the platform.

## Wrangler and the Config File

`wrangler.jsonc` defines your Worker's name, compatibility date, and bindings. The blueprint includes sensible defaults, but you'll want to update the Worker name and add your own environment variables before deploying.

## Environment Bindings

Cloudflare bindings give your Worker access to platform services without managing credentials. The blueprint uses:

- **AI Gateway** — for provider-agnostic image and video generation
- **Email Routing** — for sending transactional email from your contact form
- **Access** — for protecting private pages with JWT verification

Each binding is accessed through `context.locals.runtime.env` in API routes or `Astro.locals.runtime.env` in pages.

## AI Gateway Setup

AI Gateway acts as a proxy between your Worker and third-party AI providers. Create a gateway in the Cloudflare dashboard, note the gateway name, and set it as `AI_GATEWAY_NAME` in your environment. The blueprint's media generation endpoints handle the rest.

## Deploy

```bash
bunx wrangler deploy
```

That's it. Wrangler bundles your Astro build, uploads it to Workers, and makes it live. Subsequent deploys take seconds because only changed assets are uploaded.

## Custom Domains

Point your domain's DNS to Cloudflare, add a custom domain to your Worker, and you have a fully branded site with automatic SSL, HTTP/3, and edge caching — no reverse proxy required.
