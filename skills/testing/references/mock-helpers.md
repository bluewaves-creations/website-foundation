# Mock Helpers

Full documentation of `tests/setup.ts` test utilities.

## Source Code

```ts
import { vi } from "vitest";

/**
 * Create a mock Cloudflare runtime environment.
 */
export function createMockEnv() {
  return {
    AI: {
      gateway: vi.fn().mockReturnValue({
        getUrl: vi.fn().mockResolvedValue("https://gateway.ai.cloudflare.com/v1/test"),
      }),
    },
    AI_GATEWAY_NAME: "website-foundation",
    SEND_EMAIL: {
      send: vi.fn().mockResolvedValue(undefined),
    },
    CONTACT_EMAIL: "test@example.com",
    TEAM_DOMAIN: "test-team",
    POLICY_AUD: "test-aud-1234",
  };
}

/**
 * Create a mock API context for testing endpoints.
 */
export function createMockContext(
  request: Request,
  env = createMockEnv(),
) {
  return {
    request,
    locals: {
      runtime: { env },
    },
    url: new URL(request.url),
  };
}
```

## Mock Bindings Explained

| Binding | Mock Behavior |
|---------|---------------|
| `AI.gateway(name).getUrl(provider)` | Returns resolved promise with test gateway URL |
| `SEND_EMAIL.send(message)` | Returns resolved promise (void) — email "sent" successfully |
| `CONTACT_EMAIL` | String `"test@example.com"` |
| `TEAM_DOMAIN` | String `"test-team"` |
| `POLICY_AUD` | String `"test-aud-1234"` |

## Usage

```ts
// Default env
const context = createMockContext(request);

// Custom env (override specific values)
const env = createMockEnv();
env.CONTACT_EMAIL = "custom@test.com";
const context = createMockContext(request, env);
```

## Extending for New Bindings

Add new bindings to `createMockEnv()`:

```ts
export function createMockEnv() {
  return {
    // ...existing bindings...
    MY_KV: {
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    },
  };
}
```

## Asserting Mock Calls

```ts
const env = createMockEnv();
const context = createMockContext(request, env);

await POST(context as any);

// Verify email was sent
expect(env.SEND_EMAIL.send).toHaveBeenCalledOnce();

// Verify AI gateway was accessed
expect(env.AI.gateway).toHaveBeenCalledWith("website-foundation");
```
