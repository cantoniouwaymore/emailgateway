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
  getMonthlyReportExample,
  getDarkModeExample,
  getCountdownExample
} from './template-examples';

export function generateTemplateScripts(): string {
  return `
    <script>
      // Template examples data - imported from template-examples.ts
      const templateExamples = {
        'welcome': ${JSON.stringify(getWelcomeExample(), null, 2)},
        'payment-success': ${JSON.stringify(getPaymentSuccessExample(), null, 2)},
        'renewal-7': ${JSON.stringify(getRenewalExample(), null, 2)},
        'usage-80': ${JSON.stringify(getUsageExample(), null, 2)},
        'upgrade': ${JSON.stringify(getUpgradeExample(), null, 2)},
        'payment-failure': ${JSON.stringify(getPaymentFailureExample(), null, 2)},
        'invoice': ${JSON.stringify(getInvoiceExample(), null, 2)},
        'password-reset': ${JSON.stringify(getPasswordResetExample(), null, 2)},
        'monthly-report': ${JSON.stringify(getMonthlyReportExample(), null, 2)},
        'dark-mode': ${JSON.stringify(getDarkModeExample(), null, 2)},
        'countdown': ${JSON.stringify(getCountdownExample(), null, 2)}
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
          console.log('Parsed template hero:', template.hero);
          preview.innerHTML = generateEmailPreview(template);
        } catch (error) {
          const preview = document.getElementById('email-preview');
          if (preview) {
            const errorMessage = error.message || 'Unknown JSON parsing error';
            const errorDetails = errorMessage.includes('JSON') ? errorMessage : \`JSON Parse Error: \${errorMessage}\`;
            
            // Extract position information from error message
            const positionMatch = errorMessage.match(/position (\d+)/);
            const lineMatch = errorMessage.match(/line (\d+)/);
            const columnMatch = errorMessage.match(/column (\d+)/);
            
            let positionInfo = '';
            if (positionMatch) {
              positionInfo += \`Position: \${positionMatch[1]}\`;
            }
            if (lineMatch) {
              positionInfo += positionInfo ? \` | Line: \${lineMatch[1]}\` : \`Line: \${lineMatch[1]}\`;
            }
            if (columnMatch) {
              positionInfo += positionInfo ? \` | Column: \${columnMatch[1]}\` : \`Column: \${columnMatch[1]}\`;
            }
            
            // Try to show the problematic character
            let charInfo = '';
            if (positionMatch) {
              const pos = parseInt(positionMatch[1]);
              const textarea = document.getElementById('template-json');
              if (textarea && pos < textarea.value.length) {
                const char = textarea.value[pos];
                const charCode = char.charCodeAt(0);
                charInfo = \`Character at position \${pos}: '\${char}' (ASCII: \${charCode})\`;
              }
            }
            
            preview.innerHTML = \`
              <div class="text-center text-red-500 py-8">
                <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                <p class="font-medium mb-2">Invalid JSON format</p>
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-lg mx-auto">
                  <p class="text-sm text-red-700 text-left font-mono mb-2">\${errorDetails}</p>
                  \${positionInfo ? \`<p class="text-xs text-red-600 text-left mb-2"><strong>Location:</strong> \${positionInfo}</p>\` : ''}
                  \${charInfo ? \`<p class="text-xs text-red-600 text-left mb-2"><strong>Character:</strong> \${charInfo}</p>\` : ''}
                  <div class="text-xs text-red-600 text-left">
                    <p class="font-medium mb-1">Common JSON issues:</p>
                    <ul class="list-disc list-inside space-y-1">
                      <li>Missing comma between properties</li>
                      <li>Trailing comma after last property</li>
                      <li>Unquoted property names</li>
                      <li>Mismatched brackets or braces</li>
                      <li>Invalid escape sequences in strings</li>
                    </ul>
                  </div>
                </div>
                <p class="text-xs text-red-600 mt-3">Use the Format button to auto-fix common issues</p>
              </div>
            \`;
          }
        }
      }

      // Generate enhanced email preview HTML
      function generateEmailPreview(template) {
        // Template is now directly the JSON structure
        
        if (!template.template || !template.variables) {
          return \`
            <div class="text-center text-red-500 py-8">
              <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
              <p class="font-medium mb-2">Invalid template structure</p>
              <div class="bg-red-50 border border-red-200 rounded-lg p-3 max-w-md mx-auto">
                <p class="text-sm text-red-700 text-left">
                  Template must contain both "template" and "variables" objects.
                  <br><br>
                  Expected structure:
                  <br><code class="text-xs">{"template": {...}, "variables": {...}}</code>
                </p>
              </div>
              <p class="text-xs text-red-600 mt-3">Use the Validate button to get detailed feedback</p>
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
          copyright_text: vars.copyright_text || '',
          progress_bars: vars.progress_bars || [],
          countdown: vars.countdown || null
        };
        
        // Countdown calculation helper function
        function calculateCountdown(targetDate, unit) {
          try {
            const target = new Date(targetDate);
            const now = new Date();
            const diff = target.getTime() - now.getTime();
            
            if (diff <= 0) {
              return '0'; // Countdown expired
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            switch (unit.toLowerCase()) {
              case 'days':
                return days.toString();
              case 'hours':
                return hours.toString();
              case 'minutes':
                return minutes.toString();
              case 'seconds':
                return seconds.toString();
              default:
                return '0';
            }
          } catch (error) {
            console.warn('Countdown calculation failed:', error);
            return '0';
          }
        }

        // Helper to check if countdown has expired
        function isCountdownExpired(targetDate) {
          try {
            const target = new Date(targetDate);
            const now = new Date();
            return target.getTime() <= now.getTime();
          } catch (error) {
            console.warn('Countdown expiry check failed:', error);
            return true;
          }
        }

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
        
        // Check if using object-based structure
        const isObjectBased = vars.header || vars.hero || vars.title || vars.body || vars.snapshot || vars.visual || vars.actions || vars.support || vars.footer;
        
        if (isObjectBased) {
          // Object-based structure rendering - simplified to avoid nested template literals
          let html = '<div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm" style="font-family: ' + (theme.font_family || 'Inter, Helvetica, Arial, sans-serif') + ';">';
          
          // Header Section
          if (vars.header && vars.header.show !== false) {
            html += '<div class="text-center mb-6">';
            if (vars.header.logo_url) {
              html += '<img src="' + vars.header.logo_url + '" alt="' + (vars.header.logo_alt || 'Logo') + '" class="w-32 h-auto mx-auto mb-4 rounded-lg">';
            }
            if (vars.header.tagline) {
              html += '<p class="text-sm mb-2" style="color: ' + (theme.muted_text_color || '#6b7280') + '">' + vars.header.tagline + '</p>';
            }
            html += '</div>';
          }
          
          // Hero Section
          if (vars.hero && vars.hero.show) {
            html += '<div class="text-center mb-6">';
            if (vars.hero.type === 'icon') {
              html += '<div class="text-4xl mb-2">' + (vars.hero.icon || '📧') + '</div>';
            } else if (vars.hero.type === 'image' && vars.hero.image_url) {
              // Only support fixed pixel widths for email compatibility
              let imageWidth = vars.hero.image_width || '120px';
              
              // Convert percentage widths to fixed pixels with warning
              if (imageWidth.includes('%')) {
                console.warn('Percentage widths not supported in emails. Converting to fixed pixels.');
                if (imageWidth === '100%') imageWidth = '600px';
                else if (imageWidth === '75%') imageWidth = '450px';
                else if (imageWidth === '50%') imageWidth = '300px';
                else if (imageWidth === '25%') imageWidth = '150px';
                else imageWidth = '400px'; // Default for other percentages
              }
              
              console.log('Hero image rendering:', { 
                image_url: vars.hero.image_url, 
                image_width: vars.hero.image_width, 
                finalWidth: imageWidth 
              });
              html += '<img src="' + vars.hero.image_url + '" alt="' + (vars.hero.image_alt || 'Hero Image') + '" style="width: ' + imageWidth + ' !important; height: auto !important; max-width: ' + imageWidth + ';" class="mx-auto mb-2 rounded-lg">';
            }
            html += '</div>';
          }
          
          // Title Section
          if (vars.title && vars.title.show !== false) {
            html += '<div class="text-center mb-6">';
            html += '<h1 class="text-2xl font-bold mb-2" style="color: ' + (vars.title.color || theme.heading_color || '#1f2937') + '; font-size: ' + (vars.title.size || '28px') + '; font-weight: ' + (vars.title.weight || '700') + '; text-align: ' + (vars.title.align || 'center') + ';">';
            html += vars.title.text || processedVars.email_title || 'Email Title';
            html += '</h1></div>';
          }
          
          // Body Section
          if (vars.body && vars.body.show !== false) {
            html += '<div class="prose max-w-none mb-6">';
            (vars.body.paragraphs || []).forEach(paragraph => {
              html += '<div class="text-gray-700 mb-4" style="color: ' + (vars.body.color || theme.text_color || '#374151') + '; font-size: ' + (vars.body.font_size || theme.font_size || '16px') + '; line-height: ' + (vars.body.line_height || theme.line_height || '26px') + ';">';
              html += paragraph.replace(/\\{\\{user_firstname\\}\\}/g, processedVars.user_firstname)
                              .replace(/\\{\\{product_name\\}\\}/g, processedVars.product_name)
                              .replace(/\\{\\{workspace_name\\}\\}/g, processedVars.workspace_name)
                              .replace(/\\{\\{current_date\\}\\}/g, processedVars.current_date)
                              .replace(/\\{\\{transaction_id\\}\\}/g, processedVars.transaction_id)
                              .replace(/\\{\\{next_billing_date\\}\\}/g, processedVars.next_billing_date);
              html += '</div>';
            });
            html += '</div>';
          }
          
          // Snapshot Section
          if (vars.snapshot && vars.snapshot.show !== false) {
            html += '<div class="mb-6">';
            if (vars.snapshot.title) {
              html += '<h3 class="text-lg font-semibold mb-3 text-center" style="color: ' + (theme.heading_color || '#1f2937') + '">' + vars.snapshot.title + '</h3>';
            }
            html += '<div class="bg-gray-50 rounded-lg overflow-hidden" style="background-color: ' + (theme.card_background || '#f8fafc') + ';">';
            html += '<table class="w-full">';
            html += '<thead><tr style="background-color: ' + (theme.card_background || '#f8fafc') + ';">';
            html += '<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color: ' + (theme.heading_color || '#1f2937') + '">Label</th>';
            html += '<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color: ' + (theme.heading_color || '#1f2937') + '">Value</th>';
            html += '</tr></thead><tbody>';
            (vars.snapshot.facts || []).forEach(fact => {
              html += '<tr class="border-t" style="border-color: ' + (theme.border_color || '#e5e7eb') + ';">';
              html += '<td class="px-4 py-3 font-medium" style="color: ' + (theme.text_color || '#374151') + '">' + fact.label + '</td>';
              html += '<td class="px-4 py-3" style="color: ' + (theme.text_color || '#374151') + '">' + fact.value.replace(/\\{\\{user_firstname\\}\\}/g, processedVars.user_firstname)
                                                                                    .replace(/\\{\\{product_name\\}\\}/g, processedVars.product_name)
                                                                                    .replace(/\\{\\{current_date\\}\\}/g, processedVars.current_date)
                                                                                    .replace(/\\{\\{transaction_id\\}\\}/g, processedVars.transaction_id)
                                                                                    .replace(/\\{\\{next_billing_date\\}\\}/g, processedVars.next_billing_date) + '</td>';
              html += '</tr>';
            });
            html += '</tbody></table></div></div>';
          }
          
          // Actions Section
          if (vars.actions && vars.actions.show !== false) {
            html += '<div class="mb-6 text-center">';
            if (vars.actions.primary) {
              html += '<a href="' + vars.actions.primary.url.replace(/\\{\\{transaction_id\\}\\}/g, processedVars.transaction_id) + '" class="inline-block px-6 py-3 rounded-lg font-semibold text-white mr-3 mb-2" style="background-color: ' + (vars.actions.primary.color || theme.primary_button_color || '#3b82f6') + '; color: ' + (vars.actions.primary.text_color || theme.primary_button_text_color || '#ffffff') + ';">';
              html += vars.actions.primary.label + '</a>';
            }
            if (vars.actions.secondary && vars.actions.secondary.show !== false) {
              html += '<a href="' + vars.actions.secondary.url + '" class="inline-block px-4 py-2 text-sm font-medium" style="color: ' + (vars.actions.secondary.color || theme.secondary_button_color || '#6b7280') + ';">';
              html += vars.actions.secondary.label + '</a>';
            }
            html += '</div>';
          }
          
          // Visual Section
          if (vars.visual && vars.visual.show !== false) {
            if (vars.visual.type === 'countdown' && vars.visual.countdown) {
              const countdown = vars.visual.countdown;
              if (!isCountdownExpired(countdown.target_date)) {
                html += '<div class="mb-6">';
                html += '<div class="bg-gray-50 rounded-lg p-6 text-center" style="background-color: ' + (theme.card_background || '#f8fafc') + '; border: 1px solid ' + (theme.border_color || '#e5e7eb') + ';">';
                html += '<div class="text-base font-semibold mb-4" style="color: ' + (theme.heading_color || '#1f2937') + ';">' + countdown.message + '</div>';
                html += '<div class="flex justify-center gap-6 flex-wrap py-5">';
                
                if (countdown.show_days) {
                  html += '<div class="text-center px-3 py-4 bg-white rounded-xl border min-w-[80px]" style="background-color: ' + (theme.card_background || '#f8fafc') + '; border: 1px solid ' + (theme.border_color || '#e5e7eb') + '; border-radius: 12px;">';
                  html += '<div class="text-3xl font-bold mb-1" style="color: ' + (theme.primary_button_color || '#3b82f6') + '; line-height: 1;">' + calculateCountdown(countdown.target_date, 'days') + '</div>';
                  html += '<div class="text-xs uppercase tracking-wider font-semibold" style="color: ' + (theme.muted_text_color || '#6b7280') + '; letter-spacing: 0.8px;">Days</div>';
                  html += '</div>';
                }
                
                if (countdown.show_hours) {
                  html += '<div class="text-center px-3 py-4 bg-white rounded-xl border min-w-[80px]" style="background-color: ' + (theme.card_background || '#f8fafc') + '; border: 1px solid ' + (theme.border_color || '#e5e7eb') + '; border-radius: 12px;">';
                  html += '<div class="text-3xl font-bold mb-1" style="color: ' + (theme.primary_button_color || '#3b82f6') + '; line-height: 1;">' + calculateCountdown(countdown.target_date, 'hours') + '</div>';
                  html += '<div class="text-xs uppercase tracking-wider font-semibold" style="color: ' + (theme.muted_text_color || '#6b7280') + '; letter-spacing: 0.8px;">Hours</div>';
                  html += '</div>';
                }
                
                if (countdown.show_minutes) {
                  html += '<div class="text-center px-3 py-4 bg-white rounded-xl border min-w-[80px]" style="background-color: ' + (theme.card_background || '#f8fafc') + '; border: 1px solid ' + (theme.border_color || '#e5e7eb') + '; border-radius: 12px;">';
                  html += '<div class="text-3xl font-bold mb-1" style="color: ' + (theme.primary_button_color || '#3b82f6') + '; line-height: 1;">' + calculateCountdown(countdown.target_date, 'minutes') + '</div>';
                  html += '<div class="text-xs uppercase tracking-wider font-semibold" style="color: ' + (theme.muted_text_color || '#6b7280') + '; letter-spacing: 0.8px;">Minutes</div>';
                  html += '</div>';
                }
                
                if (countdown.show_seconds) {
                  html += '<div class="text-center px-3 py-4 bg-white rounded-xl border min-w-[80px]" style="background-color: ' + (theme.card_background || '#f8fafc') + '; border: 1px solid ' + (theme.border_color || '#e5e7eb') + '; border-radius: 12px;">';
                  html += '<div class="text-3xl font-bold mb-1" style="color: ' + (theme.primary_button_color || '#3b82f6') + '; line-height: 1;">' + calculateCountdown(countdown.target_date, 'seconds') + '</div>';
                  html += '<div class="text-xs uppercase tracking-wider font-semibold" style="color: ' + (theme.muted_text_color || '#6b7280') + '; letter-spacing: 0.8px;">Seconds</div>';
                  html += '</div>';
                }
                
                html += '</div>';
                if (countdown.target_date) {
                  html += '<div class="text-xs mt-3" style="color: ' + (theme.muted_text_color || '#6b7280') + ';">';
                  html += 'Target: ' + new Date(countdown.target_date).toLocaleDateString();
                  html += '</div>';
                }
                html += '</div></div>';
              } else {
                html += '<div class="mb-6">';
                html += '<div class="bg-gray-50 rounded-lg p-6 text-center" style="background-color: ' + (theme.card_background || '#f8fafc') + '; border: 1px solid ' + (theme.border_color || '#e5e7eb') + ';">';
                html += '<div class="text-base font-semibold" style="color: ' + (theme.muted_text_color || '#6b7280') + ';">⏰ This offer has expired</div>';
                html += '</div></div>';
              }
            } else if (vars.visual.type === 'progress' && vars.visual.progress_bars) {
              html += '<div class="mb-6">';
              vars.visual.progress_bars.forEach(progressBar => {
                html += '<div class="mb-4">';
                html += '<div class="flex justify-between items-center mb-2">';
                html += '<span class="text-sm font-semibold" style="color: ' + (theme.text_color || '#374151') + ';">' + progressBar.label + '</span>';
                html += '<span class="text-sm font-semibold" style="color: ' + (theme.text_color || '#374151') + ';">' + progressBar.current + (progressBar.unit ? ' ' + progressBar.unit : '') + '</span>';
                html += '</div>';
                html += '<div class="bg-gray-200 rounded-full h-2 overflow-hidden" style="background-color: ' + (theme.border_color || '#e5e7eb') + ';">';
                html += '<div class="h-full rounded-full transition-all duration-300" style="background-color: ' + (progressBar.color || theme.primary_button_color || '#3b82f6') + '; width: ' + (progressBar.percentage || 0) + '%;"></div>';
                html += '</div>';
                if (progressBar.description) {
                  html += '<div class="text-xs mt-1" style="color: ' + (theme.muted_text_color || '#6b7280') + ';">' + progressBar.description + '</div>';
                }
                html += '</div>';
              });
              html += '</div>';
            }
          }
          
          // Support Section
          if (vars.support && vars.support.show !== false) {
            html += '<div class="mb-6 text-center">';
            html += '<p class="text-sm mb-3" style="color: ' + (theme.muted_text_color || '#6b7280') + '">' + (vars.support.title || 'Need help?') + '</p>';
            (vars.support.links || []).forEach((link, index) => {
              if (index > 0) html += ' • ';
              html += '<a href="' + link.url + '" class="text-sm" style="color: ' + (theme.link_color || '#3b82f6') + '; text-decoration: none;">' + link.label + '</a>';
            });
            html += '</div>';
          }
          
          // Footer Section
          if (vars.footer && vars.footer.show !== false) {
            html += '<div class="mt-6 pt-4 border-t text-center text-sm" style="border-color: ' + (theme.border_color || '#e5e7eb') + ';">';
            if (vars.footer.tagline) {
              html += '<p class="mb-3" style="color: ' + (theme.muted_text_color || '#6b7280') + '">' + vars.footer.tagline + '</p>';
            }
            if (vars.footer.social_links && vars.footer.social_links.length > 0) {
              html += '<div class="mb-3">';
              vars.footer.social_links.forEach(link => {
                const icon = link.platform === 'twitter' ? '🐦' : link.platform === 'linkedin' ? '💼' : link.platform === 'github' ? '🐙' : '🔗';
                html += '<a href="' + link.url + '" class="inline-block mx-1 text-lg" style="color: ' + (theme.social_icon_color || '#6b7280') + ';">' + icon + '</a>';
              });
              html += '</div>';
            }
            if (vars.footer.legal_links && vars.footer.legal_links.length > 0) {
              html += '<div class="mb-3">';
              vars.footer.legal_links.forEach((link, index) => {
                if (index > 0) html += ' • ';
                html += '<a href="' + link.url + '" class="text-xs" style="color: ' + (theme.link_color || '#3b82f6') + '; text-decoration: none;">' + link.label + '</a>';
              });
              html += '</div>';
            }
            html += '<p class="text-xs" style="color: ' + (theme.muted_text_color || '#6b7280') + ';">';
            html += vars.footer.copyright || '© ' + new Date().getFullYear() + ' ' + (processedVars.workspace_name || 'Your Company') + '. All rights reserved.';
            html += '</p></div>';
          }
          
          html += '</div>';
          return html;
        } else {
          // Legacy structure rendering - simplified to avoid nested template literals
          let html = '<div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm" style="font-family: ' + (theme.font_family || 'Inter, Helvetica, Arial, sans-serif') + ';">';
          
          // Header with logo
          html += '<div class="text-center mb-6">';
          if (processedVars.image_url) {
            html += '<img src="' + processedVars.image_url + '" alt="' + (processedVars.image_alt || 'Logo') + '" class="w-32 h-auto mx-auto mb-4 rounded-lg">';
          }
          html += '<h1 class="text-2xl font-bold mb-2" style="color: ' + (theme.heading_color || '#1f2937') + '">' + (processedVars.email_title || 'Email Title') + '</h1>';
          html += '<p class="text-sm" style="color: ' + (theme.muted_text_color || '#6b7280') + '">From ' + processedVars.workspace_name + '</p>';
          html += '</div>';
          
          // Content
          html += '<div class="prose max-w-none mb-6">';
          html += '<div class="text-gray-700 mb-4" style="color: ' + (theme.text_color || '#374151') + '; font-size: ' + (theme.font_size || '16px') + '; line-height: ' + (theme.line_height || '26px') + ';">';
          html += processedContent;
          html += '</div>';
          
          // Facts table
          if (processedFacts && processedFacts.length > 0) {
            html += '<div class="bg-gray-50 p-4 rounded-lg mb-4" style="background-color: ' + (theme.card_background || '#f8fafc') + ';">';
            html += '<h3 class="font-semibold mb-2" style="color: ' + (theme.heading_color || '#1f2937') + '">Details:</h3>';
            html += '<div class="space-y-2">';
            processedFacts.forEach(fact => {
              html += '<div class="flex justify-between text-sm">';
              html += '<span class="font-medium" style="color: ' + (theme.text_color || '#374151') + '">' + fact.label + ':</span>';
              html += '<span style="color: ' + (theme.text_color || '#374151') + '">' + fact.value + '</span>';
              html += '</div>';
            });
            html += '</div></div>';
          }
          
          // CTA Buttons
          if (vars.cta_primary || vars.cta_secondary) {
            html += '<div class="text-center space-y-3">';
            if (vars.cta_primary) {
              html += '<button class="px-6 py-3 rounded-lg font-semibold text-white transition-colors" style="background-color: ' + (theme.primary_button_color || '#3b82f6') + '; color: ' + (theme.primary_button_text_color || '#ffffff') + ';">';
              html += vars.cta_primary.label + '</button>';
            }
            if (vars.cta_secondary) {
              html += '<button class="px-6 py-3 rounded-lg font-semibold text-white transition-colors ml-3" style="background-color: ' + (theme.secondary_button_color || '#6b7280') + '; color: ' + (theme.secondary_button_text_color || '#ffffff') + ';">';
              html += vars.cta_secondary.label + '</button>';
            }
            html += '</div>';
          }
          
          // Social Links
          if (vars.social_links && vars.social_links.length > 0) {
            html += '<div class="text-center mb-6">';
            html += '<p class="text-sm mb-3" style="color: ' + (theme.muted_text_color || '#6b7280') + '">Follow us on social media</p>';
            html += '<div class="flex justify-center space-x-4">';
            vars.social_links.forEach(link => {
              html += '<a href="' + link.url + '" class="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style="background-color: ' + (theme.social_button_color || '#f3f4f6') + '; color: ' + (theme.social_icon_color || '#6b7280') + ';">';
              html += '<i class="fab fa-' + link.platform + ' text-sm"></i></a>';
            });
            html += '</div></div>';
          }
          
          // Progress Bars
          if (processedVars.progress_bars && processedVars.progress_bars.length > 0) {
            html += '<div class="mb-6">';
            processedVars.progress_bars.forEach(bar => {
              html += '<div class="mb-4">';
              html += '<div class="flex justify-between items-center mb-2">';
              html += '<span class="text-sm font-semibold" style="color: ' + (theme.text_color || '#374151') + '">' + bar.label + '</span>';
              html += '<span class="text-sm font-semibold" style="color: ' + (theme.text_color || '#374151') + '">' + bar.current + (bar.unit ? ' ' + bar.unit : '') + '</span>';
              html += '</div>';
              html += '<div class="w-full bg-gray-200 rounded-full h-2" style="background-color: ' + (theme.border_color || '#e5e7eb') + ';">';
              html += '<div class="h-2 rounded-full transition-all duration-300" style="width: ' + (bar.percentage || 0) + '%; background-color: ' + (bar.color || theme.primary_button_color || '#3b82f6') + ';"></div>';
              html += '</div>';
              if (bar.description) {
                html += '<div class="text-xs mt-1" style="color: ' + (theme.muted_text_color || '#6b7280') + '">' + bar.description + '</div>';
              }
              html += '</div>';
            });
            html += '</div>';
          }
          
          // Footer
          html += '<div class="mt-6 pt-4 border-t border-gray-200 text-center text-sm" style="border-color: ' + (theme.border_color || '#e5e7eb') + ';">';
          if (processedVars.footer_text) {
            html += '<p style="color: ' + (theme.muted_text_color || '#9ca3af') + '; margin-bottom: 16px;">' + processedVars.footer_text + '</p>';
          } else {
            html += '<p style="color: ' + (theme.muted_text_color || '#9ca3af') + '; margin-bottom: 16px;">';
            html += 'This email was sent by <strong>' + processedVars.workspace_name + '</strong>.';
            if (processedVars.support_email) {
              html += 'If you have any questions, please contact <a href="mailto:' + processedVars.support_email + '" style="color: ' + (theme.link_color || '#3b82f6') + '; text-decoration: none;">' + processedVars.support_email + '</a>.';
            }
            html += '</p>';
          }
          
          if (processedVars.footer_links && processedVars.footer_links.length > 0) {
            html += '<div class="mb-3">';
            processedVars.footer_links.forEach((link, index) => {
              if (index > 0) html += ' • ';
              html += '<a href="' + link.url + '" class="text-xs" style="color: ' + (theme.link_color || '#3b82f6') + '; text-decoration: none;">' + link.label + '</a>';
            });
            html += '</div>';
          }
          
          html += '<p style="color: ' + (theme.muted_text_color || '#9ca3af') + '; font-size: 11px;">';
          html += processedVars.copyright_text || '© ' + new Date().getFullYear() + ' ' + processedVars.workspace_name + '. All rights reserved.';
          html += '</p></div>';
          
          html += '</div>';
          return html;
        }
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
          const errorMessage = error.message || 'Unknown JSON parsing error';
          showStatus(\`JSON Error: \${errorMessage}\`, 'error');
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

      // Validate template using API
      async function validateTemplate(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        try {
          const textarea = document.getElementById('template-json');
          if (!textarea) return;
          
          const jsonText = textarea.value.trim();
          if (!jsonText) {
            showStatus('Please enter template JSON first', 'error');
            return;
          }
          
          let template = JSON.parse(jsonText);
          
          // Template is now directly the JSON structure
          // Ensure we have the right structure
          if (!template.template || !template.variables) {
            showStatus('Invalid template structure. Expected template and variables objects.', 'error');
            return;
          }
          
          // Check for percentage widths in hero images
          if (template.variables.hero && template.variables.hero.image_width && template.variables.hero.image_width.includes('%')) {
            showStatus('⚠️ Percentage widths not supported in emails. Use fixed pixels (e.g., "400px", "300px")', 'warning');
            return;
          }
          
          showStatus('Validating template...', 'info');
          
          const response = await fetch('/api/v1/templates/validate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + (window.adminToken || 'admin-test-token')
            },
            body: JSON.stringify(template)
          });
          
          const result = await response.json();
          
          // Show validation results in a modal
          showValidationResults(result);
          
        } catch (error) {
          console.error('Validation error:', error);
          showStatus('Validation failed: ' + error.message, 'error');
        }
      }

      // Show validation results in a modal
      function showValidationResults(result) {
        // Remove existing validation modal if any
        const existingModal = document.getElementById('validation-modal');
        if (existingModal) {
          existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'validation-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        const errorsHtml = result.errors.map(error => \`
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-red-400"></i>
              </div>
              <div class="ml-3 flex-1">
                <h4 class="text-sm font-medium text-red-800">\${error.field}</h4>
                <p class="text-sm text-red-700 mt-1">\${error.message}</p>
                \${error.suggestion ? \`<p class="text-xs text-red-600 mt-2"><strong>Suggestion:</strong> \${error.suggestion}</p>\` : ''}
              </div>
            </div>
          </div>
        \`).join('');
        
        const warningsHtml = result.warnings.map(warning => \`
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <i class="fas fa-exclamation-triangle text-yellow-400"></i>
              </div>
              <div class="ml-3 flex-1">
                <h4 class="text-sm font-medium text-yellow-800">\${warning.field}</h4>
                <p class="text-sm text-yellow-700 mt-1">\${warning.message}</p>
                \${warning.suggestion ? \`<p class="text-xs text-yellow-600 mt-2"><strong>Suggestion:</strong> \${warning.suggestion}</p>\` : ''}
              </div>
            </div>
          </div>
        \`).join('');
        
        const suggestionsHtml = result.suggestions ? result.suggestions.map(suggestion => \`
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <i class="fas fa-lightbulb text-blue-400"></i>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm text-blue-700">\${suggestion}</p>
              </div>
            </div>
          </div>
        \`).join('') : '';
        
        modal.innerHTML = \`
          <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                Template Validation Results
                <span class="ml-2 px-2 py-1 text-xs font-medium rounded-full \${result.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                  \${result.valid ? 'Valid' : 'Invalid'}
                </span>
              </h3>
              <button onclick="closeValidationModal(event)" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            \${result.valid ? \`
              <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div class="flex items-center">
                  <i class="fas fa-check-circle text-green-400 mr-2"></i>
                  <p class="text-green-700 font-medium">Template is valid and ready to use!</p>
                </div>
              </div>
            \` : \`
              <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div class="flex items-center">
                  <i class="fas fa-times-circle text-red-400 mr-2"></i>
                  <p class="text-red-700 font-medium">Template has \${result.errors.length} error\${result.errors.length > 1 ? 's' : ''} that must be fixed.</p>
                </div>
              </div>
            \`}
            
            \${result.errors.length > 0 ? \`
              <div class="mb-6">
                <h4 class="text-md font-semibold text-gray-900 mb-3">
                  <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
                  Errors (\${result.errors.length})
                </h4>
                <div class="space-y-3">
                  \${errorsHtml}
                </div>
              </div>
            \` : ''}
            
            \${result.warnings.length > 0 ? \`
              <div class="mb-6">
                <h4 class="text-md font-semibold text-gray-900 mb-3">
                  <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                  Warnings (\${result.warnings.length})
                </h4>
                <div class="space-y-3">
                  \${warningsHtml}
                </div>
              </div>
            \` : ''}
            
            \${result.suggestions && result.suggestions.length > 0 ? \`
              <div class="mb-6">
                <h4 class="text-md font-semibold text-gray-900 mb-3">
                  <i class="fas fa-lightbulb text-blue-500 mr-2"></i>
                  Suggestions
                </h4>
                <div class="space-y-2">
                  \${suggestionsHtml}
                </div>
              </div>
            \` : ''}
            
            <div class="flex justify-end">
              <button 
                onclick="closeValidationModal(event)" 
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        \`;
        
        document.body.appendChild(modal);
        
        // Close modal on escape key
        const handleEscape = (event) => {
          if (event.key === 'Escape') {
            closeValidationModal();
          }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Store handler for cleanup
        modal._escapeHandler = handleEscape;
      }

      // Close validation modal
      function closeValidationModal(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        const modal = document.getElementById('validation-modal');
        if (modal) {
          // Remove escape key listener
          if (modal._escapeHandler) {
            document.removeEventListener('keydown', modal._escapeHandler);
          }
          modal.remove();
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
          
          // Template is now directly the JSON structure
          
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
