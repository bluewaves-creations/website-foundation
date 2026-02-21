---
title: "Editorial Journal"
description: "A long-form editorial publication with rich typography, pull quotes, and author bios — powered by the blog collection."
image: "/images/gallery/editorial-journal.jpg"
category: "Editorial"
publishedAt: 2026-02-09
tags: ["editorial", "writing", "publishing"]
---

The blog collection already supports everything an editorial team needs: front matter for author attribution, draft flags for editorial workflow, tag-based categorization, and Markdown rendering with the typography plugin for properly styled prose.

## What You'd Change

Add a custom serif typeface to the `@theme` block for a more literary feel. Extend the blog schema with fields like `category`, `readingTime`, and `featured` to support editorial sections and homepage curation. Create a dedicated author collection so each writer gets a bio page with their published articles.

Pull quotes, drop caps, and footnotes all work through standard Markdown extensions or the typography plugin's built-in classes. The `prose-lg` class on detail pages already sets comfortable line lengths and spacing for long reads.

## Why the Blueprint Fits

Editorial publications thrive on structured content and fast page loads. The Content Layer API validates every article against its schema before build, catching broken front matter early. Server-rendered pages mean your journal works without JavaScript, respecting readers on slow connections.
