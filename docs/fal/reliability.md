> ## Documentation Index
> Fetch the complete documentation index at: https://docs.fal.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Reliability | fal.ai Model APIs

> How fal ensures high reliability for your API requests through queueing, automatic retries, and model fallbacks.

fal is designed for production workloads and includes several built-in mechanisms to ensure your requests succeed.

## Queue-Based Processing

The [queue system](/model-apis/model-endpoints/queue) handles traffic surges gracefully and provides request tracking. When you submit a request, it enters a managed queue that ensures reliable processing even during peak demand.

## Automatic Retries

When using the [queue](/model-apis/model-endpoints/queue), fal automatically retries requests that fail due to:

* **Server errors (503)**: The model endpoint was temporarily unavailable
* **Timeouts (504)**: The request took too long due to transient issues
* **Connection errors**: Network issues between fal infrastructure
* **Rate limits (429)**: Request waits and retries automatically when you temporarily exceed your [concurrent request limit](/model-apis/faq#is-there-a-rate-limit)

Requests are retried up to 10 times with intelligent backoff.

<Tip>
  **No charge for server errors**: Failed requests that return 5xx status codes are not billed.
</Tip>

<Note>
  Automatic retries only apply to queue-based requests. Direct synchronous requests return errors immediately without retry.
</Note>

### Disabling Retries Per Request

If you need to disable retries for a specific request, pass the `x-fal-no-retry` header when submitting a request:

```bash  theme={null}
curl -X POST "https://queue.fal.run/fal-ai/flux/dev" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -H "x-fal-no-retry: 1" \
  -d '{"prompt": "a cat"}'
```

When this header is set to `1`, `true`, or `yes`, fal will not retry the request even if it fails due to a retryable error.

## Model Fallbacks

For supported models, fal might automatically reroute requests to equivalent alternative endpoints if the primary endpoint is temporarily unavailable. This only occurs after fal retries the request up to five times; if those retries fail, the request is routed to a fallback endpoint. This mechanism improves overall reliability and reduces the likelihood of failed requests.

Fallbacks are enabled by default for all accounts. If you need to disable fallbacks for your account, please let your account team know. If you want to disable it per request, you can pass `x-app-fal-disable-fallbacks` header. For any questions, contact our sales team.
