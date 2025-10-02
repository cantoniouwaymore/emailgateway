/**
 * Template Loader
 * Handles loading templates from database and mock storage
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

export class TemplateLoader {
  private mockTemplates: Map<string, any> = new Map();

  /**
   * Set a mock template for preview rendering
   */
  setMockTemplate(template: any) {
    this.mockTemplates.set(template.key, template);
  }

  /**
   * Get template from mock storage or database
   */
  async getTemplate(key: string): Promise<any> {
    // Check for mock template first (for preview rendering)
    const mockTemplate = this.mockTemplates.get(key);
    if (mockTemplate) {
      return mockTemplate;
    }
    
    // Load from database
    const template = await prisma.template.findUnique({
      where: { key },
      include: {
        locales: true
      }
    });
    
    return template;
  }

  /**
   * Load template from database with specific locale
   */
  async loadTemplateFromDatabase(key: string, locale: string): Promise<any> {
    console.log('🔧 LOADING TEMPLATE FROM DATABASE:', { key, locale });
    
    // Check for mock template first (for preview rendering)
    const mockTemplate = this.mockTemplates.get(key);
    if (mockTemplate) {
      console.log('🔧 USING MOCK TEMPLATE FOR PREVIEW');
      return {
        jsonStructure: mockTemplate.jsonStructure
      };
    }
    
    let template;
    if (locale === '__base__') {
      // For base locale, don't load locales at all
      template = await prisma.template.findUnique({
        where: { key }
      });
    } else {
      // For regular locales, load with locale data
      template = await prisma.template.findUnique({
        where: { key },
        include: {
          locales: {
            where: { locale }
          }
        }
      });
    }

    console.log('🔧 DATABASE QUERY RESULT:', JSON.stringify(template, null, 2));

    if (!template) {
      console.log('🔧 TEMPLATE NOT FOUND IN DATABASE');
      return null;
    }

    // Handle __base__ locale - use only the base template structure
    if (locale === '__base__') {
      console.log('🔧 USING BASE TEMPLATE STRUCTURE (__base__ locale)');
      const baseStructure = template.jsonStructure as Record<string, any>;
      
      return {
        jsonStructure: baseStructure
      };
    }

    // Try to find locale-specific content, fallback to base template structure
    let localeOverrides;
    if ('locales' in template && Array.isArray(template.locales)) {
      localeOverrides = template.locales.find((l: any) => l.locale === locale);
    }

    // Merge base structure with locale overrides (if any)
    const baseStructure = template.jsonStructure as Record<string, any>;
    const localeStructure = localeOverrides?.jsonStructure as Record<string, any> || {};
    
    // If no locale-specific content, just use the base structure
    const mergedStructure = localeOverrides ? this.deepMerge(baseStructure, localeStructure) : baseStructure;
    
    return {
      jsonStructure: mergedStructure
    };
  }

  /**
   * Deep merge two objects
   */
  private deepMerge(base: any, override: any): any {
    const result = { ...base };
    
    for (const key in override) {
      if (override[key] && typeof override[key] === 'object' && !Array.isArray(override[key])) {
        result[key] = this.deepMerge(result[key] || {}, override[key]);
      } else {
        result[key] = override[key];
      }
    }
    
    return result;
  }

  /**
   * Get all available templates
   */
  async getAvailableTemplates(): Promise<any[]> {
    const templates = await prisma.template.findMany({
      include: {
        locales: {
          select: { locale: true }
        }
      }
    });

    return templates.map(template => ({
      key: template.key,
      name: template.name,
      description: template.description,
      category: template.category,
      availableLocales: template.locales.map(l => l.locale),
      jsonStructure: template.jsonStructure,
      variableSchema: template.variableSchema,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt
    }));
  }

  /**
   * Get template for creation (check if exists)
   */
  async getTemplateForCreation(key: string): Promise<any> {
    const template = await prisma.template.findUnique({
      where: { key },
      include: {
        locales: true
      }
    });

    if (!template) {
      return null;
    }

    return {
      key: template.key,
      name: template.name,
      description: template.description,
      category: template.category,
      variableSchema: template.variableSchema,
      jsonStructure: template.jsonStructure,
      locales: template.locales.map(locale => ({
        locale: locale.locale,
        jsonStructure: locale.jsonStructure
      }))
    };
  }

  /**
   * Create a new template
   */
  async createTemplate(templateData: any): Promise<any> {
    const template = await prisma.template.create({
      data: {
        key: templateData.key,
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        variableSchema: templateData.variableSchema,
        jsonStructure: templateData.jsonStructure
      }
    });

    return template;
  }

  /**
   * Create template with initial locale
   */
  async createTemplateWithLocale(templateData: any, locale: string): Promise<any> {
    const template = await prisma.template.create({
      data: {
        key: templateData.key,
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        variableSchema: templateData.variableSchema,
        jsonStructure: templateData.jsonStructure,
        locales: {
          create: {
            locale: locale,
            jsonStructure: templateData.jsonStructure
          }
        }
      },
      include: {
        locales: true
      }
    });

    return template;
  }

  /**
   * Update template
   */
  async updateTemplate(key: string, templateData: any): Promise<any> {
    const template = await prisma.template.update({
      where: { key },
      data: {
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        variableSchema: templateData.variableSchema,
        jsonStructure: templateData.jsonStructure
      }
    });

    return template;
  }

  /**
   * Delete template
   */
  async deleteTemplate(key: string): Promise<void> {
    await prisma.template.delete({
      where: { key }
    });
  }

  /**
   * Add locale to template
   */
  async addLocale(templateKey: string, locale: string, jsonStructure: any): Promise<any> {
    const template = await prisma.template.findUnique({
      where: { key: templateKey }
    });

    if (!template) {
      throw new Error(`Template not found: ${templateKey}`);
    }

    const templateLocale = await prisma.templateLocale.create({
      data: {
        templateId: template.id,
        locale,
        jsonStructure
      }
    });

    return templateLocale;
  }

  /**
   * Update locale
   */
  async updateLocale(templateKey: string, locale: string, jsonStructure: any): Promise<any> {
    const template = await prisma.template.findUnique({
      where: { key: templateKey }
    });

    if (!template) {
      throw new Error(`Template not found: ${templateKey}`);
    }

    const templateLocale = await prisma.templateLocale.upsert({
      where: {
        templateId_locale: {
          templateId: template.id,
          locale
        }
      },
      update: {
        jsonStructure
      },
      create: {
        templateId: template.id,
        locale,
        jsonStructure
      }
    });

    return templateLocale;
  }

  /**
   * Delete locale
   */
  async deleteLocale(templateKey: string, locale: string): Promise<void> {
    const template = await prisma.template.findUnique({
      where: { key: templateKey }
    });

    if (!template) {
      throw new Error(`Template not found: ${templateKey}`);
    }

    await prisma.templateLocale.deleteMany({
      where: {
        templateId: template.id,
        locale
      }
    });
  }

  /**
   * Validate template variables
   */
  async validateTemplateVariables(templateKey: string, variables: Record<string, any>): Promise<any> {
    const template = await prisma.template.findUnique({
      where: { key: templateKey }
    });

    if (!template) {
      throw new Error(`Template not found: ${templateKey}`);
    }

    const schema = template.variableSchema as any;
    const errors: any[] = [];
    const warnings: any[] = [];

    // Check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (!variables[field]) {
          errors.push({
            field,
            message: `Required field '${field}' is missing`
          });
        }
      }
    }

    // Check field types
    if (schema.properties) {
      for (const [field, fieldSchema] of Object.entries(schema.properties)) {
        const value = variables[field];
        if (value !== undefined) {
          const fieldDef = fieldSchema as any;
          if (fieldDef.type === 'string' && typeof value !== 'string') {
            errors.push({
              field,
              message: `Field '${field}' should be a string`
            });
          } else if (fieldDef.type === 'number' && typeof value !== 'number') {
            errors.push({
              field,
              message: `Field '${field}' should be a number`
            });
          } else if (fieldDef.type === 'boolean' && typeof value !== 'boolean') {
            errors.push({
              field,
              message: `Field '${field}' should be a boolean`
            });
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

