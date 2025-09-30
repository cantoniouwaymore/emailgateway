import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import mjml from 'mjml';
import { logger } from '../utils/logger';
import { VariableDetector } from '../utils/variable-detector';

const prisma = new PrismaClient();

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
  private mockTemplates: Map<string, any> = new Map();

  constructor(templatesPath?: string) {
    this.templatesPath = templatesPath || join(__dirname, '..', 'templates');
    this.registerHelpers();
  }

  // Method to set a mock template for preview rendering
  setMockTemplate(template: any) {
    this.mockTemplates.set(template.key, template);
  }

  // Method to get template data for debugging
  async getTemplateData(key: string) {
    const template = await this.getTemplate(key);
    if (template) {
      // Apply the same conversion logic as in mergeVariables
      const convertedStructure = this.convertOldButtonStructure(template.jsonStructure);
      return {
        ...template,
        jsonStructure: convertedStructure
      };
    }
    return template;
  }

  // Helper method to convert old button structure to new structure
  private convertOldButtonStructure(jsonStructure: any): any {
    if (!jsonStructure.actions) {
      return jsonStructure;
    }

    const converted = { ...jsonStructure };
    
    // Convert old button structure to new structure
    if (converted.actions.primaryButton) {
      converted.actions.primary = {
        show: true,
        label: converted.actions.primaryButton.label || 'Primary Button',
        url: converted.actions.primaryButton.url || '#',
        style: 'button',
        color: converted.actions.primaryButton.backgroundColor || '#3b82f6',
        text_color: converted.actions.primaryButton.textColor || '#ffffff'
      };
    }
    
    if (converted.actions.secondaryButton) {
      converted.actions.secondary = {
        show: true,
        label: converted.actions.secondaryButton.label || 'Secondary Button',
        url: converted.actions.secondaryButton.url || '#',
        style: 'button',
        color: converted.actions.secondaryButton.backgroundColor || '#6b7280',
        text_color: converted.actions.secondaryButton.textColor || '#ffffff'
      };
    }
    
    // Clean up old structure
    delete converted.actions.primaryButton;
    delete converted.actions.secondaryButton;
    
    return converted;
  }

  private registerHelpers(): void {
    // Register Handlebars helpers for template rendering
    Handlebars.registerHelper('eq', function(this: any, a: any, b: any) {
      return a === b;
    });
    
    Handlebars.registerHelper('gt', function(this: any, a: any, b: any) {
      return a > b;
    });

    Handlebars.registerHelper('ne', function(this: any, a: any, b: any) {
      return a !== b;
    });

    Handlebars.registerHelper('gt', function(this: any, a: any, b: any) {
      return a > b;
    });

    Handlebars.registerHelper('lt', function(this: any, a: any, b: any) {
      return a < b;
    });

    Handlebars.registerHelper('and', function(this: any, a: any, b: any) {
      return a && b;
    });

    Handlebars.registerHelper('or', function(this: any, a: any, b: any) {
      return a || b;
    });

    Handlebars.registerHelper('not', function(this: any, a: any) {
      return !a;
    });

    Handlebars.registerHelper('if_eq', function(this: any, a: any, b: any, options: any) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    Handlebars.registerHelper('unless_eq', function(this: any, a: any, b: any, options: any) {
      if (a !== b) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    Handlebars.registerHelper('formatDate', function(date: string, format: string) {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d.getTime())) return date;
      
      switch (format) {
        case 'short':
          return d.toLocaleDateString();
        case 'long':
          return d.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        case 'time':
          return d.toLocaleTimeString();
        default:
          return d.toISOString();
      }
    });

    Handlebars.registerHelper('formatCurrency', function(amount: number, currency: string = 'USD') {
      if (typeof amount !== 'number') return amount;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    });

    Handlebars.registerHelper('formatNumber', function(num: number, decimals: number = 0) {
      if (typeof num !== 'number') return num;
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(num);
    });

    Handlebars.registerHelper('truncate', function(str: string, length: number) {
      if (typeof str !== 'string') return str;
      if (str.length <= length) return str;
      return str.substring(0, length) + '...';
    });

    Handlebars.registerHelper('countdown', function(targetDate: string) {
      if (!targetDate) return '';
      const target = new Date(targetDate);
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) return 'Expired';
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${days}d ${hours}h ${minutes}m`;
    });

    Handlebars.registerHelper('isExpired', function(targetDate: string) {
      if (!targetDate) return false;
      const target = new Date(targetDate);
      const now = new Date();
      return target.getTime() <= now.getTime();
    });
  }

  async renderTemplate(options: TemplateRenderOptions): Promise<RenderedTemplate> {
    const { key, locale = 'en', variables } = options;

    try {
      logger.debug({ templateKey: key, locale }, 'Starting template rendering');
      console.log('🔧 DATABASE TEMPLATE ENGINE - Starting render:', { key, locale, variables });

      // Load template from database
      const template = await this.loadTemplateFromDatabase(key, locale);
      console.log('🔧 DATABASE TEMPLATE ENGINE - Loading template with key:', key, 'locale:', locale);
      console.log('🔧 DATABASE TEMPLATE ENGINE - Loaded template:', JSON.stringify(template, null, 2));
      
      if (!template) {
        throw new Error(`Template not found: ${key}`);
      }

      // Merge template structure with user variables
      const finalStructure = this.mergeVariables(template.jsonStructure, variables);
      console.log('🔧 DATABASE TEMPLATE ENGINE - Final structure:', JSON.stringify(finalStructure, null, 2));
      console.log('🔧 DATABASE TEMPLATE ENGINE - Title text:', finalStructure.title?.text);
      console.log('🔧 DATABASE TEMPLATE ENGINE - Body paragraphs:', finalStructure.body?.paragraphs);
      console.log('🔧 DATABASE TEMPLATE ENGINE - Email title:', finalStructure.email_title);

      // Use the main MJML template instead of generating our own
      // Look for the template in both src and dist directories
      let mainTemplatePath = join(this.templatesPath, 'transactional-en.mjml');
      let mjmlTemplate: string;
      
      try {
        mjmlTemplate = readFileSync(mainTemplatePath, 'utf8');
      } catch (error) {
        // Try in src directory if not found in templatesPath
        const srcTemplatePath = join(process.cwd(), 'src', 'templates', 'transactional-en.mjml');
        mjmlTemplate = readFileSync(srcTemplatePath, 'utf8');
        mainTemplatePath = srcTemplatePath;
      }
      
      console.log('🔧 DATABASE TEMPLATE ENGINE - Using main MJML template from:', mainTemplatePath);
      
      // Render with Handlebars using the main template
      const compiledTemplate = Handlebars.compile(mjmlTemplate);
      const renderedMjml = compiledTemplate(finalStructure);
      console.log('🔧 DATABASE TEMPLATE ENGINE - Rendered MJML preview:', renderedMjml.substring(0, 500) + '...');

      // Convert MJML to HTML
      const mjmlResult = mjml(renderedMjml, {
        validationLevel: 'soft'
      });

      if (mjmlResult.errors.length > 0) {
        logger.warn({ errors: mjmlResult.errors }, 'MJML compilation warnings');
      }

      const result: RenderedTemplate = {
        html: mjmlResult.html
      };

      // Generate text version
      const textContent = this.generateTextFromJson(finalStructure);
      if (textContent) {
        const compiledTextTemplate = Handlebars.compile(textContent);
        result.text = compiledTextTemplate(finalStructure);
      }

      // Generate subject
      const subjectTemplate = this.generateSubjectFromJson(finalStructure);
      if (subjectTemplate) {
        const compiledSubjectTemplate = Handlebars.compile(subjectTemplate);
        result.subject = compiledSubjectTemplate(finalStructure);
      }

      logger.info({ templateKey: key, locale }, 'Template rendered successfully');
      return result;

    } catch (error) {
      logger.error({ error, templateKey: key, locale }, 'Failed to render template');
      throw new Error(`Template rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async loadTemplateFromDatabase(key: string, locale: string): Promise<any> {
    console.log('🔧 LOADING TEMPLATE FROM DATABASE:', { key, locale });
    
    // Check for mock template first (for preview rendering)
    const mockTemplate = this.mockTemplates.get(key);
    if (mockTemplate) {
      console.log('🔧 USING MOCK TEMPLATE FOR PREVIEW');
      // Apply conversion to mock template as well
      const convertedStructure = this.convertOldButtonStructure(mockTemplate.jsonStructure);
      return {
        jsonStructure: convertedStructure
      };
    }
    
    const template = await prisma.template.findUnique({
      where: { key },
      include: {
        locales: {
          where: { locale }
        }
      }
    });

    console.log('🔧 DATABASE QUERY RESULT:', JSON.stringify(template, null, 2));

    if (!template) {
      console.log('🔧 TEMPLATE NOT FOUND IN DATABASE');
      return null;
    }

    // Try to find locale-specific content, fallback to English
    let localeOverrides = template.locales.find(l => l.locale === locale);
    if (!localeOverrides && locale !== 'en') {
      localeOverrides = template.locales.find(l => l.locale === 'en');
    }

    // Merge base structure with locale overrides
    const baseStructure = template.jsonStructure as Record<string, any>;
    const localeStructure = localeOverrides?.jsonStructure as Record<string, any> || {};
    const mergedStructure = this.deepMerge(baseStructure, localeStructure);
    
    // Apply conversion to old button structure
    const convertedStructure = this.convertOldButtonStructure(mergedStructure);
    
    return {
      jsonStructure: convertedStructure
    };
  }

  private mergeVariables(templateStructure: Record<string, any>, userVariables: Record<string, any>): Record<string, any> {
    // Use the variable detector to replace {{}} patterns in the template structure
    const processedStructure = VariableDetector.replaceVariablesInObject(templateStructure, userVariables);
    
    // Start with the processed template structure (preserving user's template content)
    const finalStructure = { ...processedStructure };
    
    // Map database template structure to MJML template variables
    // This ensures the MJML template can access the database template content
    if (finalStructure.title && finalStructure.title.text) {
      finalStructure.email_title = finalStructure.title.text;
    }
    
    if (finalStructure.header && finalStructure.header.tagline) {
      finalStructure.workspace_name = finalStructure.header.tagline;
    }
    
    // Button structure conversion is now handled in loadTemplateFromDatabase
    
    // Override with user variables where they exist (for non-template variables)
    for (const [key, value] of Object.entries(userVariables)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          // Deep merge objects
          (finalStructure as any)[key] = { ...(finalStructure as any)[key], ...value };
        } else {
          // Special handling for title variable - merge into title.text instead of replacing the entire title object
          if (key === 'title' && typeof value === 'string') {
            if (finalStructure.title && typeof finalStructure.title === 'object') {
              finalStructure.title.text = value;
            } else {
              // If title doesn't exist as an object, create it
              finalStructure.title = {
                show: true,
                text: value,
                size: '28px',
                weight: '700',
                color: '#1f2937',
                align: 'center',
                padding: '12px 0px 8px 0px',
                line_height: '36px'
              };
            }
          } else {
            (finalStructure as any)[key] = value;
          }
        }
      }
    }
    
    // Convert old button structure to new structure if needed
    if (finalStructure.actions) {
      if (finalStructure.actions.primaryButton && !finalStructure.actions.primary) {
        finalStructure.actions.primary = {
          show: true,
          label: finalStructure.actions.primaryButton.label || 'Primary Button',
          url: finalStructure.actions.primaryButton.url || '#',
          style: 'button',
          color: finalStructure.actions.primaryButton.backgroundColor || '#3b82f6',
          text_color: finalStructure.actions.primaryButton.textColor || '#ffffff'
        };
      }
      
      if (finalStructure.actions.secondaryButton && !finalStructure.actions.secondary) {
        finalStructure.actions.secondary = {
          show: true,
          label: finalStructure.actions.secondaryButton.label || 'Secondary Button',
          url: finalStructure.actions.secondaryButton.url || '#',
          style: 'button',
          color: finalStructure.actions.secondaryButton.backgroundColor || '#6b7280',
          text_color: finalStructure.actions.secondaryButton.textColor || '#ffffff'
        };
      }
    }
    
    // Handle backward compatibility for footer links (camelCase vs snake_case)
    if (finalStructure.footer) {
      // Convert socialLinks to social_links if needed
      if (finalStructure.footer.socialLinks && !finalStructure.footer.social_links) {
        console.log('🔄 Converting socialLinks to social_links for backward compatibility');
        finalStructure.footer.social_links = finalStructure.footer.socialLinks;
      }
      // Convert legalLinks to legal_links if needed
      if (finalStructure.footer.legalLinks && !finalStructure.footer.legal_links) {
        console.log('🔄 Converting legalLinks to legal_links for backward compatibility');
        finalStructure.footer.legal_links = finalStructure.footer.legalLinks;
      }
      
      // Debug social links processing
      if (finalStructure.footer.social_links) {
        console.log('🔗 Social links found:', finalStructure.footer.social_links);
        console.log('🔗 Social links count:', finalStructure.footer.social_links.length);
      } else {
        console.log('🔗 No social links found in footer');
      }
    }

    // Normalize camelCase to snake_case for sections used by MJML template
    // Header
    if (finalStructure.header) {
      if (finalStructure.header.logoUrl && !finalStructure.header.logo_url) {
        finalStructure.header.logo_url = finalStructure.header.logoUrl;
      }
      if (finalStructure.header.logoAlt && !finalStructure.header.logo_alt) {
        finalStructure.header.logo_alt = finalStructure.header.logoAlt;
      }
    }

    // Body
    if (finalStructure.body) {
      if (finalStructure.body.fontSize && !finalStructure.body.font_size) {
        finalStructure.body.font_size = finalStructure.body.fontSize;
      }
      if (finalStructure.body.lineHeight && !finalStructure.body.line_height) {
        finalStructure.body.line_height = finalStructure.body.lineHeight;
      }
    }

    // Hero
    if (finalStructure.hero) {
      if (finalStructure.hero.imageUrl && !finalStructure.hero.image_url) {
        finalStructure.hero.image_url = finalStructure.hero.imageUrl;
      }
      if (finalStructure.hero.imageAlt && !finalStructure.hero.image_alt) {
        finalStructure.hero.image_alt = finalStructure.hero.imageAlt;
      }
      if (finalStructure.hero.imageWidth && !finalStructure.hero.image_width) {
        finalStructure.hero.image_width = finalStructure.hero.imageWidth;
      }
      if (finalStructure.hero.iconSize && !finalStructure.hero.icon_size) {
        finalStructure.hero.icon_size = finalStructure.hero.iconSize;
      }
    }

    // Visual: progress bars and countdown
    if (finalStructure.visual) {
      // progressBars -> progress_bars with key normalization
      const progressBars = finalStructure.visual.progressBars || finalStructure.visual.progress_bars;
      if (Array.isArray(progressBars)) {
        finalStructure.visual.progress_bars = progressBars.map((bar: any) => {
          const current = bar.currentValue ?? bar.current;
          const max = bar.maxValue ?? bar.max;
          const percentage = bar.percentage ?? (typeof current === 'number' && typeof max === 'number' && max > 0
            ? Math.round((current / max) * 100)
            : undefined);
          return {
            label: bar.label,
            current,
            max,
            unit: bar.unit,
            percentage,
            color: bar.color,
            description: bar.description
          };
        });
        // Remove camelCase collection to avoid ambiguity
        delete finalStructure.visual.progressBars;
      }

      // countdown normalization: targetDate -> target_date; showX -> show_x
      if (finalStructure.visual.countdown) {
        const cd = finalStructure.visual.countdown;
        if (cd.targetDate && !cd.target_date) {
          cd.target_date = cd.targetDate;
        }
        if (cd.showDays !== undefined && cd.show_days === undefined) {
          cd.show_days = cd.showDays;
        }
        if (cd.showHours !== undefined && cd.show_hours === undefined) {
          cd.show_hours = cd.showHours;
        }
        if (cd.showMinutes !== undefined && cd.show_minutes === undefined) {
          cd.show_minutes = cd.showMinutes;
        }
        if (cd.showSeconds !== undefined && cd.show_seconds === undefined) {
          cd.show_seconds = cd.showSeconds;
        }
      }
    }
    
    return finalStructure;
  }

  private deepMerge(target: any, source: any): any {
    if (source === null || source === undefined) {
      return target;
    }

    if (typeof target !== 'object' || typeof source !== 'object') {
      return source;
    }

    if (Array.isArray(target) || Array.isArray(source)) {
      return source;
    }

    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  private fixMalformedHandlebars(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    if (typeof obj === 'string') {
      // Fix malformed Handlebars variables in strings
      if (obj.startsWith('{{') && !obj.endsWith('}}')) {
        const fixed = obj + '}';
        console.log(`🔧 FIXED HANDLEBARS: "${obj}" → "${fixed}"`);
        return fixed;
      }
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.fixMalformedHandlebars(item));
    }
    
    if (typeof obj === 'object') {
      const fixed: any = {};
      for (const [key, value] of Object.entries(obj)) {
        fixed[key] = this.fixMalformedHandlebars(value);
      }
      return fixed;
    }
    
    return obj;
  }

  // This method is no longer used since we now use the main MJML template
  // private generateMjmlFromJson(variables: Record<string, any>): string { ... }

  private getMinimalFallbackTemplate(): string {
    // Minimal fallback template when files don't exist
    return `
<mjml>
  <mj-head>
    <mj-title>{{email_title}}</mj-title>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>{{custom_content}}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
  }

  private getFallbackMjmlTemplate(): string {
    // Fallback MJML template if file is not found
    return `
<mjml>
  <mj-head>
    <mj-title>{{title.text}}</mj-title>
    <mj-preview>{{title.text}}</mj-preview>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>{{title.text}}</mj-text>
        <mj-text>{{#each body.paragraphs}}{{this}}{{/each}}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
  }

  private generateTextFromJson(variables: Record<string, any>): string {
    const textParts = [];
    
    if (variables.title?.text) {
      textParts.push(variables.title.text);
      textParts.push('');
    }
    
    if (variables.body?.paragraphs) {
      if (Array.isArray(variables.body.paragraphs)) {
        variables.body.paragraphs.forEach((paragraph: string) => {
          textParts.push(paragraph);
        });
      } else {
        textParts.push(variables.body.paragraphs);
      }
      textParts.push('');
    }
    
    if (variables.snapshot?.facts) {
      textParts.push(variables.snapshot.title || 'Details:');
      if (Array.isArray(variables.snapshot.facts)) {
        variables.snapshot.facts.forEach((fact: any) => {
          if (fact.label && fact.value) {
            textParts.push(`${fact.label} ${fact.value}`);
          }
        });
      }
      textParts.push('');
    }
    
    if (variables.actions?.primary) {
      const primary = variables.actions.primary;
      if (primary.label && primary.url) {
        textParts.push(`${primary.label}: ${primary.url}`);
      }
    }
    
    if (variables.actions?.secondary) {
      const secondary = variables.actions.secondary;
      if (secondary.label && secondary.url) {
        textParts.push(`${secondary.label}: ${secondary.url}`);
      }
    }
    
    return textParts.join('\n');
  }

  private generateSubjectFromJson(variables: Record<string, any>): string {
    if (variables.title?.text) {
      return variables.title.text;
    }
    
    if (variables.email_title) {
      return variables.email_title;
    }
    
    if (variables.title) {
      return variables.title;
    }
    
    return '{{title}}';
  }

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
      createdAt: template.createdAt,
      updatedAt: template.updatedAt
    }));
  }

  async getTemplate(key: string): Promise<any> {
    // Check for mock template first (for preview rendering)
    const mockTemplate = this.mockTemplates.get(key);
    if (mockTemplate) {
      return {
        key: mockTemplate.key,
        name: 'Preview Template',
        description: 'Mock template for preview',
        category: 'preview',
        variableSchema: {},
        jsonStructure: mockTemplate.jsonStructure,
        locales: []
      };
    }

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

  async getTemplateForCreation(key: string): Promise<any> {
    // Check for any template with this key (active or inactive)
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

  async deleteTemplate(key: string): Promise<void> {
    await prisma.template.delete({
      where: { key }
    });
  }

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

  async validateTemplateVariables(templateKey: string, variables: Record<string, any>): Promise<any> {
    const template = await prisma.template.findUnique({
      where: { key: templateKey }
    });

    if (!template) {
      throw new Error(`Template not found: ${templateKey}`);
    }

    // Basic validation - can be enhanced with JSON Schema validation
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
              message: `Field '${field}' must be a string`
            });
          } else if (fieldDef.type === 'number' && typeof value !== 'number') {
            errors.push({
              field,
              message: `Field '${field}' must be a number`
            });
          } else if (fieldDef.type === 'boolean' && typeof value !== 'boolean') {
            errors.push({
              field,
              message: `Field '${field}' must be a boolean`
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
