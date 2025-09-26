export function generateDocumentationSection(data: any): string {
  return `
    <div id="documentation-tab" class="tab-content">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          <i class="fas fa-book mr-3 text-indigo-600"></i>
          Documentation
        </h2>
        <p class="text-lg text-gray-600">
          Access comprehensive documentation, guides, and resources for the email gateway system
        </p>
      </div>
      
      ${generateDocumentationOverview()}
      ${generateDocumentationCards()}
      ${generateQuickLinks()}
    </div>`;
}

function generateDocumentationOverview(): string {
  return `
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-8 border border-indigo-200">
      <div class="flex items-center mb-6">
        <div class="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mr-4">
          <i class="fas fa-graduation-cap text-2xl text-indigo-600"></i>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Developer Resources</h3>
          <p class="text-lg text-gray-600">Complete documentation and guides for building with our email gateway</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg p-6 shadow-md border border-indigo-100">
          <div class="flex items-center mb-3">
            <i class="fas fa-file-alt text-xl text-blue-600 mr-3"></i>
            <h4 class="text-lg font-semibold text-gray-900">Comprehensive</h4>
          </div>
          <p class="text-gray-600 text-sm">Complete guides covering all features and use cases</p>
        </div>
        
        <div class="bg-white rounded-lg p-6 shadow-md border border-indigo-100">
          <div class="flex items-center mb-3">
            <i class="fas fa-code text-xl text-green-600 mr-3"></i>
            <h4 class="text-lg font-semibold text-gray-900">Code Examples</h4>
          </div>
          <p class="text-gray-600 text-sm">Real-world examples and implementation patterns</p>
        </div>
        
        <div class="bg-white rounded-lg p-6 shadow-md border border-indigo-100">
          <div class="flex items-center mb-3">
            <i class="fas fa-lightbulb text-xl text-yellow-600 mr-3"></i>
            <h4 class="text-lg font-semibold text-gray-900">Best Practices</h4>
          </div>
          <p class="text-gray-600 text-sm">Proven strategies and optimization techniques</p>
        </div>
        
        <div class="bg-white rounded-lg p-6 shadow-md border border-indigo-100">
          <div class="flex items-center mb-3">
            <i class="fas fa-question-circle text-xl text-purple-600 mr-3"></i>
            <h4 class="text-lg font-semibold text-gray-900">Troubleshooting</h4>
          </div>
          <p class="text-gray-600 text-sm">Common issues and their solutions</p>
        </div>
      </div>
    </div>`;
}

