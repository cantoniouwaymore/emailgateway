export function generateAIPlaygroundSection(data: any): string {
  return `
    <div id="ai-playground-tab" class="tab-content">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
            <i class="fas fa-robot text-purple-600 mr-3"></i>
            AI Playground
          </h1>
          <p class="text-gray-600">Describe your email template and let AI generate the JSON structure for you</p>
        </div>
        
        <!-- AI Service Status -->
        <div id="ai-service-status" class="mb-6" style="display: none;">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-center">
              <i class="fas fa-exclamation-triangle text-yellow-600 mr-3"></i>
              <div>
                <h3 class="text-sm font-medium text-yellow-800">AI Service Unavailable</h3>
                <p class="text-sm text-yellow-700 mt-1">AI features are currently disabled. The playground will use pattern-based template generation instead.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Input Section -->
          <div class="space-y-6">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <i class="fas fa-edit text-blue-500 mr-2"></i>
                Describe Your Email Template
              </h2>
              
              <div class="space-y-4">
                <div>
                  <label for="email-description" class="block text-sm font-medium text-gray-700 mb-2">
                    Email Description
                  </label>
                  <textarea 
                    id="email-description" 
                    rows="6" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Describe the email template you want to create. For example: 'A welcome email for new users that includes their name, a welcome message, account details, and a button to get started'"
                  ></textarea>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="workspace-name" class="block text-sm font-medium text-gray-700 mb-2">
                      Workspace Name
                    </label>
                    <input 
                      type="text" 
                      id="workspace-name" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Your Company"
                      value="Waymore"
                    />
                  </div>
                  
                  <div>
                    <label for="product-name" class="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input 
                      type="text" 
                      id="product-name" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Your Product"
                      value="Waymore Platform"
                    />
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="user-name" class="block text-sm font-medium text-gray-700 mb-2">
                      User Name (for testing)
                    </label>
                    <input 
                      type="text" 
                      id="user-name" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="John"
                      value="John"
                    />
                  </div>
                  
                  <div>
                    <label for="test-subject" class="block text-sm font-medium text-gray-700 mb-2">
                      Subject Line
                    </label>
                    <input 
                      type="text" 
                      id="test-subject" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Email subject line"
                      value="Welcome to Waymore!"
                    />
                  </div>
                  
                </div>
                
                <div class="flex space-x-3">
                  <button 
                    type="button"
                    onclick="generateTemplate()" 
                    class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
                  >
                    <i class="fas fa-magic mr-2"></i>
                    Generate Template
                  </button>
                  
                  <button 
                    type="button"
                    onclick="clearForm()" 
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <i class="fas fa-trash mr-2"></i>
                    Clear
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Quick Examples -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                Quick Examples
              </h3>
              
              <div class="space-y-3">
                <button 
                  onclick="loadExample('welcome')" 
                  class="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="font-medium text-gray-900">Welcome Email</div>
                  <div class="text-sm text-gray-600">Onboarding email with user details and getting started guide</div>
                </button>
                
                <button 
                  onclick="loadExample('payment-success')" 
                  class="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="font-medium text-gray-900">Payment Success</div>
                  <div class="text-sm text-gray-600">Confirmation email with transaction details and receipt</div>
                </button>
                
                <button 
                  onclick="loadExample('password-reset')" 
                  class="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="font-medium text-gray-900">Password Reset</div>
                  <div class="text-sm text-gray-600">Security email with reset link and instructions</div>
                </button>
                
                <button 
                  onclick="loadExample('monthly-report')" 
                  class="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="font-medium text-gray-900">Monthly Report</div>
                  <div class="text-sm text-gray-600">Analytics email with key metrics and insights</div>
                </button>
                
                <button 
                  onclick="loadExample('themed-email')" 
                  class="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="font-medium text-gray-900">Themed Email</div>
                  <div class="text-sm text-gray-600">Branded email with custom colors and styling</div>
                </button>
                
                <button 
                  onclick="loadExample('multi-language')" 
                  class="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="font-medium text-gray-900">Multi-Language</div>
                  <div class="text-sm text-gray-600">International email with multiple language support</div>
                </button>
                
                <button 
                  onclick="loadExample('social-media')" 
                  class="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="font-medium text-gray-900">Social Media</div>
                  <div class="text-sm text-gray-600">Engagement email with social platform links</div>
                </button>
                
                <button 
                  onclick="loadExample('invoice')" 
                  class="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="font-medium text-gray-900">Invoice</div>
                  <div class="text-sm text-gray-600">Professional billing email with payment details</div>
                </button>
                
                <button 
                  onclick="loadExample('welcome-with-image')" 
                  class="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="font-medium text-gray-900">Welcome with Image</div>
                  <div class="text-sm text-gray-600">Welcome email with company logo and branding</div>
                </button>
                
                <button 
                  onclick="loadExample('success-with-icon')" 
                  class="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="font-medium text-gray-900">Success with Icon</div>
                  <div class="text-sm text-gray-600">Success email with checkmark icon and celebration</div>
                </button>
                
                <button 
                  onclick="loadExample('order-confirmation')" 
                  class="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <div class="font-medium text-gray-900">Order Confirmation</div>
                  <div class="text-sm text-gray-600">Order confirmation with shipping illustration and soft pastel theme</div>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Output Section -->
          <div class="space-y-6">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-medium text-gray-900 flex items-center">
                  <i class="fas fa-code text-green-500 mr-2"></i>
                  Generated JSON Template
                </h2>
                <div class="flex space-x-2">
                  <button 
                    type="button"
                    onclick="copyGeneratedJSON()" 
                    class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                  >
                    <i class="fas fa-copy mr-1"></i>
                    Copy
                  </button>
                  <button 
                    type="button"
                    onclick="formatJSON()" 
                    class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                  >
                    <i class="fas fa-indent mr-1"></i>
                    Format
                  </button>
                </div>
              </div>
              
              <div class="relative">
                <pre id="generated-json" class="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm overflow-auto max-h-96 font-mono text-gray-800 whitespace-pre-wrap">{
  "template": {
    "key": "transactional",
    "locale": "en"
  },
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "John",
    "product_name": "Waymore Platform",
    "support_email": "support@waymore.io",
    "email_title": "Welcome to Waymore!",
    "custom_content": "Hello John,<br><br>Welcome to our platform! Your account is ready to use."
  }
}</pre>
                
                <div id="generation-status" class="absolute top-2 right-2 hidden">
                  <div class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                    <i class="fas fa-spinner fa-spin mr-1"></i>
                    Generating...
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Test Section -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <i class="fas fa-paper-plane text-blue-500 mr-2"></i>
                Test Email
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label for="test-email" class="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Email Address
                  </label>
                  <input 
                    type="email" 
                    id="test-email" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="test@example.com"
                    value="test@example.com"
                  />
                </div>
                
                <div class="flex space-x-3">
                  <button 
                    type="button"
                    onclick="sendTestEmail()" 
                    class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
                  >
                    <i class="fas fa-paper-plane mr-2"></i>
                    Send Test Email
                  </button>
                  
                  <button 
                    type="button"
                    onclick="previewEmail()" 
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <i class="fas fa-eye mr-2"></i>
                    Preview
                  </button>
                </div>
                
                <div id="test-status" class="hidden">
                  <div class="p-3 rounded-md text-sm font-medium"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        .tab-content {
          display: none;
        }
        .tab-content.active {
          display: block;
        }
        .tab-button.active {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }
        .tab-button {
          border-color: transparent;
          color: #6b7280;
        }
        .tab-button:hover {
          color: #374151;
          border-color: #d1d5db;
        }
      </style>
    </div>`;
}

        // AI Playground JavaScript functions - defined globally
        export function generateAIPlaygroundScript(): string {
          return `
            <script>
              // Save form data to localStorage
              function saveFormData() {
                const formData = {
                  description: document.getElementById('email-description').value,
                  workspaceName: document.getElementById('workspace-name').value,
                  productName: document.getElementById('product-name').value,
                  userName: document.getElementById('user-name').value,
                  subject: document.getElementById('test-subject').value,
                  testEmail: document.getElementById('test-email').value,
                  generatedJson: document.getElementById('generated-json').textContent
                };
                localStorage.setItem('ai-playground-form-data', JSON.stringify(formData));
              }
              
              // Load form data from localStorage
              function loadFormData() {
                const savedData = localStorage.getItem('ai-playground-form-data');
                if (savedData) {
                  try {
                    const formData = JSON.parse(savedData);
                    document.getElementById('email-description').value = formData.description || '';
                    document.getElementById('workspace-name').value = formData.workspaceName || '';
                    document.getElementById('product-name').value = formData.productName || '';
                    document.getElementById('user-name').value = formData.userName || '';
                    document.getElementById('test-subject').value = formData.subject || '';
                    document.getElementById('test-email').value = formData.testEmail || '';
                    if (formData.generatedJson && formData.generatedJson !== '{\\n  "template": {\\n    "key": "transactional",\\n    "locale": "en"\\n  },\\n  "variables": {\\n    "workspace_name": "Waymore",\\n    "user_firstname": "John",\\n    "product_name": "Waymore Platform",\\n    "support_email": "support@waymore.io",\\n    "email_title": "Welcome to Waymore!",\\n    "custom_content": "Hello John,<br><br>Welcome to our platform! Your account is ready to use."\\n  }\\n}') {
                      document.getElementById('generated-json').textContent = formData.generatedJson;
                    }
                  } catch (e) {
                    console.warn('Failed to load saved form data:', e);
                  }
                }
              }
              
              // Auto-save form data every 2 seconds
              function startAutoSave() {
                setInterval(saveFormData, 2000);
              }
              
              // Initialize AI Playground when tab is shown
              function initializeAIPlayground() {
                loadFormData();
                startAutoSave();
              }
              
              // Example templates
              const examples = {
          'welcome': {
            description: 'A welcome email for new users that includes their name, a welcome message, account details, and a button to get started',
            workspace: 'Waymore',
            product: 'Waymore Platform',
            user: 'John',
            subject: 'Welcome to Waymore!'
          },
          'payment-success': {
            description: 'A payment confirmation email with transaction details, amount, date, and receipt download link',
            workspace: 'Waymore',
            product: 'Waymore Platform',
            user: 'John',
            subject: 'Payment Successful - Receipt #12345'
          },
          'password-reset': {
            description: 'A password reset email with security instructions, reset link, and expiration notice',
            workspace: 'Waymore',
            product: 'Waymore Platform',
            user: 'John',
            subject: 'Reset Your Password'
          },
          'monthly-report': {
            description: 'A monthly analytics report email with key metrics, charts data, and insights',
            workspace: 'Waymore',
            product: 'Waymore Platform',
            user: 'John',
            subject: 'Your Monthly Report - January 2024'
          },
          'themed-email': {
            description: 'A branded email with custom colors, fonts, and styling for a professional look',
            workspace: 'Waymore',
            product: 'Waymore Platform',
            user: 'John',
            subject: 'Branded Update from Waymore'
          },
          'multi-language': {
            description: 'An international email with content in multiple languages for global users',
            workspace: 'Waymore',
            product: 'Waymore Platform',
            user: 'John',
            subject: 'International Welcome Message'
          },
          'social-media': {
            description: 'A social media engagement email with links to follow on various platforms',
            workspace: 'Waymore',
            product: 'Waymore Platform',
            user: 'John',
            subject: 'Follow Us for Updates'
          },
          'invoice': {
            description: 'A professional invoice email with billing details, payment information, and due date',
            workspace: 'Waymore',
            product: 'Waymore Platform',
            user: 'John',
            subject: 'Invoice #INV-2024-001'
          },
          'welcome-with-image': {
            description: 'A welcome email with a company logo image, onboarding steps, and professional branding',
            workspace: 'Waymore',
            product: 'Waymore Platform',
            user: 'John',
            subject: 'Welcome to Waymore!'
          },
          'success-with-icon': {
            description: 'A success confirmation email with a checkmark icon, celebration message, and next steps',
            workspace: 'Waymore',
            product: 'Waymore Platform',
            user: 'John',
            subject: 'Success! Your Account is Ready'
          },
          'order-confirmation': {
            description: 'An order confirmation email with shipping illustration, order details, tracking information, and soft pastel theme',
            workspace: 'Waymore',
            product: 'Waymore Platform',
            user: 'John',
            subject: 'Order Confirmation - #ORD-2024-001'
          }
        };
        
        function loadExample(type) {
          const example = examples[type];
          if (example) {
            document.getElementById('email-description').value = example.description;
            document.getElementById('workspace-name').value = example.workspace;
            document.getElementById('product-name').value = example.product;
            document.getElementById('user-name').value = example.user;
            document.getElementById('test-subject').value = example.subject;
          }
        }
        
        function clearForm() {
          document.getElementById('email-description').value = '';
          document.getElementById('workspace-name').value = 'Waymore';
          document.getElementById('product-name').value = 'Waymore Platform';
          document.getElementById('user-name').value = 'John';
          document.getElementById('test-email').value = 'test@example.com';
          document.getElementById('test-subject').value = '';
          document.getElementById('generated-json').textContent = '{\\n  "template": {\\n    "key": "transactional",\\n    "locale": "en"\\n  },\\n  "variables": {\\n    "workspace_name": "Waymore",\\n    "user_firstname": "John",\\n    "product_name": "Waymore Platform",\\n    "support_email": "support@waymore.io",\\n    "email_title": "Welcome to Waymore!",\\n    "custom_content": "Hello John,<br><br>Welcome to our platform! Your account is ready to use."\\n  }\\n}';
          // Clear saved data
          localStorage.removeItem('ai-playground-form-data');
        }
        
        async function generateTemplate() {
          const description = document.getElementById('email-description').value.trim();
          const workspaceName = document.getElementById('workspace-name').value.trim();
          const productName = document.getElementById('product-name').value.trim();
          const userName = document.getElementById('user-name').value.trim();
          
          if (!description) {
            alert('Please provide an email description');
            return;
          }
          
          const statusDiv = document.getElementById('generation-status');
          statusDiv.classList.remove('hidden');
          
          try {
            const response = await fetch('/admin/ai/generate-template', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                description,
                workspaceName,
                productName,
                userName
              })
            });
            
            const result = await response.json();
            
            if (response.ok) {
              // The AI endpoint returns { template: { template: {...}, variables: {...} } }
              // We need to extract the inner template object for display
              const templateData = result.template;
              document.getElementById('generated-json').textContent = JSON.stringify(templateData, null, 2);
            } else if (response.status === 503) {
              // AI service unavailable - show warning and use fallback
              const statusDiv = document.getElementById('ai-service-status');
              statusDiv.style.display = 'block';
              
              // Generate a basic template using pattern-based approach
              const fallbackTemplate = {
                template: {
                  key: "transactional",
                  locale: "en"
                },
                variables: {
                  workspace_name: workspaceName || "Your Company",
                  user_firstname: userName || "User",
                  product_name: productName || "Your Product",
                  support_email: "support@example.com",
                  email_title: "Email from " + (workspaceName || "Your Company"),
                  custom_content: description
                }
              };
              
              document.getElementById('generated-json').textContent = JSON.stringify(fallbackTemplate, null, 2);
              
              // Hide the warning after 10 seconds
              setTimeout(() => {
                statusDiv.style.display = 'none';
              }, 10000);
            } else {
              throw new Error(result.error || 'Failed to generate template');
            }
          } catch (error) {
            console.error('Error generating template:', error);
            alert('Failed to generate template: ' + error.message);
          } finally {
            statusDiv.classList.add('hidden');
          }
        }
        
        function copyGeneratedJSON() {
          const jsonText = document.getElementById('generated-json').textContent;
          navigator.clipboard.writeText(jsonText).then(() => {
            // Show temporary success message
            const button = event.target.closest('button');
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
            button.classList.add('bg-green-100', 'text-green-800');
            setTimeout(() => {
              button.innerHTML = originalText;
              button.classList.remove('bg-green-100', 'text-green-800');
            }, 2000);
          });
        }
        
        function formatJSON() {
          try {
            const jsonText = document.getElementById('generated-json').textContent;
            const parsed = JSON.parse(jsonText);
            document.getElementById('generated-json').textContent = JSON.stringify(parsed, null, 2);
          } catch (error) {
            alert('Invalid JSON format');
          }
        }
        
        async function sendTestEmail() {
          const testEmail = document.getElementById('test-email').value.trim();
          const subject = document.getElementById('test-subject').value.trim();
          const jsonText = document.getElementById('generated-json').textContent;
          
          if (!testEmail || !subject) {
            alert('Please provide test email and subject');
            return;
          }
          
          try {
            const template = JSON.parse(jsonText);
            
            const emailData = {
              to: [{ email: testEmail, name: document.getElementById('user-name').value }],
              from: { email: 'marketing@waymore.io', name: 'Waymore' },
              subject: subject,
              template: template.template,
              variables: template.variables
            };
            
            console.log('Sending test email with data:', emailData);
            
            const response = await fetch('/admin/send-test-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(emailData)
            });
            
            console.log('Response status:', response.status);
            
            const result = await response.json();
            console.log('Response result:', result);
            const statusDiv = document.getElementById('test-status');
            
            if (response.ok) {
              statusDiv.className = 'p-3 rounded-md text-sm font-medium bg-green-100 text-green-800 border border-green-200';
              statusDiv.innerHTML = '<i class="fas fa-check mr-2"></i>Test email sent successfully! Message ID: ' + result.messageId;
            } else {
              statusDiv.className = 'p-3 rounded-md text-sm font-medium bg-red-100 text-red-800 border border-red-200';
              statusDiv.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Failed to send test email: ' + (result.error || result.message || 'Unknown error');
            }
            
            statusDiv.classList.remove('hidden');
            
            // Hide status after 5 seconds
            setTimeout(() => {
              statusDiv.classList.add('hidden');
            }, 5000);
            
          } catch (error) {
            console.error('Error sending test email:', error);
            alert('Failed to send test email: ' + error.message);
          }
        }
        
        function previewEmail() {
          // For now, just show an alert. In a real implementation, this would open a preview modal
          alert('Email preview feature coming soon!');
        }
    </script>`;
}
