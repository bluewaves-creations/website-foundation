# Pages and Routing

All pages in the project with their rendering modes and patterns.

## Existing Pages

| File | URL | Mode | Notes |
|------|-----|------|-------|
| `src/pages/index.astro` | `/` | Static | Homepage with promoted, blog, gallery, testimonials |
| `src/pages/blog/index.astro` | `/blog` | Static | Blog listing with featured post |
| `src/pages/blog/[slug].astro` | `/blog/:slug` | Static | Blog post detail with `getStaticPaths` |
| `src/pages/gallery/index.astro` | `/gallery` | Static | Gallery grid |
| `src/pages/gallery/[slug].astro` | `/gallery/:slug` | Static | Gallery item detail |
| `src/pages/contact.astro` | `/contact` | Static | Contact form |
| `src/pages/protected/index.astro` | `/protected` | SSR | Cloudflare Access protected page |
| `src/pages/404.astro` | N/A | Static | Custom 404 page |
| `src/pages/api/contact.ts` | `/api/contact` | SSR | Contact form handler |
| `src/pages/api/media/generate-image.ts` | `/api/media/generate-image` | SSR | Image generation (auth required) |
| `src/pages/api/media/generate-video.ts` | `/api/media/generate-video` | SSR | Video generation (auth required) |

## Adding a New Static Page

```astro
---
import Base from "../layouts/Base.astro";

export const prerender = true;
---

<Base title="Page Title" description="Page description">
  <section class="mx-auto max-w-6xl px-4 pt-16 pb-20">
    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
      Page Title
    </h1>
    <!-- content -->
  </section>
</Base>
```

## Adding a New SSR Page

Same as static but without `export const prerender = true`. Access runtime env:

```astro
---
import Base from "../layouts/Base.astro";

const env = Astro.locals.runtime.env;
---
```

## Adding a Dynamic Route

Create `src/pages/<collection>/[slug].astro`:

```astro
---
import { getCollection, render } from "astro:content";
import Base from "../../layouts/Base.astro";

export const prerender = true;

export async function getStaticPaths() {
  const items = await getCollection("collectionName");
  return items.map((item) => ({
    params: { slug: item.id },
    props: { item },
  }));
}

const { item } = Astro.props;
const { Content } = await render(item);
---

<Base title={item.data.title}>
  <article class="mx-auto max-w-3xl px-4 pt-12 pb-20">
    <div class="prose prose-lg prose-gray dark:prose-invert">
      <Content />
    </div>
  </article>
</Base>
```

## Navigation

Add new page links in `src/components/Header.astro` in the `navLinks` array:

```ts
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/new-page", label: "New Page" },  // add here
];
```
