/**
 * Utility for detecting {{variableName}} patterns in template JSON structures
 */

export interface DetectedVariable {
  name: string;
  context: string; // e.g., "body.paragraphs[0]", "title.text"
  fallback?: string;
}

export class VariableDetector {
  /**
   * Recursively scan a JSON object to find all {{variableName}} patterns
   * @param obj - The JSON object to scan
   * @param path - Current path in the object (for context)
   * @returns Array of detected variables with their context
   */
  static detectVariables(obj: any, path: string = ''): DetectedVariable[] {
    const variables: DetectedVariable[] = [];
    
    if (obj === null || obj === undefined) {
      return variables;
    }
    
    if (typeof obj === 'string') {
      // Check for {{variableName}} patterns in strings
      const matches = obj.match(/\{\{([^}]+)\}\}/g);
      if (matches) {
        matches.forEach(match => {
          const variableName = match.replace(/\{\{|\}\}/g, '').trim();
          variables.push({
            name: variableName,
            context: path || 'root',
            fallback: this.extractFallback(variableName)
          });
        });
      }
      return variables;
    }
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const itemPath = path ? `${path}[${index}]` : `[${index}]`;
        variables.push(...this.detectVariables(item, itemPath));
      });
    } else if (typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        const keyPath = path ? `${path}.${key}` : key;
        variables.push(...this.detectVariables(obj[key], keyPath));
      });
    }
    
    return variables;
  }
  
  /**
   * Get unique variable names from detected variables
   * @param variables - Array of detected variables
   * @returns Array of unique variable names
   */
  static getUniqueVariableNames(variables: DetectedVariable[]): string[] {
    const uniqueNames = new Set(variables.map(v => v.name));
    return Array.from(uniqueNames);
  }
  
  /**
   * Extract fallback value from variable name (e.g., "name|John Doe")
   * @param variableName - The variable name with potential fallback
   * @returns Object with name and fallback
   */
  private static extractFallback(variableName: string): string | undefined {
    const parts = variableName.split('|');
    if (parts.length > 1) {
      return parts.slice(1).join('|').trim();
    }
    return undefined;
  }
  
  /**
   * Clean variable name by removing fallback part
   * @param variableName - The variable name with potential fallback
   * @returns Clean variable name
   */
  static cleanVariableName(variableName: string): string {
    return variableName.split('|')[0].trim();
  }
  
  /**
   * Replace variables in a string with provided values
   * @param text - The text containing {{variableName}} patterns
   * @param variables - Object with variable values
   * @returns Text with variables replaced
   */
  static replaceVariables(text: string, variables: Record<string, any>): string {
    return text.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
      const cleanName = this.cleanVariableName(variableName);
      const fallback = this.extractFallback(variableName);
      
      // Use provided value, fallback, or empty string
      const value = variables[cleanName] ?? fallback ?? '';
      return String(value);
    });
  }
  
  /**
   * Replace variables in entire JSON object
   * @param obj - The JSON object to process
   * @param variables - Object with variable values
   * @returns New object with variables replaced
   */
  static replaceVariablesInObject(obj: any, variables: Record<string, any>): any {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    if (typeof obj === 'string') {
      return this.replaceVariables(obj, variables);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.replaceVariablesInObject(item, variables));
    }
    
    if (typeof obj === 'object') {
      const result: any = {};
      Object.keys(obj).forEach(key => {
        result[key] = this.replaceVariablesInObject(obj[key], variables);
      });
      return result;
    }
    
    return obj;
  }
}
