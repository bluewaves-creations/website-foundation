import { describe, it, expect } from "vitest";
import { buildImageUrl } from "../../src/lib/cloudflare-image";

describe("buildImageUrl", () => {
  it("builds URL with default options", () => {
    const url = buildImageUrl("https://example.com/photo.jpg");
    expect(url).toBe("/cdn-cgi/image/format=auto,quality=80,fit=cover/https://example.com/photo.jpg");
  });

  it("includes width and height when provided", () => {
    const url = buildImageUrl("https://example.com/photo.jpg", { width: 800, height: 600 });
    expect(url).toBe("/cdn-cgi/image/format=auto,quality=80,fit=cover,width=800,height=600/https://example.com/photo.jpg");
  });

  it("allows custom quality and format", () => {
    const url = buildImageUrl("https://example.com/photo.jpg", { quality: 90, format: "webp" });
    expect(url).toBe("/cdn-cgi/image/format=webp,quality=90,fit=cover/https://example.com/photo.jpg");
  });

  it("allows custom fit", () => {
    const url = buildImageUrl("https://example.com/photo.jpg", { fit: "contain" });
    expect(url).toBe("/cdn-cgi/image/format=auto,quality=80,fit=contain/https://example.com/photo.jpg");
  });

  it("handles all options together", () => {
    const url = buildImageUrl("images/my-image.png", {
      width: 400,
      height: 300,
      quality: 75,
      format: "avif",
      fit: "crop",
    });
    expect(url).toBe("/cdn-cgi/image/format=avif,quality=75,fit=crop,width=400,height=300/images/my-image.png");
  });
});
