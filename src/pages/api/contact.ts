import type { APIContext } from "astro";
import { sendEmail } from "../../lib/email";

/** Strip newlines to prevent MIME header injection. */
function stripNewlines(str: string): string {
  return str.replace(/[\r\n]/g, "");
}

export async function POST(context: APIContext) {
  const env = context.locals.runtime.env;

  let body: { name?: string; email?: string; message?: string; honeypot?: string };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Honeypot — silently succeed without sending
  if (body.honeypot) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: name, email, message" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Max-length validation
  if (name.length > 200 || email.length > 254 || message.length > 5000) {
    return new Response(
      JSON.stringify({ error: "Field exceeds maximum length" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      JSON.stringify({ error: "Invalid email address" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const safeName = stripNewlines(name);
  const safeEmail = stripNewlines(email);

  try {
    await sendEmail(env, {
      from: `noreply@${new URL(context.request.url).hostname}`,
      to: env.CONTACT_EMAIL,
      subject: `Contact form: ${safeName}`,
      body: `Name: ${safeName}\nEmail: ${safeEmail}\n\n${message}`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Email send error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
