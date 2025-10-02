/**
 * Shared utility functions for template controllers
 */

/**
 * Validate locale format
 */
export function validateLocale(locale: string): boolean {
  // Allow __base__ as a special locale for base template
  if (locale === '__base__') {
    return true;
  }
  
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

/**
 * Validates fallback syntax to prevent nested variable errors
 * @param obj - The template structure to validate
 * @param path - Current path in the object (for error reporting)
 * @returns Validation result with details about any issues found
 */
export function validateFallbackSyntax(obj: any, path: string = ''): { valid: boolean; message?: string; details?: any } {
  if (obj === null || obj === undefined) {
    return { valid: true };
  }
  
  if (typeof obj === 'string') {
    // Check for nested {{}} patterns in fallback values
    // Look for patterns like {{variable|fallback with {{nested}} content}}
    const fallbackPattern = /\{\{([^|}]+)\|([^}]*\{\{[^}]*\}\}[^}]*)\}\}/g;
    let match;
    
    while ((match = fallbackPattern.exec(obj)) !== null) {
      const variable = match[1].trim();
      const fallback = match[2].trim();
      
      return {
        valid: false,
        message: 'Nested variables in fallback values are not allowed',
        details: {
          path: path || 'root',
          variable: variable,
          fallback: fallback,
          issue: 'Fallback value contains nested {{variable}} syntax which causes Handlebars parsing errors',
          fix: 'Use separate variables instead of nested fallbacks'
        }
      };
    }
    
    return { valid: true };
  }
  
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const itemPath = path ? `${path}[${i}]` : `[${i}]`;
      const result = validateFallbackSyntax(obj[i], itemPath);
      if (!result.valid) {
        return result;
      }
    }
    return { valid: true };
  }
  
  if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const keyPath = path ? `${path}.${key}` : key;
      const result = validateFallbackSyntax(obj[key], keyPath);
      if (!result.valid) {
        return result;
      }
    }
    return { valid: true };
  }
  
  return { valid: true };
}

