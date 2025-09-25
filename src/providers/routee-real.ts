import { EmailProvider, SendProviderRequest, SendProviderResult, WebhookEvent, HealthStatus } from './types';
import { logger } from '../utils/logger';

interface RouteeAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface RouteeEmailRequest {
  from: {
    name?: string;
    email: string;
  };
  to: Array<{
    name?: string;
    email: string;
  }>;
  cc?: Array<{
    name?: string;
    email: string;
  }>;
  bcc?: Array<{
    name?: string;
    email: string;
  }>;
  replyTo?: {
    name?: string;
    email: string;
  };
  subject: string;
  content: {
    html: string;
    text?: string;
  };
  attachments?: Array<{
    content: string; // base64 encoded
    type: string; // MIME type
    filename: string;
  }>;
  scheduledDate?: string;
  ttl?: number;
  maxAttempts?: number;
  callback?: {
    url: string;
    headers?: Record<string, string>;
  };
  label?: string;
  dsn?: {
    notify: string; // 'NEVER', 'FAILURE', 'DELAY', 'SUCCESS', 'FAILURE_DELAY'
  };
}

interface RouteeEmailResponse {
  trackingId: string;
}

interface RouteeErrorResponse {
  errorCode: string;
  type: string;
  explanation: string;
}


export class RouteeEmailProvider implements EmailProvider {
  public readonly name = 'routee';
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(clientId?: string, clientSecret?: string) {
    this.clientId = clientId || process.env.ROUTEE_CLIENT_ID || '';
    this.clientSecret = clientSecret || process.env.ROUTEE_CLIENT_SECRET || '';
    this.baseUrl = process.env.ROUTEE_BASE_URL || 'https://connect.routee.net';
  }

