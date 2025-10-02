/**
 * Centralized API Client for Frontend
 * Handles all backend API communication with JWT authentication
 */

class EmailGatewayAPIClient {
  constructor() {
    this.baseURL = window.location.origin;
    this.jwtToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Initialize the API client with JWT token from environment or test endpoint
   */
  async initialize() {
    try {
      // Try to get token from configuration first (for production)
      if (window.ENV && window.ENV.JWT_TOKEN) {
        this.jwtToken = window.ENV.JWT_TOKEN;
        this.tokenExpiry = Date.now() + (24 * 60 * 60 * 1000); // Assume 24h for env token
        console.log('✅ Using JWT token from environment configuration');
        return;
      }

      // Try to get token from localStorage (for development persistence)
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        this.jwtToken = storedToken;
        this.tokenExpiry = Date.now() + (60 * 60 * 1000); // Assume 1h for stored token
        console.log('✅ Using JWT token from localStorage');
        return;
      }

      // Fallback to test token endpoint (for development)
      const response = await fetch(`${this.baseURL}/test-token`);
      if (!response.ok) {
        throw new Error(`Failed to get test token: ${response.status}`);
      }

      const data = await response.json();
      this.jwtToken = data.token;
      this.tokenExpiry = Date.now() + (60 * 60 * 1000); // 1 hour for test token
      localStorage.setItem('authToken', this.jwtToken); // Store for future use
      console.log('✅ Using JWT token from test endpoint');
    } catch (error) {
      console.error('❌ Failed to initialize API client:', error);
      throw new Error('Failed to initialize API client: ' + error.message);
    }
  }

  /**
   * Check if token is valid and refresh if needed
   */
  async ensureValidToken() {
    if (!this.jwtToken || (this.tokenExpiry && Date.now() >= this.tokenExpiry)) {
      console.log('🔄 Token expired or missing, refreshing...');
      await this.initialize();
    }
  }

  /**
   * Make authenticated API request
   */
  async request(endpoint, options = {}) {
    await this.ensureValidToken();

    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.jwtToken}`,
        ...options.headers
      }
    };

    const requestOptions = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(`API Error ${response.status}: ${errorData.message || errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Template Management APIs
  async getTemplates() {
    return this.request('/api/v1/templates');
  }

  async getTemplate(key) {
    return this.request(`/api/v1/templates/${key}`);
  }

  async createTemplate(templateData) {
    return this.request('/api/v1/templates', {
      method: 'POST',
      body: JSON.stringify(templateData)
    });
  }

  async updateTemplate(key, templateData) {
    return this.request(`/api/v1/templates/${key}`, {
      method: 'PUT',
      body: JSON.stringify(templateData)
    });
  }

  async deleteTemplate(key) {
    return this.request(`/api/v1/templates/${key}`, {
      method: 'DELETE'
    });
  }

  // Template Locale Management
  async addLocale(key, localeData) {
    return this.request(`/api/v1/templates/${key}/locales`, {
      method: 'POST',
      body: JSON.stringify(localeData)
    });
  }

  async updateLocale(key, locale, localeData) {
    return this.request(`/api/v1/templates/${key}/locales/${locale}`, {
      method: 'PUT',
      body: JSON.stringify(localeData)
    });
  }

  async deleteLocale(key, locale) {
    return this.request(`/api/v1/templates/${key}/locales/${locale}`, {
      method: 'DELETE'
    });
  }

  // Template Utilities
  async validateTemplate(key, templateData) {
    return this.request(`/api/v1/templates/${key}/validate`, {
      method: 'POST',
      body: JSON.stringify(templateData)
    });
  }

  async getTemplateVariables(key) {
    return this.request(`/api/v1/templates/${key}/variables`);
  }

  async getTemplateDetectedVariables(key) {
    return this.request(`/api/v1/templates/${key}/detected-variables`);
  }

  async getTemplateDocs(key) {
    return this.request(`/api/v1/templates/${key}/docs`);
  }

  async previewTemplate(key, variables = {}) {
    return this.request(`/api/v1/templates/${key}/preview`, {
      method: 'POST',
      body: JSON.stringify({ variables })
    });
  }

  // Template Preview Generation (for editor)
  async generatePreview(templateStructure, variables = {}) {
    return this.request('/api/v1/templates/preview', {
      method: 'POST',
      body: JSON.stringify({
        templateStructure,
        variables
      })
    });
  }

  // Email APIs
  async sendEmail(emailData) {
    return this.request('/api/v1/emails', {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
  }

  async getMessageStatus(messageId) {
    return this.request(`/api/v1/messages/${messageId}`);
  }

  // Health Check
  async getHealth() {
    return this.request('/health');
  }
}

// Create global instance
window.EmailGatewayAPI = new EmailGatewayAPIClient();

// Auto-initialize when loaded
window.EmailGatewayAPI.initialize().catch(error => {
  console.error('Failed to initialize EmailGatewayAPI:', error);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmailGatewayAPIClient;
}
