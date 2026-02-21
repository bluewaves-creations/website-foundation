<p align="center">
  <img src="docs/readme-header.jpg" alt="Website Foundation" width="800" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Astro-5-BC52EE?logo=astro&logoColor=white" alt="Astro 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Cloudflare_Workers-F38020?logo=cloudflareworkers&logoColor=white" alt="Cloudflare Workers" />
  <img src="https://img.shields.io/badge/Tests-42_passing-brightgreen" alt="Tests: 42 passing" />
</p>

# Website Foundation

A ready-to-use website template. Click **Use this template** to create your own copy, replace the sample content, and deploy. Out of the box you get a **blog**, **gallery**, **contact form** with email delivery, **password-protected pages**, **AI-powered image and video generation**, dark mode, SEO, and responsive design — all running on Cloudflare's free tier.

The sample brand is called "Wave Artisans." You'll replace it with your own name, logo, and content.

## What You Get

| Page | What it does |
|------|-------------|
| **Homepage** | Hero section, featured projects, latest blog posts, gallery preview, testimonials |
| **Blog** | List of posts with tags, author, and date. Each post has its own page |
| **Gallery** | Grid of images organized by category. Each item has its own detail page |
| **Contact** | Form that sends you an email when someone fills it out |
| **Protected area** | Pages only accessible to people you authorize (via Cloudflare Access) |
| **Dark mode** | Automatic toggle that remembers each visitor's preference |
| **AI media tools** | Generate images and videos from text prompts (protected behind login) |
| **SEO** | Sitemap, Open Graph tags, canonical URLs, meta descriptions |
| **Performance** | Static pages are prerendered at build time; dynamic pages run at the edge |

---

## Prerequisites

