/**
 * Template Metadata Controller
 * Handles template variables, validation, and documentation
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { TemplateEngine } from '../../../templates/engine';
import { logger } from '../../../utils/logger';
import { VariableDetector } from '../../../utils/variable-detector';
import { generateExampleVariables, generateTemplateDocumentation } from './metadata.helpers';

export class TemplateMetadataController {
  private templateEngine: TemplateEngine;

  constructor(templateEngine: TemplateEngine) {
    this.templateEngine = templateEngine;
  }

  /**
   * POST /api/v1/templates/{key}/validate
   * Validate template variables
   */
  async validateTemplate(request: FastifyRequest<{ Params: { key: string }, Body: { variables: Record<string, any> } }>, reply: FastifyReply) {
    try {
      const { key } = request.params;
      const { variables } = request.body;
      
      // Validate required fields
      if (!variables) {
        reply.code(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required field: variables',
            traceId: request.id
          }
        });
        return;
      }

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

      const validation = await this.templateEngine.validateTemplateVariables(key, variables);
      
      reply.code(200).send(validation);
    } catch (error) {
      logger.error({ error, templateKey: request.params.key }, 'Failed to validate template');
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to validate template',
          traceId: request.id
        }
      });
    }
  }

  /**
   * GET /api/v1/templates/{key}/variables
   * Get template variable schema
   */
  async getTemplateVariables(request: FastifyRequest<{ Params: { key: string } }>, reply: FastifyReply) {
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

      const variableSchema = template.variableSchema;
      const requiredVariables = variableSchema?.required || [];
      const optionalVariables = Object.keys(variableSchema?.properties || {}).filter(
        key => !requiredVariables.includes(key)
      );

      reply.code(200).send({
        template: {
          key: template.key,
          name: template.name,
          variableSchema,
          requiredVariables,
          optionalVariables,
          example: generateExampleVariables(variableSchema)
        }
      });
    } catch (error) {
      logger.error({ error, templateKey: request.params.key }, 'Failed to get template variables');
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get template variables',
          traceId: request.id
        }
      });
    }
  }

  /**
   * GET /api/v1/templates/{key}/detected-variables
   * Get detected variables from template structure
   */
  async getTemplateDetectedVariables(request: FastifyRequest<{ Params: { key: string } }>, reply: FastifyReply) {
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

      // Detect variables in the template structure
      const detectedVariables = VariableDetector.detectVariables(template.jsonStructure);
      const uniqueVariableNames = VariableDetector.getUniqueVariableNames(detectedVariables);

      reply.code(200).send({
        template: {
          key: template.key,
          name: template.name
        },
        detectedVariables: uniqueVariableNames,
        variableDetails: detectedVariables,
        count: uniqueVariableNames.length
      });
    } catch (error) {
      logger.error({ error, templateKey: request.params.key }, 'Failed to get template detected variables');
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get template detected variables',
          traceId: request.id
        }
      });
    }
  }

  /**
   * GET /api/v1/templates/{key}/docs
   * Get template documentation
   */
  async getTemplateDocs(request: FastifyRequest<{ Params: { key: string } }>, reply: FastifyReply) {
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

      const documentation = generateTemplateDocumentation(template);
      
      reply.code(200).send({ documentation });
    } catch (error) {
      logger.error({ error, templateKey: request.params.key }, 'Failed to get template documentation');
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get template documentation',
          traceId: request.id
        }
      });
    }
  }
}

