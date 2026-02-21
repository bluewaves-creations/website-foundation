# Seedance 1.5 Pro — Text to Video API

ByteDance's Seedance 1.5 Pro model for video generation with audio via fal.ai.

- **Endpoint**: `fal-ai/bytedance/seedance/v1.5/pro/text-to-video`
- **Pricing**: ~$0.26 per 720p 5-second video with audio

## Input Schema

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `prompt` | string | Yes | — | Text description of the video to generate |
| `aspect_ratio` | string | No | `"16:9"` | Options: `"21:9"`, `"16:9"`, `"4:3"`, `"1:1"`, `"3:4"`, `"9:16"` |
| `resolution` | string | No | `"720p"` | Options: `"480p"`, `"720p"`, `"1080p"` |
| `duration` | string | No | `"5"` | Seconds: `"4"` through `"12"` |
| `camera_fixed` | boolean | No | false | Fix camera position (no camera movement) |
| `seed` | integer | No | random | Random seed (-1 for random) |
| `enable_safety_checker` | boolean | No | true | Enable content safety filtering |
| `generate_audio` | boolean | No | true | Generate audio track for the video |

## Output Schema

```json
{
  "video": {
    "url": "https://v3b.fal.media/files/.../video.mp4"
  },
  "seed": 42
}
```

- `video.url` — URL to the generated MP4 video file
- `seed` — The seed used for generation

## Usage in Website Foundation

```ts
import { generateVideo } from "../lib/media";

const response = await generateVideo(env, "Ocean waves crashing on a rocky shore at golden hour", {
  aspectRatio: "16:9",
  resolution: "720p",
  duration: "5",
});

const data = await response.json();
const videoUrl = data.video.url;
```

## Pricing Formula

- **With audio**: $2.4 per million video tokens
- **Without audio**: $1.2 per million video tokens
- Token calculation: `tokens = (height x width x FPS x duration) / 1024`
- A 720p 5s video ≈ $0.26 with audio
