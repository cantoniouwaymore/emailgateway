import { FastifyRequest, FastifyReply } from 'fastify';
import { createTraceId } from '../../utils/logger';
import { extractTokenFromRequest, verifyJWT, requireScope } from '../../utils/auth';
import { logger } from '../../utils/logger';
import { 
  TemplateValidationRequest, 
  TemplateValidationResponse, 
  ValidationError, 
  ValidationWarning 
} from '../schemas/template-validation';

export class TemplateValidationController {
  
  async validateTemplate(
    request: FastifyRequest<{ Body: TemplateValidationRequest }>, 
    reply: FastifyReply
  ): Promise<TemplateValidationResponse> {
    const traceId = createTraceId();

    try {
      // Extract and verify JWT
      const token = extractTokenFromRequest(request);
      const payload = verifyJWT(token);
      requireScope('emails:send')(payload);

      const { template, variables } = request.body;

      logger.info({
        traceId,
        templateKey: template.key,
        templateLocale: template.locale
      }, 'Template validation requested');

      const errors: ValidationError[] = [];
      const warnings: ValidationWarning[] = [];

      // Validate template structure
      this.validateTemplateStructure(template, errors);
      
      // Validate required variables
      this.validateRequiredVariables(variables, errors);
      
      // Validate variable types and formats
      this.validateVariableTypes(variables, errors, warnings);
      
      // Check for redundancy
      this.checkForRedundancy(variables, errors, warnings);
      
      // Validate progress bars
      this.validateProgressBars(variables, errors);
      
      // Validate CTAs
      this.validateCTAs(variables, errors);
      
      // Validate social links
      this.validateSocialLinks(variables, errors, warnings);
      
      // Validate footer links
      this.validateFooterLinks(variables, errors, warnings);
      
      // Validate countdown
      this.validateCountdown(variables, errors);
      
      // Validate theme
      this.validateTheme(variables, errors);
      
      // Check best practices
      this.checkBestPractices(variables, warnings);

      const isValid = errors.length === 0;

      logger.info({
        traceId,
        isValid,
        errorCount: errors.length,
        warningCount: warnings.length
      }, 'Template validation completed');

      return {
        valid: isValid,
        errors,
        warnings,
        suggestions: this.generateSuggestions(variables, errors, warnings)
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({
        traceId,
        error: errorMessage
      }, 'Template validation failed');

      if (errorMessage.includes('JWT') || errorMessage.includes('scope')) {
        reply.code(401);
        return {
          valid: false,
          errors: [{
            type: 'missing_required_variable',
            field: 'authentication',
            message: 'Invalid or insufficient permissions'
          }],
          warnings: []
        };
      }

      reply.code(500);
      return {
        valid: false,
        errors: [{
          type: 'missing_required_variable',
          field: 'server',
          message: 'Internal server error'
        }],
        warnings: []
      };
    }
  }

  private validateTemplateStructure(template: any, errors: ValidationError[]): void {
    if (!template.key || template.key !== 'transactional') {
      errors.push({
        type: 'missing_required_variable',
        field: 'template.key',
        message: 'Template key must be "transactional"',
        suggestion: 'Set template.key to "transactional"'
      });
    }

    if (!template.locale) {
      errors.push({
        type: 'missing_required_variable',
        field: 'template.locale',
        message: 'Template locale is required',
        suggestion: 'Set template.locale to "en" or your preferred locale'
      });
    }
  }

  private validateRequiredVariables(variables: any, errors: ValidationError[]): void {
    // Validate object-based structure
    if (variables && typeof variables === 'object') {
      // Check for object-based sections
      const validSections = ['header', 'hero', 'title', 'body', 'snapshot', 'visual', 'actions', 'support', 'footer', 'theme'];
      const providedSections = Object.keys(variables).filter(key => validSections.includes(key));
      
      if (providedSections.length === 0) {
        errors.push({
          type: 'missing_object_structure',
          field: 'variables',
          message: 'No valid object-based sections found',
          suggestion: 'Use structured sections like header, title, body, actions, footer'
        });
      }
    }
  }

  private validateVariableTypes(variables: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Validate image URL
    if (variables.image_url && !this.isValidUrl(variables.image_url)) {
      errors.push({
        type: 'invalid_url',
        field: 'image_url',
        message: 'image_url must be a valid URL',
        suggestion: 'Use a valid URL format like "https://example.com/image.png"'
      });
    }

    // Validate CTA URLs
    if (variables.cta_primary?.url && !this.isValidUrl(variables.cta_primary.url)) {
      errors.push({
        type: 'invalid_url',
        field: 'cta_primary.url',
        message: 'cta_primary.url must be a valid URL',
        suggestion: 'Use a valid URL format'
      });
    }

    if (variables.cta_secondary?.url && !this.isValidUrl(variables.cta_secondary.url)) {
      errors.push({
        type: 'invalid_url',
        field: 'cta_secondary.url',
        message: 'cta_secondary.url must be a valid URL',
        suggestion: 'Use a valid URL format'
      });
    }
  }

  private checkForRedundancy(variables: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (variables.facts && variables.progress_bars) {
      // Check for duplicate information between facts and progress bars
      const factLabels = variables.facts.map((f: any) => f.label.toLowerCase());
      const progressLabels = variables.progress_bars.map((p: any) => p.label.toLowerCase());
      
      const duplicates = factLabels.filter((label: string) => 
        progressLabels.some((pLabel: string) => 
          label.includes('usage') || label.includes('limit') || label.includes('percentage') ||
          pLabel.includes('usage') || pLabel.includes('limit') || pLabel.includes('percentage')
        )
      );

      if (duplicates.length > 0) {
        warnings.push({
          type: 'best_practice_violation',
          field: 'facts and progress_bars',
          message: 'Information is duplicated between facts table and progress bars',
          suggestion: 'Remove duplicate information from facts table, keep progress bars for visual metrics'
        });
      }
    }
  }

  private validateProgressBars(variables: any, errors: ValidationError[]): void {
    if (variables.progress_bars) {
      variables.progress_bars.forEach((bar: any, index: number) => {
        const fieldPrefix = `progress_bars[${index}]`;
        
        if (!bar.max) {
          errors.push({
            type: 'invalid_progress_bar',
            field: `${fieldPrefix}.max`,
            message: 'Progress bar missing required "max" field',
            suggestion: 'Add max value for progress bar'
          });
        }

        if (!bar.unit) {
          errors.push({
            type: 'invalid_progress_bar',
            field: `${fieldPrefix}.unit`,
            message: 'Progress bar missing required "unit" field',
            suggestion: 'Add unit for progress bar (e.g., "emails", "GB", "contacts")'
          });
        }

        if (bar.color && !this.isValidColor(bar.color)) {
          errors.push({
            type: 'invalid_color',
            field: `${fieldPrefix}.color`,
            message: 'Progress bar color must be a valid hex color',
            suggestion: 'Use hex color format like "#FF5733"'
          });
        }
      });
    }
  }

  private validateCTAs(variables: any, errors: ValidationError[]): void {
    if (variables.cta_primary && !variables.cta_primary.label) {
      errors.push({
        type: 'invalid_cta',
        field: 'cta_primary.label',
        message: 'Primary CTA missing label',
        suggestion: 'Add a label for the primary button'
      });
    }

    if (variables.cta_secondary && !variables.cta_secondary.label) {
      errors.push({
        type: 'invalid_cta',
        field: 'cta_secondary.label',
        message: 'Secondary CTA missing label',
        suggestion: 'Add a label for the secondary button'
      });
    }
  }

  private validateSocialLinks(variables: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (variables.social_links) {
      if (variables.social_links.length > 5) {
        errors.push({
          type: 'exceeds_limit',
          field: 'social_links',
          message: 'Too many social links (maximum 5)',
          suggestion: 'Reduce social links to 5 or fewer'
        });
      }

      variables.social_links.forEach((link: any, index: number) => {
        const fieldPrefix = `social_links[${index}]`;
        
        if (!['twitter', 'linkedin', 'github', 'facebook', 'instagram'].includes(link.platform)) {
          errors.push({
            type: 'invalid_social_link',
            field: `${fieldPrefix}.platform`,
            message: 'Invalid social media platform',
            suggestion: 'Use one of: twitter, linkedin, github, facebook, instagram'
          });
        }

        if (!this.isValidUrl(link.url)) {
          errors.push({
            type: 'invalid_url',
            field: `${fieldPrefix}.url`,
            message: 'Social link URL must be valid',
            suggestion: 'Use a valid URL format'
          });
        }
      });
    }
  }

  private validateFooterLinks(variables: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (variables.footer_links) {
      if (variables.footer_links.length > 4) {
        errors.push({
          type: 'exceeds_limit',
          field: 'footer_links',
          message: 'Too many footer links (maximum 4)',
          suggestion: 'Reduce footer links to 4 or fewer'
        });
      }

      variables.footer_links.forEach((link: any, index: number) => {
        const fieldPrefix = `footer_links[${index}]`;
        
        if (!this.isValidUrl(link.url)) {
          errors.push({
            type: 'invalid_url',
            field: `${fieldPrefix}.url`,
            message: 'Footer link URL must be valid',
            suggestion: 'Use a valid URL format'
          });
        }
      });
    }
  }

  private validateCountdown(variables: any, errors: ValidationError[]): void {
    if (variables.countdown) {
      if (!variables.countdown.target_date) {
        errors.push({
          type: 'missing_required_variable',
          field: 'countdown.target_date',
          message: 'Countdown missing target_date',
          suggestion: 'Add target_date in ISO format'
        });
      } else if (!this.isValidDate(variables.countdown.target_date)) {
        errors.push({
          type: 'invalid_date',
          field: 'countdown.target_date',
          message: 'Countdown target_date must be a valid ISO date',
          suggestion: 'Use ISO format like "2024-12-31T23:59:59Z"'
        });
      }
    }
  }

  private validateTheme(variables: any, errors: ValidationError[]): void {
    if (variables.theme) {
      const colorFields = [
        'text_color', 'heading_color', 'background_color', 'body_background',
        'muted_text_color', 'border_color', 'primary_button_color',
        'primary_button_text_color', 'secondary_button_color', 'secondary_button_text_color',
        'dark_background_color', 'dark_text_color', 'dark_heading_color',
        'dark_muted_color', 'dark_border_color', 'dark_card_background'
      ];

      colorFields.forEach(field => {
        if (variables.theme[field] && !this.isValidColor(variables.theme[field])) {
          errors.push({
            type: 'invalid_color',
            field: `theme.${field}`,
            message: 'Theme color must be a valid hex color',
            suggestion: 'Use hex color format like "#FF5733"'
          });
        }
      });
    }
  }

  private checkBestPractices(variables: any, warnings: ValidationWarning[]): void {
    // Check for missing optional but recommended fields
    if (!variables.footer_links) {
      warnings.push({
        type: 'missing_optional_variable',
        field: 'footer_links',
        message: 'Consider adding footer links for better user experience',
        suggestion: 'Add privacy policy, terms of service, and unsubscribe links'
      });
    }

    if (!variables.image_alt && variables.image_url) {
      warnings.push({
        type: 'accessibility_concern',
        field: 'image_alt',
        message: 'Image missing alt text for accessibility',
        suggestion: 'Add image_alt for better accessibility'
      });
    }

    if (variables.custom_content && variables.custom_content.length > 1000) {
      warnings.push({
        type: 'performance_concern',
        field: 'custom_content',
        message: 'Custom content is very long, consider shortening',
        suggestion: 'Keep content concise for better email client compatibility'
      });
    }
  }

  private generateSuggestions(variables: any, errors: ValidationError[], warnings: ValidationWarning[]): string[] {
    const suggestions: string[] = [];

    if (errors.length > 0) {
      suggestions.push('Fix all validation errors before using this template');
    }

    if (warnings.length > 0) {
      suggestions.push('Review warnings for best practices and accessibility');
    }

    if (!variables.footer_links) {
      suggestions.push('Add footer links for legal compliance and user experience');
    }

    if (!variables.theme) {
      suggestions.push('Consider adding theme customization for brand consistency');
    }

    return suggestions;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidColor(color: string): boolean {
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    return colorRegex.test(color);
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}
