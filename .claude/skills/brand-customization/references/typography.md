# Typography

Website Foundation uses Nunito Sans as a variable font with both normal and italic styles.

## Current Font Setup

Font files in `public/fonts/`:
- `NunitoSans-Variable.ttf` — Normal weight (200-1000)
- `NunitoSans-Variable-Italic.ttf` — Italic weight (200-1000)

Declarations in `src/styles/global.css`:

```css
@font-face {
  font-family: "Nunito Sans";
  src: url("/fonts/NunitoSans-Variable.ttf") format("truetype");
  font-weight: 200 1000;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Nunito Sans";
  src: url("/fonts/NunitoSans-Variable-Italic.ttf") format("truetype");
  font-weight: 200 1000;
  font-style: italic;
  font-display: swap;
}
```

The `--font-sans` theme variable maps to the font:

```css
@theme {
  --font-sans: "Nunito Sans", sans-serif;
}
```

## How to Swap Fonts

1. **Get font files** — Download a variable TTF/WOFF2 font (e.g., from Google Fonts)
2. **Replace files** — Put new font files in `public/fonts/`, remove old ones
3. **Update `@font-face`** — Change `font-family`, `src` path, and weight range in `global.css`
4. **Update `--font-sans`** — Change the font name in the `@theme` block
5. **Update preload** — In `src/layouts/Base.astro`, update the `<link rel="preload">` tags (lines 52-53) to match new file paths and MIME types

Example for Inter:

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-Variable.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@theme {
  --font-sans: "Inter", sans-serif;
}
```

## Tips

- Use `font-display: swap` to prevent invisible text during font load
- Preload the primary (non-italic) font file for faster rendering
- Variable fonts keep the file count low — one file covers all weights
- Use WOFF2 format when possible for smaller file sizes (TTF works too)
