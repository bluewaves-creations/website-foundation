# AI Gateway

How media generation connects to fal.ai through Cloudflare AI Gateway.

## Architecture

1. `src/lib/media.ts` exports `generateImage()` and `generateVideo()`
2. Both functions get the gateway URL: `await env.AI.gateway(env.AI_GATEWAY_NAME).getUrl("fal")`
3. Then `fetch()` the fal.ai endpoint through the gateway URL (no API key in app code)
4. The gateway handles authentication via BYOK (Bring Your Own Key) configured in the dashboard

## Dashboard Setup

1. Go to **Cloudflare Dashboard > AI > AI Gateway**
2. Create a gateway (name becomes `AI_GATEWAY_NAME`)
3. Add **fal.ai** as a provider
4. Paste your fal.ai API key in the provider settings

## Wrangler Configuration

```jsonc
// wrangler.jsonc
"ai": {
  "binding": "AI",
  "remote": true
},
"vars": {
  "AI_GATEWAY_NAME": "website-foundation"  // match your gateway name
}
```

## Gateway URL Pattern

```ts
const gatewayUrl = await env.AI.gateway(env.AI_GATEWAY_NAME).getUrl("fal");
// Returns: https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_name}/fal

// Then append the fal.ai model path:
fetch(`${gatewayUrl}/fal-ai/bytedance/seedream/v4.5/text-to-image`, { ... });
```

## Endpoints

| Model | fal.ai Path | Use |
|-------|-------------|-----|
| Seedream v4.5 | `fal-ai/bytedance/seedream/v4.5/text-to-image` | Image generation |
| Seedance 1.5 Pro | `fal-ai/bytedance/seedance/v1.5/pro/text-to-video` | Video generation |

## Pricing

- **Image**: ~$0.04 per image (Seedream v4.5)
- **Video**: ~$0.26 per 5s 720p video with audio (Seedance 1.5 Pro)

## Common Gotcha

`env.AI.gateway(name).getUrl(provider)` is **async** — forgetting to `await` will pass a Promise object as the URL, causing fetch to fail with an unhelpful error.
