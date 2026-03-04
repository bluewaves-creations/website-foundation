# API Routes

API route template and existing endpoints.

## API Route Template

```ts
import type { APIContext } from "astro";

export async function POST(context: APIContext) {
  const env = context.locals.runtime.env;

  let body: { field1?: string; field2?: string };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { field1, field2 } = body;

  if (!field1 || !field2) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Process request...

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
```

## Existing API Routes

### `POST /api/contact`

**Request:**
```json
{ "name": "string", "email": "string", "message": "string", "honeypot": "string?" }
```

**Response:** `{ "success": true }` or `{ "error": "string" }`

**Behavior:** Validates input, checks honeypot (silent success if filled), validates email format, sends email via `sendEmail()`, max lengths: name 200, email 254, message 5000.

### `POST /api/media/generate-image`

**Request:** `{ "prompt": "string", "imageSize": "string?" }`
**Response:** fal.ai response JSON with `images[].url`
**Auth:** Requires Cloudflare Access JWT (`verifyAccessJwt`)

### `POST /api/media/generate-video`

**Request:** `{ "prompt": "string", "aspectRatio": "string?", "resolution": "string?", "duration": "string?" }`
**Response:** fal.ai response JSON with `video.url`
**Auth:** Requires Cloudflare Access JWT (`verifyAccessJwt`)

## Adding Auth Guard

```ts
import { verifyAccessJwt } from "../../lib/access";

export async function POST(context: APIContext) {
  const env = context.locals.runtime.env;

  const user = await verifyAccessJwt(context.request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // user.email available for logging
  // ...rest of handler
}
```

## Key Rules

- Always wrap `context.request.json()` in try/catch
- Always set `Content-Type: application/json` on responses
- Access env via `context.locals.runtime.env`
- API routes are SSR by default (no prerender export needed)
- Use kebab-case for filenames: `src/pages/api/my-endpoint.ts`
