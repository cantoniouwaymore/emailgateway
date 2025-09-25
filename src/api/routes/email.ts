import { FastifyInstance } from 'fastify';
import { EmailController } from '../controllers/email';

export async function emailRoutes(fastify: FastifyInstance) {
  const emailController = new EmailController();

  // POST /v1/emails - Send email
  fastify.post('/v1/emails', {
    handler: emailController.sendEmail.bind(emailController)
  });

  // GET /v1/messages/:messageId - Get message status
  fastify.get('/v1/messages/:messageId', {
    handler: emailController.getMessageStatus.bind(emailController)
  });

  // Graceful shutdown
  fastify.addHook('onClose', async () => {
    await emailController.close();
  });
}
