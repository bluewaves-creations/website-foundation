# Content Query Patterns

All content query patterns used across the site.

## Homepage Queries (`src/pages/index.astro`)

```ts
// Promoted cards — sorted by order field (ascending)
const promoted = (await getCollection("promoted"))
  .sort((a, b) => a.data.order - b.data.order);

// Latest 3 blog posts — draft-filtered, date-sorted
const posts = (await getCollection("blog"))
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
  .slice(0, 3);

// Latest 6 gallery items
const galleryItems = (await getCollection("gallery"))
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
  .slice(0, 6);

// All testimonials (no filtering)
const testimonials = await getCollection("testimonials");
```

## Blog Index (`src/pages/blog/index.astro`)

```ts
// All published posts, newest first, with featured split
const posts = (await getCollection("blog"))
  .filter((p) => !p.data.draft)
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

const [featuredPost, ...remainingPosts] = posts;
```

## Dynamic Routes with `getStaticPaths` (`src/pages/blog/[slug].astro`)

```ts
export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts
    .filter((p) => !p.data.draft)
    .map((post) => ({
      params: { slug: post.id },
      props: { post },
    }));
}

const { post } = Astro.props;
```

## Rendering Markdown Body

```ts
import { render } from "astro:content";

const { Content } = await render(post);
// Use <Content /> in template inside a prose container:
// <div class="prose prose-lg prose-gray dark:prose-invert"><Content /></div>
```

## Gallery Index (`src/pages/gallery/index.astro`)

```ts
const items = (await getCollection("gallery"))
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
```

## Content IDs and Slugs

The content ID is derived from the filename (without `.md`). Use `post.id` as the slug in URLs:

```ts
// In cards: link to /blog/{id}
<a href={`/blog/${post.id}`}>

// In getStaticPaths: use id as route param
params: { slug: post.id }
```
