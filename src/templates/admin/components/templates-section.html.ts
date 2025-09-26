export function generateTemplatesSection(data: any): string {
  return `
    <div id="templates-tab" class="tab-content">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          <i class="fas fa-code mr-3 text-indigo-600"></i>
          Universal Template Playground
        </h2>
        <p class="text-lg text-gray-600">
          Interactive playground for testing and exploring the universal email template system
        </p>
      </div>
      
      ${generateTemplateOverview()}
      ${generateTemplateExamples()}
      
      <style>
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
        .form-group {
          margin-bottom: 12px;
        }
        .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .form-group input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .form-group input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }
      </style>
      
      <script>
        // Template examples data
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
          'renewal-confirmation': {
            title: 'Renewal Confirmation',
            description: 'Successful renewal with billing details',
            json: ${JSON.stringify(getRenewalConfirmationExample(), null, 2)}
          },
          'downgrade': {
            title: 'Downgrade Confirmation',
            description: 'Plan downgrade with new limits',
            json: ${JSON.stringify(getDowngradeExample(), null, 2)}
          },
          'payment-failure-final': {
            title: 'Payment Failure Final',
            description: 'Final suspension warning for failed payments',
            json: ${JSON.stringify(getPaymentFailureFinalExample(), null, 2)}
          },
          'usage-100': {
            title: 'Usage Limit Reached',
            description: '100% usage reached with urgent upgrade',
            json: ${JSON.stringify(getUsage100Example(), null, 2)}
          },
          'renewal-7-days': {
            title: 'Renewal 7 Days',
            description: 'Early renewal reminder with billing tips',
            json: ${JSON.stringify(getRenewal7DaysExample(), null, 2)}
          }
        };
        
        async function sendTestEmail(key) {
          const emailInput = document.getElementById(\`email-\${key}\`);
          const sendBtn = document.getElementById(\`send-btn-\${key}\`);
          const statusDiv = document.getElementById(\`status-\${key}\`);
          
          const email = emailInput.value.trim();
          if (!email) {
            showStatus(key, 'Please enter your email address', 'error');
            return;
          }
          
          if (!isValidEmail(email)) {
            showStatus(key, 'Please enter a valid email address', 'error');
            return;
          }
          
          // Update button state
          sendBtn.disabled = true;
          sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
          
          try {
            const example = templateExamples[key];
            const emailData = {
              ...example.json,
              to: [{
                email: email,
                name: email.split('@')[0]
              }]
            };
            
            const response = await fetch('/admin/send-test-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(emailData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
              showStatus(key, '✅ Test email sent successfully! Check your inbox.', 'success');
            } else {
              showStatus(key, '❌ Failed to send email: ' + (result.error || 'Unknown error'), 'error');
            }
          } catch (error) {
            showStatus(key, '❌ Error sending email: ' + error.message, 'error');
          } finally {
            // Reset button state
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Test Email';
          }
        }
        
        function showStatus(key, message, type) {
          const statusDiv = document.getElementById(\`status-\${key}\`);
          statusDiv.textContent = message;
          statusDiv.className = 'status-message status-' + type;
          statusDiv.style.display = 'block';
          
          // Auto-hide success messages after 5 seconds
          if (type === 'success') {
            setTimeout(() => {
              statusDiv.style.display = 'none';
            }, 5000);
          }
        }
        
        function isValidEmail(email) {
          const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
          return emailRegex.test(email);
        }
        
        function copyExample(key) {
          const example = templateExamples[key];
          if (example) {
            navigator.clipboard.writeText(JSON.stringify(example.json, null, 2)).then(() => {
              alert('Example JSON copied to clipboard!');
            });
          }
        }
        
      </script>
    </div>`;
}

