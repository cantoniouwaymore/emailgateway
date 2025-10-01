/**
 * Template Locale Controller
 * Handles locale management operations for templates
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { TemplateEngine } from '../../../templates/engine';
import { logger } from '../../../utils/logger';
import { validateLocale, validateFallbackSyntax } from './utils';

export class TemplateLocaleController {
  private templateEngine: TemplateEngine;

  constructor(templateEngine: TemplateEngine) {
    this.templateEngine = templateEngine;
  }

  /**
   * POST /api/v1/templates/{key}/locales
   * Add a new locale to a template
   */
  async addLocale(request: FastifyRequest<{ Params: { key: string }, Body: { locale: string, jsonStructure: any } }>, reply: FastifyReply) {
    try {
      const { key } = request.params;
      const { locale, jsonStructure } = request.body;
      
      // Validate required fields
      if (!locale || !jsonStructure) {
        reply.code(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: locale, jsonStructure',
            traceId: request.id
          }
        });
        return;
      }

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

      // Validate fallback syntax to prevent nested variable errors
      const fallbackValidation = validateFallbackSyntax(jsonStructure);
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

      const templateLocale = await this.templateEngine.addLocale(key, locale, jsonStructure);
      
      reply.code(201).send({ locale: templateLocale });
    } catch (error) {
      logger.error({ error, templateKey: request.params.key }, 'Failed to add locale');
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to add locale',
          traceId: request.id
        }
      });
    }
  }

  /**
   * PUT /api/v1/templates/{key}/locales/{locale}
   * Update an existing locale
   */
  async updateLocale(request: FastifyRequest<{ Params: { key: string, locale: string }, Body: { jsonStructure: any } }>, reply: FastifyReply) {
    try {
      const { key, locale } = request.params;
      const { jsonStructure } = request.body;
      
      // Validate required fields
      if (!jsonStructure) {
        reply.code(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required field: jsonStructure',
            traceId: request.id
          }
        });
        return;
      }

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

      const templateLocale = await this.templateEngine.updateLocale(key, locale, jsonStructure);
      
      reply.code(200).send({ locale: templateLocale });
    } catch (error) {
      logger.error({ error, templateKey: request.params.key, locale: request.params.locale }, 'Failed to update locale');
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update locale',
          traceId: request.id
        }
      });
    }
  }

  /**
   * DELETE /api/v1/templates/{key}/locales/{locale}
   * Delete a locale from a template
   */
  async deleteLocale(request: FastifyRequest<{ Params: { key: string, locale: string } }>, reply: FastifyReply) {
    try {
      const { key, locale } = request.params;
      
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

      await this.templateEngine.deleteLocale(key, locale);
      
      reply.code(204).send();
    } catch (error) {
      logger.error({ error, templateKey: request.params.key, locale: request.params.locale }, 'Failed to delete locale');
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete locale',
          traceId: request.id
        }
      });
    }
  }
}

