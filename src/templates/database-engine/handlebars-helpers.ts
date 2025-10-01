/**
 * Handlebars Helper Functions for Template Rendering
 * 
 * Registers all custom Handlebars helpers used in email templates
 */

import Handlebars from 'handlebars';
import { logger } from '../../utils/logger';

/**
 * Register all Handlebars helpers
 */
export function registerHandlebarsHelpers(): void {
  // Comparison helpers
  Handlebars.registerHelper('eq', function(this: any, a: any, b: any) {
    return a === b;
  });
  
  Handlebars.registerHelper('gt', function(this: any, a: any, b: any) {
    return a > b;
  });

  Handlebars.registerHelper('ne', function(this: any, a: any, b: any) {
    return a !== b;
  });

  Handlebars.registerHelper('lt', function(this: any, a: any, b: any) {
    return a < b;
  });

  // Logical helpers
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

  // Date formatting helpers
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

  // Number formatting helpers
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

  // String helpers
  Handlebars.registerHelper('truncate', function(str: string, length: number) {
    if (typeof str !== 'string') return str;
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  });

  // Countdown helper
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

  // Expiry check helper
  Handlebars.registerHelper('isExpired', function(targetDate: string) {
    if (!targetDate) return false;
    const target = new Date(targetDate);
    const now = new Date();
    return target.getTime() <= now.getTime();
  });

  logger.info('Handlebars helpers registered successfully');
}