function generateTemplateOverview(): string {
  return `
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-8 border border-indigo-200">
      <div class="flex items-center mb-6">
        <div class="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mr-4">
          <i class="fas fa-rocket text-2xl text-indigo-600"></i>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-gray-900">Universal Template</h3>
          <p class="text-lg text-gray-600">Powerful, feature-rich email template with advanced customization</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg p-6 shadow-md border border-indigo-100">
          <div class="flex items-center mb-3">
            <i class="fas fa-mobile-alt text-xl text-blue-600 mr-3"></i>
            <h4 class="text-lg font-semibold text-gray-900">Responsive</h4>
          </div>
          <p class="text-gray-600 text-sm">Works across all email clients and devices</p>
        </div>
        
        <div class="bg-white rounded-lg p-6 shadow-md border border-indigo-100">
          <div class="flex items-center mb-3">
            <i class="fas fa-palette text-xl text-green-600 mr-3"></i>
            <h4 class="text-lg font-semibold text-gray-900">Customizable</h4>
          </div>
          <p class="text-gray-600 text-sm">Complete theme control with colors and fonts</p>
        </div>
        
        <div class="bg-white rounded-lg p-6 shadow-md border border-indigo-100">
          <div class="flex items-center mb-3">
            <i class="fas fa-globe text-xl text-purple-600 mr-3"></i>
            <h4 class="text-lg font-semibold text-gray-900">Multi-Language</h4>
          </div>
          <p class="text-gray-600 text-sm">Support for 6 languages with fallback</p>
        </div>
        
        <div class="bg-white rounded-lg p-6 shadow-md border border-indigo-100">
          <div class="flex items-center mb-3">
            <i class="fas fa-cogs text-xl text-orange-600 mr-3"></i>
            <h4 class="text-lg font-semibold text-gray-900">Interactive</h4>
          </div>
          <p class="text-gray-600 text-sm">Multi-button support and social media integration</p>
        </div>
      </div>
    </div>`;
}

function generateTemplateExamples(): string {
  return `
    <div class="mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-6">
        <i class="fas fa-eye mr-2 text-blue-600"></i>
        Template Examples
      </h3>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        ${generateExampleCard('Welcome Email', 'welcome', 'Basic welcome email with primary CTA', 'fas fa-handshake', 'bg-green-100', 'text-green-600')}
        ${generateExampleCard('Payment Success', 'payment-success', 'Transaction confirmation with facts table', 'fas fa-credit-card', 'bg-blue-100', 'text-blue-600')}
        ${generateExampleCard('Renewal Reminder', 'renewal-7', 'Subscription renewal with dual CTAs', 'fas fa-calendar', 'bg-yellow-100', 'text-yellow-600')}
        ${generateExampleCard('Usage Alert', 'usage-80', 'Usage notification with social links', 'fas fa-chart-line', 'bg-purple-100', 'text-purple-600')}
        ${generateExampleCard('Upgrade Confirmation', 'upgrade', 'Plan upgrade with custom theme', 'fas fa-arrow-up', 'bg-indigo-100', 'text-indigo-600')}
        ${generateExampleCard('Payment Failure', 'payment-failure', 'Failed payment with retry options', 'fas fa-exclamation-triangle', 'bg-red-100', 'text-red-600')}
        ${generateExampleCard('Renewal Confirmation', 'renewal-confirmation', 'Successful renewal with billing details', 'fas fa-check-circle', 'bg-green-100', 'text-green-600')}
        ${generateExampleCard('Downgrade Confirmation', 'downgrade', 'Plan downgrade with new limits', 'fas fa-arrow-down', 'bg-orange-100', 'text-orange-600')}
        ${generateExampleCard('Payment Failure Final', 'payment-failure-final', 'Final suspension warning for failed payments', 'fas fa-ban', 'bg-red-100', 'text-red-600')}
        ${generateExampleCard('Usage Limit Reached', 'usage-100', '100% usage reached with urgent upgrade', 'fas fa-exclamation-circle', 'bg-red-100', 'text-red-600')}
        ${generateExampleCard('Renewal 7 Days', 'renewal-7-days', 'Early renewal reminder with billing tips', 'fas fa-clock', 'bg-yellow-100', 'text-yellow-600')}
      </div>
    </div>`;
}

