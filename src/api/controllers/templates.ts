import { FastifyRequest, FastifyReply } from 'fastify';
import { TemplateEngine } from '../../templates/engine';
import { logger } from '../../utils/logger';
import { VariableDetector } from '../../utils/variable-detector';

export class TemplateController {
  private templateEngine: TemplateEngine;

  constructor() {
    try {
      console.log('🔧 Creating TemplateController...');
      this.templateEngine = new TemplateEngine();
      console.log('✅ TemplateController created successfully');
      
      // Set up cache cleanup if caching is enabled
      if (process.env.TEMPLATE_CACHE_ENABLED === 'true') {
        setInterval(() => {
          this.templateEngine.cleanExpiredCache();
        }, 5 * 60 * 1000); // Every 5 minutes
      }
    } catch (error) {
      console.error('❌ Error creating TemplateController:', error);
      throw error;
    }
  }

  private validateLocale(locale: string): boolean {
    // Validate ISO 639-1 language codes (2-letter codes like 'en', 'es', 'fr')
    const iso639_1Pattern = /^[a-z]{2}$/;
    
    // Common language codes we support
    const supportedLocales = [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi',
      'nl', 'sv', 'da', 'no', 'fi', 'pl', 'tr', 'cs', 'sk', 'hu', 'ro', 'bg',
      'hr', 'sl', 'et', 'lv', 'lt', 'el', 'mt', 'cy', 'ga', 'is', 'fo', 'eu'
    ];
    
    return iso639_1Pattern.test(locale.toLowerCase()) && 
           supportedLocales.includes(locale.toLowerCase());
  }

  // GET /api/v1/templates
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

  // GET /api/v1/templates/{key}
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

  // POST /api/v1/templates
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
      
      // Set default locale to 'en' if not provided
      const locale = templateData.locale || 'en';
      
