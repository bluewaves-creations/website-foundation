---
title: "Building a Website with Claude Code"
description: "How the entire Wave Artisans blueprint was scaffolded, styled, tested, and deployed using an AI-assisted development workflow."
author: "Wave Artisans"
publishedAt: 2026-02-12
image: "/images/blog/building-with-claude-code.jpg"
tags: ["claude code", "ai", "workflow"]
draft: false
---

Every line of code in this blueprint was written in collaboration with Claude Code. Here's what that workflow actually looks like in practice — from the first command to the final deploy.

## Start with Intent, Not Boilerplate

Instead of copy-pasting starter templates and wiring them together, you describe what you want: "Create an Astro 5 site with Tailwind v4, content collections for blog and gallery, and Cloudflare Workers SSR."

Claude Code scaffolds the project structure, installs dependencies, writes the Astro config with the Cloudflare adapter, and sets up the content schemas — all before you've opened a single file manually. The result is a working skeleton that builds and deploys from minute one.

## Iterate in Conversation

Once the skeleton exists, development becomes a conversation. Each feature request produces a complete implementation across all the files it touches:

- "Add a contact form that sends email via Cloudflare Email Routing" creates the form component, the API route, the email utility module, and the validation logic.
- "Add dark mode with a toggle that persists to localStorage" produces the theme toggle component, the inline script to prevent flash, and the CSS custom variant.
- "Make the gallery images square with a hover zoom" updates the component, adds the right Tailwind classes, and keeps the responsive grid intact.

The key is that each pass is coherent — the component, the route, the utility, and the tests all follow the same patterns.

## Test as You Go

Every lib module in the blueprint accepts `env` as its first parameter. This isn't an accident — it's a deliberate pattern for testability:

```typescript
// The real module
export async function sendEmail(env: Env, options: EmailOptions) {
  const msg = new EmailMessage(options.from, options.to, rawEmail);
  await env.EMAIL.send(msg);
}

// The test
const env = createMockEnv();
await sendEmail(env, { from, to, subject, body });
expect(env.EMAIL.send).toHaveBeenCalled();
```

Claude Code writes Vitest tests alongside the implementation, using `createMockEnv()` and `createMockContext()` helpers that mirror the real Cloudflare bindings. The result is 34 tests across 6 files that run in under a second.

## Ship with Confidence

The final step is deployment. `bunx wrangler deploy` pushes the entire site to Cloudflare's global network. Because every component has been tested against the same schemas and patterns, there are no last-minute surprises.

The build step catches schema violations, the type checker catches binding mismatches, and the tests catch logic errors — three layers of verification before any code reaches production.

## The Takeaway

AI-assisted development isn't about replacing developers. It's about compressing the tedious parts — boilerplate, configuration, test scaffolding, cross-file consistency — so you can spend more time on what makes your site unique. The blueprint exists because this workflow makes it possible to build something real in a weekend.
