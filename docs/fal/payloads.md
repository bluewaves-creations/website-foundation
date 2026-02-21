> ## Documentation Index
> Fetch the complete documentation index at: https://docs.fal.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Payloads

> When a request is made to a fal.ai Model API, the payloads (input and output) are stored in the platform for 30 days by default.

## Deleting IO Payloads

You can delete a request's payloads and the **CDN files found in the output** of the request using the Platform API. This is useful for removing generated images, files, or other media from the platform.

<Note>
  **Note:**

  The CDN files found in the input of the request are not deleted, as they may be used by other requests.
</Note>

<Card title="Delete Request Payloads API" icon="trash" href="/platform-apis/v1/models/requests/payloads">
  See the Platform API reference for the delete endpoint, authentication requirements, and response format.
</Card>

## Preventing IO Storage

You can prevent a request's payloads from being stored at all by including the `X-Fal-Store-IO: 0` header in your request. This is useful when you want to avoid storing sensitive data or when you don't need the payloads to be accessible later.

<Warning>
  **Caution:**

  If files were uploaded to the CDN during the processing, these will still be accessible. This header just avoids storage of the payloads in the platform itself.
</Warning>

### Example

```bash  theme={null}
curl --location --request POST 'https://queue.fal.run/fal-ai/fast-sdxl' \
--header "Authorization: Key $FAL_KEY" \
--header 'X-Fal-Store-IO: 0' \
--header 'Content-Type: application/json' \
--data '{
  "prompt": "A beautiful landscape"
}'
```
