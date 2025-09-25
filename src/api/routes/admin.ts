import { FastifyInstance } from 'fastify';
import { AdminController } from '../controllers/admin';

export async function adminRoutes(fastify: FastifyInstance) {
  const adminController = new AdminController();

  // Admin dashboard - return HTML directly
  fastify.get('/admin', async (request, reply) => {
    return adminController.getDashboardHTML(request, reply);
  });
  
  // Message details page
  fastify.get<{ Params: { messageId: string } }>('/admin/messages/:messageId', async (request, reply) => {
    return adminController.getMessageDetailsHTML(request, reply);
  });
  
  // API endpoint for real-time data
  fastify.get('/admin/api/data', adminController.getApiData.bind(adminController));
}
