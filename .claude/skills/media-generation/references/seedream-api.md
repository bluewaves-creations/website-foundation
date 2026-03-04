# Seedream v4.5 — Text to Image API

ByteDance's Seedream 4.5 model for image generation via fal.ai.

- **Endpoint**: `fal-ai/bytedance/seedream/v4.5/text-to-image`
- **Pricing**: $0.04 per image

## Input Schema

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | — | Text description of the image to generate |
| `image_size` | string or object | No | `{"height":2048,"width":2048}` | Size preset (e.g., `"auto_2K"`) or `{width, height}` object. Width/height must be 1920-4096, or total pixels between 2560x1440 and 4096x4096 |
| `num_images` | integer | No | 1 | Number of images to generate (1-6) |
| `max_images` | integer | No | 1 | Multi-image generation upper bound (1-6) |
| `seed` | integer | No | random | Random seed for reproducible results |
| `sync_mode` | boolean | No | false | If true, returns image as data URI |
| `enable_safety_checker` | boolean | No | true | Enable content safety filtering |

## Output Schema

```json
{
  "images": [
    {
      "url": "https://storage.googleapis.com/.../output.png"
    }
  ],
  "seed": 42
}
```

- `images` — Array of generated image objects, each with a `url` field
- `seed` — The seed used for generation (useful for reproducibility)

## Usage in Website Foundation

```ts
import { generateImage } from "../lib/media";

const response = await generateImage(env, "A serene mountain lake at sunset", {
  imageSize: "auto_2K",
});

const data = await response.json();
const imageUrl = data.images[0].url;
```

## Image Size Presets

Use string presets for convenience:
- `"auto_2K"` — 2048x2048 (default)

Or specify exact dimensions:
```json
{ "image_size": { "width": 1920, "height": 1080 } }
```
