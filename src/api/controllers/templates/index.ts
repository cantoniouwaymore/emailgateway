/**
 * Template Controller - Main Entry Point
 * 
 * This is a delegating controller that coordinates between specialized controllers.
 * Each sub-controller handles a specific aspect of template management.
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { TemplateEngine } from '../../../templates/engine';
import { TemplateCRUDController } from './crud.controller';
import { TemplateLocaleController } from './locale.controller';
import { TemplatePreviewController } from './preview.controller';
import { TemplateMetadataController } from './metadata.controller';

export class TemplateController {
  private templateEngine: TemplateEngine;
  private crud: TemplateCRUDController;
  private locale: TemplateLocaleController;
  private preview: TemplatePreviewController;
  private metadata: TemplateMetadataController;

  constructor() {
    try {
      console.log('🔧 Creating TemplateController...');
      this.templateEngine = new TemplateEngine();
      
      // Initialize specialized controllers
      this.crud = new TemplateCRUDController(this.templateEngine);
      this.locale = new TemplateLocaleController(this.templateEngine);
      this.preview = new TemplatePreviewController(this.templateEngine);
      this.metadata = new TemplateMetadataController(this.templateEngine);
      
      console.log('✅ TemplateController created successfully with specialized sub-controllers');
    } catch (error) {
      console.error('❌ Error creating TemplateController:', error);
      throw error;
    }
  }

  // ==================== CRUD Operations ====================
  
  /**
   * GET /api/v1/templates
   * Delegates to TemplateCRUDController
   */
  async getTemplates(request: FastifyRequest, reply: FastifyReply) {
    return this.crud.getTemplates(request, reply);
  }

  /**
   * GET /api/v1/templates/{key}
   * Delegates to TemplateCRUDController
   */
  async getTemplate(request: FastifyRequest<{ Params: { key: string } }>, reply: FastifyReply) {
    return this.crud.getTemplate(request, reply);
  }

  /**
   * POST /api/v1/templates
   * Delegates to TemplateCRUDController
   */
  async createTemplate(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    return this.crud.createTemplate(request, reply);
  }

  /**
   * PUT /api/v1/templates/{key}
   * Delegates to TemplateCRUDController
   */
  async updateTemplate(request: FastifyRequest<{ Params: { key: string }, Body: any }>, reply: FastifyReply) {
    return this.crud.updateTemplate(request, reply);
  }

  /**
   * DELETE /api/v1/templates/{key}
   * Delegates to TemplateCRUDController
   */
  async deleteTemplate(request: FastifyRequest<{ Params: { key: string } }>, reply: FastifyReply) {
    return this.crud.deleteTemplate(request, reply);
  }

  // ==================== Locale Operations ====================

  /**
   * POST /api/v1/templates/{key}/locales
   * Delegates to TemplateLocaleController
   */
  async addLocale(request: FastifyRequest<{ Params: { key: string }, Body: { locale: string, jsonStructure: any } }>, reply: FastifyReply) {
    return this.locale.addLocale(request, reply);
  }

  /**
   * PUT /api/v1/templates/{key}/locales/{locale}
   * Delegates to TemplateLocaleController
   */
  async updateLocale(request: FastifyRequest<{ Params: { key: string, locale: string }, Body: { jsonStructure: any } }>, reply: FastifyReply) {
    return this.locale.updateLocale(request, reply);
  }

  /**
   * DELETE /api/v1/templates/{key}/locales/{locale}
   * Delegates to TemplateLocaleController
   */
  async deleteLocale(request: FastifyRequest<{ Params: { key: string, locale: string } }>, reply: FastifyReply) {
    return this.locale.deleteLocale(request, reply);
  }

  // ==================== Preview Operations ====================

  /**
   * GET /api/v1/templates/{key}/preview
   * Delegates to TemplatePreviewController
   */
  async previewTemplate(request: FastifyRequest<{ Params: { key: string }, Querystring: { locale?: string, variables?: string } }>, reply: FastifyReply) {
    return this.preview.previewTemplate(request, reply);
  }

  /**
   * POST /api/v1/templates/preview
   * Delegates to TemplatePreviewController
   */
  async generatePreview(request: any, reply: any) {
    return this.preview.generatePreview(request, reply);
  }

  // ==================== Metadata Operations ====================

  /**
   * POST /api/v1/templates/{key}/validate
   * Delegates to TemplateMetadataController
   */
  async validateTemplate(request: FastifyRequest<{ Params: { key: string }, Body: { variables: Record<string, any> } }>, reply: FastifyReply) {
    return this.metadata.validateTemplate(request, reply);
  }

  /**
   * GET /api/v1/templates/{key}/variables
   * Delegates to TemplateMetadataController
   */
  async getTemplateVariables(request: FastifyRequest<{ Params: { key: string } }>, reply: FastifyReply) {
    return this.metadata.getTemplateVariables(request, reply);
  }

  /**
   * GET /api/v1/templates/{key}/detected-variables
   * Delegates to TemplateMetadataController
   */
  async getTemplateDetectedVariables(request: FastifyRequest<{ Params: { key: string } }>, reply: FastifyReply) {
    return this.metadata.getTemplateDetectedVariables(request, reply);
  }

  /**
   * GET /api/v1/templates/{key}/docs
   * Delegates to TemplateMetadataController
   */
  async getTemplateDocs(request: FastifyRequest<{ Params: { key: string } }>, reply: FastifyReply) {
    return this.metadata.getTemplateDocs(request, reply);
  }
}

// Export all sub-controllers for direct usage if needed
export { TemplateCRUDController } from './crud.controller';
export { TemplateLocaleController } from './locale.controller';
export { TemplatePreviewController } from './preview.controller';
export { TemplateMetadataController } from './metadata.controller';

