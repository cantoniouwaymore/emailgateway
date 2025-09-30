/**
 * Frontend Configuration
 * Handles environment variables and configuration for the frontend
 */

// Configuration object that can be populated from environment variables
window.ENV = {
  // JWT token from environment (set by backend)
  JWT_TOKEN: null,
  
  // API base URL
  API_BASE_URL: window.location.origin,
  
  // Other configuration options
  DEBUG: false,
  VERSION: '1.0.0'
};

// Function to set configuration from server-side environment variables
function setEnvironmentConfig(config) {
  if (config) {
    Object.assign(window.ENV, config);
  }
}

// Function to get JWT token from various sources
function getJWTToken() {
  // Priority order:
  // 1. Environment variable (production)
  // 2. Local storage (development)
  // 3. null (will trigger API client to get test token)
  
  if (window.ENV && window.ENV.JWT_TOKEN) {
    return window.ENV.JWT_TOKEN;
  }
  
  return localStorage.getItem('authToken') || null;
}

// Function to set JWT token
function setJWTToken(token) {
  if (window.ENV) {
    window.ENV.JWT_TOKEN = token;
  }
  localStorage.setItem('authToken', token);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setEnvironmentConfig,
    getJWTToken,
    setJWTToken
  };
}
