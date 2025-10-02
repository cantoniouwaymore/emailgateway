/**
 * API Client for Email Gateway
 * Provides typed functions for all backend endpoints
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string {
  return localStorage.getItem('authToken') || '';
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: { message: `HTTP ${response.status}: ${response.statusText}` }
    }));
    throw new Error(error.error?.message || 'API request failed');
  }

  return response.json();
}

/**
 * Templates API
 */
export const templatesAPI = {
  async getAll() {
    return apiRequest<{ templates: any[]; count: number }>('/api/v1/templates');
  },

  async getOne(key: string) {
    return apiRequest<{ template: any }>(`/api/v1/templates/${key}`);
  },

  async create(data: any) {
    return apiRequest<{ template: any }>('/api/v1/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(key: string, data: any) {
    return apiRequest<{ template: any }>(`/api/v1/templates/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(key: string) {
    return apiRequest<void>(`/api/v1/templates/${key}`, {
      method: 'DELETE',
    });
  },

  async addLocale(key: string, locale: string, jsonStructure: any) {
    return apiRequest<{ locale: any }>(`/api/v1/templates/${key}/locales`, {
      method: 'POST',
      body: JSON.stringify({ locale, jsonStructure }),
    });
  },

  async updateLocale(key: string, locale: string, jsonStructure: any) {
    return apiRequest<{ locale: any }>(`/api/v1/templates/${key}/locales/${locale}`, {
      method: 'PUT',
      body: JSON.stringify({ jsonStructure }),
    });
  },

  async deleteLocale(key: string, locale: string) {
    return apiRequest<void>(`/api/v1/templates/${key}/locales/${locale}`, {
      method: 'DELETE',
    });
  },

  async preview(key: string, locale?: string, variables?: Record<string, any>) {
    const params = new URLSearchParams();
    if (locale) params.append('locale', locale);
    if (variables) params.append('variables', JSON.stringify(variables));
    
    const response = await fetch(`${API_BASE_URL}/api/v1/templates/${key}/preview?${params}`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    });
    return response.text();
  },

  async generatePreview(templateStructure: any, variables?: Record<string, any>) {
    return apiRequest<{ html: string; preview: string }>('/api/v1/templates/preview', {
      method: 'POST',
      body: JSON.stringify({ templateStructure, variables }),
    });
  },

  async getVariables(key: string) {
    return apiRequest<{ template: any }>(`/api/v1/templates/${key}/variables`);
  },

  async getDetectedVariables(key: string) {
    return apiRequest<{ detectedVariables: string[]; variableDetails: any[] }>(
      `/api/v1/templates/${key}/detected-variables`
    );
  },
};

/**
 * Health API
 */
export const healthAPI = {
  async check() {
    return apiRequest<{ status: string; timestamp: string }>('/health');
  },

  async detailed() {
    return apiRequest<any>('/health/detailed');
  },
};

/**
 * Messages API (for admin dashboard)
 */
export const messagesAPI = {
  async getAdminData() {
    return apiRequest<{
      health: any;
      serviceHealth: any;
      systemMetrics: any;
      recentMessages: any[];
      stats: any[];
      queueDepth: number;
      recentWebhookEvents: any[];
      timestamp: string;
    }>('/admin/api/data');
  },

  async getOne(messageId: string) {
    return apiRequest<{ message: any }>(`/api/v1/messages/${messageId}`);
  },

  async searchByRecipient(email: string, page = 1, limit = 20) {
    const params = new URLSearchParams({ email, page: String(page), limit: String(limit) });
    return apiRequest<{ messages: any[]; total: number; page: number; totalPages: number; limit: number }>(
      `/admin/api/search?${params}`
    );
  },
};

export { getAuthToken };

