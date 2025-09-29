import { FastifyInstance } from 'fastify';

export async function templateRoutesSimple(fastify: FastifyInstance) {
  console.log('🔧 Registering simple template routes...');
  
  fastify.get('/api/v1/templates/simple', async (request, reply) => {
    return { message: 'Simple template routes are working!' };
  });
  
  console.log('✅ Simple template routes registered');
}
