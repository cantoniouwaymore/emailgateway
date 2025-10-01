/**
 * Template Preview Controller
 * Handles template preview and rendering operations
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { TemplateEngine } from '../../../templates/engine';
import { logger } from '../../../utils/logger';
import { generateTemplatePlaceholders } from './preview.helpers';

export class TemplatePreviewController {
  private templateEngine: TemplateEngine;

  constructor(templateEngine: TemplateEngine) {
    this.templateEngine = templateEngine;
  }

  /**
   * GET /api/v1/templates/{key}/preview
   * Preview a template with optional variables
   */
  async previewTemplate(request: FastifyRequest<{ Params: { key: string }, Querystring: { locale?: string, variables?: string } }>, reply: FastifyReply) {
    try {
      const { key } = request.params;
      const { locale = 'en', variables } = request.query;
      
      // Parse variables from query string if provided
      let templateVariables = {};
      if (variables) {
        try {
          templateVariables = JSON.parse(variables);
        } catch (error) {
          reply.code(400).send({
            error: {
              code: 'INVALID_VARIABLES',
              message: 'Invalid variables JSON format',
              traceId: request.id
            }
          });
          return;
        }
      } else {
        // Generate template structure placeholders for preview
        const template = await this.templateEngine.getTemplate(key);
        if (template) {
          templateVariables = generateTemplatePlaceholders(template.variableSchema);
        }
      }

      // Render the template
      const renderedTemplate = await this.templateEngine.renderTemplate({
        key,
        locale,
        variables: templateVariables
      });

      // Set content type to HTML
      reply.type('text/html');
      reply.code(200).send(renderedTemplate.html);
    } catch (error) {
      logger.error({ error, templateKey: request.params.key }, 'Failed to preview template');
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to preview template',
          traceId: request.id
        }
      });
    }
  }

  /**
   * POST /api/v1/templates/preview
   * Generate preview HTML using MJML template engine
   */
  async generatePreview(request: any, reply: any) {
    try {
      const { templateStructure, variables = {} } = request.body as {
        templateStructure: any;
        variables?: Record<string, any>;
      };

      if (!templateStructure) {
        return reply.code(400).send({
          error: 'Template structure is required'
        });
      }

      // Use the same MJML template engine as actual emails
      // This ensures preview and email rendering are identical
      const { DatabaseTemplateEngine } = require('../../../templates/database-engine');
      const dbEngine = new DatabaseTemplateEngine();
      
      // Create a mock template that the DatabaseTemplateEngine can process
      const mockTemplate = {
        key: 'preview-template',
        jsonStructure: templateStructure
      };
      
      // Store the template temporarily in the engine's memory
      dbEngine.setMockTemplate(mockTemplate);
      
      // Render using the same engine as emails
      console.log('🔍 Preview generation - templateStructure:', JSON.stringify(templateStructure, null, 2));
      console.log('🔍 Preview generation - variables:', JSON.stringify(variables, null, 2));
      
      // Resolve placeholders at render-time using VariableDetector rules
      dbEngine.setMockTemplate({ key: 'preview-template', jsonStructure: templateStructure });
      const rendered = await dbEngine.renderTemplate({
        key: 'preview-template',
        locale: 'en',
        variables: variables || {}
      });
      
      console.log('🔍 Preview generation - rendered HTML length:', rendered.html?.length || 0);

      return reply.code(200).send({
        html: rendered.html,
        text: rendered.text || '',
        preview: rendered.html
      });
    } catch (error) {
      logger.error({ error }, 'Failed to generate preview');
      return reply.code(500).send({
        error: 'Failed to generate preview',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      });
    }
  }
}

