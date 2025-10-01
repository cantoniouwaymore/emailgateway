/**
 * Database Template Engine - Main Entry Point
 * 
 * Orchestrates template loading, variable merging, and rendering
 * using specialized modules for each responsibility.
 */

import { join } from 'path';
import { logger } from '../../utils/logger';
import { TemplateLoader } from './template-loader';
import { VariableMerger } from './variable-merger';
import { TemplateRenderer } from './template-renderer';
import { registerHandlebarsHelpers } from './handlebars-helpers';

export interface TemplateRenderOptions {
  key: string;
  locale?: string;
  variables: Record<string, unknown>;
}

export interface RenderedTemplate {
  html: string;
  text?: string;
  subject?: string;
}

export class DatabaseTemplateEngine {
  private templatesPath: string;
  private loader: TemplateLoader;
  private merger: VariableMerger;
  private renderer: TemplateRenderer;

  constructor(templatesPath?: string) {
    this.templatesPath = templatesPath || join(__dirname, '..', 'templates');
    
    // Initialize specialized modules
    this.loader = new TemplateLoader();
    this.merger = new VariableMerger();
    this.renderer = new TemplateRenderer(this.templatesPath);
    
    // Register Handlebars helpers
    registerHandlebarsHelpers();
    
    logger.info('DatabaseTemplateEngine initialized with modular architecture');
  }

  /**
   * Set a mock template for preview rendering
   */
  setMockTemplate(template: any) {
    this.loader.setMockTemplate(template);
  }

  /**
   * Get template data for debugging
   */
  async getTemplateData(key: string) {
    const template = await this.loader.getTemplate(key);
    if (template) {
      // Apply button structure conversion
      const convertedStructure = this.merger.convertOldButtonStructure(template.jsonStructure);
      return {
        ...template,
        jsonStructure: convertedStructure
      };
    }
    return template;
  }

  /**
   * Get template from storage
   */
  async getTemplate(key: string): Promise<any> {
    return this.loader.getTemplate(key);
  }

  /**
   * Render template with given options
   */
  async renderTemplate(options: TemplateRenderOptions): Promise<RenderedTemplate> {
    const { key, locale = 'en', variables } = options;

    try {
      logger.debug({ templateKey: key, locale }, 'Starting template rendering');
      console.log('🔧 DATABASE TEMPLATE ENGINE - Starting render:', { key, locale, variables });

      // Step 1: Load template from database
      const template = await this.loader.loadTemplateFromDatabase(key, locale);
      console.log('🔧 DATABASE TEMPLATE ENGINE - Loading template with key:', key, 'locale:', locale);
      console.log('🔧 DATABASE TEMPLATE ENGINE - Loaded template:', JSON.stringify(template, null, 2));
      
      if (!template) {
        throw new Error(`Template not found: ${key}`);
      }

      // Step 2: Merge template structure with user variables
      const finalStructure = this.merger.mergeVariables(template.jsonStructure, variables as Record<string, any>);
      console.log('🔧 DATABASE TEMPLATE ENGINE - Final structure:', JSON.stringify(finalStructure, null, 2));
      console.log('🔧 DATABASE TEMPLATE ENGINE - Title text:', finalStructure.title?.text);
      console.log('🔧 DATABASE TEMPLATE ENGINE - Body paragraphs:', finalStructure.body?.paragraphs);
      console.log('🔧 DATABASE TEMPLATE ENGINE - Email title:', finalStructure.email_title);

      // Step 3: Render using MJML template
      const result = await this.renderer.render(finalStructure);
      
      logger.info({ templateKey: key, locale }, 'Template rendering completed successfully');
      return result;
    } catch (error) {
      logger.error({ error, templateKey: key, locale }, 'Template rendering failed');
      throw error;
    }
  }

  // ==================== Database Operations (Delegated to Loader) ====================

  async getAvailableTemplates(): Promise<any[]> {
    return this.loader.getAvailableTemplates();
  }

  async getTemplateForCreation(key: string): Promise<any> {
    return this.loader.getTemplateForCreation(key);
  }

  async createTemplate(templateData: any): Promise<any> {
    return this.loader.createTemplate(templateData);
  }

  async createTemplateWithLocale(templateData: any, locale: string): Promise<any> {
    return this.loader.createTemplateWithLocale(templateData, locale);
  }

  async updateTemplate(key: string, templateData: any): Promise<any> {
    return this.loader.updateTemplate(key, templateData);
  }

  async deleteTemplate(key: string): Promise<void> {
    return this.loader.deleteTemplate(key);
  }

  async addLocale(templateKey: string, locale: string, jsonStructure: any): Promise<any> {
    return this.loader.addLocale(templateKey, locale, jsonStructure);
  }

  async updateLocale(templateKey: string, locale: string, jsonStructure: any): Promise<any> {
    return this.loader.updateLocale(templateKey, locale, jsonStructure);
  }

  async deleteLocale(templateKey: string, locale: string): Promise<void> {
    return this.loader.deleteLocale(templateKey, locale);
  }

  async validateTemplateVariables(templateKey: string, variables: Record<string, any>): Promise<any> {
    return this.loader.validateTemplateVariables(templateKey, variables);
  }
}

