import 'dotenv/config';

// Check if we should run in worker mode
let isWorkerMode = 
  process.env.RAILWAY_SERVICE_NAME === 'email-gateway-worker' ||
  process.env.SERVICE_MODE === 'worker' ||
  process.env.RAILWAY_START_COMMAND === 'npm run worker';

console.log('🔍 Debug: RAILWAY_SERVICE_NAME=' + process.env.RAILWAY_SERVICE_NAME);
console.log('🔍 Debug: SERVICE_MODE=' + process.env.SERVICE_MODE);
console.log('🔍 Debug: RAILWAY_START_COMMAND=' + process.env.RAILWAY_START_COMMAND);
console.log('🔍 Debug: isWorkerMode=' + isWorkerMode);

// Force worker mode for email-gateway-worker service
if (process.env.RAILWAY_SERVICE_NAME === 'email-gateway-worker') {
  console.log('🚀 FORCING WORKER MODE for email-gateway-worker service');
  isWorkerMode = true;
}

if (isWorkerMode) {
  console.log('🚀 Starting Waymore Transactional Emails Service Worker...');
  
  // Import and start the worker
  import('./queue/worker').then(() => {
    console.log('✅ Worker started successfully');
  }).catch((error) => {
    console.error('❌ Worker failed to start:', error);
    process.exit(1);
  });
} else {
  console.log('🌐 Starting Waymore Transactional Emails Service API Server...');
}

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { connectDatabase, disconnectDatabase } from './db/client';
import { logger } from './utils/logger';
import { setupMetricsEndpoint } from './utils/metrics';
import { emailRoutes } from './api/routes/email';
import { healthRoutes } from './api/routes/health';
import { webhookRoutes } from './api/routes/webhook';
import { adminRoutes } from './api/routes/admin';
import { generateTestToken } from './utils/auth';
import { AIController } from './api/controllers/ai';

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
  await fastify.register(webhookRoutes);
  await fastify.register(adminRoutes);
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
        service: 'Waymore Transactional Emails Service',
        version: '1.0.0',
        status: 'running',
        endpoints: {
          'POST /api/v1/emails': 'Send email',
          'GET /api/v1/messages/:id': 'Get message status',
          'POST /webhooks/routee': 'Routee webhook endpoint',
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

    // Initialize AI controller and vector store (non-blocking)
    try {
      const aiController = new AIController();
      await aiController.initialize();
      logger.info('AI controller initialized successfully');
    } catch (error) {
      logger.warn({ error: error instanceof Error ? error.message : 'Unknown error' }, 'AI controller initialization failed, continuing without AI features');
    }

    // Build server
    const server = await buildServer();

    // Start server
    await server.listen({ port: PORT, host: HOST });

    logger.info({
      port: PORT,
      host: HOST,
      environment: NODE_ENV
    }, 'Waymore Transactional Emails Service server started');

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
