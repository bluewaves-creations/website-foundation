import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../../../src/pages/api/contact";
import { createMockContext } from "../../setup";

// Mock the email module to avoid importing cloudflare:email
vi.mock("../../../src/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
}));

import { sendEmail } from "../../../src/lib/email";

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid JSON", async () => {
    const request = new Request("https://example.com/api/contact", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });
    const ctx = createMockContext(request) as any;

    const response = await POST(ctx);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toBe("Invalid JSON");
  });

  it("returns 400 for missing fields", async () => {
    const request = new Request("https://example.com/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Test" }),
      headers: { "Content-Type": "application/json" },
    });
    const ctx = createMockContext(request) as any;

    const response = await POST(ctx);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("Missing required fields");
  });

  it("returns 400 for invalid email", async () => {
    const request = new Request("https://example.com/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Test", email: "not-an-email", message: "Hello" }),
      headers: { "Content-Type": "application/json" },
    });
    const ctx = createMockContext(request) as any;

    const response = await POST(ctx);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toBe("Invalid email address");
  });

  it("returns 200 on successful send", async () => {
    const request = new Request("https://example.com/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Test", email: "test@example.com", message: "Hello" }),
      headers: { "Content-Type": "application/json" },
    });
    const ctx = createMockContext(request) as any;

    const response = await POST(ctx);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(sendEmail).toHaveBeenCalled();
  });

  it("returns 500 when email send fails", async () => {
    vi.mocked(sendEmail).mockRejectedValueOnce(new Error("Send failed"));

    const request = new Request("https://example.com/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Test", email: "test@example.com", message: "Hello" }),
      headers: { "Content-Type": "application/json" },
    });
    const ctx = createMockContext(request) as any;

    const response = await POST(ctx);
    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body.error).toBe("Failed to send email");
  });

  it("silently succeeds without sending when honeypot is filled", async () => {
    const request = new Request("https://example.com/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Bot",
        email: "bot@spam.com",
        message: "Buy stuff",
        honeypot: "gotcha",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const ctx = createMockContext(request) as any;

    const response = await POST(ctx);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 400 when fields exceed max length", async () => {
    const request = new Request("https://example.com/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@example.com",
        message: "x".repeat(5001),
      }),
      headers: { "Content-Type": "application/json" },
    });
    const ctx = createMockContext(request) as any;

    const response = await POST(ctx);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("maximum length");
  });

  it("strips newlines from name in subject to prevent header injection", async () => {
    const request = new Request("https://example.com/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Evil\r\nBcc: victim@example.com",
        email: "test@example.com",
        message: "Hello",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const ctx = createMockContext(request) as any;

    const response = await POST(ctx);
    expect(response.status).toBe(200);

    const call = vi.mocked(sendEmail).mock.calls[0];
    expect(call[1].subject).not.toContain("\r");
    expect(call[1].subject).not.toContain("\n");
    expect(call[1].subject).toBe("Contact form: EvilBcc: victim@example.com");
  });
});