function generateExampleCard(title: string, key: string, description: string, icon: string, bgClass: string, textClass: string): string {
  return `
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
      <div class="p-6">
        <div class="flex items-center mb-4">
          <div class="flex items-center justify-center h-12 w-12 rounded-full ${bgClass} mr-4">
            <i class="${icon} text-xl ${textClass}"></i>
          </div>
          <div>
            <h4 class="text-lg font-semibold text-gray-900">${title}</h4>
            <p class="text-sm text-gray-600">${description}</p>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="form-group">
            <label for="email-${key}" class="block text-sm font-medium text-gray-700 mb-1">Your Email Address</label>
            <input type="email" 
                   id="email-${key}" 
                   placeholder="your-email@example.com" 
                   class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                   required>
          </div>
          
          <button onclick="sendTestEmail('${key}')" 
                  id="send-btn-${key}"
                  class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
            <i class="fas fa-paper-plane mr-2"></i>
            Send Test Email
          </button>
          
          <div id="status-${key}" class="status-message" style="display: none;"></div>
          
          <button onclick="copyExample('${key}')" 
                  class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            <i class="fas fa-copy mr-2"></i>
            Copy JSON
          </button>
        </div>
      </div>
    </div>`;
}



// Helper functions to generate example JSON
function getWelcomeExample() {
  return {
    "from": {
      "email": "marketing@waymore.io",
      "name": "Waymore Team"
    },
    "subject": "Welcome to Waymore!",
    "template": {
      "key": "universal",
      "locale": "en"
    },
    "to": [
      {
        "email": "user@example.com",
        "name": "John Doe"
      }
    ],
    "webhookUrl": "https://your-ngrok-url.ngrok.io/webhooks/routee",
    "variables": {
      "workspace_name": "Acme Corp",
      "user_firstname": "John",
      "product_name": "Waymore Platform",
      "support_email": "support@waymore.io",
      "email_title": "Welcome to Waymore!",
            "custom_content": "Hello {{user_firstname}},<br><br>🎉 <strong>Welcome to {{product_name}}!</strong><br><br>We're excited to have you on board. Here are some quick tips to get you started:<br><br>• <strong>Explore the dashboard</strong> to see your workspace overview<br>• <strong>Invite team members</strong> to collaborate on your projects<br>• <strong>Check out our documentation</strong> for detailed guides<br><br>If you have any questions, don't hesitate to reach out to our support team.",
      "facts": [
        {"label": "Account Type:", "value": "Pro Plan"},
        {"label": "Workspace:", "value": "Acme Corp"},
        {"label": "Setup Status:", "value": "Complete"}
      ],
      "cta_primary": {
        "label": "Get Started",
        "url": "https://go.waymore.io/dashboard"
      },
      "cta_secondary": {
        "label": "View Documentation",
        "url": "https://docs.waymore.io"
      }
    },
    "metadata": {
      "tenantId": "acme_corp",
      "eventId": "welcome_user",
      "notificationType": "welcome"
    }
  };
}

function getPaymentSuccessExample() {
  return {
    "from": {
      "email": "marketing@waymore.io",
      "name": "Waymore Team"
    },
    "subject": "Payment received for your Pro plan – Acme Corp",
    "template": {
      "key": "universal",
      "locale": "en"
    },
    "to": [
      {
        "email": "user@example.com",
        "name": "John Doe"
      }
    ],
    "webhookUrl": "https://your-ngrok-url.ngrok.io/webhooks/routee",
    "variables": {
      "workspace_name": "Acme Corp",
      "user_firstname": "John",
      "product_name": "Waymore Platform",
      "plan_name": "Pro",
      "payment_date": "01 Oct 2025",
      "amount_charged": "70.00",
      "currency": "EUR",
      "billing_url": "https://go.waymore.io/settings/account-billing",
      "support_email": "support@waymore.io",
      "email_title": "Payment Successful",
            "custom_content": "Hello {{user_firstname}},<br><br>✅ <strong>Payment Confirmed!</strong> We've successfully processed your payment for <strong>{{plan_name}}</strong> on <strong>{{payment_date}}</strong>.<br><br>💰 <strong>Amount charged:</strong> {{amount_charged}} {{currency}}<br>📄 <strong>Invoice:</strong> Your invoice will be available soon. You'll receive a separate email with your subscription confirmation and invoice link.<br><br>Thank you for keeping your subscription active!",
      "facts": [
        {"label": "Plan:", "value": "Pro"},
        {"label": "Payment Date:", "value": "01 Oct 2025"},
        {"label": "Amount Charged:", "value": "70.00 EUR"},
        {"label": "Workspace:", "value": "Acme Corp"}
      ],
      "cta_primary": {
        "label": "Manage Billing",
        "url": "https://go.waymore.io/settings/account-billing"
      }
    },
    "metadata": {
      "tenantId": "acme_corp",
      "eventId": "payment_success_generic",
      "notificationType": "payment_confirmation"
    }
  };
}

