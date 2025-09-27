// Template playground JavaScript functionality
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

export function generateTemplateScripts(): string {
  return `
    <script>
      // Template examples data - imported from template-examples.ts
      const templateExamples = {
        'welcome': {
          title: 'Welcome Email',
          description: 'Complete onboarding with tips and CTAs',
          json: ${JSON.stringify(getWelcomeExample(), null, 2)}
        },
        'payment-success': {
          title: 'Payment Success',
          description: 'Transaction confirmation with billing details',
          json: ${JSON.stringify(getPaymentSuccessExample(), null, 2)}
        },
        'renewal-7': {
          title: 'Renewal Reminder',
          description: 'Final reminder with charge amounts',
          json: ${JSON.stringify(getRenewalExample(), null, 2)}
        },
        'usage-80': {
          title: 'Usage Warning',
          description: 'Threshold alerts with upgrade options',
          json: ${JSON.stringify(getUsageExample(), null, 2)}
        },
        'upgrade': {
          title: 'Upgrade Confirmation',
          description: 'Plan changes with feature details',
          json: ${JSON.stringify(getUpgradeExample(), null, 2)}
        },
        'payment-failure': {
          title: 'Payment Failure',
          description: 'Failed payment with retry information',
          json: ${JSON.stringify(getPaymentFailureExample(), null, 2)}
        },
        'invoice': {
          title: 'Invoice',
          description: 'Professional invoice with payment details',
          json: ${JSON.stringify(getInvoiceExample(), null, 2)}
        },
        'password-reset': {
          title: 'Password Reset',
          description: 'Security reset with expiration notice',
          json: ${JSON.stringify(getPasswordResetExample(), null, 2)}
        },
        'monthly-report': {
          title: 'Monthly Report',
          description: 'Analytics report with key metrics',
          json: ${JSON.stringify(getMonthlyReportExample(), null, 2)}
        }
      };

      // Filter templates by category
      function filterTemplates(category, event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        try {
          const buttons = document.querySelectorAll('.filter-btn');
          const cards = document.querySelectorAll('.template-card');
          
          // Update button states
          buttons.forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('bg-gray-200', 'text-gray-700');
            btn.classList.remove('bg-purple-600', 'text-white');
          });
          
          const activeBtn = document.querySelector(\`[data-filter="\${category}"]\`);
          if (activeBtn) {
            activeBtn.classList.add('active', 'bg-purple-600', 'text-white');
            activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
          }
          
          // Show/hide cards
          cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          });
        } catch (error) {
          console.error('Error filtering templates:', error);
        }
      }

      // Load template into editor
      function loadTemplate(templateKey, event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        try {
          const template = templateExamples[templateKey];
          if (template) {
            const textarea = document.getElementById('template-json');
            if (textarea) {
              // Debug: Log the full template object
              console.log('Loading template:', templateKey, template);
              
              // Use the template object directly
              textarea.value = JSON.stringify(template, null, 2);
              
              // Debug: Log what was actually set
              console.log('JSON set in textarea:', textarea.value);
              
              updatePreview();
              showStatus('Template loaded successfully!', 'success');
            }
          } else {
            console.error('Template not found:', templateKey);
            showStatus('Template not found', 'error');
          }
        } catch (error) {
          console.error('Error loading template:', error);
          showStatus('Error loading template', 'error');
        }
      }

      // Load template from dropdown
      function loadTemplateFromDropdown(templateKey) {
        if (templateKey) {
          loadTemplate(templateKey);
        }
      }

      // Copy template to clipboard
      function copyTemplate(templateKey, event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        try {
          const template = templateExamples[templateKey];
          if (template) {
            const jsonString = JSON.stringify(template, null, 2);
            
            // Copy to clipboard
            navigator.clipboard.writeText(jsonString).then(() => {
              showStatus('Template copied to clipboard!', 'success');
            }).catch((err) => {
              console.error('Failed to copy to clipboard:', err);
              // Fallback for older browsers
              const textArea = document.createElement('textarea');
              textArea.value = jsonString;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);
              showStatus('Template copied to clipboard!', 'success');
            });
          } else {
            console.error('Template not found:', templateKey);
            showStatus('Template not found', 'error');
          }
        } catch (error) {
          console.error('Error copying template:', error);
          showStatus('Error copying template', 'error');
        }
      }

      // Update email preview
      function updatePreview() {
        try {
          const textarea = document.getElementById('template-json');
          const preview = document.getElementById('email-preview');
          
          if (!textarea || !preview) return;
          
          const jsonText = textarea.value;
          
          if (!jsonText.trim()) {
            preview.innerHTML = \`
              <div class="text-center text-gray-500 py-8">
                <i class="fas fa-envelope text-4xl mb-4"></i>
                <p>Load a template to see the preview</p>
              </div>
            \`;
            return;
          }
          
          const template = JSON.parse(jsonText);
          preview.innerHTML = generateEmailPreview(template);
        } catch (error) {
          const preview = document.getElementById('email-preview');
          if (preview) {
            preview.innerHTML = \`
              <div class="text-center text-red-500 py-8">
                <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                <p>Invalid JSON format</p>
              </div>
            \`;
          }
        }
      }

      // Generate enhanced email preview HTML
      function generateEmailPreview(template) {
        // Handle wrapped template structure (with title, description, json)
        if (template.json) {
          template = template.json;
        }
        
        if (!template.template || !template.variables) {
          return \`
            <div class="text-center text-gray-500 py-8">
              <i class="fas fa-envelope text-4xl mb-4"></i>
              <p>Invalid template structure</p>
            </div>
          \`;
        }

        const vars = template.variables;
        const theme = vars.theme || {};
        
        // Process Handlebars variables with sample data
        const processedVars = {
          ...vars,
          user_firstname: vars.user_firstname || 'John',
          product_name: vars.product_name || 'Your Product',
          workspace_name: vars.workspace_name || 'Your Company',
          support_email: vars.support_email || 'support@example.com',
          current_date: new Date().toLocaleDateString(),
          user_id: '12345',
          transaction_id: 'TXN-12345',
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          renewal_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          failure_date: new Date().toLocaleDateString(),
          retry_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
          upgrade_date: new Date().toLocaleDateString(),
          reset_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          billing_period: 'January 2024',
          request_time: new Date().toLocaleString(),
          ip_address: '192.168.1.1',
          expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString(),
          user_email: 'john@example.com',
          reset_token: 'abc123def456',
          footer_text: vars.footer_text || '',
          footer_links: vars.footer_links || [],
          copyright_text: vars.copyright_text || ''
        };
        
        // Process custom content with Handlebars-like replacement
        let processedContent = processedVars.custom_content || 'Email content will appear here...';
        processedContent = processedContent
          .replace(/\\{\\{user_firstname\\}\\}/g, processedVars.user_firstname)
          .replace(/\\{\\{product_name\\}\\}/g, processedVars.product_name)
          .replace(/\\{\\{workspace_name\\}\\}/g, processedVars.workspace_name)
          .replace(/\\{\\{support_email\\}\\}/g, processedVars.support_email)
          .replace(/\\{\\{current_date\\}\\}/g, processedVars.current_date)
          .replace(/\\{\\{user_id\\}\\}/g, processedVars.user_id)
          .replace(/\\{\\{transaction_id\\}\\}/g, processedVars.transaction_id)
          .replace(/\\{\\{next_billing_date\\}\\}/g, processedVars.next_billing_date)
          .replace(/\\{\\{renewal_date\\}\\}/g, processedVars.renewal_date)
          .replace(/\\{\\{failure_date\\}\\}/g, processedVars.failure_date)
          .replace(/\\{\\{retry_date\\}\\}/g, processedVars.retry_date)
          .replace(/\\{\\{upgrade_date\\}\\}/g, processedVars.upgrade_date)
          .replace(/\\{\\{reset_date\\}\\}/g, processedVars.reset_date)
          .replace(/\\{\\{due_date\\}\\}/g, processedVars.due_date)
          .replace(/\\{\\{billing_period\\}\\}/g, processedVars.billing_period)
          .replace(/\\{\\{request_time\\}\\}/g, processedVars.request_time)
          .replace(/\\{\\{ip_address\\}\\}/g, processedVars.ip_address)
          .replace(/\\{\\{expiry_time\\}\\}/g, processedVars.expiry_time)
          .replace(/\\{\\{user_email\\}\\}/g, processedVars.user_email)
          .replace(/\\{\\{reset_token\\}\\}/g, processedVars.reset_token);
        
        // Process facts with variable replacement
        const processedFacts = (vars.facts || []).map(fact => ({
          ...fact,
          value: fact.value
            .replace(/\\{\\{user_firstname\\}\\}/g, processedVars.user_firstname)
            .replace(/\\{\\{product_name\\}\\}/g, processedVars.product_name)
            .replace(/\\{\\{workspace_name\\}\\}/g, processedVars.workspace_name)
            .replace(/\\{\\{current_date\\}\\}/g, processedVars.current_date)
            .replace(/\\{\\{user_id\\}\\}/g, processedVars.user_id)
            .replace(/\\{\\{transaction_id\\}\\}/g, processedVars.transaction_id)
            .replace(/\\{\\{next_billing_date\\}\\}/g, processedVars.next_billing_date)
            .replace(/\\{\\{renewal_date\\}\\}/g, processedVars.renewal_date)
            .replace(/\\{\\{failure_date\\}\\}/g, processedVars.failure_date)
            .replace(/\\{\\{retry_date\\}\\}/g, processedVars.retry_date)
            .replace(/\\{\\{upgrade_date\\}\\}/g, processedVars.upgrade_date)
            .replace(/\\{\\{reset_date\\}\\}/g, processedVars.reset_date)
            .replace(/\\{\\{due_date\\}\\}/g, processedVars.due_date)
            .replace(/\\{\\{billing_period\\}\\}/g, processedVars.billing_period)
            .replace(/\\{\\{request_time\\}\\}/g, processedVars.request_time)
            .replace(/\\{\\{ip_address\\}\\}/g, processedVars.ip_address)
            .replace(/\\{\\{expiry_time\\}\\}/g, processedVars.expiry_time)
            .replace(/\\{\\{user_email\\}\\}/g, processedVars.user_email)
            .replace(/\\{\\{reset_token\\}\\}/g, processedVars.reset_token)
        }));
        
        return \`
          <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm" style="font-family: \${theme.font_family || 'Inter, Helvetica, Arial, sans-serif'};">
            <!-- Header with logo -->
            <div class="text-center mb-6">
              \${processedVars.image_url ? \`<img src="\${processedVars.image_url}" alt="\${processedVars.image_alt || 'Logo'}" class="w-32 h-auto mx-auto mb-4 rounded-lg">\` : ''}
              <h1 class="text-2xl font-bold mb-2" style="color: \${theme.heading_color || '#1f2937'}">\${processedVars.email_title || 'Email Title'}</h1>
              <p class="text-sm" style="color: \${theme.muted_text_color || '#6b7280'}">From \${processedVars.workspace_name}</p>
            </div>
            
            <!-- Content -->
            <div class="prose max-w-none mb-6">
              <div class="text-gray-700 mb-4" style="color: \${theme.text_color || '#374151'}; font-size: \${theme.font_size || '16px'}; line-height: \${theme.line_height || '26px'};">
                \${processedContent}
              </div>
              
              <!-- Facts table -->
              \${processedFacts && processedFacts.length > 0 ? \`
                <div class="bg-gray-50 p-4 rounded-lg mb-4" style="background-color: \${theme.card_background || '#f8fafc'};">
                  <h3 class="font-semibold mb-2" style="color: \${theme.heading_color || '#1f2937'}">Details:</h3>
                  <div class="space-y-2">
                    \${processedFacts.map(fact => \`
                      <div class="flex justify-between text-sm">
                        <span class="font-medium" style="color: \${theme.text_color || '#374151'}">\${fact.label}:</span>
                        <span style="color: \${theme.text_color || '#374151'}">\${fact.value}</span>
                      </div>
                    \`).join('')}
                  </div>
                </div>
              \` : ''}
              
              <!-- CTA Buttons -->
              \${vars.cta_primary || vars.cta_secondary ? \`
                <div class="text-center space-y-3">
                  \${vars.cta_primary ? \`
                    <button class="px-6 py-3 rounded-lg font-semibold text-white transition-colors" 
                            style="background-color: \${theme.primary_button_color || '#3b82f6'}; color: \${theme.primary_button_text_color || '#ffffff'};">
                      \${vars.cta_primary.label}
                    </button>
                  \` : ''}
                  \${vars.cta_secondary ? \`
                    <button class="px-6 py-3 rounded-lg font-semibold text-white transition-colors ml-3" 
                            style="background-color: \${theme.secondary_button_color || '#6b7280'}; color: \${theme.secondary_button_text_color || '#ffffff'};">
                      \${vars.cta_secondary.label}
                    </button>
                  \` : ''}
                </div>
              \` : ''}
            </div>
            
            <!-- Social Links -->
            \${vars.social_links && vars.social_links.length > 0 ? \`
              <div class="text-center mb-6">
                <p class="text-sm mb-3" style="color: \${theme.muted_text_color || '#6b7280'}">Follow us on social media</p>
                <div class="flex justify-center space-x-4">
                  \${vars.social_links.map(link => \`
                    <a href="\${link.url}" class="w-8 h-8 rounded-full flex items-center justify-center transition-colors" 
                       style="background-color: \${theme.social_button_color || '#f3f4f6'}; color: \${theme.social_icon_color || '#6b7280'};">
                      <i class="fab fa-\${link.platform} text-sm"></i>
                    </a>
                  \`).join('')}
                </div>
              </div>
            \` : ''}
            
            <!-- Footer -->
            <div class="mt-6 pt-4 border-t border-gray-200 text-center text-sm" style="border-color: \${theme.border_color || '#e5e7eb'};">
              <!-- Custom Footer Text -->
              \${processedVars.footer_text ? \`
                <p style="color: \${theme.muted_text_color || '#9ca3af'}; margin-bottom: 16px;">
                  \${processedVars.footer_text}
                </p>
              \` : \`
                <p style="color: \${theme.muted_text_color || '#9ca3af'}; margin-bottom: 16px;">
                  This email was sent by <strong>\${processedVars.workspace_name}</strong>. If you have any questions, please contact 
                  <a href="mailto:\${processedVars.support_email}" 
                     style="color: \${theme.link_color || '#3b82f6'}; text-decoration: none;">
                    \${processedVars.support_email}
                  </a>.
                </p>
              \`}
              
              <!-- Footer Links -->
              \${processedVars.footer_links && processedVars.footer_links.length > 0 ? \`
                <p style="color: \${theme.muted_text_color || '#9ca3af'}; margin-bottom: 16px;">
                  \${processedVars.footer_links.map((link, index) => \`
                    \${index > 0 ? ' • ' : ''}
                    <a href="\${link.url}" style="color: \${theme.link_color || '#3b82f6'}; text-decoration: none;">
                      \${link.label}
                    </a>
                  \`).join('')}
                </p>
              \` : ''}
              
              <!-- Copyright -->
              <p style="color: \${theme.muted_text_color || '#9ca3af'}; font-size: 11px;">
                \${processedVars.copyright_text || \`© \${new Date().getFullYear()} \${processedVars.workspace_name}. All rights reserved.\`}
              </p>
            </div>
          </div>
        \`;
      }

      // Format JSON
      function formatJSON(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        try {
          const textarea = document.getElementById('template-json');
          if (!textarea) return;
          
          const json = JSON.parse(textarea.value);
          textarea.value = JSON.stringify(json, null, 2);
          showStatus('JSON formatted successfully!', 'success');
        } catch (error) {
          showStatus('Invalid JSON format', 'error');
        }
      }

      // Copy JSON to clipboard
      function copyJSON(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        try {
          const textarea = document.getElementById('template-json');
          if (!textarea) return;
          
          textarea.select();
          document.execCommand('copy');
          showStatus('JSON copied to clipboard!', 'success');
        } catch (error) {
          showStatus('Failed to copy JSON', 'error');
        }
      }

      // Clear template
      function clearTemplate(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        try {
          const textarea = document.getElementById('template-json');
          const preview = document.getElementById('email-preview');
          
          if (textarea) {
            textarea.value = '';
          }
          
          if (preview) {
            preview.innerHTML = \`
              <div class="text-center text-gray-500 py-8">
                <i class="fas fa-envelope text-4xl mb-4"></i>
                <p>Load a template to see the preview</p>
              </div>
            \`;
          }
          
          showStatus('Template cleared', 'success');
        } catch (error) {
          showStatus('Error clearing template', 'error');
        }
      }

      // Preview template
      function previewTemplate(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        try {
          updatePreview();
          showStatus('Preview updated', 'success');
        } catch (error) {
          showStatus('Error updating preview', 'error');
        }
      }

      // Send test email
      function sendTemplateTestEmail(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        try {
          const textarea = document.getElementById('template-json');
          if (!textarea) return;
          
          const jsonText = textarea.value;
          
          if (!jsonText.trim()) {
            showStatus('Please load a template first', 'error');
            return;
          }
          
          // Show email input modal
          showEmailInputModal();
        } catch (error) {
          showStatus('Invalid template format', 'error');
        }
      }

      // Show email input modal
      function showEmailInputModal() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'email-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = \`
          <div class="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Send Test Email</h3>
              <button onclick="closeEmailModal(event)" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                id="test-email-input" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter email address"
                value="test@example.com"
              />
            </div>
            
            <div class="flex space-x-3">
              <button 
                onclick="closeEmailModal(event)" 
                class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onclick="confirmSendTestEmail(event)" 
                class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Send Test
              </button>
            </div>
          </div>
        \`;
        
        document.body.appendChild(modal);
        
        // Focus on input and add Enter key support
        setTimeout(() => {
          const input = document.getElementById('test-email-input');
          if (input) {
            input.focus();
            input.select();
            
            // Add Enter key support
            input.addEventListener('keydown', function(event) {
              if (event.key === 'Enter') {
                confirmSendTestEmail();
              } else if (event.key === 'Escape') {
                closeEmailModal();
              }
            });
          }
        }, 100);
      }

      // Close email modal
      function closeEmailModal() {
        const modal = document.getElementById('email-modal');
        if (modal) {
          modal.remove();
        }
      }

      // Confirm and send test email
      async function confirmSendTestEmail() {
        try {
          const emailInput = document.getElementById('test-email-input');
          const textarea = document.getElementById('template-json');
          
          if (!emailInput || !textarea) return;
          
          const email = emailInput.value.trim();
          const jsonText = textarea.value;
          
          if (!email) {
            showStatus('Please enter an email address', 'error');
            return;
          }
          
          if (!jsonText.trim()) {
            showStatus('Please load a template first', 'error');
            return;
          }
          
          // Validate email format
          const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
          if (!emailRegex.test(email)) {
            showStatus('Please enter a valid email address', 'error');
            return;
          }
          
          let template = JSON.parse(jsonText);
          
          // Handle wrapped template structure (with title, description, json)
          if (template.json) {
            template = template.json;
          }
          
          // Close modal
          closeEmailModal();
          
          // Show loading state
          showStatus('Sending test email...', 'success');
          
          // Prepare email data
          const emailData = {
            to: [{ email: email, name: 'Test User' }],
            from: { email: 'marketing@waymore.io', name: 'Waymore Team' },
            subject: template.variables?.email_title || 'Test Email',
            template: template.template,
            variables: template.variables,
            metadata: {
              tenantId: 'admin_test',
              eventId: 'test_email',
              notificationType: 'test'
            }
          };
          
          // Debug: Log the email data being sent
          console.log('Sending test email with data:', emailData);
          
          // Send test email
          const response = await fetch('/admin/send-test-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
          });
          
          console.log('Response status:', response.status);
          
          if (response.ok) {
            const result = await response.json();
            console.log('Response result:', result);
            showStatus(\`Test email sent successfully to \${email}!\`, 'success');
          } else {
            const error = await response.json();
            console.error('Error response:', error);
            showStatus(\`Failed to send email: \${error.message || 'Unknown error'}\`, 'error');
          }
        } catch (error) {
          closeEmailModal();
          showStatus('Error sending test email', 'error');
          console.error('Error sending test email:', error);
        }
      }

      // Show status message
      function showStatus(message, type) {
        try {
          // Remove existing status messages
          const existing = document.querySelector('.status-message');
          if (existing) {
            existing.remove();
          }
          
          // Create new status message
          const statusDiv = document.createElement('div');
          statusDiv.className = \`status-message status-\${type}\`;
          statusDiv.textContent = message;
          statusDiv.style.display = 'block';
          
          // Find a safe place to insert the status message
          let targetElement = document.querySelector('#templates-tab .mb-12:last-of-type');
          
          // Fallback to other selectors if the first one fails
          if (!targetElement) {
            targetElement = document.querySelector('#templates-tab .mb-12');
          }
          
          if (!targetElement) {
            targetElement = document.querySelector('#templates-tab');
          }
          
          if (!targetElement) {
            targetElement = document.body;
          }
          
          // Insert the status message
          if (targetElement) {
            targetElement.appendChild(statusDiv);
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
              if (statusDiv && statusDiv.parentNode) {
                statusDiv.remove();
              }
            }, 3000);
          } else {
            // Fallback: use console if DOM insertion fails
            console.log(\`Status: \${message}\`);
          }
        } catch (error) {
          console.error('Error showing status message:', error);
          console.log(\`Status: \${message}\`);
        }
      }

      // Initialize event listeners when tab becomes active
      function initializeTemplateTab() {
        const textarea = document.getElementById('template-json');
        if (textarea && !textarea.hasAttribute('data-initialized')) {
          textarea.addEventListener('input', updatePreview);
          textarea.setAttribute('data-initialized', 'true');
        }
      }
      
      // Call initialization when the tab is shown
      setTimeout(initializeTemplateTab, 100);
    </script>
  `;
}
