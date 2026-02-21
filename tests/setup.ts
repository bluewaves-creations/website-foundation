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
