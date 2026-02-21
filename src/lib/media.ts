interface AiBinding {
  gateway(name: string): { getUrl(provider: string): Promise<string> };
}

export interface GenerateImageOptions {
  imageSize?: string;
}

export interface GenerateVideoOptions {
  aspectRatio?: string;
  resolution?: string;
  duration?: string;
}

/**
 * Generate an image using fal.ai Seedream v4.5 via Cloudflare AI Gateway.
 * No API key needed — AI Gateway handles auth via BYOK.
 */
export async function generateImage(
  env: { AI: AiBinding; AI_GATEWAY_NAME: string },
  prompt: string,
  options: GenerateImageOptions = {},
): Promise<Response> {
  const gatewayUrl = await env.AI.gateway(env.AI_GATEWAY_NAME).getUrl("fal");

  const response = await fetch(
    `${gatewayUrl}/fal-ai/bytedance/seedream/v4.5/text-to-image`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        image_size: options.imageSize ?? "auto_2K",
        num_images: 1,
      }),
    },
  );

  return response;
}

/**
 * Generate a video using fal.ai Seedance 1.5 Pro via Cloudflare AI Gateway.
 * No API key needed — AI Gateway handles auth via BYOK.
 */
export async function generateVideo(
  env: { AI: AiBinding; AI_GATEWAY_NAME: string },
  prompt: string,
  options: GenerateVideoOptions = {},
): Promise<Response> {
  const gatewayUrl = await env.AI.gateway(env.AI_GATEWAY_NAME).getUrl("fal");

  const response = await fetch(
    `${gatewayUrl}/fal-ai/bytedance/seedance/v1.5/pro/text-to-video`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        aspect_ratio: options.aspectRatio ?? "16:9",
        resolution: options.resolution ?? "720p",
        duration: options.duration ?? "5",
        generate_audio: true,
      }),
    },
  );

  return response;
}
