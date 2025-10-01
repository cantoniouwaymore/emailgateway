/**
 * Shared TypeScript interfaces for template management
 * 
 * These types are used across controllers, services, and template engines
 * to ensure type safety and consistency.
 */

/**
 * Template render options for both file-based and database templates
 */
export interface TemplateRenderOptions {
  key: string;
  locale?: string;
  version?: string;
  variables: Record<string, unknown>;
}

/**
 * Rendered template output
 */
export interface RenderedTemplate {
  html: string;
  text?: string;
  subject?: string;
}

/**
 * Template metadata from database
 */
export interface TemplateMetadata {
  id: string;
  key: string;
  name: string;
  description?: string;
  category: string;
  variableSchema?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Template locale data
 */
export interface TemplateLocale {
  id: string;
  templateId: string;
  locale: string;
  jsonStructure: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Template with all locales
 */
export interface TemplateWithLocales extends TemplateMetadata {
  locales: TemplateLocale[];
}

/**
 * Template variable definition
 */
export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  required?: boolean;
  defaultValue?: unknown;
  example?: unknown;
}

/**
 * Template variable schema
 */
export interface TemplateVariableSchema {
  [variableName: string]: TemplateVariable;
}

/**
 * Template preview request
 */
export interface TemplatePreviewRequest {
  key: string;
  locale?: string;
  variables?: Record<string, unknown>;
}

/**
 * Template validation result
 */
export interface TemplateValidationResult {
  valid: boolean;
  errors: TemplateValidationError[];
  warnings: TemplateValidationWarning[];
}

/**
 * Template validation error
 */
export interface TemplateValidationError {
  field: string;
  message: string;
  type: 'missing_required' | 'invalid_type' | 'invalid_format';
}

/**
 * Template validation warning
 */
export interface TemplateValidationWarning {
  field: string;
  message: string;
  type: 'best_practice' | 'optimization' | 'deprecation';
}

/**
 * Template creation request
 */
export interface CreateTemplateRequest {
  key: string;
  name: string;
  description?: string;
  category: string;
  jsonStructure: Record<string, unknown>;
  variableSchema?: TemplateVariableSchema;
}

/**
 * Template update request
 */
export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  category?: string;
  jsonStructure?: Record<string, unknown>;
  variableSchema?: TemplateVariableSchema;
}

/**
 * Locale creation request
 */
export interface CreateLocaleRequest {
  locale: string;
  jsonStructure: Record<string, unknown>;
}

/**
 * Locale update request
 */
export interface UpdateLocaleRequest {
  jsonStructure: Record<string, unknown>;
}