function getRenewalExample() {
  return {
    "from": {
      "email": "marketing@waymore.io",
      "name": "Waymore Team"
    },
    "subject": "Final reminder: Pro renews tomorrow for Acme Corp",
    "template": {
      "key": "universal",
      "locale": "en"
    },
    "to": [
      {
        "email": "user@example.com",
        "name": "John Doe"
      }
    ],
    "webhookUrl": "https://your-ngrok-url.ngrok.io/webhooks/routee",
    "variables": {
      "workspace_name": "Acme Corp",
      "user_firstname": "John",
      "product_name": "Waymore Platform",
      "plan_name": "Pro",
      "renewal_date": "01 Oct 2025",
      "next_charge_amount": "70.00",
      "currency": "EUR",
      "billing_url": "https://go.waymore.io/settings/account-billing",
      "support_email": "support@waymore.io",
      "email_title": "Final Reminder: Pro renews tomorrow",
            "custom_content": "Hello {{user_firstname}},<br><br>This is a friendly reminder that your <strong>{{plan_name}}</strong> subscription for <strong>{{workspace_name}}</strong> renews on <strong>{{renewal_date}}</strong>.<br><br>💰 <strong>Upcoming charge:</strong> {{next_charge_amount}} {{currency}}<br><br>⚠️ <strong>Please confirm your payment details</strong> to avoid service interruption.",
      "facts": [
        {"label": "Plan:", "value": "Pro"},
        {"label": "Renewal Date:", "value": "01 Oct 2025"},
        {"label": "Charge Amount:", "value": "70.00 EUR"},
        {"label": "Workspace:", "value": "Acme Corp"}
      ],
      "cta_primary": {
        "label": "Manage Billing",
        "url": "https://go.waymore.io/settings/account-billing"
      }
    },
    "metadata": {
      "tenantId": "acme_corp",
      "eventId": "renewal_1_day_final",
      "notificationType": "renewal_final_reminder"
    }
  };
}

function getUsageExample() {
  return {
    "from": {
      "email": "marketing@waymore.io",
      "name": "Waymore Team"
    },
    "subject": "Usage Threshold Warning",
    "template": {
      "key": "universal",
      "locale": "en"
    },
    "to": [
      {
        "email": "user@example.com",
        "name": "John Doe"
      }
    ],
    "webhookUrl": "https://your-ngrok-url.ngrok.io/webhooks/routee",
    "variables": {
      "workspace_name": "Acme Corp",
      "user_firstname": "John",
      "product_name": "Waymore Platform",
      "plan_name": "Advanced",
      "usage_percent": "80",
      "usage_current": "24,000",
      "usage_limit": "30,000",
      "usage_metric": "contacts",
      "upgrade_url": "https://go.waymore.io/settings/account-billing",
      "support_email": "support@waymore.io",
      "email_title": "Usage Threshold Warning",
            "custom_content": "Hello {{user_firstname}},<br><br>Your current <strong>{{product_name}}</strong> subscription <strong>{{plan_name}}</strong> is at <strong>{{usage_percent}}%</strong> of its limit.<br><br>👉 <strong>To avoid interruptions</strong>, you may want to review your plan and upgrade if needed.",
      "facts": [
        {"label": "Used:", "value": "24,000 contacts"},
        {"label": "Limit:", "value": "30,000 contacts"},
        {"label": "Usage:", "value": "80%"}
      ],
      "cta_primary": {
        "label": "Manage Plan",
        "url": "https://go.waymore.io/settings/account-billing"
      }
    },
    "metadata": {
      "tenantId": "acme_corp",
      "eventId": "usage_threshold_80",
      "notificationType": "usage_warning"
    }
  };
}

