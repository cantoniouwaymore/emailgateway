import { FastifyInstance } from 'fastify';
import { WebhookController } from '../controllers/webhook';

export async function webhookRoutes(fastify: FastifyInstance) {
  const webhookController = new WebhookController();

  // POST /webhooks/routee - Handle Routee webhook events
  fastify.post('/webhooks/routee', {
    schema: {
      description: 'Handle webhook events from Routee provider',
      tags: ['webhooks'],
      summary: 'Routee webhook endpoint',
      body: {
        type: 'object',
        properties: {
          events: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                messageId: { type: 'string' },
                trackingId: { type: 'string' },
                eventType: { type: 'string' },
                timestamp: { type: 'string' },
                details: { type: 'object' }
              },
              required: ['trackingId', 'eventType', 'timestamp']
            }
          }
        },
        required: ['events']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            processed: { type: 'number' },
            failed: { type: 'number' },
            total: { type: 'number' }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            traceId: { type: 'string' }
          }
        }
      }
    },
    handler: webhookController.handleRouteeWebhook.bind(webhookController)
  });

  // Graceful shutdown
  fastify.addHook('onClose', async () => {
    await webhookController.close();
  });
}
