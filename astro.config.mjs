// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  output: "server",
  adapter: cloudflare({
    imageService: "cloudflare",
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