function getUpgradeExample() {
  return {
    "from": {
      "email": "marketing@waymore.io",
      "name": "Waymore Team"
    },
    "subject": "Your plan has been upgraded to Advanced",
    "template": {
      "key": "universal",
      "locale": "en"
    },
    "to": [
      {
        "email": "user@example.com",
        "name": "John Doe"
      }
    ],
    "webhookUrl": "https://your-ngrok-url.ngrok.io/webhooks/routee",
    "variables": {
      "workspace_name": "Acme Corp",
      "user_firstname": "John",
      "product_name": "Waymore Platform",
      "old_plan_name": "Basic",
      "new_plan_name": "Advanced",
      "upgrade_date": "10 Oct 2025",
      "new_limits": "100,000 contacts, 3GB storage, Advanced analytics",
      "billing_change": "Prorated charge €20 added to next invoice",
      "billing_url": "https://go.waymore.io/settings/account-billing",
      "support_email": "support@waymore.io",
      "email_title": "Plan Upgrade Successful",
      "custom_content": "Hello {{user_firstname}},<br><br>🎉 <strong>Congratulations!</strong> Your subscription for <strong>{{workspace_name}}</strong> has been successfully upgraded.<br><br>📈 <strong>Plan Change:</strong> {{old_plan_name}} → {{new_plan_name}}<br>📅 <strong>Effective from:</strong> {{upgrade_date}}<br>✨ <strong>New features:</strong> {{new_limits}}<br>💰 <strong>Billing update:</strong> {{billing_change}}<br><br>You now have access to your enhanced plan benefits!",
      "facts": [
        {"label": "Previous Plan:", "value": "Basic"},
        {"label": "New Plan:", "value": "Advanced"},
        {"label": "Effective Date:", "value": "10 Oct 2025"},
        {"label": "New Features:", "value": "100,000 contacts, 3GB storage, Advanced analytics"},
        {"label": "Billing Update:", "value": "Prorated charge €20 added to next invoice"},
        {"label": "Workspace:", "value": "Acme Corp"}
      ],
      "cta_primary": {
        "label": "Manage Plan",
        "url": "https://go.waymore.io/settings/account-billing"
      },
      "cta_secondary": {
        "label": "View Features",
        "url": "https://go.waymore.io/features"
      }
    },
    "metadata": {
      "tenantId": "acme_corp",
      "eventId": "upgrade_confirmation_success",
      "notificationType": "upgrade_confirmation"
    }
  };
}

function getPaymentFailureExample() {
  return {
    "from": {
      "email": "marketing@waymore.io",
      "name": "Waymore Team"
    },
    "subject": "Action required: Payment failed for your Pro subscription",
    "template": {
      "key": "universal",
      "locale": "en"
    },
    "to": [
      {
        "email": "user@example.com",
        "name": "John Doe"
      }
    ],
    "webhookUrl": "https://your-ngrok-url.ngrok.io/webhooks/routee",
    "variables": {
      "workspace_name": "Acme Corp",
      "user_firstname": "John",
      "product_name": "Waymore Platform",
      "plan_name": "Pro",
      "payment_date": "01 Oct 2025",
      "amount_attempted": "70.00",
      "currency": "EUR",
      "failure_reason": "Insufficient funds",
      "next_retry_date": "03 Oct 2025",
      "payment_update_url": "https://go.waymore.io/settings/account-billing/payment-methods",
      "billing_url": "https://go.waymore.io/settings/account-billing",
      "support_email": "support@waymore.io",
      "email_title": "Payment Failed - Action Required",
      "custom_content": "Hello {{user_firstname}},<br><br>⚠️ <strong>Payment Failed</strong> - We tried to process your payment for <strong>{{plan_name}}</strong>, but it failed on <strong>{{payment_date}}</strong>.<br><br>💰 <strong>Amount:</strong> {{amount_attempted}} {{currency}}<br>❌ <strong>Reason:</strong> {{failure_reason}}<br>🔄 <strong>Next retry attempt:</strong> {{next_retry_date}}<br><br>Please update your payment details to ensure your subscription continues without interruption.",
      "facts": [
        {"label": "Plan:", "value": "Pro"},
        {"label": "Payment Date:", "value": "01 Oct 2025"},
        {"label": "Amount Attempted:", "value": "70.00 EUR"},
        {"label": "Failure Reason:", "value": "Insufficient funds"},
        {"label": "Next Retry:", "value": "03 Oct 2025"},
        {"label": "Workspace:", "value": "Acme Corp"}
      ],
      "cta_primary": {
        "label": "Update Payment Method",
        "url": "https://go.waymore.io/settings/account-billing/payment-methods"
      },
      "cta_secondary": {
        "label": "Manage Billing",
        "url": "https://go.waymore.io/settings/account-billing"
      }
    },
    "metadata": {
      "tenantId": "acme_corp",
      "eventId": "payment_failure_attempt_1",
      "notificationType": "payment_failure"
    }
  };
}

