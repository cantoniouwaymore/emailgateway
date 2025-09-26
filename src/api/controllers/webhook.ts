import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../db/client';
import { logger } from '../../utils/logger';
import { createTraceId } from '../../utils/logger';
import { ProviderManager } from '../../providers/manager';
import { MessageStatus } from '@prisma/client';
import crypto from 'crypto';

interface RouteeWebhookPayload {
  trackingId?: string;
  status?: {
    id: number;
    name: string;
    dateTime: number;
    final: boolean;
    delivered: boolean;
  };
  message_id?: string;
  event?: string;
  messageId?: string;
  eventType?: string;
  id?: string;
  // Additional Routee fields
  sender?: string;
  subject?: string;
  recipient?: string;
  link_url?: string;
  timestamp?: number;
}

interface WebhookRequest extends FastifyRequest {
  body: RouteeWebhookPayload | RouteeWebhookPayload[];
  headers: {
    'x-routee-signature'?: string;
    'x-routee-timestamp'?: string;
  };
}

export class WebhookController {
  private providerManager: ProviderManager;

  constructor() {
    this.providerManager = new ProviderManager();
  }

  async handleRouteeWebhook(request: WebhookRequest, reply: FastifyReply) {
    const traceId = createTraceId();
    
    try {
      // Log the raw request body for debugging
      logger.info({
        traceId,
        provider: 'routee',
        rawBody: JSON.stringify(request.body),
        headers: request.headers
      }, 'Received Routee webhook - debugging payload');

      // Validate webhook signature if configured
      // Temporarily disabled for Routee testing - Routee may not support signature validation
      if (process.env.ROUTEE_WEBHOOK_SECRET && process.env.ROUTEE_WEBHOOK_SECRET !== 'your-webhook-secret') {
        const isValid = this.validateWebhookSignature(request);
        if (!isValid) {
          logger.warn({
            traceId,
            provider: 'routee'
          }, 'Invalid webhook signature');
          
          reply.code(401);
          return { error: 'Invalid signature' };
        }
      }

      // Handle different Routee webhook payload formats
      let trackingId, status;
      
      // Check if it's an array format (actual Routee format)
      if (Array.isArray(request.body) && request.body.length > 0) {
        const firstEvent = request.body[0];
        trackingId = firstEvent.message_id;
        status = { name: firstEvent.event || 'unknown' };
      }
      // Check if it's a single object with expected format
      else if (request.body && !Array.isArray(request.body)) {
        const body = request.body as RouteeWebhookPayload;
        
        // Check if it's the expected format
        if (body.trackingId && body.status) {
          trackingId = body.trackingId;
          status = { name: body.status.name, id: body.status.id };
        }
        // Check if it's a single Routee event object
        else if (body.message_id && body.event) {
          trackingId = body.message_id;
          status = { name: body.event };
        }
        // Check if it's a different field structure
        else if (body.messageId) {
          trackingId = body.messageId;
          status = { name: body.eventType || 'unknown' };
        }
        // Check if it's a simple status update
        else if (body.status) {
          trackingId = body.id || body.messageId || 'unknown';
          status = { name: body.status.name || 'unknown' };
        }
        else {
          logger.warn({
            traceId,
            provider: 'routee',
            body: request.body
          }, 'Unknown webhook payload format');
          
          reply.code(400);
          return { error: 'Unknown payload format' };
        }
      }
      else {
        logger.warn({
          traceId,
          provider: 'routee',
          body: request.body
        }, 'Unknown webhook payload format');
        
        reply.code(400);
        return { error: 'Unknown payload format' };
      }
      
      if (!trackingId || !status) {
        logger.warn({
          traceId,
          provider: 'routee',
          body: request.body
        }, 'Invalid webhook payload format - missing trackingId or status');
        
        reply.code(400);
        return { error: 'Invalid payload format' };
      }

      // Process the webhook event
      try {
        await this.processWebhookEvent({ trackingId, status }, traceId);
        
        logger.info({
          traceId,
          provider: 'routee',
          trackingId,
          statusName: status.name
        }, 'Processed webhook event');

        reply.code(200);
        return {
          processed: 1,
          failed: 0,
          total: 1
        };
      } catch (error) {
        logger.error({
          traceId,
          trackingId,
          error: error instanceof Error ? error.message : 'Unknown error'
        }, 'Failed to process webhook event');
        
        reply.code(500);
        return {
          error: 'Failed to process webhook event',
          traceId
        };
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({
        traceId,
        provider: 'routee',
        error: errorMessage
      }, 'Failed to process Routee webhook');

      reply.code(500);
      return {
        error: 'Internal server error',
        traceId
      };
    }
  }

  private validateWebhookSignature(request: WebhookRequest): boolean {
    const secret = process.env.ROUTEE_WEBHOOK_SECRET;
    if (!secret) return true; // Skip validation if no secret configured

    const signature = request.headers['x-routee-signature'];
    const timestamp = request.headers['x-routee-timestamp'];
    
    if (!signature || !timestamp) {
      return false;
    }

    // Create expected signature
    const payload = JSON.stringify(request.body);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(timestamp + payload)
      .digest('hex');

    // Compare signatures
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  private async processWebhookEvent(payload: { trackingId: string; status: { name: string; id?: number } }, traceId: string): Promise<void> {
    const { trackingId, status } = payload;
    
    logger.info({
      traceId,
      trackingId,
      statusName: status.name,
      statusId: status.id,
      provider: 'routee'
    }, 'Processing webhook event');

    // Find message by provider message ID (trackingId)
    const message = await prisma.message.findFirst({
      where: {
        provider: 'routee',
        providerMessageId: trackingId
      }
    });

    if (!message) {
      logger.warn({
        traceId,
        trackingId,
        statusName: status.name
      }, 'Message not found for webhook event');
      return;
    }

    // Store the raw webhook event
    await prisma.providerEvent.create({
      data: {
        messageId: message.messageId,
        provider: 'routee',
        eventType: status.name,
        rawJson: payload as any
      }
    });

    // Update message status based on status name
    const newStatus = this.mapStatusNameToStatus(status.name);
    if (newStatus) {
      await prisma.message.update({
        where: { messageId: message.messageId },
        data: {
          status: newStatus,
          updatedAt: new Date()
        }
      });

      logger.info({
        traceId,
        messageId: message.messageId,
        trackingId,
        statusName: status.name,
        newStatus
      }, 'Updated message status from webhook');

      // Send webhook notification to client if configured
      if (message.webhookUrl) {
        await this.notifyClientWebhook(message, payload, newStatus);
      }
    }
  }

  private mapStatusNameToStatus(statusName: string): MessageStatus | null {
    const statusMap: Record<string, MessageStatus> = {
      // Initial states
      'queued': MessageStatus.QUEUED,
      'accepted': MessageStatus.QUEUED,
      'sent': MessageStatus.SENT,
      
      // Success states
      'delivered': MessageStatus.DELIVERED,
      'opened': MessageStatus.DELIVERED, // Opened is still delivered status
      'clicked': MessageStatus.DELIVERED, // Clicked is still delivered status
      
      // Failure states
      'bounced': MessageStatus.BOUNCED,
      'undelivered': MessageStatus.BOUNCED,
      'differed': MessageStatus.BOUNCED,
      
      // Special states
      'unsubscribed': MessageStatus.DELIVERED, // Unsubscribed is still delivered (user action)
      
      // Legacy mappings
      'bounce': MessageStatus.BOUNCED,
      'failed': MessageStatus.BOUNCED,
      'dropped': MessageStatus.BOUNCED,
      'reject': MessageStatus.BOUNCED,
      'spam': MessageStatus.BOUNCED,
    };

    return statusMap[statusName] || null;
  }

  private async notifyClientWebhook(message: any, payload: { trackingId: string; status: { name: string; id?: number; dateTime?: number; final?: boolean; delivered?: boolean } }, newStatus: MessageStatus): Promise<void> {
    if (!message.webhookUrl) return;

    try {
      const webhookPayload = {
        messageId: message.messageId,
        status: newStatus.toLowerCase(),
        eventType: payload.status.name,
        timestamp: payload.status.dateTime ? new Date(payload.status.dateTime * 1000).toISOString() : new Date().toISOString(),
        provider: 'routee',
        trackingId: payload.trackingId,
        details: {
          statusId: payload.status.id,
          final: payload.status.final,
          delivered: payload.status.delivered
        }
      };

      const response = await fetch(message.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'EmailGateway/1.0'
        },
        body: JSON.stringify(webhookPayload),
        // timeout: 10000 // 10 second timeout - removed due to TypeScript error
      });

      if (!response.ok) {
        logger.warn({
          messageId: message.messageId,
          webhookUrl: message.webhookUrl,
          status: response.status
        }, 'Client webhook notification failed');
      } else {
        logger.info({
          messageId: message.messageId,
          webhookUrl: message.webhookUrl
        }, 'Client webhook notification sent');
      }
    } catch (error) {
      logger.error({
        messageId: message.messageId,
        webhookUrl: message.webhookUrl,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'Failed to send client webhook notification');
    }
  }

  async close(): Promise<void> {
    // Cleanup if needed
  }
}
