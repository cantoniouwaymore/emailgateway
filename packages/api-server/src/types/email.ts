export interface Recipient {
  email: string;
  name?: string;
}

export interface EmailTemplate {
  key: string;
  locale?: string;
  version?: string;
}

export interface Attachment {
  filename: string;
  contentBase64: string;
  contentType: string;
}

export interface SendEmailRequest {
  messageId?: string;
  to: Recipient[];
  cc?: Recipient[];
  bcc?: Recipient[];
  from: Recipient;
  replyTo?: Recipient;
  subject: string;
  template: EmailTemplate;
  variables?: Record<string, unknown>;
  attachments?: Attachment[];
  metadata?: Record<string, unknown>;
  webhookUrl?: string;
}

export interface SendEmailResponse {
  messageId?: string;
  status?: 'queued';
  error?: {
    code: string;
    message: string;
    traceId?: string;
  };
}

export interface MessageStatus {
  messageId: string;
  status: 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed' | 'suppressed';
  attempts: number;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderResult {
  provider: string;
  providerMessageId?: string;
  status: 'sent' | 'failed';
  details?: Record<string, unknown>;
  error?: string;
}

export interface WebhookEvent {
  messageId: string;
  eventType: 'delivered' | 'bounce' | 'open' | 'click' | 'spam';
  provider: string;
  timestamp: string;
  details?: Record<string, unknown>;
}
