# Vitest Patterns

Standard patterns for writing tests in this project.

## Test File Template

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockEnv, createMockContext } from "../setup";

// Mock external modules BEFORE importing the module under test
vi.mock("cloudflare:email", () => ({
  EmailMessage: vi.fn().mockImplementation((from, to, raw) => ({ from, to, raw })),
}));

// Import AFTER mocks are set up
import { POST } from "../../src/pages/api/contact";

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 on valid submission", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Jane Doe",
        email: "jane@example.com",
        message: "Hello there",
      }),
    });

    const context = createMockContext(request);
    const response = await POST(context as any);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it("returns 400 on invalid JSON", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });

    const context = createMockContext(request);
    const response = await POST(context as any);

    expect(response.status).toBe(400);
  });
});
```

## Important: Mock Order

Always `vi.mock()` before `import`:

```ts
// 1. vi.mock declarations
vi.mock("cloudflare:email", () => ({ ... }));

// 2. Import the module that uses cloudflare:email
import { sendEmail } from "../../src/lib/email";
```

Vitest hoists `vi.mock()` calls automatically, but keeping them at the top makes intent clear.

## Schema Testing

Test Zod schemas directly without Astro runtime:

```ts
import { z } from "astro/zod";

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string(),
  publishedAt: z.coerce.date(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

describe("blog schema", () => {
  it("accepts valid frontmatter", () => {
    const result = blogSchema.safeParse({
      title: "Test Post",
      description: "A test",
      author: "Tester",
      publishedAt: "2026-01-15",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = blogSchema.safeParse({
      description: "A test",
      author: "Tester",
      publishedAt: "2026-01-15",
    });
    expect(result.success).toBe(false);
  });
});
```

## Testing Lib Functions

Lib functions accept `env` as first parameter for easy mocking:

```ts
import { createMockEnv } from "../setup";
import { generateImage } from "../../src/lib/media";

it("calls AI gateway with correct URL", async () => {
  const env = createMockEnv();
  global.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ images: [] })));

  await generateImage(env, "test prompt");

  expect(env.AI.gateway).toHaveBeenCalledWith("website-foundation");
});
```
