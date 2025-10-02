<template>
  <div class="openapi-docs-container">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading API documentation...</p>
    </div>
    <div v-else-if="error" class="error-container">
      <h3>Failed to load API documentation</h3>
      <p>{{ error }}</p>
      <button @click="loadDocs" class="retry-button">Retry</button>
    </div>
    <div ref="openapiContainer" class="openapi-container">
      <!-- OpenAPI content will be rendered here -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const openapiContainer = ref(null)
const loading = ref(true)
const error = ref(null)

const loadDocs = async () => {
  try {
    loading.value = true
    error.value = null

    // Clear previous content
    if (openapiContainer.value) {
      openapiContainer.value.innerHTML = ''
    }

    // Load the OpenAPI spec
    const response = await fetch('/api/openapi.json')
    const spec = await response.json()

    // Use Swagger UI directly
    const SwaggerUIBundle = await import('swagger-ui-dist/swagger-ui-bundle.js')
    
    // Create a unique ID for the container
    const containerId = 'swagger-ui-' + Date.now()
    openapiContainer.value.id = containerId

    // Create Swagger UI instance
    SwaggerUIBundle.default({
      url: '/api/openapi.json',
      dom_id: '#' + containerId,
      deepLinking: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      defaultModelRendering: 'example',
      displayRequestDuration: true,
      tryItOutEnabled: true,
      onComplete: () => {
        console.log('Swagger UI loaded successfully')
        loading.value = false
      },
      onFailure: (error) => {
        console.error('Swagger UI failed to load:', error)
        error.value = 'Failed to load API documentation'
        loading.value = false
      }
    })

  } catch (err) {
    console.error('Failed to load OpenAPI documentation:', err)
    error.value = err.message || 'Failed to load API documentation'
    loading.value = false
  }
}

onMounted(async () => {
  // Load Swagger UI CSS
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css'
  document.head.appendChild(link)

  loadDocs()
})
</script>

<style scoped>
.openapi-docs-container {
  width: 100%;
  min-height: 400px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--vp-c-divider);
  border-top: 4px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.error-container h3 {
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
}

.error-container p {
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
}

.retry-button {
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background: var(--vp-c-brand-2);
}

.openapi-container {
  width: 100%;
}

/* Modern Swagger UI Styling */
:deep(.swagger-ui) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important;
  background: transparent !important;
  color: var(--vp-c-text-1) !important;
  line-height: 1.6 !important;
}

/* Hide the top bar */
:deep(.swagger-ui .topbar) {
  display: none !important;
}

/* Modern info section */
:deep(.swagger-ui .info) {
  margin: 0 0 3rem 0 !important;
  padding: 2rem !important;
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 100%) !important;
  border-radius: 16px !important;
  border: 1px solid var(--vp-c-divider) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

:deep(.swagger-ui .info .title) {
  color: var(--vp-c-text-1) !important;
  font-size: 2.5rem !important;
  font-weight: 700 !important;
  margin: 0 0 1rem 0 !important;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2)) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

:deep(.swagger-ui .info .description) {
  color: var(--vp-c-text-2) !important;
  font-size: 1.125rem !important;
  line-height: 1.7 !important;
  margin-bottom: 1.5rem !important;
}

/* Modern operation blocks */
:deep(.swagger-ui .opblock) {
  border: none !important;
  border-radius: 16px !important;
  margin: 2rem 0 !important;
  background: var(--vp-c-bg) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  overflow: hidden !important;
  transition: all 0.3s ease !important;
}

:deep(.swagger-ui .opblock:hover) {
  transform: translateY(-2px) !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

:deep(.swagger-ui .opblock .opblock-summary) {
  border: none !important;
  padding: 1.5rem 2rem !important;
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg) 100%) !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

:deep(.swagger-ui .opblock .opblock-summary:hover) {
  background: linear-gradient(135deg, var(--vp-c-bg-soft-hover) 0%, var(--vp-c-bg-soft) 100%) !important;
}

:deep(.swagger-ui .opblock .opblock-summary-path) {
  color: var(--vp-c-text-1) !important;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
  font-size: 1.125rem !important;
  font-weight: 600 !important;
  margin-right: 1rem !important;
}

/* Modern HTTP method badges */
:deep(.swagger-ui .opblock .opblock-summary-method) {
  border-radius: 8px !important;
  font-weight: 700 !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.75rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  min-width: 80px !important;
  text-align: center !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.2s ease !important;
}

:deep(.swagger-ui .opblock.opblock-get .opblock-summary-method) {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  color: white !important;
}

:deep(.swagger-ui .opblock.opblock-post .opblock-summary-method) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
  color: white !important;
}

:deep(.swagger-ui .opblock.opblock-put .opblock-summary-method) {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  color: white !important;
}

:deep(.swagger-ui .opblock.opblock-delete .opblock-summary-method) {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  color: white !important;
}

/* Modern operation body */
:deep(.swagger-ui .opblock-body) {
  background: var(--vp-c-bg) !important;
  color: var(--vp-c-text-1) !important;
  padding: 2rem !important;
  border-top: 1px solid var(--vp-c-divider) !important;
}

/* Modern buttons */
:deep(.swagger-ui .btn) {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2)) !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 0.75rem 1.5rem !important;
  cursor: pointer !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

:deep(.swagger-ui .btn:hover) {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
}

:deep(.swagger-ui .btn.execute) {
  background: linear-gradient(135deg, #10b981, #059669) !important;
}

:deep(.swagger-ui .btn.clear) {
  background: linear-gradient(135deg, #6b7280, #4b5563) !important;
}

/* Modern code blocks */
:deep(.swagger-ui .highlight-code) {
  background: var(--vp-c-bg-soft) !important;
  border: 1px solid var(--vp-c-divider) !important;
  border-radius: 12px !important;
  padding: 1.5rem !important;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
  color: var(--vp-c-text-1) !important;
  font-size: 0.875rem !important;
  line-height: 1.6 !important;
  overflow-x: auto !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

/* Modern input fields */
:deep(.swagger-ui input[type="text"]) {
  background: var(--vp-c-bg) !important;
  border: 2px solid var(--vp-c-divider) !important;
  border-radius: 8px !important;
  color: var(--vp-c-text-1) !important;
  padding: 0.75rem 1rem !important;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
  font-size: 0.875rem !important;
  transition: all 0.2s ease !important;
}

:deep(.swagger-ui input[type="text"]:focus) {
  border-color: var(--vp-c-brand-1) !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.1) !important;
}

/* Modern sections */
:deep(.swagger-ui .try-out) {
  background: var(--vp-c-bg-soft) !important;
  border: 1px solid var(--vp-c-divider) !important;
  border-radius: 12px !important;
  padding: 1.5rem !important;
  margin: 1.5rem 0 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

:deep(.swagger-ui .responses-inner) {
  background: var(--vp-c-bg-soft) !important;
  border: 1px solid var(--vp-c-divider) !important;
  border-radius: 12px !important;
  padding: 1.5rem !important;
  margin: 1.5rem 0 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

/* Layout improvements */
:deep(.swagger-ui .wrapper) {
  padding: 0 !important;
  max-width: none !important;
}

:deep(.swagger-ui .swagger-container) {
  background: transparent !important;
}

/* Smooth animations */
:deep(.swagger-ui *) {
  transition: all 0.2s ease !important;
}
</style>