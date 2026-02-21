# Cloudflare Setup Guide

Step-by-step dashboard configuration for all Cloudflare services used by Website Foundation.

## 1. AI Gateway (Media Generation)

1. Go to **Cloudflare Dashboard > AI > AI Gateway**
2. Click **Create Gateway**
3. Name it (e.g., `website-foundation`) — this becomes your `AI_GATEWAY_NAME`
4. Under **Providers**, add **fal.ai** and paste your fal.ai API key
5. The gateway proxies requests to fal.ai — no API key needed in your app code

The `ai` binding in `wrangler.jsonc` connects your Worker to the gateway:

```jsonc
"ai": {
  "binding": "AI",
  "remote": true
}
```

## 2. Email Routing (Contact Form)

1. Go to **Cloudflare Dashboard > Email > Email Routing**
2. Add your domain and verify DNS records
3. Add a **Destination address** and verify it (check your inbox)
4. In `wrangler.jsonc`, update `destination_address` to your verified email:

```jsonc
"send_email": [
  {
    "name": "SEND_EMAIL",
    "destination_address": "you@yourdomain.com"
  }
]
```

5. Set the `CONTACT_EMAIL` secret — this is the `to` address used by the contact form API route

## 3. Cloudflare Access (Protected Pages)

1. Go to **Cloudflare Dashboard > Zero Trust > Access > Applications**
2. Click **Add an application** > **Self-hosted**
3. Set the application domain to your site's protected path (e.g., `yoursite.com/protected`)
4. Configure an identity provider (one-time email PIN works for simple setups)
5. Create a policy (e.g., allow specific emails)
6. After saving, find the **Application Audience (AUD) Tag** — this is your `POLICY_AUD`
7. Your **Team domain** (e.g., `yourteam`) is found under **Zero Trust > Settings > Custom Pages** — this is your `TEAM_DOMAIN`

## 4. Custom Domain (Optional)

1. Go to **Cloudflare Dashboard > Workers & Pages > your worker > Settings > Domains & Routes**
2. Click **Add** > **Custom domain**
3. Enter your domain — Cloudflare handles DNS and SSL automatically
4. Update `site` in `astro.config.mjs` to match your custom domain
