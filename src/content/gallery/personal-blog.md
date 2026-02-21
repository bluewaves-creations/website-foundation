---
title: "Personal Blog"
description: "A minimal personal blog with an about page, post archive, and RSS feed — the simplest expression of the foundation."
image: "/images/gallery/personal-blog.jpg"
category: "Personal"
publishedAt: 2026-02-05
tags: ["blog", "personal", "minimal"]
---

Strip the foundation down to its essentials and you get a clean personal blog. One collection for posts, a homepage with recent entries, and a detail page for each article — the writing takes center stage.

## What You'd Change

Remove the gallery and testimonials sections from the homepage. Replace the promoted cards with an "about me" block that introduces who you are and what you write about. Add an archive page that lists every post by year, and an RSS feed endpoint so readers can subscribe.

The gray-first design system ensures your words are the focal point. When you're ready to personalize, adding an accent color takes exactly one line in `global.css`. Swap the font for something with more character — a monospace for a technical blog, a humanist serif for personal essays.

## Build It with Claude Code

Tell Claude Code "strip this down to a minimal personal blog with about page and RSS feed" and it removes the gallery and testimonials collections, replaces the promoted section with an about block, creates an archive page grouped by year, and adds an RSS endpoint at `/feed.xml` using Astro's built-in RSS support. The homepage becomes clean and focused — just your latest posts and a brief introduction.

## Why the Foundation Fits

Personal blogs should be simple to maintain and fast to load. There's no database to back up, no CMS to update, no plugins to patch. You write a Markdown file, commit it, and deploy. The foundation handles the rest — responsive layout, dark mode, meta tags, and edge delivery.
