import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../db/client';
import { logger } from '../../utils/logger';
import { createTraceId } from '../../utils/logger';
import { ProviderManager } from '../../providers/manager';
import { MessageStatus } from '@prisma/client';
import crypto from 'crypto';

interface RouteeWebhookPayload {
  events: Array<{
    messageId?: string;
    trackingId: string;
    eventType: string;
    timestamp: string;
    details?: Record<string, unknown>;
  }>;
}

interface WebhookRequest extends FastifyRequest {
  body: RouteeWebhookPayload;
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
      logger.info({
        traceId,
        provider: 'routee',
        eventsCount: request.body?.events?.length || 0
      }, 'Received Routee webhook');

      // Validate webhook signature if configured
      if (process.env.ROUTEE_WEBHOOK_SECRET) {
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

      const { events } = request.body;
      
      if (!events || !Array.isArray(events)) {
        logger.warn({
          traceId,
          provider: 'routee'
        }, 'Invalid webhook payload format');
        
        reply.code(400);
        return { error: 'Invalid payload format' };
      }

      // Process each event
      const results = await Promise.allSettled(
        events.map(event => this.processWebhookEvent(event, traceId))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info({
        traceId,
        provider: 'routee',
        successful,
        failed,
        total: events.length
      }, 'Processed webhook events');

      reply.code(200);
      return {
        processed: successful,
        failed,
        total: events.length
      };

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

  private async processWebhookEvent(event: any, traceId: string): Promise<void> {
    const { trackingId, eventType, timestamp, details } = event;
    
    logger.info({
      traceId,
      trackingId,
      eventType,
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
        eventType
      }, 'Message not found for webhook event');
      return;
    }

    // Store the raw webhook event
    await prisma.providerEvent.create({
      data: {
        messageId: message.messageId,
        provider: 'routee',
        eventType,
        rawJson: event
      }
    });

    // Update message status based on event type
    const newStatus = this.mapEventTypeToStatus(eventType);
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
        eventType,
        newStatus
      }, 'Updated message status from webhook');

      // Send webhook notification to client if configured
      if (message.webhookUrl) {
        await this.notifyClientWebhook(message, event, newStatus);
      }
    }
  }

  private mapEventTypeToStatus(eventType: string): MessageStatus | null {
    const statusMap: Record<string, MessageStatus> = {
      'delivered': MessageStatus.DELIVERED,
      'bounce': MessageStatus.BOUNCED,
      'failed': MessageStatus.BOUNCED,
      'dropped': MessageStatus.BOUNCED,
      'reject': MessageStatus.BOUNCED,
      'spam': MessageStatus.BOUNCED,
      // Note: 'open' and 'click' events don't change the message status
      // but are still stored for analytics
    };

    return statusMap[eventType] || null;
  }

  private async notifyClientWebhook(message: any, event: any, newStatus: MessageStatus): Promise<void> {
    if (!message.webhookUrl) return;

    try {
      const webhookPayload = {
        messageId: message.messageId,
        status: newStatus.toLowerCase(),
        eventType: event.eventType,
        timestamp: event.timestamp,
        provider: 'routee',
        trackingId: event.trackingId,
        details: event.details
      };

      const response = await fetch(message.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'EmailGateway/1.0'
        },
        body: JSON.stringify(webhookPayload),
        timeout: 10000 // 10 second timeout
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
