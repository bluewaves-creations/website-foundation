export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
  fit?: "cover" | "contain" | "crop" | "scale-down";
}

/**
 * Build a Cloudflare image transformation URL.
 * Uses `/cdn-cgi/image/` prefix for on-the-fly transformations.
 */
export function buildImageUrl(src: string, options: ImageOptions = {}): string {
  const { width, height, quality = 80, format = "auto", fit = "cover" } = options;

  const params: string[] = [`format=${format}`, `quality=${quality}`, `fit=${fit}`];

  if (width) params.push(`width=${width}`);
  if (height) params.push(`height=${height}`);

  return `/cdn-cgi/image/${params.join(",")}/${src}`;
}