function getRenewalConfirmationExample() {
  return {
    "from": {
      "email": "marketing@waymore.io",
      "name": "Waymore Team"
    },
    "subject": "Your Pro plan has been renewed for Acme Corp",
    "template": {
      "key": "universal",
      "locale": "en"
    },
    "to": [
      {
        "email": "user@example.com",
        "name": "John Doe"
      }
    ],
    "webhookUrl": "https://your-ngrok-url.ngrok.io/webhooks/routee",
    "variables": {
      "workspace_name": "Acme Corp",
      "user_firstname": "John",
      "product_name": "Waymore Platform",
      "plan_name": "Pro",
      "renewal_date": "01 Oct 2025",
      "period_start": "01 Oct 2025",
      "period_end": "31 Oct 2025",
      "amount_charged": "70.00",
      "currency": "EUR",
      "invoice_url": "https://go.waymore.io/settings/account-billing/invoices/inv_123",
      "billing_url": "https://go.waymore.io/settings/account-billing",
      "support_email": "support@waymore.io",
      "email_title": "Renewal Successful",
      "custom_content": "Hello {{user_firstname}},<br><br>🎉 <strong>Great news!</strong> Your <strong>{{plan_name}}</strong> subscription for <strong>{{workspace_name}}</strong> renewed successfully on <strong>{{renewal_date}}</strong>.<br><br>✅ <strong>Billing period:</strong> {{period_start}} → {{period_end}}<br>💰 <strong>Charged:</strong> {{amount_charged}} {{currency}}<br>📄 <strong>Invoice:</strong> <a href=\"{{invoice_url}}\" style=\"color: #007bff;\">View invoice</a><br><br>You're all set for the new period!",
      "facts": [
        {"label": "Plan:", "value": "Pro"},
        {"label": "Renewal Date:", "value": "01 Oct 2025"},
        {"label": "Billing Period:", "value": "01 Oct 2025 → 31 Oct 2025"},
        {"label": "Amount Charged:", "value": "70.00 EUR"},
        {"label": "Workspace:", "value": "Acme Corp"}
      ],
      "cta_primary": {
        "label": "Manage Billing",
        "url": "https://go.waymore.io/settings/account-billing"
      },
      "cta_secondary": {
        "label": "View Invoice",
        "url": "https://go.waymore.io/settings/account-billing/invoices/inv_123"
      }
    },
    "metadata": {
      "tenantId": "acme_corp",
      "eventId": "renewal_confirmation_success",
      "notificationType": "renewal_confirmation"
    }
  };
}

