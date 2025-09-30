export function generateDocumentationSection(data: any): string {
  return `
    <div id="documentation-tab" class="tab-content">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <!-- Header -->
        <div class="mb-12">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Email Gateway Documentation</h1>
          <p class="text-lg text-gray-600">Complete developer resources and guides for our email gateway system</p>
        </div>

        <!-- Quickstart Section -->
        <div class="mb-12">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
            <div class="flex items-start justify-between mb-6">
              <div class="flex-1">
                <h2 class="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                  <i class="fas fa-rocket text-blue-600 mr-3"></i>
                  Quick Start Guide
                </h2>
                <p class="text-gray-700 mb-4">Get up and running with our email gateway in minutes. Send your first email with just a few lines of code.</p>
                <div class="flex items-center text-sm text-gray-600">
                  <i class="fas fa-clock mr-2"></i>
                  <span>5 minutes to complete</span>
                </div>
              </div>
              <a href="/docs/API.md" class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View Full Guide
                <i class="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
            
            <!-- Code Example -->
            <div class="bg-gray-900 rounded-lg overflow-hidden">
              <div class="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div class="flex items-center">
                  <span class="text-sm text-gray-300">JavaScript</span>
                </div>
                <button onclick="copyCodeSample()" class="text-gray-400 hover:text-white transition-colors">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <div class="p-4">
                <pre class="text-sm text-gray-100 overflow-x-auto"><code>// Send email with template
const response = await fetch('/api/v1/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Idempotency-Key': 'unique-key-123'
  },
  body: JSON.stringify({
    to: [{ email: 'user@example.com', name: 'John Doe' }],
    subject: 'Welcome to Waymore!',
    template: { key: 'transactional', locale: 'en' },
    variables: {
      workspace_name: 'Waymore',
      user_firstname: 'John',
      dashboard_url: 'https://app.waymore.io/dashboard'
    }
  })
});

const result = await response.json();
console.log('Message ID:', result.messageId);</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Documentation Cards -->
        <div class="mb-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-gray-900">Browse Documentation</h2>
            <a href="/docs/API.md" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all guides <i class="fas fa-arrow-right ml-1"></i>
            </a>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="/docs/API.md" class="group bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-code text-blue-600 text-lg"></i>
                </div>
                <i class="fas fa-arrow-right text-gray-400 group-hover:text-blue-600 transition-colors"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">API Reference</h3>
              <p class="text-gray-600 text-sm">Complete API documentation with examples, endpoints, and authentication details.</p>
            </a>
            
            <a href="/docs/DEVELOPER.md" class="group bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-cog text-green-600 text-lg"></i>
                </div>
                <i class="fas fa-arrow-right text-gray-400 group-hover:text-blue-600 transition-colors"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Developer Guide</h3>
              <p class="text-gray-600 text-sm">Setup, configuration, and development best practices for integrating with our platform.</p>
            </a>
            
            <a href="/docs/TRANSACTIONAL_TEMPLATE_GUIDE.md" class="group bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-envelope text-purple-600 text-lg"></i>
                </div>
                <i class="fas fa-arrow-right text-gray-400 group-hover:text-blue-600 transition-colors"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Template Guide</h3>
              <p class="text-gray-600 text-sm">Create and customize email templates with our comprehensive template system.</p>
            </a>
          </div>
        </div>

        <!-- Getting Started Section -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Getting Started</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <i class="fas fa-key text-orange-600"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Authentication</h3>
              </div>
              <p class="text-gray-600 text-sm mb-4">All requests require JWT authentication with required scopes.</p>
              <div class="bg-gray-50 rounded p-3 mb-4">
                <code class="text-sm text-gray-800">Authorization: Bearer YOUR_JWT_TOKEN</code>
              </div>
              <a href="/docs/API.md#authentication" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Learn more <i class="fas fa-arrow-right ml-1"></i>
              </a>
            </div>
            
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <i class="fas fa-paper-plane text-green-600"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Template Validation</h3>
              </div>
              <p class="text-gray-600 text-sm mb-4">Validate templates before sending to ensure proper formatting.</p>
              <div class="bg-gray-50 rounded p-3 mb-4">
                <code class="text-sm text-gray-800">POST /api/v1/templates/validate</code>
              </div>
              <a href="/docs/API.md#template-validation" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Learn more <i class="fas fa-arrow-right ml-1"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- API Examples Section -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Common API Examples</h2>
          <div class="space-y-6">
            <!-- Send Email Example -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-envelope text-blue-600 mr-3"></i>
                Send Email
              </h3>
              <div class="bg-gray-900 rounded-lg overflow-hidden">
                <div class="px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <span class="text-sm text-gray-300">POST /api/v1/emails</span>
                </div>
                <div class="p-4">
                  <pre class="text-sm text-gray-100 overflow-x-auto"><code>{
  "to": [{ "email": "user@example.com", "name": "John Doe" }],
  "subject": "Welcome!",
  "template": { "key": "transactional", "locale": "en" },
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "John"
  }
}</code></pre>
                </div>
              </div>
            </div>

            <!-- Check Status Example -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-search text-green-600 mr-3"></i>
                Check Message Status
              </h3>
              <div class="bg-gray-900 rounded-lg overflow-hidden">
                <div class="px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <span class="text-sm text-gray-300">GET /api/v1/messages/{messageId}</span>
                </div>
                <div class="p-4">
                  <pre class="text-sm text-gray-100 overflow-x-auto"><code>{
  "messageId": "msg_abc123",
  "status": "delivered",
  "timestamp": "2024-01-01T10:00:00Z"
}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resources Section -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Additional Resources</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="/docs/ARCHITECTURE.md" class="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-sitemap text-indigo-600 text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Architecture</h3>
              <p class="text-sm text-gray-600">System architecture and design principles</p>
            </a>
            
            <a href="/docs/DEPLOYMENT.md" class="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-server text-yellow-600 text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Deployment</h3>
              <p class="text-sm text-gray-600">Deployment guides and best practices</p>
            </a>
            
            <a href="/docs/CLEANUP.md" class="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-broom text-red-600 text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Cleanup</h3>
              <p class="text-sm text-gray-600">Data cleanup and maintenance procedures</p>
            </a>
            
            <a href="/docs/ROUTEE_INTEGRATION.md" class="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-plug text-teal-600 text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Routee Integration</h3>
              <p class="text-sm text-gray-600">Routee SMS provider integration guide</p>
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 pt-8">
          <div class="text-center">
            <p class="text-gray-600 text-sm mb-4">Need help? Have questions?</p>
            <div class="flex justify-center space-x-6">
              <a href="mailto:support@waymore.io" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                <i class="fas fa-envelope mr-2"></i>Contact Support
              </a>
              <a href="https://github.com/waymore/emailgateway" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                <i class="fab fa-github mr-2"></i>GitHub
              </a>
              <a href="/docs/README.md" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                <i class="fas fa-book mr-2"></i>Full Documentation
              </a>
            </div>
          </div>
        </div>
      </div>

      <script>
        function copyCodeSample() {
          const codeSample = \`// Send email with template
const response = await fetch('/api/v1/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Idempotency-Key': 'unique-key-123'
  },
  body: JSON.stringify({
    to: [{ email: 'user@example.com', name: 'John Doe' }],
    subject: 'Welcome to Waymore!',
    template: { key: 'transactional', locale: 'en' },
    variables: {
      workspace_name: 'Waymore',
      user_firstname: 'John',
      dashboard_url: 'https://app.waymore.io/dashboard'
    }
  })
});

const result = await response.json();
console.log('Message ID:', result.messageId);\`;\`;
          
          navigator.clipboard.writeText(codeSample).then(() => {
            // Show a temporary success message
            const button = event.target.closest('button');
            const originalContent = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check text-green-400"></i>';
            setTimeout(() => {
              button.innerHTML = originalContent;
            }, 2000);
          });
        }
      </script>
    </div>
  `;
}