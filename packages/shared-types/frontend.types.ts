/**
 * Frontend-specific types for Email Gateway Admin UI
 * 
 * These types extend the shared backend types with frontend-specific
 * properties and serialized date formats.
 */

import { TemplateMetadata, TemplateLocale, MessageStatus } from './template.types';

/**
 * Template interface for frontend use
 * Extends backend TemplateMetadata with frontend-specific properties
 */
export interface Template extends Omit<TemplateMetadata, 'createdAt' | 'updatedAt'> {
  // Serialized dates for JSON transport
  createdAt: string;
  updatedAt: string;
  
  // Frontend-specific properties
  availableLocales?: string[];
  locales?: FrontendTemplateLocale[];
}

/**
 * Template locale interface for frontend use
 * Extends backend TemplateLocale with serialized dates
 */
export interface FrontendTemplateLocale extends Omit<TemplateLocale, 'createdAt' | 'updatedAt'> {
  // Serialized dates for JSON transport
  createdAt: string;
  updatedAt: string;
}

/**
 * Message interface for frontend use
 * Extends backend MessageStatus with frontend-specific properties
 */
export interface Message extends Omit<MessageStatus, 'createdAt' | 'updatedAt'> {
  // Serialized dates for JSON transport
  createdAt: string;
  updatedAt: string;
  
  // Frontend-specific properties
  provider?: string;
  providerMessageId?: string;
  subject?: string;
  toJson?: any;
}

/**
 * Health status interface for frontend use
 */
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime?: number;
  services?: {
    database?: boolean;
    queue?: boolean;
    provider?: boolean;
  };
}

/**
 * Detected variable interface for template editor
 */
export interface DetectedVariable {
  name: string;
  fallback: string | null;
  full: string;
}