function generateDocumentationCards(): string {
  return `
    <div class="mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-6">
        <i class="fas fa-folder-open mr-2 text-blue-600"></i>
        Documentation Library
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
          <div class="flex items-center mb-4">
            <div class="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mr-4">
              <i class="fas fa-puzzle-piece text-xl text-blue-600"></i>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-900">Universal Template Guide</h4>
              <p class="text-sm text-gray-600">Complete template system documentation</p>
            </div>
          </div>
          <p class="text-gray-600 mb-4">
            Learn about the universal email template system, customization options, multi-language support, and advanced features.
          </p>
          <div class="flex space-x-2">
            <button onclick="openDocumentation('template-guide')" 
                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              <i class="fas fa-book-open mr-2"></i>
              Read Guide
            </button>
            <button onclick="copyDocumentationLink('template-guide')" 
                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200">
              <i class="fas fa-link"></i>
            </button>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
          <div class="flex items-center mb-4">
            <div class="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mr-4">
              <i class="fas fa-code text-xl text-green-600"></i>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-900">API Reference</h4>
              <p class="text-sm text-gray-600">Complete API documentation</p>
            </div>
          </div>
          <p class="text-gray-600 mb-4">
            Detailed API endpoints, request/response formats, authentication, and integration examples.
          </p>
          <div class="flex space-x-2">
            <button onclick="openDocumentation('api-reference')" 
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              <i class="fas fa-book-open mr-2"></i>
              Read Guide
            </button>
            <button onclick="copyDocumentationLink('api-reference')" 
                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200">
              <i class="fas fa-link"></i>
            </button>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200">
          <div class="flex items-center mb-4">
            <div class="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mr-4">
              <i class="fas fa-lightbulb text-xl text-purple-600"></i>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-900">Developer Guide</h4>
              <p class="text-sm text-gray-600">Best practices and tips</p>
            </div>
          </div>
          <p class="text-gray-600 mb-4">
            Development best practices, optimization techniques, and troubleshooting guides for developers.
          </p>
          <div class="flex space-x-2">
            <button onclick="openDocumentation('best-practices')" 
                    class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              <i class="fas fa-book-open mr-2"></i>
              Read Guide
            </button>
            <button onclick="copyDocumentationLink('best-practices')" 
                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200">
              <i class="fas fa-link"></i>
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function generateQuickLinks(): string {
  return `
    <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
      <div class="text-center mb-8">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
          <i class="fas fa-rocket text-2xl text-indigo-600"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Quick Start Resources</h3>
        <p class="text-lg text-gray-600">
          Get up and running quickly with these essential resources
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-auto mb-4">
            <i class="fas fa-play text-xl text-blue-600"></i>
          </div>
          <h4 class="text-lg font-semibold text-gray-900 text-center mb-2">Getting Started</h4>
          <p class="text-gray-600 text-center text-sm mb-4">Quick setup and first email</p>
          <button onclick="openDocumentation('getting-started')" 
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Start Here
          </button>
        </div>
        
        <div class="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mx-auto mb-4">
            <i class="fas fa-code text-xl text-green-600"></i>
          </div>
          <h4 class="text-lg font-semibold text-gray-900 text-center mb-2">Code Examples</h4>
          <p class="text-gray-600 text-center text-sm mb-4">Copy-paste ready examples</p>
          <button onclick="openDocumentation('examples')" 
                  class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            View Examples
          </button>
        </div>
        
        <div class="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mx-auto mb-4">
            <i class="fas fa-tools text-xl text-yellow-600"></i>
          </div>
          <h4 class="text-lg font-semibold text-gray-900 text-center mb-2">Tools & SDKs</h4>
          <p class="text-gray-600 text-center text-sm mb-4">Development tools and libraries</p>
          <button onclick="openDocumentation('tools')" 
                  class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Browse Tools
          </button>
        </div>
        
        <div class="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mx-auto mb-4">
            <i class="fas fa-life-ring text-xl text-red-600"></i>
          </div>
          <h4 class="text-lg font-semibold text-gray-900 text-center mb-2">Support</h4>
          <p class="text-gray-600 text-center text-sm mb-4">Get help and support</p>
          <button onclick="openDocumentation('support')" 
                  class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Get Support
          </button>
        </div>
      </div>
    </div>
    
    <script>
      function openDocumentation(type) {
        const urls = {
          'template-guide': '/docs/UNIVERSAL_TEMPLATE_GUIDE.md',
          'api-reference': '/docs/API.md',
          'best-practices': '/docs/DEVELOPER.md',
          'getting-started': '/docs/README.md',
          'examples': '/docs/API.md',
          'tools': '/docs/DEVELOPER.md',
          'support': '/docs/DEVELOPER.md'
        };
        
        if (urls[type]) {
          window.location.href = urls[type];
        }
      }
      
      function copyDocumentationLink(type) {
        const urls = {
          'template-guide': '/docs/UNIVERSAL_TEMPLATE_GUIDE.md',
          'api-reference': '/docs/API.md',
          'best-practices': '/docs/DEVELOPER.md'
        };
        
        if (urls[type]) {
          const fullUrl = window.location.origin + urls[type];
          navigator.clipboard.writeText(fullUrl).then(() => {
            alert('Documentation link copied to clipboard!');
          });
        }
      }
    </script>`;
}
