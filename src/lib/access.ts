import { jwtVerify, createRemoteJWKSet } from "jose";

export interface AccessPayload {
  email: string;
  sub: string;
  iss: string;
  aud: string[];
  [key: string]: unknown;
}

/**
 * Verify a Cloudflare Access JWT from the `Cf-Access-Jwt-Assertion` header.
 * Uses `jose` package as recommended by Cloudflare docs.
 */
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
