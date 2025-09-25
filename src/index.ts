import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { connectDatabase, disconnectDatabase } from './db/client';
import { logger } from './utils/logger';
import { setupMetricsEndpoint } from './utils/metrics';
import { emailRoutes } from './api/routes/email';
import { healthRoutes } from './api/routes/health';
import { generateTestToken } from './utils/auth';

const PORT = parseInt(process.env['PORT'] || '3000');
const HOST = process.env['HOST'] || '0.0.0.0';
const NODE_ENV = process.env['NODE_ENV'] || 'development';

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env['LOG_LEVEL'] || 'info'
    },
    trustProxy: true,
    disableRequestLogging: NODE_ENV === 'production'
  });

  // Register plugins
  await fastify.register(helmet, {
    contentSecurityPolicy: false // Allow MJML templates
  });

  await fastify.register(cors, {
    origin: NODE_ENV === 'development' ? true : false,
    credentials: true
  });

  await fastify.register(rateLimit, {
    max: parseInt(process.env['RATE_GLOBAL_RPS'] || '200'),
    timeWindow: '1 minute',
    errorResponseBuilder: (request, context) => ({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded, retry in ${context.after}`,
        traceId: request.id
      }
    })
  });

  // Add request ID and trace ID
  fastify.addHook('onRequest', async (request, reply) => {
    const traceId = request.headers['x-trace-id'] as string || 
                    Math.random().toString(36).substring(2, 15);
    (request as any).traceId = traceId;
    reply.header('X-Trace-Id', traceId);
  });

  // Add response time header
  fastify.addHook('onResponse', async (request, reply) => {
    reply.header('X-Response-Time', reply.getResponseTime().toString());
  });

  // Setup metrics endpoint
  setupMetricsEndpoint(fastify);

  // Register routes
  await fastify.register(healthRoutes);
  await fastify.register(emailRoutes, { prefix: '/api' });

  // Add a test endpoint to generate JWT tokens (development only)
  if (NODE_ENV === 'development') {
    fastify.get('/test-token', async (request, reply) => {
      const token = generateTestToken();
      return {
        token,
        expiresIn: '1 hour',
        scopes: ['emails:send', 'emails:read']
      };
    });

    fastify.get('/', async (request, reply) => {
      return {
        service: 'Email Gateway',
        version: '1.0.0',
        status: 'running',
        endpoints: {
          'POST /api/v1/emails': 'Send email',
          'GET /api/v1/messages/:id': 'Get message status',
          'GET /healthz': 'Liveness probe',
          'GET /readyz': 'Readiness probe',
          'GET /health': 'Health check',
          'GET /metrics': 'Prometheus metrics',
          'GET /test-token': 'Generate test JWT (dev only)'
        }
      };
    });
  }

  return fastify;
}

async function start() {
  try {
    // Connect to database
    await connectDatabase();

    // Build server
    const server = await buildServer();

    // Start server
    await server.listen({ port: PORT, host: HOST });

    logger.info({
      port: PORT,
      host: HOST,
      environment: NODE_ENV
    }, 'Email Gateway server started');

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info({ signal }, 'Received shutdown signal');
      
      try {
        await server.close();
        await disconnectDatabase();
        logger.info('Server shut down gracefully');
        process.exit(0);
      } catch (error) {
        logger.error({ error }, 'Error during shutdown');
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

// Start server if this file is run directly
if (require.main === module) {
  start();
}

export { buildServer };
