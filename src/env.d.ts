/// <reference types="astro/client" />

declare module "cloudflare:email" {
  export class EmailMessage {
    constructor(from: string, to: string, raw: string | ReadableStream);
    readonly from: string;
    readonly to: string;
  }
}

type CloudflareEnv = {
  AI: {
    gateway(name: string): { getUrl(provider: string): Promise<string> };
  };
  AI_GATEWAY_NAME: string;
  SEND_EMAIL: { send(message: import("cloudflare:email").EmailMessage): Promise<void> };
  CONTACT_EMAIL: string;
  TEAM_DOMAIN: string;
  POLICY_AUD: string;
};

type Runtime = import("@astrojs/cloudflare").Runtime<CloudflareEnv>;
declare namespace App {
  interface Locals extends Runtime {}
}
