import { FastifyInstance } from 'fastify';
import { EmailController } from '../controllers/email';
import { TemplateValidationController } from '../controllers/template-validation';
import { templateValidationRequestSchema } from '../schemas/template-validation';

export async function emailRoutes(fastify: FastifyInstance) {
  const emailController = new EmailController();
  const templateValidationController = new TemplateValidationController();

  // POST /v1/emails - Send email
  fastify.post('/v1/emails', {
    handler: emailController.sendEmail.bind(emailController)
  });

  // GET /v1/messages/:messageId - Get message status
  fastify.get('/v1/messages/:messageId', {
    handler: emailController.getMessageStatus.bind(emailController)
  });

  // POST /v1/templates/validate - Validate template structure
  fastify.post('/v1/templates/validate', {
    handler: templateValidationController.validateTemplate.bind(templateValidationController)
  });

  // Graceful shutdown
  fastify.addHook('onClose', async () => {
    await emailController.close();
  });
}
