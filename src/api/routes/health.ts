import { FastifyInstance } from 'fastify';
import { HealthController } from '../controllers/health';
import { healthCheckSchema } from '../schemas/email';

export async function healthRoutes(fastify: FastifyInstance) {
  const healthController = new HealthController();

  // GET /healthz - Liveness probe
  fastify.get('/healthz', {
    schema: healthCheckSchema,
    handler: healthController.livenessCheck.bind(healthController)
  });

  // GET /readyz - Readiness probe
  fastify.get('/readyz', {
    schema: healthCheckSchema,
    handler: healthController.readinessCheck.bind(healthController)
  });

  // GET /health - Detailed health check
  fastify.get('/health', {
    schema: healthCheckSchema,
    handler: healthController.healthCheck.bind(healthController)
  });
}
