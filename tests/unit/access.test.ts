import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock jose before importing the module under test
vi.mock("jose", () => ({
  createRemoteJWKSet: vi.fn().mockReturnValue("mock-jwks"),
  jwtVerify: vi.fn(),
}));

import { verifyAccessJwt } from "../../src/lib/access";
import { jwtVerify } from "jose";

describe("verifyAccessJwt", () => {
  const env = {
    TEAM_DOMAIN: "test-team",
    POLICY_AUD: "test-aud-1234",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when no JWT header present", async () => {
    const request = new Request("https://example.com", {
      headers: {},
    });

    const result = await verifyAccessJwt(request, env);
    expect(result).toBeNull();
  });

  it("returns payload on valid JWT", async () => {
    const mockPayload = {
      email: "user@example.com",
      sub: "user-123",
      iss: `https://test-team.cloudflareaccess.com`,
      aud: ["test-aud-1234"],
    };

    vi.mocked(jwtVerify).mockResolvedValueOnce({
      payload: mockPayload,
      protectedHeader: { alg: "RS256" },
    } as any);

    const request = new Request("https://example.com", {
      headers: { "cf-access-jwt-assertion": "valid-token" },
    });

    const result = await verifyAccessJwt(request, env);
    expect(result).toEqual(mockPayload);
    expect(jwtVerify).toHaveBeenCalledWith("valid-token", "mock-jwks", {
      audience: "test-aud-1234",
    });
  });

  it("returns null on invalid JWT", async () => {
    vi.mocked(jwtVerify).mockRejectedValueOnce(new Error("Invalid token"));

    const request = new Request("https://example.com", {
      headers: { "cf-access-jwt-assertion": "invalid-token" },
    });

    const result = await verifyAccessJwt(request, env);
    expect(result).toBeNull();
  });
});
