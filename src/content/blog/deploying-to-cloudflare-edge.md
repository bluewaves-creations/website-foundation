---
title: "From Local to Global in One Command"
description: "Wrangler setup, environment bindings, AI Gateway configuration, and email routing — everything you need to deploy the foundation to Cloudflare's edge."
author: "Website Foundation"
publishedAt: 2026-02-18
image: "/images/blog/deploying-to-cloudflare.jpg"
tags: ["cloudflare", "deployment", "workers"]
draft: false
---

Deployment is where the creative partnership comes full circle. You and Claude Code have built something together — components, content, API routes, tests — and now it's time to put it in front of the world. The foundation runs on Cloudflare Workers, which means your site is served from data centers in over 300 cities worldwide. Getting there takes one command.

## Wrangler and the Config File

`wrangler.jsonc` defines your Worker's name, compatibility date, and bindings. The foundation includes sensible defaults, but you'll want to update the Worker name and add your own environment variables before deploying.

Claude Code can handle the configuration — tell it "set up my Wrangler config for production" and it will update the Worker name, verify your bindings, and flag anything that needs a secret set before deploy.

## Environment Bindings

Cloudflare bindings give your Worker access to platform services without managing credentials. The foundation uses:

- **AI Gateway** — for provider-agnostic image and video generation
- **Email Routing** — for sending transactional email from your contact form
- **Access** — for protecting private pages with JWT verification

Each binding is accessed through `context.locals.runtime.env` in API routes or `Astro.locals.runtime.env` in pages.

## AI Gateway Setup

AI Gateway acts as a proxy between your Worker and third-party AI providers. Create a gateway in the Cloudflare dashboard, note the gateway name, and set it as `AI_GATEWAY_NAME` in your environment. The foundation's media generation endpoints handle the rest.

## Deploy

```bash
bun run deploy
```

That's it. Wrangler bundles your Astro build, uploads it to Workers, and makes it live. Subsequent deploys take seconds because only changed assets are uploaded.

## Custom Domains

Point your domain's DNS to Cloudflare, add a custom domain to your Worker, and you have a fully branded site with automatic SSL, HTTP/3, and edge caching — no reverse proxy required.

## Iterate After Deploy

Deployment isn't the end of the conversation. Once your site is live, the collaboration continues:

- "The hero image looks washed out on mobile — make it darker and add a text shadow" — Claude Code updates the component and you redeploy in seconds.
- "Add a banner announcing our launch event next week" — Claude Code creates a dismissible banner component, wires it into the layout, and it's live with the next `bun run deploy`.
- "The contact form is getting spam — add a honeypot field" — Claude Code adds the hidden field, updates the API route validation, and writes a test for the new logic.

Every change follows the same cycle: describe what you want, review the implementation, deploy. The gap between idea and live site stays small — exactly where it should be.
