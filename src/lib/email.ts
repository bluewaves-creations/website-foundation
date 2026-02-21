import { EmailMessage } from "cloudflare:email";

interface SendEmailOptions {
  from: string;
  to: string;
  subject: string;
  body: string;
}

/**
 * Send an email using Cloudflare Email Routing binding.
 */
export async function sendEmail(
  env: { SEND_EMAIL: { send: (message: EmailMessage) => Promise<void> } },
  options: SendEmailOptions,
): Promise<void> {
  const { from, to, subject, body } = options;

  const msg = new EmailMessage(from, to, buildMimeMessage({ from, to, subject, body }));
  await env.SEND_EMAIL.send(msg);
}

function buildMimeMessage(options: SendEmailOptions): string {
  const { from, to, subject, body } = options;
  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join("\r\n");
}
