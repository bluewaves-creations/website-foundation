---
title: "Developer Docs"
description: "A technical documentation site with code blocks, syntax highlighting, and versioned content — leveraging the Content Layer API."
image: "/images/gallery/developer-docs.jpg"
category: "Documentation"
publishedAt: 2026-02-06
tags: ["documentation", "developer", "technical"]
---

Documentation sites live and die by structure. The Content Layer API makes it easy to organize docs into sections with validated front matter, and Astro's Markdown rendering handles code blocks with syntax highlighting out of the box.

## What You'd Change

Add a `section` and `order` field to the blog schema to group pages into logical chapters. Build a sidebar navigation component that queries the collection and renders a nested tree. Add a search endpoint that indexes the Markdown content at build time and returns results from a lightweight API route.

For versioned docs, add a `version` field to the schema and filter by it in your listing pages. Each major release gets its own set of Markdown files, and a version switcher in the header lets readers toggle between them.

## Build It with Claude Code

Tell Claude Code "I need a docs site with sidebar navigation, versioning, and search" and it extends the content schema with section, order, and version fields, creates a collapsible sidebar component that builds its tree from the collection query, adds a version switcher to the header, and builds a search API route with a build-time index. The whole documentation architecture comes together coherently — every component following the same patterns.

## Why the Foundation Fits

Developer documentation needs to be fast, searchable, and easy to maintain. Markdown-based content means engineers can submit doc changes through pull requests — the same workflow they use for code. Prerendered pages load instantly, and the typography plugin ensures code blocks, tables, and inline code all render cleanly.
