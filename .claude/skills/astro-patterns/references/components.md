# Components

All components in `src/components/` with their Props interfaces and usage.

## Existing Components

| Component | Props | Description |
|-----------|-------|-------------|
| `Header.astro` | None | Sticky header with nav links, logo, theme toggle, mobile menu |
| `Footer.astro` | None | Footer with copyright, email, contact link |
| `ThemeToggle.astro` | None | Dark/light mode toggle button |
| `Button.astro` | `variant`, `size`, `href`, `type`, `class` | Pill-shaped button/link |
| `BlogCard.astro` | `title`, `description`, `slug`, `publishedAt`, `author`, `image`, `tags`, `featured` | Blog post card |
| `GalleryCard.astro` | `title`, `description`, `image`, `slug`, `category` | Gallery item card |
| `PromotedCard.astro` | `title`, `description`, `image`, `link`, `linkText` | Homepage promoted card |
| `TestimonialCard.astro` | `author`, `role`, `company`, `avatar`, `rating`, `body` | Testimonial quote card |
| `ContactForm.astro` | None | Contact form with honeypot, client-side submission |
| `CloudflareImage.astro` | `src`, `alt`, `width`, `height`, `class` | Image with Cloudflare transforms |

## Standard Card Pattern

```astro
<div class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800 overflow-hidden">
  <!-- card content -->
</div>
```

## Button Variants

```astro
<Button variant="primary">Primary</Button>    <!-- dark bg, light text -->
<Button variant="secondary">Secondary</Button> <!-- border, no fill -->
<Button variant="ghost">Ghost</Button>         <!-- no border, subtle hover -->
<Button href="/link" size="sm">Link</Button>   <!-- renders as <a> when href set -->
```

## Creating a New Component

1. Create `src/components/MyComponent.astro` (PascalCase)
2. Define `interface Props` in the frontmatter
3. Destructure props with defaults
4. Use Tailwind utility classes with `dark:` variants
5. Use `<slot />` for child content

```astro
---
interface Props {
  title: string;
  highlighted?: boolean;
}
const { title, highlighted = false } = Astro.props;
---

<div class:list={[
  "rounded-2xl p-6 shadow-sm ring-1",
  highlighted
    ? "bg-gray-900 text-white ring-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:ring-gray-300"
    : "bg-white ring-gray-200 dark:bg-gray-900 dark:ring-gray-800",
]}>
  <h3 class="text-lg font-semibold">{title}</h3>
  <slot />
</div>
```
