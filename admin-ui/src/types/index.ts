/**
 * TypeScript types for Email Gateway Admin UI
 */

export interface Template {
  key: string;
  name: string;
  description?: string;
  category: string;
  jsonStructure: Record<string, any>;
  variableSchema?: Record<string, any>;
  availableLocales?: string[];
  locales?: TemplateLocale[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateLocale {
  locale: string;
  jsonStructure: Record<string, any>;
}

export interface DetectedVariable {
  name: string;
  fallback: string | null;
  full: string;
}

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

export interface Message {
  messageId: string;
  status: string;
  attempts: number;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
  provider?: string;
  providerMessageId?: string;
  subject?: string;
  toJson?: any;
}

