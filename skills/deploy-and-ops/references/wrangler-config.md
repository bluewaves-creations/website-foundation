# Wrangler Configuration

Annotated `wrangler.jsonc` with every field explained.

```jsonc
{
  // Worker name — appears in Cloudflare dashboard and default URL
  "name": "website-foundation",

  // Entry point — Astro builds the Worker to this path
  "main": "dist/_worker.js/index.js",

  // Workers runtime compatibility date
  "compatibility_date": "2025-01-01",

  // Enable Node.js built-in modules (required by jose, etc.)
  "compatibility_flags": ["nodejs_compat"],

  // Static asset serving — serves built files from dist/
  "assets": {
    "binding": "ASSETS",       // Available as env.ASSETS in code
    "directory": "./dist"      // Build output directory
  },

  // Enable logging and analytics
  "observability": {
    "enabled": true
  },

  // AI Gateway binding — connects to Cloudflare AI for gateway access
  "ai": {
    "binding": "AI",           // Available as env.AI in code
    "remote": true             // Uses remote AI binding (not local model)
  },

  // Email Routing binding — sends email through Cloudflare
  "send_email": [
    {
      "name": "SEND_EMAIL",                    // Available as env.SEND_EMAIL
      "destination_address": "you@example.com"  // Must be verified in dashboard
    }
  ],

  // Plain-text variables (not secrets)
  "vars": {
    "AI_GATEWAY_NAME": "website-foundation"    // Name of your AI Gateway
  }
}
```

## Key Points

- **JSONC format**: Supports comments (prefixed with `//`)
- **`main`**: Must point to Astro's Worker output — do not change unless build output changes
- **`compatibility_date`**: Controls which Workers runtime features are available
- **`nodejs_compat`**: Required for the `jose` JWT library used by Cloudflare Access verification
- **`destination_address`**: Must match a verified email in Cloudflare Email Routing dashboard
