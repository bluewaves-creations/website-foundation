import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock cloudflare:email before importing
vi.mock("cloudflare:email", () => ({
  EmailMessage: class EmailMessage {
    from: string;
    to: string;
    raw: string;
    constructor(from: string, to: string, raw: string) {
      this.from = from;
      this.to = to;
      this.raw = raw;
    }
  },
}));

import { sendEmail } from "../../src/lib/email";

describe("sendEmail", () => {
  const mockSend = vi.fn().mockResolvedValue(undefined);
  const mockEnv = {
    SEND_EMAIL: { send: mockSend },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls the SEND_EMAIL binding", async () => {
    await sendEmail(mockEnv, {
      from: "noreply@example.com",
      to: "user@example.com",
      subject: "Test",
      body: "Hello",
    });

    expect(mockSend).toHaveBeenCalledOnce();
  });

  it("builds correct MIME headers", async () => {
    await sendEmail(mockEnv, {
      from: "noreply@example.com",
      to: "user@example.com",
      subject: "Test Subject",
      body: "Hello World",
    });

    const message = mockSend.mock.calls[0][0];
    const raw = message.raw;
    expect(raw).toContain("From: noreply@example.com");
    expect(raw).toContain("To: user@example.com");
    expect(raw).toContain("Subject: Test Subject");
    expect(raw).toContain("MIME-Version: 1.0");
    expect(raw).toContain("Content-Type: text/plain; charset=utf-8");
    expect(raw).toContain("Hello World");
  });

  it("propagates errors from the send binding", async () => {
    mockSend.mockRejectedValueOnce(new Error("Network error"));

    await expect(
      sendEmail(mockEnv, {
        from: "noreply@example.com",
        to: "user@example.com",
        subject: "Test",
        body: "Hello",
      }),
    ).rejects.toThrow("Network error");
  });
});
