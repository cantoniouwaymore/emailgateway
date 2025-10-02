/**
 * Template CRUD Controller
 * Handles Create, Read, Update, Delete operations for templates
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { TemplateEngine } from '../../../templates/engine';
import { logger } from '../../../utils/logger';
import { VariableDetector } from '../../../utils/variable-detector';
import { validateLocale, validateFallbackSyntax } from './utils';

export class TemplateCRUDController {
  private templateEngine: TemplateEngine;

  constructor(templateEngine: TemplateEngine) {
    this.templateEngine = templateEngine;
  }

  /**
   * GET /api/v1/templates
   * List all available templates
   */
  async getTemplates(request: FastifyRequest, reply: FastifyReply) {
    try {
      const templates = await this.templateEngine.getAvailableTemplates();
      
      reply.code(200).send({
        templates,
        count: templates.length
      });
    } catch (error) {
      logger.error({ error }, 'Failed to get templates');
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get templates',
          traceId: request.id
        }
      });
    }
  }

  /**
   * GET /api/v1/templates/{key}
   * Get a single template by key
   */
  async getTemplate(request: FastifyRequest<{ Params: { key: string } }>, reply: FastifyReply) {
    try {
      const { key } = request.params;
      const template = await this.templateEngine.getTemplate(key);
      
      if (!template) {
        reply.code(404).send({
          error: {
            code: 'TEMPLATE_NOT_FOUND',
            message: `Template not found: ${key}`,
            traceId: request.id
          }
        });
        return;
      }

      reply.code(200).send({ template });
    } catch (error) {
      logger.error({ error, templateKey: request.params.key }, 'Failed to get template');
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get template',
          traceId: request.id
        }
      });
    }
  }

  /**
   * POST /api/v1/templates
   * Create a new template
   */
  async createTemplate(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    try {
      const templateData = request.body as any;
      
      // Validate required fields
      if (!templateData.key || !templateData.name || !templateData.jsonStructure) {
        reply.code(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: key, name, jsonStructure',
            traceId: request.id
          }
        });
        return;
      }

      // Validate fallback syntax to prevent nested variable errors
      const fallbackValidation = validateFallbackSyntax(templateData.jsonStructure);
      if (!fallbackValidation.valid) {
        reply.code(400).send({
          error: {
            code: 'INVALID_FALLBACK_SYNTAX',
            message: fallbackValidation.message,
            details: fallbackValidation.details,
            traceId: request.id
          }
        });
        return;
      }

      // Check if template already exists (including inactive ones)
      const existingTemplate = await this.templateEngine.getTemplateForCreation(templateData.key);
      if (existingTemplate) {
        reply.code(409).send({
          error: {
            code: 'TEMPLATE_EXISTS',
            message: `Template already exists: ${templateData.key}`,
            details: `A template with the key '${templateData.key}' already exists. Use PUT /api/v1/templates/${templateData.key} to update it instead.`,
            traceId: request.id
          }
        });
        return;
      }

      // Detect variables in the template structure
      const detectedVariables = VariableDetector.detectVariables(templateData.jsonStructure);
      const uniqueVariableNames = VariableDetector.getUniqueVariableNames(detectedVariables);
      
      // Add detected variables to template data
      templateData.detectedVariables = uniqueVariableNames;
      templateData.variableDetails = detectedVariables;
      
      // Ensure variableSchema is provided (required by Prisma schema)
      if (!templateData.variableSchema) {
        templateData.variableSchema = {
          type: 'object',
          properties: {},
          required: []
        };
      }
      
      // Set default locale to 'en' if not provided
      const locale = templateData.locale || 'en';
      
      // Validate locale format
      if (!validateLocale(locale)) {
        reply.code(400).send({
          error: {
            code: 'INVALID_LOCALE',
            message: `Invalid locale: ${locale}. Must be a valid ISO 639-1 language code (e.g., 'en', 'es', 'fr')`,
            traceId: request.id
          }
        });
        return;
      }
      
      const template = await this.templateEngine.createTemplateWithLocale(templateData, locale);
      
      reply.code(201).send({ 
        template,
        locale,
        detectedVariables: uniqueVariableNames,
        variableDetails: detectedVariables
      });
    } catch (error) {
      logger.error({ error }, 'Failed to create template');
      
      // Handle Prisma validation errors
      if (error instanceof Error && error.name === 'PrismaClientValidationError') {
        reply.code(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Template data validation failed',
            details: error.message,
            traceId: request.id
          }
        });
        return;
      }
      
      // Handle Prisma unique constraint errors
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        reply.code(409).send({
          error: {
            code: 'TEMPLATE_EXISTS',
            message: 'A template with this key already exists',
            details: error.message,
            traceId: request.id
          }
        });
        return;
      }
      
      // Handle other Prisma errors
      if (error instanceof Error && error.message.includes('prisma')) {
        reply.code(400).send({
          error: {
            code: 'DATABASE_ERROR',
            message: 'Database operation failed',
            details: error.message,
            traceId: request.id
          }
        });
        return;
      }
      
      // Generic error fallback
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create template',
          details: error instanceof Error ? error.message : 'Unknown error',
          traceId: request.id
        }
      });
    }
  }

  /**
   * PUT /api/v1/templates/{key}
   * Update an existing template
   */
  async updateTemplate(request: FastifyRequest<{ Params: { key: string }, Body: any }>, reply: FastifyReply) {
    try {
      const { key } = request.params;
      const templateData = request.body as any;
      
      console.log('📧 UPDATE TEMPLATE - Key:', key);
      console.log('📧 UPDATE TEMPLATE - Data:', JSON.stringify(templateData, null, 2));
      
      // Check if template exists
      const existingTemplate = await this.templateEngine.getTemplate(key);
      if (!existingTemplate) {
        reply.code(404).send({
          error: {
            code: 'TEMPLATE_NOT_FOUND',
            message: `Template not found: ${key}`,
            traceId: request.id
          }
        });
        return;
      }

      // Validate fallback syntax to prevent nested variable errors
      if (templateData.jsonStructure) {
        const fallbackValidation = validateFallbackSyntax(templateData.jsonStructure);
        if (!fallbackValidation.valid) {
          reply.code(400).send({
            error: {
              code: 'INVALID_FALLBACK_SYNTAX',
              message: fallbackValidation.message,
              details: fallbackValidation.details,
              traceId: request.id
            }
          });
          return;
        }
      }

      // Detect variables in the template structure
      const detectedVariables = VariableDetector.detectVariables(templateData.jsonStructure);
      const uniqueVariableNames = VariableDetector.getUniqueVariableNames(detectedVariables);
      
      // Add detected variables to template data
      templateData.detectedVariables = uniqueVariableNames;
      templateData.variableDetails = detectedVariables;
      
      const template = await this.templateEngine.updateTemplate(key, templateData);
      
      reply.code(200).send({ 
        template,
        detectedVariables: uniqueVariableNames,
        variableDetails: detectedVariables
      });
    } catch (error) {
      logger.error({ error, templateKey: request.params.key }, 'Failed to update template');
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update template',
          traceId: request.id
        }
      });
    }
  }

  /**
   * DELETE /api/v1/templates/{key}
   * Delete a template
   */
  async deleteTemplate(request: FastifyRequest<{ Params: { key: string } }>, reply: FastifyReply) {
    try {
      const { key } = request.params;
      
      // Check if template exists
      const existingTemplate = await this.templateEngine.getTemplate(key);
      if (!existingTemplate) {
        reply.code(404).send({
          error: {
            code: 'TEMPLATE_NOT_FOUND',
            message: `Template not found: ${key}`,
            traceId: request.id
          }
        });
        return;
      }

      await this.templateEngine.deleteTemplate(key);
      
      reply.code(204).send();
    } catch (error) {
      logger.error({ error, templateKey: request.params.key }, 'Failed to delete template');
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete template',
          traceId: request.id
        }
      });
    }
  }
}

