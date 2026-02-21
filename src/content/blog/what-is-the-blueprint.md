---
title: "What Is the Wave Artisans Website Blueprint?"
description: "An architecture deep dive into the blueprint's hybrid SSR strategy, content collections, gray-first design system, and Cloudflare Workers integration."
author: "Wave Artisans"
publishedAt: 2026-02-10
image: "/images/blog/what-is-the-blueprint.jpg"
tags: ["architecture", "astro", "cloudflare"]
draft: false
---

The Wave Artisans Website Blueprint is more than a starter template. It's a production-ready foundation that embeds years of web development best practices into a single, forkable repository.

## Hybrid SSR by Default

Astro 5 ships with a flexible rendering model. The blueprint uses `output: "server"` so every page is server-rendered on Cloudflare Workers by default. Static pages opt in with `export const prerender = true` — giving you the best of both worlds without a config toggle.

## Content Collections, Not a CMS

Blog posts, gallery items, promoted cards, and testimonials are all plain Markdown files validated by Zod schemas. There's no database to provision and no admin panel to secure. Content lives in `src/content/`, and the Content Layer API handles the rest.

## A Gray-First Design System

The blueprint ships without an accent color on purpose. A custom OKLCH gray palette covers every surface, text, and border — so when you add your brand's accent, it pops against a meticulously tuned neutral backdrop.

## Cloudflare Workers at the Edge

Server-side logic runs on Workers, which means your API routes, access control, and email sending happen at the edge — within milliseconds of your visitors. AI Gateway integration lets you generate images and video through a single, provider-agnostic endpoint.

## Who Is It For?

Developers and small teams who want to ship a real website — not a toy — in days instead of weeks. Fork it, replace the content, add your colors, and deploy.
