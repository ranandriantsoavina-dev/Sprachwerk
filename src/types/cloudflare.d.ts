declare module 'cloudflare:node' {
  export interface HttpServerHandlerOptions {
    port?: number;
    server?: unknown;
  }
  export function httpServerHandler(
    optionsOrServer?: HttpServerHandlerOptions | unknown
  ): unknown;
}

declare module 'cloudflare:workers' {
  export const env: {
    DB?: any;
    ASSETS?: { fetch(request: Request): Promise<Response> };
    APP_URL?: string;
    SESSION_SECRET?: string;
    MAILTRAP_API_TOKEN?: string;
    MAILTRAP_SENDER_EMAIL?: string;
    MAILTRAP_SANDBOX_INBOX_ID?: string;
    ADMIN_PASSCODE?: string;
    [key: string]: unknown;
  };
}
