import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as generateImagePost } from "../../../src/pages/api/media/generate-image";
import { POST as generateVideoPost } from "../../../src/pages/api/media/generate-video";
import { createMockContext } from "../../setup";

// Mock the media module
vi.mock("../../../src/lib/media", () => ({
  generateImage: vi.fn(),
  generateVideo: vi.fn(),
}));

// Mock the access module
vi.mock("../../../src/lib/access", () => ({
  verifyAccessJwt: vi.fn(),
}));

import { generateImage, generateVideo } from "../../../src/lib/media";
import { verifyAccessJwt } from "../../../src/lib/access";

/** Create a request with a valid Access JWT header. */
function authedRequest(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "cf-access-jwt-assertion": "valid-token",
    },
  });
}

describe("POST /api/media/generate-image", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: auth passes
    vi.mocked(verifyAccessJwt).mockResolvedValue({ email: "user@example.com", sub: "1", iss: "test", aud: [] });
  });

  it("returns 403 when no JWT is provided", async () => {
    vi.mocked(verifyAccessJwt).mockResolvedValueOnce(null);

    const request = new Request("https://example.com/api/media/generate-image", {
      method: "POST",
      body: JSON.stringify({ prompt: "test" }),
      headers: { "Content-Type": "application/json" },
    });
    const ctx = createMockContext(request) as any;

    const response = await generateImagePost(ctx);
    expect(response.status).toBe(403);

    const body = await response.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 400 for missing prompt", async () => {
    const request = authedRequest("https://example.com/api/media/generate-image", {});
    const ctx = createMockContext(request) as any;

    const response = await generateImagePost(ctx);
    expect(response.status).toBe(400);
  });

  it("returns 200 with image data on success", async () => {
    const mockData = { images: [{ url: "https://cdn.example.com/image.png" }] };
    vi.mocked(generateImage).mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), { status: 200 }),
    );

    const request = authedRequest("https://example.com/api/media/generate-image", { prompt: "a beautiful sunset" });
    const ctx = createMockContext(request) as any;

    const response = await generateImagePost(ctx);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.images[0].url).toBe("https://cdn.example.com/image.png");
  });

  it("returns error status when generation fails", async () => {
    vi.mocked(generateImage).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Rate limited" }), { status: 429 }),
    );

    const request = authedRequest("https://example.com/api/media/generate-image", { prompt: "test" });
    const ctx = createMockContext(request) as any;

    const response = await generateImagePost(ctx);
    expect(response.status).toBe(429);
  });
});

describe("POST /api/media/generate-video", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(verifyAccessJwt).mockResolvedValue({ email: "user@example.com", sub: "1", iss: "test", aud: [] });
  });

  it("returns 403 when no JWT is provided", async () => {
    vi.mocked(verifyAccessJwt).mockResolvedValueOnce(null);

    const request = new Request("https://example.com/api/media/generate-video", {
      method: "POST",
      body: JSON.stringify({ prompt: "test" }),
      headers: { "Content-Type": "application/json" },
    });
    const ctx = createMockContext(request) as any;

    const response = await generateVideoPost(ctx);
    expect(response.status).toBe(403);

    const body = await response.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 400 for missing prompt", async () => {
    const request = authedRequest("https://example.com/api/media/generate-video", {});
    const ctx = createMockContext(request) as any;

    const response = await generateVideoPost(ctx);
    expect(response.status).toBe(400);
  });

  it("returns 200 with video data on success", async () => {
    const mockData = { video: { url: "https://cdn.example.com/video.mp4" } };
    vi.mocked(generateVideo).mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), { status: 200 }),
    );

    const request = authedRequest("https://example.com/api/media/generate-video", { prompt: "a bird flying" });
    const ctx = createMockContext(request) as any;

    const response = await generateVideoPost(ctx);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.video.url).toBe("https://cdn.example.com/video.mp4");
  });
});