You need three things installed before you start. If you already have them, skip to [Quick Start](#quick-start).

### Git

Git tracks changes to your files and lets you deploy your site.

**macOS**:
```bash
xcode-select --install
```

**Windows**: Download from [git-scm.com/downloads/win](https://git-scm.com/downloads/win) and run the installer.

**Linux (Debian/Ubuntu)**:
```bash
sudo apt update && sudo apt install git
```

Verify it worked:
```bash
git --version
```

### Bun

Bun is a fast JavaScript runtime and package manager. It replaces Node.js for this project — **you do not need Node.js installed.**

**macOS**:
```bash
curl -fsSL https://bun.sh/install | bash
```
Or via [Homebrew](https://brew.sh): `brew install oven-sh/bun/bun`

**Windows** (PowerShell):
```powershell
irm bun.sh/install.ps1 | iex
```

**Linux**:
```bash
curl -fsSL https://bun.sh/install | bash
```

Verify it worked:
```bash
bun --version
```

### Cloudflare Account

Cloudflare is where your website will live. The free tier covers everything this template uses.

1. Go to [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Create an account and verify your email

That's it for now. You'll come back to the dashboard later when you deploy.

---

## Quick Start

1. Click the green **Use this template** button at the top of this page
2. Name your new repository and click **Create repository**
3. Clone your new repo and start the dev server:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git my-site
cd my-site
bun install
bun run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser. You should see the Wave Artisans sample site.

> **Note**: The dev server watches your files and reloads the page automatically when you save changes. Leave it running while you work.

---

## Make It Yours

Work through these in order. Each change shows up instantly in your browser.

### 1. Site Name and Branding

Replace "Wave Artisans" with your own name in these files:

| File | What to change |
|------|---------------|
| `src/pages/index.astro` (line 23) | `<Base title="Wave Artisans — Website Blueprint">` — change to your site title |
| `src/layouts/Base.astro` (line 15) | Default meta description — change the fallback text |
| `src/components/Header.astro` (line 19) | Logo `src` and `alt` text |
| `src/components/Footer.astro` (lines 9–13) | Copyright name and contact email |
| `src/pages/blog/index.astro` | Page title |
| `src/pages/gallery/index.astro` | Page title |
| `src/pages/contact.astro` | Page title |

### 2. Site URL

Open `astro.config.mjs` and change:

```js
site: "https://example.com",
```

to your actual domain (e.g., `"https://mysite.com"`). This URL is used for the sitemap, canonical links, and social sharing tags.

> **Note**: If you don't have a domain yet, skip this step and come back after the [Deploy](#deploy-to-cloudflare) section.

### 3. Content

All content lives in `src/content/` as Markdown files. Delete the sample files and create your own.

Here's how to create a new blog post — add a file like `src/content/blog/my-first-post.md`:

```markdown
---
title: "My First Post"
description: "A short summary of this post"
author: "Your Name"
publishedAt: 2026-02-21
tags: ["general"]
---

Write your post content here using Markdown.
```

See the [Content Collections Reference](#content-collections-reference) below for the full schema of each collection.

### 4. Colors

The template ships with a neutral gray palette so your accent color stands out. To add one, edit `src/styles/global.css` and add your accent inside the `@theme` block:

```css
@theme {
  --color-accent-500: oklch(55% 0.2 250);
  --color-accent-600: oklch(48% 0.2 250);
  /* Add more shades as needed */
}
```

Then use `accent-500`, `accent-600`, etc. in your Tailwind classes.

### 5. Fonts

The template uses Nunito Sans, self-hosted in `public/fonts/`. To change it:

1. Replace the `.ttf` files in `public/fonts/` with your font files
2. Update the `@font-face` declarations in `src/styles/global.css`
3. Update `--font-sans` in the `@theme` block to match your new font name

### 6. Logos and Favicons

Replace these files with your own:

| File | Purpose |
|------|---------|
| `public/wave-artisan-logo.svg` | Header logo (referenced in `Header.astro`) |
| `public/favicon.svg` | Browser tab icon (SVG) |
| `public/favicon.ico` | Browser tab icon (legacy fallback) |
| `public/apple-icon.png` | iOS home screen icon |
| `public/opengraph.png` | Default social sharing image |

---

## Deploy to Cloudflare

### 1. Authenticate Wrangler

Wrangler is Cloudflare's deployment tool. It's already installed as a project dependency — no global install needed.

```bash
bunx wrangler login
```

This opens your browser. Log in and authorize Wrangler.

Verify it worked:
```bash
bunx wrangler whoami
```

### 2. Deploy

```bash
bunx wrangler deploy
```

Wrangler reads `wrangler.jsonc`, builds your site, and uploads it. Your site is now live at:

```
https://website-foundation.<your-subdomain>.workers.dev
```

> **Note**: Every Cloudflare Worker gets a free `*.workers.dev` URL you can use for testing.

### 3. Add a Custom Domain

**If you already own a domain:**

1. In the Cloudflare dashboard, click **Add a site** and enter your domain
2. Select the **Free** plan
3. Cloudflare scans your existing DNS records — review and confirm
4. You'll receive two nameservers (e.g., `alice.ns.cloudflare.com`)
5. Go to your domain registrar and replace the current nameservers with the Cloudflare ones
6. Wait for activation (usually under 10 minutes, sometimes up to 24 hours)

**If you need a domain:**

1. In the dashboard, go to **Domain Registration** > **Register Domain**
2. Search for and purchase a domain — it's auto-configured with Cloudflare

**Connect your domain to the Worker:**

1. Go to **Workers & Pages** > click your Worker > **Settings** > **Domains & Routes**
2. Click **Add** > **Custom Domain**
3. Enter your domain (e.g., `mysite.com`)
4. Cloudflare creates the DNS record and provisions an SSL certificate automatically

> **Note**: Some features like email sending and image transforms require a custom domain. They don't work on `*.workers.dev` URLs.

### 4. Set Secrets

Secrets are environment variables stored securely on Cloudflare. You need one for the contact form:

```bash
bunx wrangler secret put CONTACT_EMAIL
```

You'll be prompted to enter the email address where contact form submissions should be sent.

**For local development**, create a `.dev.vars` file in the project root:

```
CONTACT_EMAIL=you@example.com
POLICY_AUD=your-aud-tag
TEAM_DOMAIN=your-team
```

> **Note**: `.dev.vars` is already in `.gitignore` so it won't be committed to your repository.

---

## Feature Setup Guides

Each feature below is optional and self-contained. Set up only what you need.

### Contact Form Email (Email Routing)

The contact form at `/contact` sends emails using Cloudflare Email Routing.

**Setup:**

1. In the Cloudflare dashboard, select your domain, then go to **Email** > **Email Routing**
2. Click **Enable Email Routing** and follow the prompts
3. Under **Destination addresses**, add the email where you want to receive messages (e.g., your personal email)
4. Check that email's inbox and click the verification link Cloudflare sends
5. Set the `CONTACT_EMAIL` secret if you haven't already:
   ```bash
   bunx wrangler secret put CONTACT_EMAIL
   ```
6. Open `wrangler.jsonc` and confirm the `destination_address` matches your verified email
7. Re-deploy: `bunx wrangler deploy`

**Test it**: Visit `/contact` on your live site, submit a message, and check your inbox.

> **Note**: Email Routing requires a custom domain. It does not work on `*.workers.dev` URLs.

### AI Media Generation (AI Gateway + fal.ai)

The template can generate images and videos from text prompts using fal.ai models through Cloudflare's AI Gateway.

**Setup:**

1. Create a fal.ai account at [fal.ai](https://fal.ai) and generate an API key from your dashboard
2. In the Cloudflare dashboard, go to **AI** > **AI Gateway** > **Create Gateway**
3. Name it `website-foundation` (this matches the `AI_GATEWAY_NAME` in `wrangler.jsonc`)
4. In the gateway's **Settings**, enable **Authenticated Gateway**
5. Still in Settings, go to **Provider Keys** > **Add API Key**
6. Select provider **fal**, paste your fal.ai API key, and save

No environment variable is needed on the Worker side — the AI binding in `wrangler.jsonc` connects to the gateway automatically, and the gateway injects your fal.ai key into requests (this is called "BYOK" — Bring Your Own Key).

**Test it**: The media generation endpoints are protected by Cloudflare Access. Set up Access first (next section), then visit `/protected` to use the generation tools.

> **Note**: fal.ai usage is billed by fal.ai based on your account's plan and credits.

### Protected Pages (Cloudflare Access)

Cloudflare Access adds a login screen in front of `/protected` pages. Only people you authorize can get in.

**Setup:**

1. In the Cloudflare dashboard sidebar, click **Zero Trust**
2. If this is your first time, choose an organization name (this becomes your "team domain," e.g., `myteam`) and select the **Free** plan
3. Go to **Settings** > **Authentication** > **Login methods** > **Add** > select **One-time PIN**
4. Go to **Access** > **Applications** > **Add an application** > **Self-hosted**
   - **Application name**: anything descriptive (e.g., "Protected Area")
   - **Domain**: your domain
   - **Path**: `/protected`
   - **Session duration**: e.g., 24 hours
5. Create a policy:
   - **Action**: Allow
   - **Rule type**: Emails
   - **Value**: list the email addresses allowed to log in
6. Save the application, then find the **Application Audience (AUD) Tag** on the application's overview page
7. Set the secrets:
   ```bash
   bunx wrangler secret put POLICY_AUD
   # Paste the AUD tag when prompted

   bunx wrangler secret put TEAM_DOMAIN
   # Enter your org name (e.g., "myteam") when prompted
   ```
8. Re-deploy: `bunx wrangler deploy`

**Test it**: Visit `/protected` on your live site. You should see a Cloudflare login page. Enter an authorized email, check for the one-time PIN, and log in.

### Sessions with KV (Optional)

Not used by the default template, but `@astrojs/cloudflare` supports server-side sessions via Cloudflare KV.

1. Create a KV namespace:
   ```bash
   bunx wrangler kv namespace create SESSION
   ```
2. Copy the output and add a `kv_namespaces` entry to `wrangler.jsonc`
3. Re-deploy: `bunx wrangler deploy`

---

## Content Collections Reference

Content lives in Markdown files inside `src/content/`. Each file starts with a block of metadata called "frontmatter" between `---` markers, followed by the body text.

Schemas are defined in `src/content.config.ts`.

### Promoted

Location: `src/content/promoted/`

Featured items shown in the hero section of the homepage.

```markdown
---
title: "Project Name"          # Required
description: "Short summary"   # Required
image: "https://example.com/photo.jpg"  # Required
link: "https://example.com"    # Required
linkText: "View Project"       # Required
order: 1                       # Required — controls display order
publishedAt: 2026-01-15        # Required
---

Optional body text (not currently displayed on the homepage).
```

### Blog

Location: `src/content/blog/`

```markdown
---
title: "Post Title"            # Required
description: "Post summary"    # Required
author: "Author Name"          # Required
publishedAt: 2026-01-15        # Required
updatedAt: 2026-02-01          # Optional — shown if present
image: "https://example.com/photo.jpg"  # Optional
tags: ["astro", "tutorial"]    # Optional — defaults to []
draft: false                   # Optional — defaults to false (true = hidden)
---

Post content in Markdown.
```

### Gallery

Location: `src/content/gallery/`

```markdown
---
title: "Image Title"           # Required
description: "Image description"  # Required
image: "https://example.com/photo.jpg"  # Required
category: "Landscape"          # Required
publishedAt: 2026-01-15        # Required
tags: ["landscape", "nature"]  # Optional — defaults to []
---

Optional description text.
```

### Testimonials

Location: `src/content/testimonials/`

```markdown
---
author: "Person Name"          # Required
role: "Job Title"              # Required
company: "Company Name"        # Optional
avatar: "https://example.com/avatar.jpg"  # Optional
rating: 5                      # Optional — 1 to 5
publishedAt: 2026-01-15        # Required
---

Testimonial text goes here as the body.
```

---

## Project Structure

You don't need to understand every file. Here are the key directories:

```
src/
  content.config.ts        # Content collection schemas
  content/
    promoted/              # Hero/promoted content (.md)
    blog/                  # Blog posts (.md)
    gallery/               # Gallery items (.md)
    testimonials/          # Testimonials (.md)
  layouts/
    Base.astro             # Base HTML layout (head, meta tags, scripts)
  components/
    Header.astro           # Responsive nav + mobile menu
    Footer.astro           # Site footer
    ThemeToggle.astro      # Dark/light mode toggle
    Button.astro           # Pill-shaped button (primary/secondary/ghost)
    CloudflareImage.astro  # Cloudflare image optimization wrapper
    PromotedCard.astro     # Promoted content card
    BlogCard.astro         # Blog post card
    GalleryCard.astro      # Gallery item card
    TestimonialCard.astro  # Testimonial card
    ContactForm.astro      # Contact form with client-side JS
  pages/
    index.astro            # Homepage (prerendered)
    blog/                  # Blog listing + detail (prerendered)
    gallery/               # Gallery listing + detail (prerendered)
    contact.astro          # Contact page (prerendered)
    404.astro              # Custom 404 page (prerendered)
    protected/             # Gated area (SSR, requires Cloudflare Access)
    api/
      contact.ts           # Email sending endpoint
      media/
        generate-image.ts  # Image generation (Access-protected)
        generate-video.ts  # Video generation (Access-protected)
  lib/
    cloudflare-image.ts    # Image transformation URL builder
    email.ts               # Email sending via Cloudflare binding
    media.ts               # fal.ai via AI Gateway (direct fetch)
    access.ts              # Cloudflare Access JWT verification
  styles/
    global.css             # Tailwind theme, fonts, dark mode
public/
  fonts/                   # Self-hosted Nunito Sans variable fonts
  robots.txt               # Crawler directives + sitemap reference
tests/
  unit/                    # Unit tests
  integration/             # Integration tests
```

---

## Commands

| Command | What it does |
|---------|-------------|
| `bun install` | Install project dependencies |
| `bun run dev` | Start dev server at `localhost:4321` |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build locally |
| `bun run check` | Run TypeScript checks |
| `bun run test` | Run all tests (42 tests across 7 files) |
| `bun run test:watch` | Run tests in watch mode |
| `bunx wrangler deploy` | Deploy to Cloudflare |

---

## API Reference

These endpoints are called by the frontend automatically. You don't need to call them manually unless you're building custom integrations.

### POST `/api/contact`

Send a contact form email.

```json
{ "name": "Jane", "email": "jane@example.com", "message": "Hello!" }
```

All three fields are required. Returns `{ "success": true }` or `{ "error": "..." }`.

### POST `/api/media/generate-image`

Generate an image using Seedream v4.5. Requires Cloudflare Access authentication (`Cf-Access-Jwt-Assertion` header).

```json
{ "prompt": "a sunset over the ocean", "imageSize": "auto_2K" }
```

### POST `/api/media/generate-video`

Generate a video using Seedance 1.5 Pro. Requires Cloudflare Access authentication (`Cf-Access-Jwt-Assertion` header).

```json
{ "prompt": "a bird flying", "aspectRatio": "16:9", "resolution": "720p", "duration": "5" }
```

---

## Environment Variables

| Variable | Required for | How to set | Description |
|----------|-------------|-----------|-------------|
| `CONTACT_EMAIL` | Contact form | `bunx wrangler secret put CONTACT_EMAIL` | Email address that receives contact form submissions |
| `POLICY_AUD` | Protected pages | `bunx wrangler secret put POLICY_AUD` | Cloudflare Access application AUD tag |
| `TEAM_DOMAIN` | Protected pages | `bunx wrangler secret put TEAM_DOMAIN` | Cloudflare Access team/org name |
| `AI_GATEWAY_NAME` | AI media generation | Set in `wrangler.jsonc` | AI Gateway name (default: `website-foundation`) |

**Local development** — create a `.dev.vars` file in the project root:

```
CONTACT_EMAIL=you@example.com
POLICY_AUD=your-aud-tag
TEAM_DOMAIN=your-team
```

---

## Using with Claude Code

This template is designed to work well from Claude Code on web, iOS, and desktop:

1. **Clone the repo** and open it in Claude Code
2. **Add content** — ask Claude to create new blog posts, gallery items, or testimonials as Markdown files in `src/content/`
3. **Customize theming** — ask Claude to add your brand colors to `global.css`
4. **Modify components** — ask Claude to adjust layouts, add sections, or create new components
5. **Generate media** — use the API endpoints to generate images and videos for your content
6. **Deploy** — run `bunx wrangler deploy` to publish to Cloudflare

---

## Troubleshooting

<details>
<summary><code>bun: command not found</code></summary>

Bun isn't installed or isn't in your PATH. Try reinstalling:

```bash
curl -fsSL https://bun.sh/install | bash
```

Then **restart your terminal** (close the window and open a new one) so the PATH change takes effect.
</details>

<details>
<summary><code>wrangler: command not found</code></summary>

Don't install Wrangler globally. Use `bunx` to run the version bundled with this project:

```bash
bunx wrangler deploy    # correct
wrangler deploy         # won't work unless installed globally
```
</details>

<details>
<summary>Build fails with "Could not resolve cloudflare:email"</summary>

This is expected when building locally — the `cloudflare:email` module only exists on Cloudflare's runtime. Use the dev server instead:

```bash
bun run dev
```

The production build (`bun run build`) will succeed when deployed via `bunx wrangler deploy`.
</details>

<details>
<summary>Contact form says "Failed to send"</summary>

Check each of these:

- [ ] `CONTACT_EMAIL` secret is set (`bunx wrangler secret put CONTACT_EMAIL`)
- [ ] Email Routing is enabled in your domain's Cloudflare dashboard
- [ ] The destination email address is verified (check for a verification email from Cloudflare)
- [ ] You're using a custom domain, not a `*.workers.dev` URL
- [ ] The `destination_address` in `wrangler.jsonc` matches your verified email
- [ ] You re-deployed after making changes (`bunx wrangler deploy`)
</details>

<details>
<summary>Protected page returns 403 Forbidden</summary>

Check each of these:

- [ ] `POLICY_AUD` and `TEAM_DOMAIN` secrets are set
- [ ] `POLICY_AUD` value matches the AUD tag in your Access application's overview
- [ ] `TEAM_DOMAIN` matches your Zero Trust org name
- [ ] Your email is listed in the Access policy's allow rules
- [ ] You re-deployed after setting the secrets
</details>

<details>
<summary>Wrong canonical URLs or broken sitemap</summary>

Update the `site` value in `astro.config.mjs` to your actual domain:

```js
site: "https://yourdomain.com",
```

Then re-deploy.
</details>

<details>
<summary><code>/cdn-cgi/image/</code> returns 404</summary>

Cloudflare image transformations only work on domains served through Cloudflare. They won't work on:
- `localhost` (local development)
- `*.workers.dev` URLs

You need a custom domain connected to Cloudflare for image transforms to work.
</details>

<details>
<summary>AI image/video generation errors</summary>

Check each of these:

- [ ] AI Gateway exists and is named `website-foundation` (must match `AI_GATEWAY_NAME` in `wrangler.jsonc`)
- [ ] **Authenticated Gateway** is enabled in the gateway's settings
- [ ] A fal.ai API key is added under **Provider Keys** with provider set to `fal`
- [ ] Your fal.ai account has available credits
- [ ] Cloudflare Access is set up (the endpoints require authentication)
</details>

<details>
<summary>Dark mode flashes the wrong theme on page load</summary>

Make sure the inline theme script is present in `src/layouts/Base.astro` inside the `<head>` tag. It must use `is:inline` so Astro doesn't bundle it:

```html
<script is:inline>
  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
</script>
```

This script must run before the page renders, which is why it's inline in `<head>`.
</details>

<details>
<summary>Tests fail</summary>

Make sure you're running tests from the project root:

```bash
bun run test
```

If tests fail after your changes, run individual test files to isolate the issue:

```bash
bunx vitest run tests/unit/specific-test.test.ts
```
</details>

---

## Tech Stack

- [Astro 5](https://astro.build) — Static site generator with hybrid SSR
- [Tailwind CSS v4](https://tailwindcss.com) — Utility-first CSS with `@theme` directive and OKLCH colors
- [Cloudflare Workers](https://workers.cloudflare.com) — Edge SSR, AI Gateway, Email Routing, Access
- [fal.ai](https://fal.ai) — Image generation (Seedream v4.5) and video generation (Seedance 1.5 Pro)
- [jose](https://github.com/panva/jose) — JWT verification for Cloudflare Access
- [Vitest](https://vitest.dev) — Unit and integration testing
