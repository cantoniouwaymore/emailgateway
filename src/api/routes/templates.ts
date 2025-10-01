import { FastifyInstance } from 'fastify';
import { TemplateController } from '../controllers/templates/index';

export async function templateRoutes(fastify: FastifyInstance) {
  try {
    console.log('🔧 Registering template routes...');
    
    const templateController = new TemplateController();
    
    // Template CRUD operations
    fastify.get('/api/v1/templates', templateController.getTemplates.bind(templateController));
    fastify.get('/api/v1/templates/:key', templateController.getTemplate.bind(templateController));
    fastify.post('/api/v1/templates', templateController.createTemplate.bind(templateController));
    fastify.put('/api/v1/templates/:key', templateController.updateTemplate.bind(templateController));
    fastify.delete('/api/v1/templates/:key', templateController.deleteTemplate.bind(templateController));
    
    // Locale management
    fastify.post('/api/v1/templates/:key/locales', templateController.addLocale.bind(templateController));
    fastify.put('/api/v1/templates/:key/locales/:locale', templateController.updateLocale.bind(templateController));
    fastify.delete('/api/v1/templates/:key/locales/:locale', templateController.deleteLocale.bind(templateController));
    
    // Template utilities
    fastify.post('/api/v1/templates/:key/validate', templateController.validateTemplate.bind(templateController));
    fastify.get('/api/v1/templates/:key/variables', templateController.getTemplateVariables.bind(templateController));
    fastify.get('/api/v1/templates/:key/detected-variables', templateController.getTemplateDetectedVariables.bind(templateController));
    fastify.get('/api/v1/templates/:key/docs', templateController.getTemplateDocs.bind(templateController));
    fastify.get('/api/v1/templates/:key/preview', templateController.previewTemplate.bind(templateController));
    
    // Template preview generation for editor
    fastify.post('/api/v1/templates/preview', templateController.generatePreview.bind(templateController));
    
    console.log('✅ Template routes registered successfully');
  } catch (error) {
    console.error('❌ Error registering template routes:', error);
    throw error;
  }
}