function getDowngradeExample() {
  return {
    "from": {
      "email": "marketing@waymore.io",
      "name": "Waymore Team"
    },
    "subject": "Your subscription has been downgraded to Basic",
    "template": {
      "key": "universal",
      "locale": "en"
    },
    "to": [
      {
        "email": "user@example.com",
        "name": "John Doe"
      }
    ],
    "webhookUrl": "https://your-ngrok-url.ngrok.io/webhooks/routee",
    "variables": {
      "workspace_name": "Acme Corp",
      "user_firstname": "John",
      "product_name": "Waymore Platform",
      "old_plan_name": "Advanced",
      "new_plan_name": "Basic",
      "downgrade_date": "15 Oct 2025",
      "new_limits": "10,000 contacts, 1GB storage, Basic analytics",
      "billing_change": "Lower monthly charge €12 from next cycle",
      "billing_url": "https://go.waymore.io/settings/account-billing",
      "support_email": "support@waymore.io",
      "email_title": "Plan Change Confirmed",
      "custom_content": "Hello {{user_firstname}},<br><br>📋 <strong>Plan Change Confirmed</strong> - Your subscription for <strong>{{workspace_name}}</strong> has been successfully changed.<br><br>📉 <strong>Plan Change:</strong> {{old_plan_name}} → {{new_plan_name}}<br>📅 <strong>Effective from:</strong> {{downgrade_date}}<br>📊 <strong>New limits:</strong> {{new_limits}}<br>💰 <strong>Billing update:</strong> {{billing_change}}<br><br>Please review your new plan limits to ensure they meet your needs.",
      "facts": [
        {"label": "Previous Plan:", "value": "Advanced"},
        {"label": "New Plan:", "value": "Basic"},
        {"label": "Effective Date:", "value": "15 Oct 2025"},
        {"label": "New Limits:", "value": "10,000 contacts, 1GB storage, Basic analytics"},
        {"label": "Billing Update:", "value": "Lower monthly charge €12 from next cycle"},
        {"label": "Workspace:", "value": "Acme Corp"}
      ],
      "cta_primary": {
        "label": "Manage Plan",
        "url": "https://go.waymore.io/settings/account-billing"
      },
      "cta_secondary": {
        "label": "View Current Usage",
        "url": "https://go.waymore.io/usage"
      }
    },
    "metadata": {
      "tenantId": "acme_corp",
      "eventId": "downgrade_confirmation_success",
      "notificationType": "downgrade_confirmation"
    }
  };
}

function getPaymentFailureFinalExample() {
  return {
    "from": {
      "email": "marketing@waymore.io",
      "name": "Waymore Team"
    },
    "subject": "URGENT: Service suspension pending - Payment failed",
    "template": {
      "key": "universal",
      "locale": "en"
    },
    "to": [
      {
        "email": "user@example.com",
        "name": "John Doe"
      }
    ],
    "webhookUrl": "https://your-ngrok-url.ngrok.io/webhooks/routee",
    "variables": {
      "workspace_name": "Acme Corp",
      "user_firstname": "John",
      "product_name": "Waymore Platform",
      "plan_name": "Pro",
      "payment_date": "01 Oct 2025",
      "amount_attempted": "70.00",
      "currency": "EUR",
      "failure_reason": "Insufficient funds",
      "suspension_date": "05 Oct 2025",
      "payment_update_url": "https://go.waymore.io/settings/account-billing/payment-methods",
      "support_url": "https://go.waymore.io/support",
      "billing_url": "https://go.waymore.io/settings/account-billing",
      "support_email": "support@waymore.io",
      "email_title": "URGENT: Service Suspension Pending",
      "custom_content": "Hello {{user_firstname}},<br><br>🚨 <strong>URGENT ACTION REQUIRED</strong> - Your <strong>{{plan_name}}</strong> subscription for <strong>{{workspace_name}}</strong> is at risk of suspension.<br><br>❌ <strong>Payment Status:</strong> All retry attempts have failed<br>💰 <strong>Amount:</strong> {{amount_attempted}} {{currency}}<br>📅 <strong>Suspension Date:</strong> {{suspension_date}}<br>⚠️ <strong>Consequence:</strong> Service will be suspended and data access will be limited<br><br><strong>IMMEDIATE ACTION REQUIRED:</strong> Update your payment method now to prevent service interruption.",
      "facts": [
        {"label": "Plan:", "value": "Pro"},
        {"label": "Payment Date:", "value": "01 Oct 2025"},
        {"label": "Amount Attempted:", "value": "70.00 EUR"},
        {"label": "Failure Reason:", "value": "Insufficient funds"},
        {"label": "Suspension Date:", "value": "05 Oct 2025"},
        {"label": "Workspace:", "value": "Acme Corp"}
      ],
      "cta_primary": {
        "label": "Fix Payment Now",
        "url": "https://go.waymore.io/settings/account-billing/payment-methods"
      },
      "cta_secondary": {
        "label": "Contact Support",
        "url": "https://go.waymore.io/support"
      }
    },
    "metadata": {
      "tenantId": "acme_corp",
      "eventId": "payment_failure_final_suspension",
      "notificationType": "payment_failure_final"
    }
  };
}

