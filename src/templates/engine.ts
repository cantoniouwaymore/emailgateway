import Handlebars from 'handlebars';
import mjml from 'mjml';
import { readFileSync } from 'fs';
import { join } from 'path';
import { logger } from '../utils/logger';
import { DatabaseTemplateEngine } from './database-engine';

export interface TemplateRenderOptions {
  key: string;
  locale?: string;
  version?: string;
  variables: Record<string, unknown>;
}

export interface RenderedTemplate {
  html: string;
  text?: string;
  subject?: string;
}

export class TemplateEngine {
  private templatesPath: string;
  private databaseEngine: DatabaseTemplateEngine;
  private useDatabase: boolean;
  private fallbackToFiles: boolean;

  constructor(templatesPath: string = join(process.cwd(), 'src', 'templates')) {
    this.templatesPath = templatesPath;
    this.useDatabase = process.env.USE_DATABASE_TEMPLATES === 'true';
    this.fallbackToFiles = process.env.TEMPLATE_FALLBACK_TO_FILES === 'true';
    
    this.databaseEngine = new DatabaseTemplateEngine(templatesPath);
    this.registerHelpers();
    
    logger.info('TemplateEngine initialized', {
      useDatabase: this.useDatabase,
      fallbackToFiles: this.fallbackToFiles
    });
  }

