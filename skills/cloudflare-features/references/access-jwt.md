# Cloudflare Access JWT

How protected pages and API routes verify user identity.

## Architecture

1. User visits a protected URL (e.g., `/protected`)
2. Cloudflare Access intercepts the request, prompts for authentication
3. After auth, Cloudflare adds a `Cf-Access-Jwt-Assertion` header to the request
4. The Worker calls `verifyAccessJwt(request, env)` to validate the JWT
5. Returns an `AccessPayload` with user's `email`, `sub`, `iss`, `aud` — or `null` if invalid

## Dashboard Setup

1. Go to **Cloudflare Dashboard > Zero Trust > Access > Applications**
2. **Add an application** > **Self-hosted**
3. Set the application domain and path
4. Configure identity provider (e.g., one-time PIN)
5. Create an access policy (e.g., allow specific email addresses)
6. Copy the **Application Audience (AUD) Tag** → set as `POLICY_AUD` secret
7. Find **Team domain** under Zero Trust Settings → set as `TEAM_DOMAIN` secret

## Source Code

`src/lib/access.ts`:

```ts
import { jwtVerify, createRemoteJWKSet } from "jose";

export interface AccessPayload {
  email: string;
  sub: string;
  iss: string;
  aud: string[];
  [key: string]: unknown;
}

export async function verifyAccessJwt(
  request: Request,
  env: { TEAM_DOMAIN: string; POLICY_AUD: string },
): Promise<AccessPayload | null> {
  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return null;

  try {
    const JWKS = createRemoteJWKSet(
      new URL(`https://${env.TEAM_DOMAIN}.cloudflareaccess.com/cdn-cgi/access/certs`),
    );
    const { payload } = await jwtVerify(token, JWKS, {
      audience: env.POLICY_AUD,
    });
    return payload as unknown as AccessPayload;
  } catch {
    return null;
  }
}
```

## Usage in API Routes

```ts
export async function POST(context: APIContext) {
  const env = context.locals.runtime.env;
  const user = await verifyAccessJwt(context.request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  // user.email is available for logging/authorization
}
```

## JWKS Endpoint

Cloudflare publishes public keys at:
```
https://{TEAM_DOMAIN}.cloudflareaccess.com/cdn-cgi/access/certs
```

The `jose` library fetches and caches these keys automatically via `createRemoteJWKSet`.
