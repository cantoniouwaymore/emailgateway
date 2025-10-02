/**
 * Variable Merger
 * Handles merging template structures with user variables and normalization
 */

import { VariableDetector } from '../../utils/variable-detector';

export class VariableMerger {
  /**
   * Merge template structure with user variables
   */
  mergeVariables(templateStructure: Record<string, any>, userVariables: Record<string, any>): Record<string, any> {
    // Use the variable detector to replace {{}} patterns in the template structure
    const processedStructure = VariableDetector.replaceVariablesInObject(templateStructure, userVariables);
    
    // Start with the processed template structure (preserving user's template content)
    const finalStructure = { ...processedStructure };
    
    // Map database template structure to MJML template variables
    if (finalStructure.title && finalStructure.title.text) {
      finalStructure.email_title = finalStructure.title.text;
    }
    
    if (finalStructure.header && finalStructure.header.tagline) {
      finalStructure.workspace_name = finalStructure.header.tagline;
    }
    
    // Override with user variables where they exist
    for (const [key, value] of Object.entries(userVariables)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          // Deep merge objects
          (finalStructure as any)[key] = { ...(finalStructure as any)[key], ...value };
        } else {
          // Special handling for title variable
          if (key === 'title' && typeof value === 'string') {
            if (finalStructure.title && typeof finalStructure.title === 'object') {
              finalStructure.title.text = value;
            } else {
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
    
    // Normalize footer links
    this.normalizeFooterLinks(finalStructure);
    
    // Normalize case for all sections
    this.normalizeSectionCase(finalStructure);
    
    return finalStructure;
  }

  /**
   * Convert old button structure to new structure
   */
  convertOldButtonStructure(jsonStructure: any): any {
    if (!jsonStructure.actions) {
      return jsonStructure;
    }

    const converted = { ...jsonStructure };
    
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

  /**
   * Normalize footer links (camelCase to snake_case)
   */
  private normalizeFooterLinks(structure: any): void {
    if (!structure.footer) return;
    
    // Convert socialLinks to social_links if needed
    if (structure.footer.socialLinks && !structure.footer.social_links) {
      console.log('🔄 Converting socialLinks to social_links for backward compatibility');
      structure.footer.social_links = structure.footer.socialLinks;
    }
    
    // Convert legalLinks to legal_links if needed
    if (structure.footer.legalLinks && !structure.footer.legal_links) {
      console.log('🔄 Converting legalLinks to legal_links for backward compatibility');
      structure.footer.legal_links = structure.footer.legalLinks;
    }
    
    // Debug social links
    if (structure.footer.social_links) {
      console.log('🔗 Social links found:', structure.footer.social_links);
      console.log('🔗 Social links count:', structure.footer.social_links.length);
    }
  }

  /**
   * Normalize camelCase to snake_case for sections
   */
  private normalizeSectionCase(structure: any): void {
    // Header
    if (structure.header) {
      if (structure.header.logoUrl && !structure.header.logo_url) {
        structure.header.logo_url = structure.header.logoUrl;
      }
      if (structure.header.logoAlt && !structure.header.logo_alt) {
        structure.header.logo_alt = structure.header.logoAlt;
      }
    }

    // Body
    if (structure.body) {
      if (structure.body.fontSize && !structure.body.font_size) {
        structure.body.font_size = structure.body.fontSize;
      }
      if (structure.body.lineHeight && !structure.body.line_height) {
        structure.body.line_height = structure.body.lineHeight;
      }
    }

    // Hero
    if (structure.hero) {
      if (structure.hero.imageUrl && !structure.hero.image_url) {
        structure.hero.image_url = structure.hero.imageUrl;
      }
      if (structure.hero.imageAlt && !structure.hero.image_alt) {
        structure.hero.image_alt = structure.hero.imageAlt;
      }
      if (structure.hero.imageWidth && !structure.hero.image_width) {
        structure.hero.image_width = structure.hero.imageWidth;
      }
      if (structure.hero.iconSize && !structure.hero.icon_size) {
        structure.hero.icon_size = structure.hero.iconSize;
      }
    }

    // Visual: progress bars and countdown
    if (structure.visual) {
      const progressBars = structure.visual.progressBars || structure.visual.progress_bars;
      if (Array.isArray(progressBars)) {
        structure.visual.progress_bars = progressBars.map((bar: any) => {
          const current = bar.currentValue ?? bar.current;
          const max = bar.maxValue ?? bar.max;
          
          // Convert to numbers for percentage calculation
          const currentNum = typeof current === 'string' ? parseFloat(current) : current;
          const maxNum = typeof max === 'string' ? parseFloat(max) : max;
          
          const percentage = bar.percentage ?? (
            typeof currentNum === 'number' && typeof maxNum === 'number' && maxNum > 0
              ? Math.round((currentNum / maxNum) * 100)
              : undefined
          );
          
          
          return {
            label: bar.label,
            current,
            max,
            unit: bar.unit,
            percentage,
            color: bar.color || '#3b82f6',
            description: bar.description
          };
        });
      }
      
      // Countdown normalization
      if (structure.visual.countdown) {
        if (structure.visual.countdown.targetDate && !structure.visual.countdown.target_date) {
          structure.visual.countdown.target_date = structure.visual.countdown.targetDate;
        }
        if (structure.visual.countdown.showDays !== undefined && structure.visual.countdown.show_days === undefined) {
          structure.visual.countdown.show_days = structure.visual.countdown.showDays;
        }
        if (structure.visual.countdown.showHours !== undefined && structure.visual.countdown.show_hours === undefined) {
          structure.visual.countdown.show_hours = structure.visual.countdown.showHours;
        }
        if (structure.visual.countdown.showMinutes !== undefined && structure.visual.countdown.show_minutes === undefined) {
          structure.visual.countdown.show_minutes = structure.visual.countdown.showMinutes;
        }
        if (structure.visual.countdown.showSeconds !== undefined && structure.visual.countdown.show_seconds === undefined) {
          structure.visual.countdown.show_seconds = structure.visual.countdown.showSeconds;
        }
      }
    }

    // Theme
    if (structure.theme) {
      if (structure.theme.fontFamily && !structure.theme.font_family) {
        structure.theme.font_family = structure.theme.fontFamily;
      }
      if (structure.theme.fontSize && !structure.theme.font_size) {
        structure.theme.font_size = structure.theme.fontSize;
      }
      if (structure.theme.textColor && !structure.theme.text_color) {
        structure.theme.text_color = structure.theme.textColor;
      }
      if (structure.theme.headingColor && !structure.theme.heading_color) {
        structure.theme.heading_color = structure.theme.headingColor;
      }
      if (structure.theme.backgroundColor && !structure.theme.background_color) {
        structure.theme.background_color = structure.theme.backgroundColor;
      }
      if (structure.theme.bodyBackground && !structure.theme.body_background) {
        structure.theme.body_background = structure.theme.bodyBackground;
      }
      if (structure.theme.mutedTextColor && !structure.theme.muted_text_color) {
        structure.theme.muted_text_color = structure.theme.mutedTextColor;
      }
      if (structure.theme.primaryButtonColor && !structure.theme.primary_button_color) {
        structure.theme.primary_button_color = structure.theme.primaryButtonColor;
      }
      if (structure.theme.primaryButtonTextColor && !structure.theme.primary_button_text_color) {
        structure.theme.primary_button_text_color = structure.theme.primaryButtonTextColor;
      }
    }
  }

  /**
   * Deep merge two objects
   */
  deepMerge(base: any, override: any): any {
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
}

