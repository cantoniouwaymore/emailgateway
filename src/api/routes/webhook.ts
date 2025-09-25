import { FastifyInstance } from 'fastify';
import { WebhookController } from '../controllers/webhook';

export async function webhookRoutes(fastify: FastifyInstance) {
  const webhookController = new WebhookController();

  // POST /webhooks/routee - Handle Routee webhook events
  fastify.post('/webhooks/routee', async (request, reply) => {
    return webhookController.handleRouteeWebhook(request as any, reply as any);
  });

  // Graceful shutdown
  fastify.addHook('onClose', async () => {
    await webhookController.close();
  });
}