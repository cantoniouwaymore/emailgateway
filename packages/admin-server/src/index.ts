import 'dotenv/config';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

const PORT = parseInt(process.env['ADMIN_PORT'] || '5175');
const HOST = process.env['HOST'] || '0.0.0.0';
const NODE_ENV = process.env['NODE_ENV'] || 'development';

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env['LOG_LEVEL'] || 'info'
    },
    trustProxy: true
  });

  // Register plugins
  await fastify.register(helmet, {
    contentSecurityPolicy: false // Allow API calls to different origins
  });

  await fastify.register(cors, {
    origin: NODE_ENV === 'development' ? true : false,
    credentials: true
  });

  // Path to the built React admin UI
  const distPath = join(process.cwd(), '..', 'admin-ui', 'dist');
  const indexPath = join(distPath, 'index.html');

  // Check if React app is built
  if (!existsSync(indexPath)) {
    console.log('⚠️  React admin UI not built yet. Run: cd packages/admin-ui && npm run build');
    
    fastify.get('*', async (request, reply) => {
      return reply.code(503).send({
        error: 'React admin UI not built. Please run: cd packages/admin-ui && npm run build',
        instructions: [
          '1. cd packages/admin-ui',
          '2. npm run build',
          '3. Restart the admin server'
        ]
      });
    });
  } else {
    // Serve static files from admin-ui/dist
    await fastify.register(fastifyStatic, {
      root: distPath,
      prefix: '/',
      decorateReply: false,
    });

    // Load the index.html once
    const indexHtml = readFileSync(indexPath, 'utf-8');

    // SPA catch-all: serve index.html for all routes
    // This allows React Router to handle client-side routing
    const spaHandler = async (request: any, reply: any) => {
      reply.type('text/html').send(indexHtml);
    };

    // Register all SPA routes
    fastify.get('/', spaHandler);
    fastify.get('/dashboard', spaHandler);
    fastify.get('/templates', spaHandler);
    fastify.get('/templates/editor', spaHandler);
    fastify.get('/templates/editor/:templateKey', spaHandler);
    fastify.get('/messages', spaHandler);
    fastify.get('/messages/:messageId', spaHandler);

    console.log('✅ Admin UI routes registered');
  }

  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    return {
      status: 'healthy',
      service: 'admin-server',
      port: PORT,
      timestamp: new Date().toISOString()
    };
  });

  return fastify;
}

async function start() {
  try {
    const server = await buildServer();

    await server.listen({ port: PORT, host: HOST });

    console.log(`🚀 Admin UI Server started on http://${HOST}:${PORT}`);
    console.log(`📊 Health check: http://${HOST}:${PORT}/health`);

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      
      try {
        await server.close();
        console.log('Admin server shut down gracefully');
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start admin server:', error);
    process.exit(1);
  }
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}

export { buildServer };
