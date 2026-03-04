# Troubleshooting

Common errors and their fixes.

## Build Errors

### "Could not resolve entry module"
**Cause**: Running `wrangler deploy` without building first.
**Fix**: Run `bun run build` before `wrangler deploy`, or use `bun run deploy` which does both.

### TypeScript errors in `.astro` files
**Cause**: Type mismatches in component props or content schemas.
**Fix**: Run `bun run check` to see all errors. Common issues: missing required prop, wrong type for optional prop.

## Runtime Errors

### `Astro.site` is undefined
**Cause**: `site` not set in `astro.config.mjs` or set to empty string.
**Fix**: Set `site` to your production URL. In code, use the safe pattern:
```ts
const url = Astro.site ? new URL(Astro.url.pathname, Astro.site) : Astro.url;
```

### Image transforms return 404
**Cause**: Using `/cdn-cgi/image/` URLs on localhost or non-Cloudflare domains.
**Fix**: Image transforms only work on Cloudflare-served domains. Use original URLs in development.

### Email send fails
**Cause**: `SEND_EMAIL` binding not available (local dev) or destination not verified.
**Fix**: Email sending only works in deployed Workers. Verify the destination address in Cloudflare Email Routing dashboard. Check that `CONTACT_EMAIL` secret is set.

### AI Gateway returns error or Promise object in URL
**Cause**: Forgetting to `await` the async `getUrl()` call.
**Fix**: Always `await`:
```ts
const gatewayUrl = await env.AI.gateway(env.AI_GATEWAY_NAME).getUrl("fal");
```

### "Unauthorized" on protected pages
**Cause**: Missing or invalid Cloudflare Access JWT.
**Fix**: Verify `POLICY_AUD` and `TEAM_DOMAIN` secrets match your Access application. Check that the Access application covers the correct URL path.

## Test Errors

### "Cannot find module 'cloudflare:email'"
**Cause**: Test file imports `cloudflare:email` without mocking it first.
**Fix**: Add `vi.mock("cloudflare:email", ...)` before importing the module that uses it.

### Mock not being called
**Cause**: `vi.clearAllMocks()` not called in `beforeEach`, or mocks from previous test leaking.
**Fix**: Always include:
```ts
beforeEach(() => {
  vi.clearAllMocks();
});
```

## Authentication Errors

### `wrangler deploy` says "not logged in"
**Fix**: Run `bunx wrangler login` and authenticate in the browser.

### Secret not found in production
**Fix**: Set the secret: `bunx wrangler secret put SECRET_NAME`. Secrets are per-worker, so ensure you're deploying to the same worker name.

## Configuration Checks

Before deploying, verify:
- [ ] `astro.config.mjs` `site` is not `"https://example.com"`
- [ ] `wrangler.jsonc` `destination_address` is not `"you@example.com"`
- [ ] All required secrets are set in production
- [ ] `.dev.vars` exists for local development