function getUsage100Example() {
  return {
    "from": {
      "email": "marketing@waymore.io",
      "name": "Waymore Team"
    },
    "subject": "Usage Limit Reached",
    "template": {
      "key": "universal",
      "locale": "en"
    },
    "to": [
      {
        "email": "user@example.com",
        "name": "John Doe"
      }
    ],
    "webhookUrl": "https://your-ngrok-url.ngrok.io/webhooks/routee",
    "variables": {
      "workspace_name": "Acme Corp",
      "user_firstname": "John",
      "product_name": "Waymore Platform",
      "plan_name": "Advanced",
      "usage_percent": "100",
      "usage_current": "30,000",
      "usage_limit": "30,000",
      "usage_metric": "contacts",
      "upgrade_url": "https://go.waymore.io/settings/account-billing",
      "support_email": "support@waymore.io",
      "email_title": "Usage Limit Reached",
      "custom_content": "Hello {{user_firstname}},<br><br>🚨 <strong>URGENT:</strong> Your {{product_name}} subscription has reached its limit!<br><br>Your <strong>{{plan_name}}</strong> plan is now <strong>blocked</strong> until you upgrade.<br><br>⚠️ <strong>Action Required:</strong> Upgrade your plan immediately to restore service.",
      "facts": [
        {"label": "Used:", "value": "30,000 contacts"},
        {"label": "Limit:", "value": "30,000 contacts"},
        {"label": "Status:", "value": "100% - Blocked"}
      ],
      "cta_primary": {
        "label": "Upgrade Plan",
        "url": "https://go.waymore.io/settings/account-billing"
      }
    },
    "metadata": {
      "tenantId": "acme_corp",
      "eventId": "usage_100_reached",
      "notificationType": "usage_limit_reached"
    }
  };
}

function getRenewal7DaysExample() {
  return {
    "from": {
      "email": "marketing@waymore.io",
      "name": "Waymore Team"
    },
    "subject": "Renewal Reminder",
    "template": {
      "key": "universal",
      "locale": "en"
    },
    "to": [
      {
        "email": "user@example.com",
        "name": "John Doe"
      }
    ],
    "webhookUrl": "https://your-ngrok-url.ngrok.io/webhooks/routee",
    "variables": {
      "workspace_name": "Acme Corp",
      "user_firstname": "John",
      "product_name": "Waymore Platform",
      "plan_name": "Advanced",
      "renewal_date": "01 Oct 2025",
      "billing_url": "https://go.waymore.io/settings/account-billing",
      "support_email": "support@waymore.io",
      "email_title": "Renewal Reminder",
      "custom_content": "Hello {{user_firstname}},<br><br>Your <strong>{{plan_name}}</strong> plan will renew on <strong>{{renewal_date}}</strong>.<br><br>💡 <strong>Tip:</strong> Make sure your payment method is up to date to avoid any service interruptions.",
      "facts": [
        {"label": "Plan:", "value": "Advanced"},
        {"label": "Renewal Date:", "value": "01 Oct 2025"},
        {"label": "Workspace:", "value": "Acme Corp"}
      ],
      "cta_primary": {
        "label": "Manage Billing",
        "url": "https://go.waymore.io/settings/account-billing"
      }
    },
    "metadata": {
      "tenantId": "acme_corp",
      "eventId": "renewal_7_days",
      "notificationType": "renewal_reminder"
    }
  };
}
