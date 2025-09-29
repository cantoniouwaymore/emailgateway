import { generateTemplateCards } from './template-cards';
import { generateTemplateScripts } from './template-scripts';

export function generateTemplatesSection(data: any): string {
  return `
    <div id="templates-tab" class="tab-content">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <!-- Header -->
        <div class="mb-12">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Transactional Template Playground</h1>
          <p class="text-lg text-gray-600">Interactive playground for testing and exploring our transactional email template system with full API functionality</p>
        </div>
        
        <!-- Quick Start Section -->
        <div class="mb-12">
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100">
            <div class="flex items-start justify-between mb-6">
              <div class="flex-1">
                <h2 class="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                  <i class="fas fa-play-circle text-purple-600 mr-3"></i>
                  Quick Start Guide
          </h2>
                <p class="text-gray-700 mb-4">Get started with our transactional templates in minutes. Choose a template, customize it, and send a test email.</p>
                <div class="flex items-center text-sm text-gray-600">
                  <i class="fas fa-clock mr-2"></i>
                  <span>3 minutes to complete</span>
            </div>
            </div>
              <a href="/docs/TRANSACTIONAL_TEMPLATE_GUIDE.md" class="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                View Full Guide
                <i class="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
            
            <!-- Steps -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="flex items-start">
                <div class="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">1</div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Choose Template</h3>
                  <p class="text-sm text-gray-600">Select from our pre-built templates with full API features</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">2</div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Customize Content</h3>
                  <p class="text-sm text-gray-600">Modify themes, facts, CTAs, social links, and branding</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">3</div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Send Test Email</h3>
                  <p class="text-sm text-gray-600">Preview and send test emails to verify your template</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Features Section -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Template Features</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-mobile-alt text-blue-600 text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Responsive Design</h3>
              <p class="text-sm text-gray-600">Mobile-first MJML design that works across all email clients</p>
            </div>
            
            <div class="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-palette text-green-600 text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Customizable Themes</h3>
              <p class="text-sm text-gray-600">Complete control over colors, fonts, and branding</p>
            </div>
            
            <div class="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-table text-purple-600 text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Facts Tables</h3>
              <p class="text-sm text-gray-600">Dynamic data tables for structured information display</p>
            </div>
            
            <div class="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-mouse-pointer text-orange-600 text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Interactive Elements</h3>
              <p class="text-sm text-gray-600">CTAs, social links, and dynamic content support</p>
            </div>
            
            <div class="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-image text-cyan-600 text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Custom Images</h3>
              <p class="text-sm text-gray-600">Support for custom logos and images with alt text</p>
            </div>
            
            <div class="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-share-alt text-pink-600 text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Social Links</h3>
              <p class="text-sm text-gray-600">Built-in social media integration with customizable styling</p>
            </div>
            
            <div class="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-code text-indigo-600 text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Handlebars Support</h3>
              <p class="text-sm text-gray-600">Full Handlebars templating with conditional logic</p>
            </div>
            
            <div class="text-center p-6 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-globe text-yellow-600 text-lg"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Multi-Language</h3>
              <p class="text-sm text-gray-600">Support for multiple locales with automatic fallback</p>
            </div>
          </div>
        </div>

        <!-- Interactive Playground -->
        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Interactive Playground</h2>
          <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div class="border-b border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">Template Editor</h3>
                <div class="flex space-x-3">
                  <select id="template-selector" onchange="loadTemplateFromDropdown(this.value)" class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="">Select a template...</option>
                    <option value="welcome">Welcome Email</option>
                    <option value="payment-success">Payment Success</option>
                    <option value="renewal-7">Renewal Reminder</option>
                    <option value="usage-80">Usage Warning</option>
                    <option value="upgrade">Upgrade Confirmation</option>
                    <option value="payment-failure">Payment Failure</option>
                    <option value="invoice">Invoice</option>
                    <option value="password-reset">Password Reset</option>
                    <option value="monthly-report">Monthly Report</option>
                    <option value="dark-mode">Dark Mode</option>
                    <option value="countdown">Countdown Timer</option>
                  </select>
                  <button onclick="previewTemplate(event)" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    <i class="fas fa-eye mr-2"></i>Preview
                  </button>
                  <button onclick="sendTemplateTestEmail(event)" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                    <i class="fas fa-paper-plane mr-2"></i>Send Test
                  </button>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <!-- JSON Editor -->
              <div class="p-6 border-r border-gray-200">
                <div class="mb-4">
                  <div class="flex items-center justify-between mb-2">
                    <label class="block text-sm font-medium text-gray-700">Template JSON</label>
                    <button 
                      onclick="updatePreview()" 
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <i class="fas fa-sync-alt mr-1"></i>
                      Update Preview
                    </button>
                  </div>
                  <textarea 
                    id="template-json" 
                    rows="20" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Select a template below to load its JSON structure..."
                  ></textarea>
                </div>
                <div class="flex space-x-3">
                  <button onclick="formatJSON(event)" class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                    <i class="fas fa-code mr-1"></i>Format
                  </button>
                  <button onclick="validateTemplate(event)" class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors">
                    <i class="fas fa-check-circle mr-1"></i>Validate
                  </button>
                  <button onclick="copyJSON(event)" class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                    <i class="fas fa-copy mr-1"></i>Copy
                  </button>
                  <button onclick="clearTemplate(event)" class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                    <i class="fas fa-trash mr-1"></i>Clear
                  </button>
                </div>
              </div>
              
              <!-- Preview Panel -->
              <div class="p-6">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email Preview</label>
                  <div class="border border-gray-300 rounded-md bg-gray-50 min-h-[400px] p-4">
                    <div id="email-preview" class="text-center text-gray-500 py-8">
                      <i class="fas fa-envelope text-4xl mb-4"></i>
                      <p>Load a template to see the preview</p>
                    </div>
                  </div>
                </div>
                <div class="text-xs text-gray-500">
                  <i class="fas fa-info-circle mr-1"></i>
                  Preview shows how the email will appear to recipients
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Template Categories -->
        <div class="mb-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-gray-900">Template Categories</h2>
            <div class="flex space-x-2">
              <button onclick="filterTemplates('all')" class="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium filter-btn active" data-filter="all">
                All Templates
              </button>
              <button onclick="filterTemplates('user')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium filter-btn hover:bg-gray-300 transition-colors" data-filter="user">
                User Management
              </button>
              <button onclick="filterTemplates('billing')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium filter-btn hover:bg-gray-300 transition-colors" data-filter="billing">
                Billing & Payments
              </button>
              <button onclick="filterTemplates('usage')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium filter-btn hover:bg-gray-300 transition-colors" data-filter="usage">
                Usage & Analytics
              </button>
            </div>
          </div>
          
          ${generateTemplateCards()}
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 pt-8">
          <div class="text-center">
            <p class="text-gray-600 text-sm mb-4">Need help with templates?</p>
            <div class="flex justify-center space-x-6">
              <a href="/docs/TRANSACTIONAL_TEMPLATE_GUIDE.md" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                <i class="fas fa-book mr-2"></i>Template Guide
              </a>
              <a href="mailto:support@waymore.io" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                <i class="fas fa-envelope mr-2"></i>Contact Support
              </a>
              <a href="/docs/API.md" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                <i class="fas fa-code mr-2"></i>API Reference
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        .filter-btn.active {
          background-color: #7c3aed;
          color: white;
        }
        .template-card.hidden {
          display: none;
        }
        .status-message {
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          margin-top: 8px;
          display: none;
        }
        .status-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .status-error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
      </style>
      
      ${generateTemplateScripts()}
      </div>
  `;
}

// Import template examples from separate file
import { 
  getWelcomeExample, 
  getPaymentSuccessExample, 
  getRenewalExample, 
  getUsageExample, 
  getUpgradeExample, 
  getPaymentFailureExample,
  getInvoiceExample,
  getPasswordResetExample,
  getMonthlyReportExample
} from './template-examples';