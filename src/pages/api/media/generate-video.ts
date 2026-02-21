import type { APIContext } from "astro";
import { generateVideo } from "../../../lib/media";
import { verifyAccessJwt } from "../../../lib/access";

export async function POST(context: APIContext) {
  const env = context.locals.runtime.env;

  const user = await verifyAccessJwt(context.request, env);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { prompt?: string; aspectRatio?: string; resolution?: string; duration?: string };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { prompt, aspectRatio, resolution, duration } = body;

  if (!prompt) {
    return new Response(
      JSON.stringify({ error: "Missing required field: prompt" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const response = await generateVideo(env, prompt, { aspectRatio, resolution, duration });
    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Video generation failed", details: data }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Video generation error:", err);
    return new Response(
      JSON.stringify({ error: "Video generation failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
