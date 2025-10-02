export interface SendProviderRequest {
  to: Array<{ email: string; name?: string }>;
  cc?: Array<{ email: string; name?: string }>;
  bcc?: Array<{ email: string; name?: string }>;
  from: { email: string; name?: string };
  replyTo?: { email: string; name?: string };
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
  messageId: string;
  metadata?: Record<string, unknown>;
}

export interface SendProviderResult {
  provider: string;
  providerMessageId?: string;
  status: 'sent' | 'failed';
  details?: Record<string, unknown>;
  error?: string;
}

export interface WebhookEvent {
  messageId: string;
  eventType: 'delivered' | 'bounce' | 'open' | 'click' | 'spam' | 'reject';
  provider: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface HealthStatus {
  healthy: boolean;
  latency?: number;
  error?: string;
  details?: Record<string, unknown>;
}

export interface EmailProvider {
  name: string;
  send(request: SendProviderRequest): Promise<SendProviderResult>;
  parseWebhook(payload: unknown, headers: Record<string, string>): WebhookEvent[];
  health(): Promise<HealthStatus>;
}
