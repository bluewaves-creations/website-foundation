import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateImage, generateVideo } from "../../src/lib/media";

describe("media helpers", () => {
  const mockEnv = {
    AI: {
      gateway: vi.fn().mockReturnValue({
        getUrl: vi.fn().mockResolvedValue("https://gateway.ai.cloudflare.com/v1/test"),
      }),
    },
    AI_GATEWAY_NAME: "website-foundation",
  };

  beforeEach(() => {
    vi.restoreAllMocks();

    mockEnv.AI.gateway.mockReturnValue({
      getUrl: vi.fn().mockResolvedValue("https://gateway.ai.cloudflare.com/v1/test"),
    });

    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ images: [{ url: "https://cdn.example.com/image.png" }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  describe("generateImage", () => {
    it("calls AI gateway with correct provider", async () => {
      await generateImage(mockEnv, "a sunset over the ocean");
      expect(mockEnv.AI.gateway).toHaveBeenCalledWith("website-foundation");
      expect(mockEnv.AI.gateway().getUrl).toHaveBeenCalledWith("fal");
    });

    it("sends correct request to fal.ai endpoint", async () => {
      await generateImage(mockEnv, "a sunset over the ocean");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://gateway.ai.cloudflare.com/v1/test/fal-ai/bytedance/seedream/v4.5/text-to-image",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"prompt":"a sunset over the ocean"'),
        }),
      );
    });

    it("uses default image size auto_2K", async () => {
      await generateImage(mockEnv, "test prompt");

      const fetchCall = vi.mocked(globalThis.fetch).mock.calls[0];
      const body = JSON.parse(fetchCall[1]!.body as string);
      expect(body.image_size).toBe("auto_2K");
      expect(body.num_images).toBe(1);
    });

    it("accepts custom image size", async () => {
      await generateImage(mockEnv, "test prompt", { imageSize: "1024x768" });

      const fetchCall = vi.mocked(globalThis.fetch).mock.calls[0];
      const body = JSON.parse(fetchCall[1]!.body as string);
      expect(body.image_size).toBe("1024x768");
    });
  });

  describe("generateVideo", () => {
    it("sends correct request to video endpoint", async () => {
      await generateVideo(mockEnv, "a bird flying");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://gateway.ai.cloudflare.com/v1/test/fal-ai/bytedance/seedance/v1.5/pro/text-to-video",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"prompt":"a bird flying"'),
        }),
      );
    });

    it("uses default options", async () => {
      await generateVideo(mockEnv, "test prompt");

      const fetchCall = vi.mocked(globalThis.fetch).mock.calls[0];
      const body = JSON.parse(fetchCall[1]!.body as string);
      expect(body.aspect_ratio).toBe("16:9");
      expect(body.resolution).toBe("720p");
      expect(body.duration).toBe("5");
      expect(body.generate_audio).toBe(true);
    });

    it("accepts custom options", async () => {
      await generateVideo(mockEnv, "test prompt", {
        aspectRatio: "9:16",
        resolution: "1080p",
        duration: "10",
      });

      const fetchCall = vi.mocked(globalThis.fetch).mock.calls[0];
      const body = JSON.parse(fetchCall[1]!.body as string);
      expect(body.aspect_ratio).toBe("9:16");
      expect(body.resolution).toBe("1080p");
      expect(body.duration).toBe("10");
    });
  });
});
