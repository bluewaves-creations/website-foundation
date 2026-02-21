# Color System

Website Foundation uses an OKLCH gray palette defined in `src/styles/global.css` inside a `@theme` block.

## Current Palette

```css
@theme {
  --font-sans: "Nunito Sans", sans-serif;

  /* Gray palette — OKLCH, dark to light */
  --color-gray-950: oklch(22.73% 0.0038 285.98);
  --color-gray-900: oklch(29.39% 0.0036 286.02);
  --color-gray-800: oklch(34.92% 0.0035 286.03);
  --color-gray-700: oklch(40.24% 0.0033 286.02);
  --color-gray-600: oklch(50.07% 0.0047 286.03);
  --color-gray-500: oklch(64.83% 0.0074 286.03);
  --color-gray-400: oklch(75.20% 0.0057 286.01);
  --color-gray-300: oklch(83.12% 0.0070 286.02);
  --color-gray-200: oklch(86.22% 0.0069 286.02);
  --color-gray-100: oklch(92.33% 0.0068 286.01);
  --color-gray-50: oklch(96.26% 0.0067 286.00);
}
```

## Adding an Accent Color

Add custom color tokens inside the `@theme` block:

```css
@theme {
  /* ...existing gray palette... */

  /* Accent — ocean blue */
  --color-accent-600: oklch(50% 0.18 250);
  --color-accent-500: oklch(60% 0.18 250);
  --color-accent-400: oklch(70% 0.15 250);
}
```

Then use `accent-500`, `accent-600` etc. in Tailwind classes: `bg-accent-500`, `text-accent-600`, `hover:bg-accent-600`.

## OKLCH Explained

OKLCH format: `oklch(lightness chroma hue)`
- **Lightness**: 0% (black) to 100% (white)
- **Chroma**: 0 (gray) to ~0.37 (most vivid)
- **Hue**: 0-360 degree color wheel (0=red, 120=green, 250=blue)

Tip: Keep chroma low (0.003-0.007) for neutrals, increase for accents.

## Dark Mode

Dark mode uses class-based toggling via `@custom-variant`:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Always pair light and dark variants in component classes:

```
bg-white dark:bg-gray-900
text-gray-900 dark:text-gray-100
ring-gray-200 dark:ring-gray-800
```

## Standard Component Patterns

**Cards:**
```
rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800
```

**Buttons:**
```
rounded-full (pill shape)
```

**Layout sections:**
```
mx-auto max-w-6xl px-4 py-16
```

**Section dividers:**
```
border-t border-gray-200 dark:border-gray-800
```