  private registerHelpers(): void {
    // Register common Handlebars helpers
    Handlebars.registerHelper('eq', function(a: unknown, b: unknown) {
      return a === b;
    });

    Handlebars.registerHelper('ne', function(a: unknown, b: unknown) {
      return a !== b;
    });

    Handlebars.registerHelper('gt', function(a: unknown, b: unknown) {
      return Number(a) > Number(b);
    });

    Handlebars.registerHelper('lt', function(a: unknown, b: unknown) {
      return Number(a) < Number(b);
    });

    Handlebars.registerHelper('formatDate', function(date: string | Date, format?: string) {
      const d = new Date(date);
      if (format === 'short') {
        return d.toLocaleDateString();
      }
      return d.toLocaleString();
    });

    // Countdown calculation helper
    Handlebars.registerHelper('countdown', function(targetDate: string, unit: string) {
      try {
        const target = new Date(targetDate);
        const now = new Date();
        const diff = target.getTime() - now.getTime();
        
        if (diff <= 0) {
          return '0'; // Countdown expired
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        switch (unit.toLowerCase()) {
          case 'days':
            return days.toString();
          case 'hours':
            return hours.toString();
          case 'minutes':
            return minutes.toString();
          case 'seconds':
            return seconds.toString();
          default:
            return '0';
        }
      } catch (error) {
        logger.warn({ error, targetDate, unit }, 'Countdown calculation failed');
        return '0';
      }
    });

    // Helper to check if countdown has expired
    Handlebars.registerHelper('countdownExpired', function(targetDate: string) {
      try {
        const target = new Date(targetDate);
        const now = new Date();
        return target.getTime() <= now.getTime();
      } catch (error) {
        logger.warn({ error, targetDate }, 'Countdown expiry check failed');
        return true;
      }
    });
  }

  async renderTemplate(options: TemplateRenderOptions): Promise<RenderedTemplate> {
    const { key, locale = 'en', version, variables } = options;
    
    // Handle __base__ locale by using base template structure
    const actualLocale = locale === '__base__' ? 'en' : locale;

    try {
      // Use database engine if enabled and template exists in database
      if (this.useDatabase) {
        console.log('🔧 TEMPLATE ENGINE - Using database engine for:', { key, locale, variables });
        try {
          const result = await this.databaseEngine.renderTemplate({
            key,
            locale: locale, // Pass the original locale (including __base__)
            variables
          });
          console.log('🔧 TEMPLATE ENGINE - Database rendering successful:', { templateKey: key, locale, source: 'database' });
          logger.info({ templateKey: key, locale, source: 'database' }, 'Template rendered from database');
          
          return result;
        } catch (dbError) {
          console.log('🔧 TEMPLATE ENGINE - Database rendering failed:', { templateKey: key, error: dbError instanceof Error ? dbError.message : 'Unknown error' });
          logger.warn({ templateKey: key, error: dbError instanceof Error ? dbError.message : 'Unknown error' }, 'Database template rendering failed, falling back to file system');
          // Fall through to file system rendering if fallback is enabled
          if (!this.fallbackToFiles) {
            throw dbError;
          }
        }
      }

      // Fallback to file system rendering
      console.log('🔧 TEMPLATE ENGINE - Falling back to file system rendering:', { templateKey: key, locale, source: 'filesystem' });
      logger.info({ templateKey: key, locale, source: 'filesystem' }, 'Rendering template from file system');

      // Process custom_content variable if it exists
      const processedVariables = { ...variables };
      if (processedVariables.custom_content && typeof processedVariables.custom_content === 'string') {
        // Compile and render the custom_content with Handlebars
        const customContentTemplate = Handlebars.compile(processedVariables.custom_content);
        processedVariables.custom_content = customContentTemplate(variables);
        logger.debug({ templateKey: key }, 'Custom content processed with Handlebars variables');
      }

      // Load template files
      const templatePath = this.getTemplatePath(key, actualLocale, version);
      const mjmlTemplate = this.loadTemplate(templatePath, 'mjml');
      
      // Compile Handlebars template
      const compiledTemplate = Handlebars.compile(mjmlTemplate);
      const renderedMjml = compiledTemplate(processedVariables);

      // Convert MJML to HTML
      const mjmlResult = mjml(renderedMjml, {
        validationLevel: 'soft',
        minify: true
      });

      if (mjmlResult.errors.length > 0) {
        logger.warn({ errors: mjmlResult.errors }, 'MJML compilation warnings');
      }

      const result: RenderedTemplate = {
        html: mjmlResult.html
      };

      // Try to load text version if it exists
      try {
        const textTemplate = this.loadTemplate(templatePath, 'txt');
        const compiledTextTemplate = Handlebars.compile(textTemplate);
        result.text = compiledTextTemplate(processedVariables);
      } catch {
        // Text template is optional
      }

      // Try to load subject template if it exists
      try {
        const subjectTemplate = this.loadTemplate(templatePath, 'subject');
        const compiledSubjectTemplate = Handlebars.compile(subjectTemplate);
        result.subject = compiledSubjectTemplate(processedVariables);
        logger.info({ templateKey: key, renderedSubject: result.subject }, 'Subject template rendered successfully');
      } catch (error) {
        logger.debug({ templateKey: key, error: error instanceof Error ? error.message : 'Unknown error' }, 'Subject template not found or error');
        // Subject template is optional
      }

      logger.info({ templateKey: key, locale, source: 'filesystem' }, 'Template rendered successfully');
      
      return result;
    } catch (error) {
      logger.error({ error, templateKey: key, locale }, 'Failed to render template');
      throw new Error(`Template rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getTemplatePath(key: string, locale: string, version?: string): string {
    const parts = key.split('/');
    const templateName = parts[parts.length - 1];
    
    // Remove 'templates/' prefix if it exists to avoid duplication
    const cleanParts = parts[0] === 'templates' ? parts.slice(1) : parts;
    const templateDir = join(this.templatesPath, ...cleanParts.slice(0, -1));
    
    if (version) {
      return join(templateDir, `${templateName}-${version}-${locale}`);
    }
    
    return join(templateDir, `${templateName}-${locale}`);
  }

  private loadTemplate(templatePath: string, extension: string): string {
    const filePath = `${templatePath}.${extension}`;
    
    try {
      return readFileSync(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Template file not found: ${filePath}`);
    }
  }


  async previewTemplate(options: TemplateRenderOptions): Promise<RenderedTemplate> {
    // Same as renderTemplate but with additional validation
    const result = await this.renderTemplate(options);
    
    // Add preview-specific modifications if needed
    return result;
  }

  // Database engine methods
  async getAvailableTemplates(): Promise<any[]> {
    if (this.useDatabase) {
      return await this.databaseEngine.getAvailableTemplates();
    }
    return [];
  }

  async getTemplate(key: string): Promise<any> {
    if (this.useDatabase) {
      return await this.databaseEngine.getTemplate(key);
    }
    return null;
  }

  async getTemplateForCreation(key: string): Promise<any> {
    if (this.useDatabase) {
      return await this.databaseEngine.getTemplateForCreation(key);
    }
    return null;
  }


  async createTemplate(templateData: any): Promise<any> {
    if (this.useDatabase) {
      return await this.databaseEngine.createTemplate(templateData);
    }
    throw new Error('Database engine not enabled');
  }

  async createTemplateWithLocale(templateData: any, locale: string): Promise<any> {
    if (this.useDatabase) {
      return await this.databaseEngine.createTemplateWithLocale(templateData, locale);
    }
    throw new Error('Database engine not enabled');
  }

  async updateTemplate(key: string, templateData: any): Promise<any> {
    if (this.useDatabase) {
      return await this.databaseEngine.updateTemplate(key, templateData);
    }
    throw new Error('Database engine not enabled');
  }

  async deleteTemplate(key: string): Promise<void> {
    if (this.useDatabase) {
      return await this.databaseEngine.deleteTemplate(key);
    }
    throw new Error('Database engine not enabled');
  }

  async addLocale(templateKey: string, locale: string, jsonStructure: any): Promise<any> {
    if (this.useDatabase) {
      return await this.databaseEngine.addLocale(templateKey, locale, jsonStructure);
    }
    throw new Error('Database engine not enabled');
  }

  async updateLocale(templateKey: string, locale: string, jsonStructure: any): Promise<any> {
    if (this.useDatabase) {
      return await this.databaseEngine.updateLocale(templateKey, locale, jsonStructure);
    }
    throw new Error('Database engine not enabled');
  }

  async deleteLocale(templateKey: string, locale: string): Promise<void> {
    if (this.useDatabase) {
      return await this.databaseEngine.deleteLocale(templateKey, locale);
    }
    throw new Error('Database engine not enabled');
  }

  async validateTemplateVariables(templateKey: string, variables: Record<string, any>): Promise<any> {
    if (this.useDatabase) {
      return await this.databaseEngine.validateTemplateVariables(templateKey, variables);
    }
    return { valid: true, errors: [], warnings: [] };
  }
}