      // Validate locale format
      if (!this.validateLocale(locale)) {
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
      reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create template',
          traceId: request.id
        }
      });
    }
  }

  // PUT /api/v1/templates/{key}
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

  // DELETE /api/v1/templates/{key}
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

  // POST /api/v1/templates/{key}/locales
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
      if (!this.validateLocale(locale)) {
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

  // PUT /api/v1/templates/{key}/locales/{locale}
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
      if (!this.validateLocale(locale)) {
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

  // DELETE /api/v1/templates/{key}/locales/{locale}
  async deleteLocale(request: FastifyRequest<{ Params: { key: string, locale: string } }>, reply: FastifyReply) {
    try {
      const { key, locale } = request.params;
      
      // Validate locale format
      if (!this.validateLocale(locale)) {
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

  // POST /api/v1/templates/{key}/validate
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

  // GET /api/v1/templates/{key}/variables
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
          example: this.generateExampleVariables(variableSchema)
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

  // GET /api/v1/templates/{key}/variables
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


  // GET /api/v1/templates/{key}/docs
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

      const documentation = this.generateTemplateDocumentation(template);
      
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

  // GET /api/v1/templates/{key}/preview
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
          templateVariables = this.generateTemplatePlaceholders(template.variableSchema);
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

  private generateTemplatePlaceholders(variableSchema: any): Record<string, any> {
    const placeholders: Record<string, any> = {};
    
    if (variableSchema?.properties) {
      for (const [key, schema] of Object.entries(variableSchema.properties)) {
        const fieldSchema = schema as any;
        
        if (fieldSchema.type === 'string') {
          placeholders[key] = this.getDemonstrationValue(key, 'string');
        } else if (fieldSchema.type === 'number') {
          placeholders[key] = this.getDemonstrationValue(key, 'number');
        } else if (fieldSchema.type === 'boolean') {
          placeholders[key] = this.getDemonstrationValue(key, 'boolean');
        } else if (fieldSchema.type === 'object') {
          // Recursively generate placeholders for nested objects
          placeholders[key] = this.generateTemplatePlaceholders(fieldSchema);
        } else if (fieldSchema.type === 'array') {
          // Generate demonstration values for arrays
          placeholders[key] = this.getDemonstrationArray(key);
        }
      }
    }
    
    return placeholders;
  }

  private getDemonstrationValue(key: string, type: string): any {
    // Create meaningful demonstration values that show what the template can do
    const demonstrations: Record<string, any> = {
      // Header values
      'logo_url': 'https://example.com/your-logo.png',
      'logo_alt': 'Your Company Logo',
      'tagline': 'Your Company Tagline',
      
      // Title values
      'text': 'Your Email Title Here',
      'size': '32px',
      'weight': '700',
      'title_color': '#1f2937',
      'align': 'center',
      
      // Body values
      'font_size': '16px',
      'line_height': '26px',
      'body_color': '#374151',
      
      // Button values
      'label': 'Your Button Text',
      'url': 'https://example.com/your-link',
      'style': 'button',
      'button_color': '#3b82f6',
      'text_color': '#ffffff',
      
      // Snapshot values
      'snapshot_title': 'Your Section Title',
      'snapshot_style': 'table',
      
      // Countdown values
      'message': 'Your Countdown Message',
      'target_date': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      'show_days': true,
      'show_hours': true,
      'show_minutes': true,
      'show_seconds': false,
      
      // Support values
      'support_title': 'Need Help?',
      
      // Footer values
      'width': '120px',
      'alt': 'Your Company Logo',
      'footer_tagline': 'Your Company Tagline',
      'copyright': '© 2024 Your Company. All rights reserved.',
      
      // Theme values
      'font_family': "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      'theme_font_size': '16px',
      'theme_text_color': '#374151',
      'heading_color': '#1f2937',
      'background_color': '#ffffff',
      'body_background': '#f8fafc',
      'border_color': '#e5e7eb',
      'muted_text_color': '#6b7280',
      'primary_button_color': '#3b82f6',
      'primary_button_text_color': '#ffffff',
      'secondary_button_color': '#6b7280',
      'secondary_button_text_color': '#ffffff'
    };

    if (demonstrations[key]) {
      return demonstrations[key];
    }

    // Fallback based on type
    switch (type) {
      case 'string':
        return `Your ${key.replace(/_/g, ' ')} here`;
      case 'number':
        return 0;
      case 'boolean':
        return true;
      default:
        return `{{${key}}}`;
    }
  }

  private getDemonstrationArray(key: string): any[] {
    const arrayDemonstrations: Record<string, any[]> = {
      'paragraphs': [
        'This is your first paragraph. Replace this with your actual content.',
        'This is your second paragraph. You can customize the text, styling, and layout.',
        'Add as many paragraphs as needed to tell your story effectively.'
      ],
      'facts': [
        { label: 'Feature 1', value: 'Your Value Here' },
        { label: 'Feature 2', value: 'Another Value' },
        { label: 'Feature 3', value: 'Third Value' }
      ],
      'links': [
        { label: 'Documentation', url: 'https://example.com/docs' },
        { label: 'Support', url: 'https://example.com/support' },
        { label: 'Contact', url: 'mailto:support@example.com' }
      ],
      'social_links': [
        { platform: 'twitter', url: 'https://twitter.com/yourcompany' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/yourcompany' },
        { platform: 'facebook', url: 'https://facebook.com/yourcompany' }
      ],
      'legal_links': [
        { label: 'Privacy Policy', url: 'https://example.com/privacy' },
        { label: 'Terms of Service', url: 'https://example.com/terms' },
        { label: 'Unsubscribe', url: 'https://example.com/unsubscribe' }
      ],
      'progress_bars': [
        {
          label: 'Project Progress',
          current: 75,
          max: 100,
          unit: '%',
          percentage: 75,
          color: '#10b981',
          description: '75% complete'
        }
      ]
    };

    return arrayDemonstrations[key] || [
      { label: 'Item 1', value: 'Value 1' },
      { label: 'Item 2', value: 'Value 2' }
    ];
  }

  private generateExampleVariables(variableSchema: any): Record<string, any> {
    const example: Record<string, any> = {};
    
    if (variableSchema?.properties) {
      for (const [key, schema] of Object.entries(variableSchema.properties)) {
        const fieldSchema = schema as any;
        if (fieldSchema.example) {
          example[key] = fieldSchema.example;
        } else if (fieldSchema.default !== undefined) {
          example[key] = fieldSchema.default;
        } else if (fieldSchema.type === 'string') {
          example[key] = `{{${key}}}`;
        } else if (fieldSchema.type === 'number') {
          example[key] = 0;
        } else if (fieldSchema.type === 'boolean') {
          example[key] = true;
        } else if (fieldSchema.type === 'object') {
          // Recursively generate example variables for nested objects
          example[key] = this.generateExampleVariables(fieldSchema);
          
          // Add specific examples for known object types
          if (key === 'primary' && example[key]) {
            example[key] = {
              label: "Update Payment Method",
              url: "https://app.waymore.io/billing/payment-methods",
              style: "solid",
              color: "#dc2626",
              text_color: "#ffffff"
            };
          } else if (key === 'secondary' && example[key]) {
            example[key] = {
              label: "Contact Support",
              url: "mailto:billing@waymore.io",
              style: "outline",
              color: "#6b7280",
              text_color: "#6b7280"
            };
          } else if (key === 'countdown' && example[key]) {
            // Use the schema defaults for countdown instead of hardcoded values
            example[key] = this.generateExampleVariables(fieldSchema);
          }
        } else if (fieldSchema.type === 'array') {
          // Generate example content for arrays based on the field name
          if (key === 'paragraphs') {
            example[key] = [
              "Your payment has failed and requires immediate attention.",
              "We were unable to process your payment for the Pro plan subscription. This may be due to an expired card, insufficient funds, or a temporary issue with your bank.",
              "Please update your payment method to avoid service interruption. Your account will remain active for 7 days while you resolve this issue."
            ];
          } else if (key === 'facts') {
            example[key] = [
              {"label": "Transaction ID", "value": "TXN-12345"},
              {"label": "Amount", "value": "$29.99"},
              {"label": "Plan", "value": "Pro Monthly"},
              {"label": "Payment Method", "value": "**** 4242"},
              {"label": "Failure Reason", "value": "Insufficient funds"},
              {"label": "Next Retry", "value": "Tomorrow at 2:00 PM"}
            ];
          } else if (key === 'links') {
            example[key] = [
              {"label": "Payment FAQ", "url": "https://waymore.io/payment-faq"},
              {"label": "Contact Support", "url": "https://waymore.io/support"},
              {"label": "Billing Help", "url": "https://waymore.io/billing-help"}
            ];
          } else if (key === 'progress_bars') {
            example[key] = [
              {
                "label": "Account Status",
                "current": 7,
                "max": 7,
                "unit": "days",
                "percentage": 100,
                "color": "#ef4444",
                "description": "Grace period remaining"
              },
              {
                "label": "Payment Retries",
                "current": 2,
                "max": 3,
                "unit": "attempts",
                "percentage": 67,
                "color": "#f59e0b",
                "description": "Automatic retry attempts"
              }
            ];
          } else if (key === 'social_links') {
            example[key] = [
              {"platform": "twitter", "url": "https://twitter.com/waymore"},
              {"platform": "linkedin", "url": "https://linkedin.com/company/waymore"},
              {"platform": "github", "url": "https://github.com/waymore"},
              {"platform": "facebook", "url": "https://facebook.com/waymore"}
            ];
          } else if (key === 'legal_links') {
            example[key] = [
              {"label": "Privacy Policy", "url": "https://waymore.io/privacy"},
              {"label": "Terms of Service", "url": "https://waymore.io/terms"},
              {"label": "Unsubscribe", "url": "https://waymore.io/unsubscribe?token=abc123"}
            ];
          } else {
            example[key] = [];
          }
        }
      }
    }
    
    return example;
  }

  private generateTemplateDocumentation(template: any): any {
    return {
      overview: template.description || `Template: ${template.name}`,
      requiredVariables: this.extractRequiredVariables(template.variableSchema),
      optionalVariables: this.extractOptionalVariables(template.variableSchema),
      examples: this.generateExamples(template),
      sections: this.extractSections(template.jsonStructure)
    };
  }

  private extractRequiredVariables(schema: any): any[] {
    if (!schema?.required) return [];
    
    return schema.required.map((field: string) => {
      const fieldSchema = schema.properties?.[field];
      return {
        name: field,
        type: fieldSchema?.type || 'string',
        description: fieldSchema?.description || '',
        example: fieldSchema?.example || ''
      };
    });
  }

  private extractOptionalVariables(schema: any): any[] {
    if (!schema?.properties) return [];
    
    const required = schema.required || [];
    return Object.entries(schema.properties)
      .filter(([key]) => !required.includes(key))
      .map(([key, fieldSchema]) => {
        const field = fieldSchema as any;
        return {
          name: key,
          type: field.type || 'string',
          description: field.description || '',
          example: field.example || ''
        };
      });
  }

  private generateExamples(template: any): any[] {
    return [
      {
        name: 'Basic Example',
        variables: this.generateExampleVariables(template.variableSchema)
      },
      {
        name: 'Full Featured Example',
        variables: {
          ...this.generateExampleVariables(template.variableSchema),
          header: {
            logo_url: 'https://example.com/logo.png',
            tagline: 'Your Company Tagline'
          },
          title: {
            text: 'Welcome to {{workspace_name}}!',
            color: '#1f2937'
          },
          body: {
            paragraphs: [
              'Hello {{user_firstname}}, welcome to {{workspace_name}}!',
              'Your account is ready to use.'
            ]
          }
        }
      }
    ];
  }

  private extractSections(jsonStructure: any): any[] {
    if (!jsonStructure || typeof jsonStructure !== 'object') return [];
    
    return Object.entries(jsonStructure).map(([key, value]) => ({
      name: key,
      type: typeof value,
      description: this.getSectionDescription(key),
      required: false
    }));
  }

  private getSectionDescription(sectionName: string): string {
    const descriptions: Record<string, string> = {
      header: 'Header section with logo and tagline',
      hero: 'Hero section with image or icon',
      title: 'Email title section',
      body: 'Main body content with paragraphs',
      snapshot: 'Facts/summary table section',
      visual: 'Visual elements like progress bars or countdowns',
      actions: 'Call-to-action buttons',
      support: 'Support links and FAQ',
      footer: 'Footer with social links and legal information',
      theme: 'Complete theme customization'
    };
    
    return descriptions[sectionName] || 'Template section';
  }

  // Generate template preview HTML using MJML template engine
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
      const { DatabaseTemplateEngine } = require('../../templates/database-engine');
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
      
      const rendered = await dbEngine.renderTemplate({
        key: 'preview-template',
        locale: 'en',
        variables: variables || {}
      });
      
      console.log('🔍 Preview generation - rendered HTML length:', rendered.html?.length || 0);

      // Wrap the preview HTML with Font Awesome CSS for proper icon rendering
      const previewWithCSS = `
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
          <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            .preview-container { max-width: 600px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="preview-container">
            ${rendered.html}
          </div>
        </body>
        </html>
      `;

      return reply.send({
        success: true,
        preview: previewWithCSS
      });

    } catch (error) {
      console.error('Error generating template preview:', error);
      return reply.code(500).send({
        error: 'Failed to generate template preview',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private generatePreviewHTML(templateStructure: any, variables: Record<string, any> = {}): string {
    // Replace variables in the template structure
    const processedStructure = this.replaceVariables(templateStructure, variables);

    let html = '<div class="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden font-sans">';

    // Header Section
    if (processedStructure.header) {
      html += `
        <div class="py-3 px-5">
          <div class="text-center">
            ${processedStructure.header.logoUrl ? 
              `<img src="${processedStructure.header.logoUrl}" alt="${processedStructure.header.logoAlt || 'Logo'}" style="width: 100%; max-width: 180px; height: auto; border-radius: 8px; display: block; margin: 0 auto;" width="180">` :
              `<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <i class="fas fa-envelope text-purple-600 text-xl"></i>
              </div>`
            }
            ${processedStructure.header.tagline ? 
              `<p class="text-sm text-gray-600 mt-2" style="font-size: 14px; color: #6b7280; text-align: center; margin: 8px 0 0 0;">${processedStructure.header.tagline}</p>` : 
              ''
            }
          </div>
        </div>
      `;
    }

    html += '<div class="p-6">';

    // Hero Section
    if (processedStructure.hero && processedStructure.hero.type !== 'none') {
      html += '<div class="text-center mb-6">';
      if (processedStructure.hero.type === 'icon') {
        const iconSize = processedStructure.hero.iconSize || '48px';
        html += `<div class="text-6xl mb-4" style="font-size: ${iconSize}">${processedStructure.hero.icon || '🎨'}</div>`;
      } else if (processedStructure.hero.type === 'image' && processedStructure.hero.imageUrl) {
        const imageWidth = processedStructure.hero.imageWidth || '120px';
        html += `
          <img src="${processedStructure.hero.imageUrl}" 
               alt="${processedStructure.hero.imageAlt || 'Hero Image'}" 
               style="width: ${imageWidth}; height: auto; border-radius: 12px; display: block; margin: 0 auto;" 
               width="${imageWidth}" />
        `;
      }
      html += '</div>';
    }

    // Title Section
    if (processedStructure.title) {
      const titleStyle = `
        color: ${processedStructure.title.color || '#1f2937'};
        font-size: ${processedStructure.title.size || '28px'};
        font-weight: ${processedStructure.title.weight || '700'};
        line-height: 36px;
        text-align: center;
      `;
      html += `
        <h1 class="mb-4" style="${titleStyle}">
          ${processedStructure.title.text || '{{title}}'}
        </h1>
      `;
    }

    // Body Section
    if (processedStructure.body && processedStructure.body.paragraphs) {
      processedStructure.body.paragraphs.forEach((paragraph: string, index: number) => {
        const padding = index === 0 ? '0px 20px' : '6px 20px 0px 20px';
        html += `<p class="mb-4" style="font-size: 16px; line-height: 26px; color: #374151; padding: ${padding};">${paragraph || '{{bodyText}}'}</p>`;
      });
    }

    // Snapshot Section
    if (processedStructure.snapshot) {
      html += '<div class="my-6">';
      if (processedStructure.snapshot.title) {
        html += `<h3 class="text-center mb-4" style="font-size: 18px; font-weight: 600; color: #1f2937;">${processedStructure.snapshot.title}</h3>`;
      }
      if (processedStructure.snapshot.facts) {
        html += '<div class="px-6">';
        html += '<table style="width: 100%; border-collapse: collapse; color: #000000; font-family: Inter, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 22px;">';
        processedStructure.snapshot.facts.forEach((fact: any, index: number) => {
          const isLast = index === processedStructure.snapshot.facts.length - 1;
          const borderStyle = isLast ? 'border-bottom: 1px solid #e5e7eb; border-radius: 8px 8px 8px 8px;' : 'border-bottom: 1px solid #e5e7eb;';
          html += `
            <tr style="${borderStyle}">
              <td style="padding: 16px 20px; color: #374151; font-weight: 500; font-size: 15px;">${fact.label || '{{label}}'}</td>
              <td style="padding: 16px 20px; color: #374151; font-size: 15px;">${fact.value || '{{value}}'}</td>
            </tr>
          `;
        });
        html += '</table>';
        html += '</div>';
      }
      html += '</div>';
    }

    // Visual Section
    if (processedStructure.visual) {
      if (processedStructure.visual.type === 'progress') {
        html += '<div class="my-6">';
        processedStructure.visual.progressBars?.forEach((bar: any) => {
          const percentage = bar.maxValue > 0 ? (bar.currentValue / bar.maxValue) * 100 : 0;
          html += `
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-700">${bar.label || '{{progressLabel}}'}</span>
                <span class="text-sm text-gray-600">${bar.currentValue || '{{currentValue}}'} ${bar.unit || '{{unit}}'}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${percentage}%"></div>
              </div>
              ${bar.description ? `<p class="text-xs text-gray-500 mt-1">${bar.description}</p>` : ''}
            </div>
          `;
        });
        html += '</div>';
      } else if (processedStructure.visual.type === 'countdown') {
        html += '<div class="my-6 text-center" style="padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e5e7eb;">';
        html += `<div class="mb-4" style="font-size: 16px; font-weight: 600; color: #1f2937;">${processedStructure.visual.countdown?.message || '{{countdownMessage}}'}</div>`;
        html += '<div style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; padding: 20px 0;">';
        
        // Calculate countdown values
        const targetDate = processedStructure.visual.countdown?.targetDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default to 7 days from now
        const now = new Date();
        const timeDiff = new Date(targetDate).getTime() - now.getTime();
        
        const days = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60 * 24)));
        const hours = Math.max(0, Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const minutes = Math.max(0, Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)));
        const seconds = Math.max(0, Math.floor((timeDiff % (1000 * 60)) / 1000));
        
        if (processedStructure.visual.countdown?.showDays) {
          html += '<div style="text-align: center; padding: 16px 12px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e5e7eb; min-width: 80px;">';
          html += `<div style="font-size: 28px; font-weight: 700; color: #3b82f6; line-height: 1; margin-bottom: 4px;">${days}</div>`;
          html += '<div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600;">Days</div>';
          html += '</div>';
        }
        
        if (processedStructure.visual.countdown?.showHours) {
          html += '<div style="text-align: center; padding: 16px 12px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e5e7eb; min-width: 80px;">';
          html += `<div style="font-size: 28px; font-weight: 700; color: #3b82f6; line-height: 1; margin-bottom: 4px;">${hours}</div>`;
          html += '<div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600;">Hours</div>';
          html += '</div>';
        }
        
        if (processedStructure.visual.countdown?.showMinutes) {
          html += '<div style="text-align: center; padding: 16px 12px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e5e7eb; min-width: 80px;">';
          html += `<div style="font-size: 28px; font-weight: 700; color: #3b82f6; line-height: 1; margin-bottom: 4px;">${minutes}</div>`;
          html += '<div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600;">Minutes</div>';
          html += '</div>';
        }
        
        if (processedStructure.visual.countdown?.showSeconds) {
          html += '<div style="text-align: center; padding: 16px 12px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e5e7eb; min-width: 80px;">';
          html += `<div style="font-size: 28px; font-weight: 700; color: #3b82f6; line-height: 1; margin-bottom: 4px;">${seconds}</div>`;
          html += '<div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600;">Seconds</div>';
          html += '</div>';
        }
        
        html += '</div>';
        html += '</div>';
      }
    }

    // Actions Section
    if (processedStructure.actions) {
      if (processedStructure.actions.primary && processedStructure.actions.secondary) {
        // Two buttons side by side (50% width each)
        html += '<div class="mt-6 flex flex-col sm:flex-row gap-3">';
        html += '<div class="flex-1 pr-2">';
        const primaryStyle = `
          background-color: ${processedStructure.actions.primary.color || '#3b82f6'};
          color: ${processedStructure.actions.primary.text_color || '#ffffff'};
          font-size: 15px;
          font-weight: 600;
          border-radius: 8px;
          padding: 10px 16px;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.2);
        `;
        html += `
          <a href="${processedStructure.actions.primary.url || '#'}" 
             class="block w-full text-center no-underline"
             style="${primaryStyle}">
            ${processedStructure.actions.primary.label || '{{primaryButtonLabel}}'}
          </a>
        `;
        html += '</div>';
        html += '<div class="flex-1 pl-2">';
        const secondaryStyle = `
          background-color: ${processedStructure.actions.secondary.color || '#6b7280'};
          color: ${processedStructure.actions.secondary.text_color || '#ffffff'};
          font-size: 15px;
          font-weight: 600;
          border-radius: 8px;
          padding: 10px 16px;
          box-shadow: 0 4px 6px -1px rgba(107, 114, 128, 0.3), 0 2px 4px -1px rgba(107, 114, 128, 0.2);
        `;
        html += `
          <a href="${processedStructure.actions.secondary.url || '#'}" 
             class="block w-full text-center no-underline"
             style="${secondaryStyle}">
            ${processedStructure.actions.secondary.label || '{{secondaryButtonLabel}}'}
          </a>
        `;
        html += '</div>';
        html += '</div>';
      } else if (processedStructure.actions.primary) {
        // Single primary button
        html += '<div class="mt-6 text-center">';
        const primaryStyle = `
          background-color: ${processedStructure.actions.primary.color || '#3b82f6'};
          color: ${processedStructure.actions.primary.text_color || '#ffffff'};
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          padding: 10px 18px;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.2);
        `;
        html += `
          <a href="${processedStructure.actions.primary.url || '#'}" 
             class="inline-block text-center no-underline"
             style="${primaryStyle}">
            ${processedStructure.actions.primary.label || '{{primaryButtonLabel}}'}
          </a>
        `;
        html += '</div>';
      }
    }

    // Support Section
    if (processedStructure.support) {
      html += '<div class="my-6 text-center">';
      if (processedStructure.support.title) {
        html += `<p class="mb-4" style="font-size: 14px; color: #6b7280;">${processedStructure.support.title}</p>`;
      }
      if (processedStructure.support.links) {
        html += '<p class="mb-4" style="font-size: 14px; color: #6b7280;">';
        processedStructure.support.links.forEach((link: any, index: number) => {
          if (index > 0) html += ' • ';
          html += `<a href="${link.url || '#'}" style="color: #3b82f6; text-decoration: none;">${link.label || '{{linkLabel}}'}</a>`;
        });
        html += '</p>';
      }
      html += '</div>';
    }

    html += '</div>';

    // Footer Section
    if (processedStructure.footer) {
      html += `
        <div class="bg-gray-50 px-6 py-4">
          <!-- Footer Divider -->
          <div style="border-top: 1px solid #e5e7eb; margin: 0 0 20px 0;"></div>
          
          <!-- Footer Logo -->
          ${processedStructure.footer.logo ? `
            <div class="text-center mb-5">
              <img src="${processedStructure.footer.logo.url || 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png'}" 
                   alt="${processedStructure.footer.logo.alt || 'Waymore'}" 
                   style="width: 120px; height: auto; border-radius: 8px; display: block; margin: 0 auto;" />
            </div>
          ` : ''}
          
          <!-- Footer Tagline -->
          ${processedStructure.footer.tagline ? `
            <p class="text-center mb-5" style="font-size: 14px; color: #6b7280; line-height: 22px;">
              ${processedStructure.footer.tagline}
            </p>
          ` : ''}
          
          <!-- Social Links -->
          ${processedStructure.footer.social_links ? `
            <div class="flex justify-center space-x-2 mb-5">
              ${processedStructure.footer.social_links.map((link: any) => `
                <a href="${link.url || '#'}" 
                   style="display: inline-block; padding: 4px; background-color: #f3f4f6; border-radius: 3px; width: 24px; height: 24px; text-align: center;">
                  <i class="fab fa-${link.platform}" style="color: #1f2937; font-size: 12px;"></i>
                </a>
              `).join('')}
            </div>
          ` : ''}
          
          <!-- Legal Links -->
          ${processedStructure.footer.legal_links ? `
            <p class="text-center mb-5" style="font-size: 12px; color: #6b7280; line-height: 20px;">
              ${processedStructure.footer.legal_links.map((link: any, index: number) => 
                `${index > 0 ? ' • ' : ''}<a href="${link.url || '#'}" style="color: #3b82f6; text-decoration: none;">${link.label || '{{linkLabel}}'}</a>`
              ).join('')}
            </p>
          ` : ''}
          
          <!-- Copyright -->
          ${processedStructure.footer.copyright ? `
            <p class="text-center" style="font-size: 12px; color: #6b7280; line-height: 20px;">
              ${processedStructure.footer.copyright}
            </p>
          ` : ''}
        </div>
      `;
    }

    html += '</div>';
    return html;
  }

  private replaceVariables(obj: any, variables: Record<string, any>): any {
    if (typeof obj === 'string') {
      return obj.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
        return variables[varName] || match;
      });
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.replaceVariables(item, variables));
    }
    
    if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.replaceVariables(value, variables);
      }
      return result;
    }
    
    return obj;
  }
}
