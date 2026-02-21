# Secrets Reference

All environment variables and secrets used by Website Foundation.

## Variable Table

| Variable | Required | Where Used | Description |
|----------|----------|------------|-------------|
| `CONTACT_EMAIL` | Yes | `src/pages/api/contact.ts` | Destination email for contact form submissions |
| `POLICY_AUD` | For auth | `src/lib/access.ts` | Cloudflare Access Application Audience (AUD) tag |
| `TEAM_DOMAIN` | For auth | `src/lib/access.ts` | Cloudflare Zero Trust team domain (e.g., `yourteam`) |
| `AI_GATEWAY_NAME` | For media | `src/lib/media.ts` | Name of your Cloudflare AI Gateway |

## Local Development (`.dev.vars`)

Create a `.dev.vars` file in the project root (gitignored):

```env
CONTACT_EMAIL=you@yourdomain.com
POLICY_AUD=your-aud-tag-here
TEAM_DOMAIN=yourteam
```

`AI_GATEWAY_NAME` is set as a plain `var` in `wrangler.jsonc`, not a secret:

```jsonc
"vars": {
  "AI_GATEWAY_NAME": "website-foundation"
}
```

## Production Secrets

Set each secret using wrangler:

```bash
bunx wrangler secret put CONTACT_EMAIL
bunx wrangler secret put POLICY_AUD
bunx wrangler secret put TEAM_DOMAIN
```

Wrangler prompts for the value interactively. Secrets are encrypted at rest and available via `context.locals.runtime.env` in API routes or `Astro.locals.runtime.env` in pages.

## Bindings (Not Secrets)

These are configured in `wrangler.jsonc` and do not need `wrangler secret put`:

| Binding | Type | Config Key |
|---------|------|------------|
| `AI` | AI Gateway | `"ai": { "binding": "AI", "remote": true }` |
| `SEND_EMAIL` | Email | `"send_email": [{ "name": "SEND_EMAIL", ... }]` |
| `ASSETS` | Static Assets | `"assets": { "binding": "ASSETS", ... }` |