  private async getAccessToken(): Promise<string> {
    // Check if current token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      logger.debug({ provider: this.name }, 'Authenticating with Routee');
      
      // Routee uses Basic Authentication with Base64-encoded credentials
      // Format: application-id:application-secret -> Base64 -> Basic Auth header
      const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      logger.debug({ 
        provider: this.name,
        clientId: this.clientId,
        hasSecret: !!this.clientSecret
      }, 'Authenticating with Routee using Basic Auth');
      
      const response = await fetch('https://auth.routee.net/oauth/token?grant_type=client_credentials', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Routee authentication failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as RouteeAuthResponse;
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer

      logger.info({ provider: this.name }, 'Successfully authenticated with Routee');
      return this.accessToken;
    } catch (error) {
      logger.error({ 
        provider: this.name, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 'Failed to authenticate with Routee');
      throw error;
    }
  }


  async send(request: SendProviderRequest): Promise<SendProviderResult> {
    const startTime = Date.now();
    
    try {
      const accessToken = await this.getAccessToken();

      logger.info({
        provider: this.name,
        messageId: request.messageId,
        to: request.to.map(r => r.email),
        from: request.from.email
      }, 'Sending email via Routee');

      // Transform our request to Routee Email API v.2 format
      const routeeRequest: any = {
        from: {
          name: request.from.name,
          address: request.from.email  // Routee uses 'address' not 'email'
        },
        to: request.to.map(recipient => ({
          name: recipient.name,
          address: recipient.email  // Routee uses 'address' not 'email'
        })),
        subject: request.subject,
        content: {
          html: request.html,
          text: request.text
        },
        ttl: 60, // 1 hour default (30-4320 minutes)
        maxAttempts: 3,
        label: request.metadata?.tenantId as string || 'email-gateway'
      };

      // Add optional fields if present
      if (request.cc && request.cc.length > 0) {
        routeeRequest.cc = request.cc.map(recipient => ({
          name: recipient.name,
          address: recipient.email  // Routee uses 'address' not 'email'
        }));
      }

      if (request.bcc && request.bcc.length > 0) {
        routeeRequest.bcc = request.bcc.map(recipient => ({
          name: recipient.name,
          address: recipient.email  // Routee uses 'address' not 'email'
        }));
      }

      if (request.replyTo) {
        routeeRequest.replyTo = {
          name: request.replyTo.name,
          address: request.replyTo.email  // Routee uses 'address' not 'email'
        };
      }

      if (request.attachments && request.attachments.length > 0) {
        routeeRequest.attachments = request.attachments.map(attachment => ({
          content: attachment.content.toString('base64'),
          type: attachment.contentType,
          filename: attachment.filename
        }));
      }

      // Add callback URL for webhook notifications
      const webhookUrl = process.env.WEBHOOK_BASE_URL || process.env.BASE_URL || 'http://localhost:3000';
      routeeRequest.eventCallback = {
        url: `${webhookUrl}/webhooks/routee`
      };

      // Debug: Log the request being sent
      console.log('=== ROUTEE API DEBUG ===');
      console.log('Routee API URL:', `${this.baseUrl}/transactional-email`);
      console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'MISSING');
      console.log('Routee API Request:', JSON.stringify(routeeRequest, null, 2));
      console.log('========================');

      // Make the API call to Routee Email API v.2
      const response = await fetch(`${this.baseUrl}/transactional-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(routeeRequest)
      });

      const latency = Date.now() - startTime;

      console.log('=== ROUTEE API RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      console.log('==========================');

      if (!response.ok) {
        let errorMessage = `Routee API error: ${response.status}`;
        try {
          const errorText = await response.text();
          console.log('Routee API Error Response:', errorText);
          try {
            const errorData = JSON.parse(errorText) as RouteeErrorResponse;
            errorMessage = `${errorData.type}: ${errorData.explanation}`;
          } catch {
            errorMessage = `Routee API error: ${response.status} - ${errorText}`;
          }
        } catch {
          errorMessage = `Routee API error: ${response.status} - Failed to read response`;
        }

        logger.error({
          provider: this.name,
          messageId: request.messageId,
          error: errorMessage,
          latency,
          statusCode: response.status
        }, 'Failed to send email via Routee');

        return {
          provider: this.name,
          status: 'failed',
          error: errorMessage
        };
      }

      const responseData = await response.json() as RouteeEmailResponse;
      
      logger.info({
        provider: this.name,
        messageId: request.messageId,
        providerMessageId: responseData.trackingId,
        latency
      }, 'Email sent successfully via Routee');

      return {
        provider: this.name,
        providerMessageId: responseData.trackingId,
        status: 'sent',
        details: {
          queuedAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 60000).toISOString(),
          routeeTrackingId: responseData.trackingId
        }
      };

    } catch (error) {
      const latency = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({
        provider: this.name,
        messageId: request.messageId,
        error: errorMessage,
        latency
      }, 'Failed to send email via Routee');

      return {
        provider: this.name,
        status: 'failed',
        error: errorMessage
      };
    }
  }

  parseWebhook(payload: unknown, headers: Record<string, string>): WebhookEvent[] {
    try {
      logger.info({ provider: this.name }, 'Parsing Routee webhook');
      
      // Routee webhook payload structure (this would need to be updated based on actual Routee webhook format)
      const routeePayload = payload as any;
      
      if (!routeePayload || !Array.isArray(routeePayload.events)) {
        return [];
      }

      return routeePayload.events.map((event: any) => ({
        messageId: event.messageId || event.trackingId,
        eventType: this.mapRouteeEventType(event.eventType),
        provider: this.name,
        timestamp: event.timestamp || new Date().toISOString(),
        details: {
          routeeEventType: event.eventType,
          routeeTrackingId: event.trackingId,
          ...event.details
        }
      }));
    } catch (error) {
      logger.error({ 
        provider: this.name, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 'Failed to parse Routee webhook');
      return [];
    }
  }

  private mapRouteeEventType(routeeEventType: string): 'delivered' | 'bounce' | 'open' | 'click' | 'spam' | 'reject' {
    const eventTypeMap: Record<string, 'delivered' | 'bounce' | 'open' | 'click' | 'spam' | 'reject'> = {
      'delivered': 'delivered',
      'bounce': 'bounce',
      'open': 'open',
      'click': 'click',
      'spam': 'spam',
      'reject': 'reject',
      'failed': 'bounce',
      'dropped': 'reject'
    };

    return eventTypeMap[routeeEventType] || 'delivered';
  }


  async health(): Promise<HealthStatus> {
    const startTime = Date.now();
    
    try {
      logger.debug({ provider: this.name }, 'Checking Routee health');
      
      // Test authentication
      await this.getAccessToken();
      
      const latency = Date.now() - startTime;

      return {
        healthy: true,
        latency
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({
        provider: this.name,
        error: errorMessage,
        latency
      }, 'Routee health check failed');

      return {
        healthy: false,
        latency,
        error: errorMessage
      };
    }
  }
}
