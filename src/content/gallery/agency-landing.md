---
title: "Agency Landing"
description: "A services agency site with case studies, team bios, and a branded contact flow — built on content collections and the contact form."
image: "/images/gallery/agency-landing.jpg"
category: "Agency"
publishedAt: 2026-02-07
tags: ["agency", "services", "business"]
---

Agencies need credibility pages fast — a professional web presence that showcases past work, introduces the team, and converts visitors into leads. The foundation's content collections and contact form cover every piece.

## What You'd Change

Turn the promoted cards into case study highlights with client logos, project descriptions, and outcome metrics. Create a new "team" collection with fields for name, role, photo, and bio. The testimonials collection already handles client quotes — just populate it with real feedback.

Customize the contact form to include a project budget dropdown and a services checklist. The existing API route sends email via Cloudflare Email Routing, so inquiries land directly in your inbox with all the details structured and ready to triage.

## Build It with Claude Code

Tell Claude Code "turn this into an agency site with case studies and a team page" and it creates a case studies collection with schema fields for client, industry, and outcomes, builds a team collection with photo and bio, adds listing and detail pages for both, and updates the homepage to feature your best work. The contact form gets the extra fields, and the email template formats the inquiry for easy triage.

## Why the Foundation Fits

Agency sites change infrequently but need to look polished and load fast. Prerendered pages with edge caching give you both. When you win a new client and need to update the case studies, it's a Markdown file and a deploy — no CMS login, no database migration.
