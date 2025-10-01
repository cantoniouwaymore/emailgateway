/**
 * Admin React Routes
 * Serves the modern React admin UI
 */

import { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

export async function adminReactRoutes(fastify: FastifyInstance) {
  const distPath = join(process.cwd(), 'admin-ui', 'dist');
  const indexPath = join(distPath, 'index.html');

  // Check if React app is built
  if (!existsSync(indexPath)) {
    console.log('⚠️  React admin UI not built yet. Run: cd admin-ui && npm run build');
    fastify.get('/admin/react', async (request, reply) => {
      reply.code(503).send({
        error: 'React admin UI not built. Please run: cd admin-ui && npm run build'
      });
    });
    return;
  }

  // Serve static files from admin-ui/dist
  await fastify.register(fastifyStatic, {
    root: distPath,
    prefix: '/admin/react/',
    decorateReply: false,
  });

  // Load the index.html once
  const indexHtml = readFileSync(indexPath, 'utf-8');

  // SPA catch-all: serve index.html for all /admin/react/* routes
  // This allows React Router to handle client-side routing
  const spaHandler = async (request: any, reply: any) => {
    reply.type('text/html').send(indexHtml);
  };

  // Register all SPA routes
  fastify.get('/admin/react', spaHandler);
  fastify.get('/admin/react/', spaHandler);
  fastify.get('/admin/react/dashboard', spaHandler);
  fastify.get('/admin/react/templates', spaHandler);
  fastify.get('/admin/react/templates/editor', spaHandler);
  fastify.get('/admin/react/templates/editor/:templateKey', spaHandler);
  fastify.get('/admin/react/messages', spaHandler);
  fastify.get('/admin/react/messages/:messageId', spaHandler);

  console.log('✅ React admin routes registered at /admin/react');
}

