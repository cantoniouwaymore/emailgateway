/**
 * Template Renderer
 * Handles MJML and Handlebars rendering
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import mjml from 'mjml';
import { logger } from '../../utils/logger';

export class TemplateRenderer {
  private templatesPath: string;

  constructor(templatesPath?: string) {
    this.templatesPath = templatesPath || join(__dirname, '..', 'templates');
  }

  /**
   * Render template using MJML and Handlebars
   */
  async render(finalStructure: Record<string, any>): Promise<{ html: string; text?: string; subject?: string }> {
    // Use the main MJML template
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
    
    // Process the MJML template with Handlebars
    const handlebarsTemplate = Handlebars.compile(mjmlTemplate);
    const processedMJML = handlebarsTemplate(finalStructure);
    
    console.log('🔧 DATABASE TEMPLATE ENGINE - Processed MJML length:', processedMJML.length);
    console.log('🔧 DATABASE TEMPLATE ENGINE - First 500 chars of MJML:', processedMJML.substring(0, 500));
    
    // Render MJML to HTML
    const mjmlResult = mjml(processedMJML, {
      minify: false,
      validationLevel: 'soft'
    });
    
    if (mjmlResult.errors.length > 0) {
      console.error('🔧 MJML ERRORS:', mjmlResult.errors);
      logger.warn({ errors: mjmlResult.errors }, 'MJML rendering produced errors');
    }
    
    console.log('🔧 DATABASE TEMPLATE ENGINE - Rendered HTML length:', mjmlResult.html.length);
    console.log('🔧 DATABASE TEMPLATE ENGINE - Rendering successful');
    
    return {
      html: mjmlResult.html,
      text: this.generatePlainText(finalStructure),
      subject: finalStructure.email_title || finalStructure.title?.text
    };
  }

  /**
   * Generate plain text version of email
   */
  private generatePlainText(structure: Record<string, any>): string {
    let text = '';
    
    // Title
    if (structure.title && structure.title.text) {
      text += `${structure.title.text}\n\n`;
    }
    
    // Body paragraphs
    if (structure.body && structure.body.paragraphs) {
      if (Array.isArray(structure.body.paragraphs)) {
        text += structure.body.paragraphs.join('\n\n') + '\n\n';
      }
    }
    
    // Primary button
    if (structure.actions && structure.actions.primary) {
      text += `${structure.actions.primary.label}: ${structure.actions.primary.url}\n\n`;
    }
    
    // Secondary button
    if (structure.actions && structure.actions.secondary) {
      text += `${structure.actions.secondary.label}: ${structure.actions.secondary.url}\n\n`;
    }
    
    // Footer
    if (structure.footer) {
      if (structure.footer.tagline) {
        text += `\n${structure.footer.tagline}\n`;
      }
      if (structure.footer.copyright) {
        text += `${structure.footer.copyright}\n`;
      }
    }
    
    return text.trim();
  }
}

