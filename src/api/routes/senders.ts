import { FastifyInstance } from 'fastify';
import { SenderController } from '../controllers/senders';

export async function senderRoutes(fastify: FastifyInstance) {
  const senderController = new SenderController();

  // POST /v1/senders - Add a new sender
  fastify.post('/v1/senders', {
    handler: senderController.addSender.bind(senderController)
  });

  // GET /v1/senders - Get all verified senders
  fastify.get('/v1/senders', {
    handler: senderController.getSenders.bind(senderController)
  });

  // GET /v1/senders/:email/verify - Check sender verification status
  fastify.get('/v1/senders/:email/verify', {
    handler: senderController.checkSenderVerification.bind(senderController)
  });

  // Graceful shutdown
  fastify.addHook('onClose', async () => {
    await senderController.close();
  });
}
