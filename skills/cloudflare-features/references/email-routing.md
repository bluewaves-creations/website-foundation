# Email Routing

How the contact form sends email using Cloudflare Email Routing.

## Architecture

1. User submits the contact form (client-side `<ContactForm>` component)
2. Client POSTs JSON to `/api/contact`
3. API route (`src/pages/api/contact.ts`) validates input, checks honeypot, calls `sendEmail()`
4. `sendEmail()` in `src/lib/email.ts` builds a MIME message and sends via the `SEND_EMAIL` binding
5. Cloudflare Email Routing delivers to the `destination_address` configured in `wrangler.jsonc`

## Dashboard Setup

1. Go to **Cloudflare Dashboard > Email > Email Routing**
2. Add your domain and configure DNS records
3. Add and verify a **Destination address** (the inbox that receives contact emails)

## Wrangler Configuration

```jsonc
// wrangler.jsonc
"send_email": [
  {
    "name": "SEND_EMAIL",
    "destination_address": "you@yourdomain.com"  // change this
  }
]
```

Also set the `CONTACT_EMAIL` secret — this is the `to` address passed to `sendEmail()`:

```bash
bunx wrangler secret put CONTACT_EMAIL
```

## Source Code

`src/lib/email.ts`:

```ts
import { EmailMessage } from "cloudflare:email";

export async function sendEmail(
  env: { SEND_EMAIL: { send: (message: EmailMessage) => Promise<void> } },
  options: { from: string; to: string; subject: string; body: string },
): Promise<void> {
  const { from, to, subject, body } = options;
  const msg = new EmailMessage(from, to, buildMimeMessage({ from, to, subject, body }));
  await env.SEND_EMAIL.send(msg);
}
```

## MIME Format

The `buildMimeMessage()` helper constructs a plain-text MIME message with `\r\n` line endings:

```
From: noreply@yourdomain.com
To: you@yourdomain.com
Subject: Contact form: Jane Doe
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8

Name: Jane Doe
Email: jane@example.com

Hello, I'd like to...
```

## Local Testing

Email sending does not work in local dev (`bun run dev`). The `SEND_EMAIL` binding is only available in deployed Workers. To test the contact form locally, the API route will throw — verify other logic with unit tests that mock the binding.
