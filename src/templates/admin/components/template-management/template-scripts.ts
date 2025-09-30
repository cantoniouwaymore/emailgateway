export function generateTemplateManagementScripts(): string {
  return `
    <script>
      // Global variables
      let currentTemplates = [];
      let currentTemplate = null;
      let currentLocales = [];

      // Initialize template management
      async function initializeTemplateManagement() {
        try {
          // Wait for API client to be ready
          if (!window.EmailGatewayAPI) {
            throw new Error('API client not available');
          }

          // Load templates using centralized API client
          await loadTemplates();
        } catch (error) {
          console.error('Failed to initialize template management:', error);
          showStatus('Failed to initialize template management', 'error');
        }
      }

      // Load templates from API using centralized client
      async function loadTemplates() {
        try {
          showTemplatesLoading(true);
          
          const data = await window.EmailGatewayAPI.getTemplates();
          currentTemplates = data.templates || [];
          
          updateStats();
          populateCategoryFilter();
          renderTemplates();
          showTemplatesLoading(false);
        } catch (error) {
          console.error('Failed to load templates:', error);
          showStatus('Failed to load templates: ' + error.message, 'error');
          showTemplatesLoading(false);
        }
      }

      // Update statistics
      function updateStats() {
        const totalTemplates = currentTemplates.length;
        const activeTemplates = currentTemplates.length;
        const totalLocales = currentTemplates.reduce((sum, t) => sum + (t.availableLocales?.length || 0), 0);
        const categories = [...new Set(currentTemplates.map(t => t.category))].length;

        document.getElementById('total-templates').textContent = totalTemplates;
        document.getElementById('active-templates').textContent = activeTemplates;
        document.getElementById('total-locales').textContent = totalLocales;
        document.getElementById('total-categories').textContent = categories;
      }

      // Populate category filter with available categories
      function populateCategoryFilter() {
        const categoryFilter = document.getElementById('category-filter');
        if (!categoryFilter) return;

        // Get unique categories from templates
        const categories = [...new Set(currentTemplates.map(t => t.category))].sort();
        
        // Clear existing options except "All Categories"
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        
        // Add category options
        categories.forEach(category => {
          if (category) { // Only add non-empty categories
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
          }
        });
      }

      // Render templates table
      function renderTemplates() {
        const tbody = document.getElementById('templates-tbody');
        const emptyState = document.getElementById('templates-empty');
        const table = document.getElementById('templates-table');

        if (currentTemplates.length === 0) {
          emptyState.classList.remove('hidden');
          table.classList.add('hidden');
          return;
        }

        emptyState.classList.add('hidden');
        table.classList.remove('hidden');

        tbody.innerHTML = currentTemplates.map(template => \`
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i class="fas fa-file-alt text-purple-600"></i>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">\${template.name}</div>
                  <div class="text-sm text-gray-500">\${template.key}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${getCategoryColor(template.category)}">
                \${template.category}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex flex-wrap gap-1">
                \${(template.availableLocales || []).map(locale => \`
                  <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    \${locale}
                  </span>
                \`).join('')}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              \${template.updatedAt ? new Date(template.updatedAt).toLocaleDateString() : template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <button onclick="viewTemplate('\${template.key}')" class="text-blue-600 hover:text-blue-900" title="View Template">
                  <i class="fas fa-eye"></i>
                </button>
                <button onclick="editSectionBasedTemplate('\${template.key}')" class="text-green-600 hover:text-green-900" title="Edit in Visual Builder">
                  <i class="fas fa-magic"></i>
                </button>
                <button onclick="editTemplate('\${template.key}')" class="text-indigo-600 hover:text-indigo-900" title="View JSON">
                  <i class="fas fa-code"></i>
                </button>
                <button onclick="deleteTemplate('\${template.key}')" class="text-red-600 hover:text-red-900" title="Delete Template">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        \`).join('');
      }

      // Get category color
      function getCategoryColor(category) {
        const colors = {
          'transactional': 'bg-blue-100 text-blue-800',
          'marketing': 'bg-green-100 text-green-800',
          'notification': 'bg-yellow-100 text-yellow-800',
          'test': 'bg-gray-100 text-gray-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
      }

      // Show/hide loading state
      function showTemplatesLoading(show) {
        const loading = document.getElementById('templates-loading');
        const table = document.getElementById('templates-table');
        const empty = document.getElementById('templates-empty');
        
        if (show) {
          loading.classList.remove('hidden');
          table.classList.add('hidden');
          empty.classList.add('hidden');
        } else {
          loading.classList.add('hidden');
        }
      }

      // Filter templates
      function filterTemplates() {
        const search = document.getElementById('template-search').value.toLowerCase();
        const category = document.getElementById('category-filter').value;
        
        let filtered = currentTemplates.filter(template => {
          const matchesSearch = !search || 
            template.name.toLowerCase().includes(search) ||
            template.key.toLowerCase().includes(search) ||
            (template.description && template.description.toLowerCase().includes(search));
          
          const matchesCategory = !category || template.category === category;
          
          return matchesSearch && matchesCategory;
        });
        
        // Temporarily replace currentTemplates for rendering
        const originalTemplates = currentTemplates;
        currentTemplates = filtered;
        renderTemplates();
        currentTemplates = originalTemplates;
      }

      // Sort templates
      function sortTemplates() {
        const sortBy = document.getElementById('sort-filter').value;
        
        currentTemplates.sort((a, b) => {
          switch (sortBy) {
            case 'name':
              return a.name.localeCompare(b.name);
            case 'key':
              return a.key.localeCompare(b.key);
            case 'category':
              return a.category.localeCompare(b.category);
            case 'created':
              return new Date(a.createdAt) - new Date(b.createdAt);
            case 'updated':
              return new Date(b.updatedAt || a.createdAt) - new Date(a.updatedAt || a.createdAt);
            default:
              return 0;
          }
        });
        
        renderTemplates();
      }

      // Refresh templates
      async function refreshTemplates() {
        await loadTemplates();
        showStatus('Templates refreshed', 'success');
      }

      // Show create template modal
      function showCreateTemplateModal() {
        document.getElementById('template-form-title').textContent = 'Create Template';
        document.getElementById('template-form').reset();
        document.getElementById('template-key').readOnly = false;
        
        // Load a default template example
        loadTemplateExample();
        
        // Generate initial email request JSON
        generateEmailRequestExample();
        
        // Add event listener to regenerate email request JSON when template structure changes
        const jsonStructureField = document.getElementById('template-json-structure');
        if (jsonStructureField) {
          jsonStructureField.addEventListener('input', function() {
            // Debounce the regeneration
            clearTimeout(window.emailRequestTimeout);
            window.emailRequestTimeout = setTimeout(() => {
              generateEmailRequestExample();
            }, 500);
          });
        }
        
        document.getElementById('template-form-modal').classList.remove('hidden');
        currentTemplate = null;
      }

      // Show section-based template modal
      function showSectionBasedTemplateModal() {
        // Navigate to template editor page instead of opening modal
        window.location.href = '/admin/template-editor';
      }

      // Edit template in visual builder
      function editSectionBasedTemplate(templateKey) {
        // Navigate to template editor page with template parameter
        window.location.href = \`/admin/template-editor?template=\${templateKey}&mode=edit\`;
      }

      // Show edit template modal
      async function editTemplate(templateKey) {
        try {
          const data = await window.EmailGatewayAPI.getTemplate(templateKey);
          currentTemplate = data.template;
          
          // Populate form
          document.getElementById('template-form-title').textContent = 'View JSON';
          document.getElementById('template-key').value = currentTemplate.key;
          document.getElementById('template-key').readOnly = true;
          document.getElementById('template-name-display').textContent = currentTemplate.name || 'Unknown';
          document.getElementById('template-description-display').textContent = currentTemplate.description || 'No description provided';
          document.getElementById('template-category-display').textContent = currentTemplate.category || 'Unknown';
          // Populate template JSON structure
          let templateStructure = currentTemplate.jsonStructure;
          if (!templateStructure || Object.keys(templateStructure).length === 0) {
            // Show a default structure if template is empty
            templateStructure = {
              "title": {
                "text": "{{email_title}}",
                "size": "28px",
                "color": "#1f2937"
              },
              "body": {
                "paragraphs": [
                  "Hello {{user_name}},",
                  "{{email_content}}"
                ],
                "font_size": "16px"
              },
              "actions": {
                "primary": {
                  "label": "{{cta_label}}",
                  "url": "{{cta_url}}",
                  "style": "button"
                }
              }
            };
          }
          document.getElementById('template-json-structure').value = JSON.stringify(templateStructure, null, 2);
          
          // Populate variable schema
          const variableSchema = currentTemplate.variableSchema || {};
          document.getElementById('template-variable-schema').value = JSON.stringify(variableSchema, null, 2);
          
          // Generate email request JSON for developer reference
          generateEmailRequestExample();
          
          // Add event listener to regenerate email request JSON when template structure changes
          const jsonStructureField = document.getElementById('template-json-structure');
          if (jsonStructureField) {
            jsonStructureField.addEventListener('input', function() {
              // Debounce the regeneration
              clearTimeout(window.emailRequestTimeout);
              window.emailRequestTimeout = setTimeout(() => {
                generateEmailRequestExample();
              }, 500);
            });
          }
          
          document.getElementById('template-form-modal').classList.remove('hidden');
        } catch (error) {
          console.error('Failed to load template:', error);
          showStatus('Failed to load template: ' + error.message, 'error');
        }
      }

      // Close template form modal
      function closeTemplateFormModal() {
        document.getElementById('template-form-modal').classList.add('hidden');
        currentTemplate = null;
      }

      // Handle template form submit
      async function handleTemplateSubmit(event) {
        event.preventDefault();
        
        try {
          const formData = new FormData(event.target);
          const templateData = {
            key: formData.get('key'),
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            jsonStructure: JSON.parse(document.getElementById('template-json-structure').value),
            variableSchema: JSON.parse(document.getElementById('template-variable-schema').value)
          };
          
          if (currentTemplate) {
            await window.EmailGatewayAPI.updateTemplate(currentTemplate.key, templateData);
          } else {
            await window.EmailGatewayAPI.createTemplate(templateData);
          }
          
          closeTemplateFormModal();
          await loadTemplates();
          showStatus(\`Template \${currentTemplate ? 'updated' : 'created'} successfully\`, 'success');
        } catch (error) {
          console.error('Failed to save template:', error);
          showStatus('Failed to save template: ' + error.message, 'error');
        }
      }

      // Delete template
      async function deleteTemplate(templateKey) {
        if (!confirm(\`Are you sure you want to delete template "\${templateKey}"?\`)) {
          return;
        }
        
        try {
          await window.EmailGatewayAPI.deleteTemplate(templateKey);
          
          await loadTemplates();
          showStatus('Template deleted successfully', 'success');
        } catch (error) {
          console.error('Failed to delete template:', error);
          showStatus('Failed to delete template: ' + error.message, 'error');
        }
      }

      // View template
      async function viewTemplate(templateKey) {
        console.log('viewTemplate called with key:', templateKey);
        try {
          showLoading('Loading template preview...');
          
          // Get template data first
          const templateData = await window.EmailGatewayAPI.getTemplate(templateKey);
          const template = templateData.template;
          
          console.log('Template data:', template);
          console.log('Template jsonStructure:', template.jsonStructure);
          
          // Check if template has valid structure
          if (!template.jsonStructure || Object.keys(template.jsonStructure).length === 0) {
            throw new Error('Template has no JSON structure defined. Please edit the template first to add content.');
          }
          
          // Prepare preview request with template structure and sample variables
          const requestBody = {
            templateStructure: template.jsonStructure,
            variables: {
              companyName: 'Your Company',
              title: template.name || 'Sample Title',
              bodyText: 'This is a sample email body text that demonstrates how your template will look.',
              primaryButtonLabel: 'Primary Action',
              primaryButtonUrl: '#',
              secondaryButtonLabel: 'Secondary Action',
              secondaryButtonUrl: '#',
              copyright: '&copy; 2024 Your Company. All rights reserved.',
              user_name: 'John Doe',
              email_title: template.name || 'Sample Email',
              workspace_name: 'Your Workspace'
            }
          };
          
          // Call the preview API using the API client
          console.log('Calling generatePreview with:', requestBody);
          const response = await window.EmailGatewayAPI.generatePreview(requestBody.templateStructure, requestBody.variables);
          console.log('Preview API response:', response);
          
          // Show the preview in a modal
          showTemplatePreviewModal(template.name || templateKey, response.preview);
          
          hideLoading();
        } catch (error) {
          console.error('Failed to generate template preview:', error);
          alert('Failed to generate template preview: ' + error.message);
          hideLoading();
        }
      }

      // Show template preview modal
      function showTemplatePreviewModal(templateName, previewHtml) {
        console.log('showTemplatePreviewModal called with:', { templateName, previewHtml });
        
        // Use the existing modal from the HTML template
        const modal = document.getElementById('template-preview-modal');
        if (!modal) {
          console.error('Template preview modal not found in DOM');
          return;
        }
        
        // Update the modal title
        const titleElement = modal.querySelector('h3');
        if (titleElement) {
          titleElement.textContent = \`Template Preview: \${templateName}\`;
        }
        
        // Update the email preview content
        const emailPreviewDiv = modal.querySelector('#preview-email-content');
        if (emailPreviewDiv) {
          console.log('Setting preview content to:', previewHtml);
          emailPreviewDiv.innerHTML = previewHtml || '<p class="text-gray-500">No preview content available</p>';
          
          // Make the email preview content div full width
          emailPreviewDiv.style.width = '100%';
          emailPreviewDiv.style.maxWidth = '100%';
          emailPreviewDiv.style.padding = '0';
          emailPreviewDiv.style.margin = '0';
        } else {
          console.error('Could not find preview-email-content div');
        }
        
        // Hide the JSON structure section and make email preview full width
        const gridContainer = modal.querySelector('.grid');
        if (gridContainer) {
          // Hide the first div (JSON structure)
          const jsonSection = gridContainer.children[0];
          if (jsonSection) {
            jsonSection.style.display = 'none';
          }
          
          // Make the second div (email preview) take full width
          const emailSection = gridContainer.children[1];
          if (emailSection) {
            emailSection.style.width = '100%';
            emailSection.style.maxWidth = '100%';
            emailSection.style.flex = '1';
            emailSection.style.gridColumn = '1 / -1';
          }
          
          // Make the grid container itself full width
          gridContainer.style.width = '100%';
          gridContainer.style.maxWidth = '100%';
          gridContainer.style.display = 'block';
        }
        
        // Show the modal
        modal.classList.remove('hidden');
      }

      // Close template preview modal
      function closeTemplatePreviewModal() {
        const modal = document.getElementById('template-preview-modal');
        if (modal) {
          modal.classList.add('hidden');
        }
      }


      // Show loading state
      function showLoading(message) {
        // Create or update loading overlay
        let loading = document.getElementById('loading-overlay');
        if (!loading) {
          loading = document.createElement('div');
          loading.id = 'loading-overlay';
          loading.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center';
          loading.innerHTML = \`
            <div class="bg-white p-6 rounded-lg shadow-xl flex items-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-4"></div>
              <p class="text-gray-900 font-medium" id="loading-message">\${message}</p>
            </div>
          \`;
          document.body.appendChild(loading);
        } else {
          loading.querySelector('#loading-message').textContent = message;
          loading.classList.remove('hidden');
        }
      }

      // Hide loading state
      function hideLoading() {
        const loading = document.getElementById('loading-overlay');
        if (loading) {
          loading.classList.add('hidden');
        }
      }

      // Show template details
      function showTemplateDetails(template) {
        // This would show a detailed view of the template
        // For now, we'll just show an alert with basic info
        alert(\`Template: \${template.name}\\nKey: \${template.key}\\nCategory: \${template.category}\\nLocales: \${template.availableLocales?.join(', ') || 'None'}\`);
      }


      // JSON Tab Management
      function showJsonTab(tabName, event) {
        const tbody = document.getElementById('locales-tbody');
        const emptyState = document.getElementById('locales-empty');
        const table = document.getElementById('locales-table');
        const loading = document.getElementById('locales-loading');

        loading.classList.remove('hidden');
        table.classList.add('hidden');
        emptyState.classList.add('hidden');

        try {
          if (currentLocales.length === 0) {
            loading.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
          }

          tbody.innerHTML = currentLocales.map(locale => \`
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="text-2xl mr-3">\${getLocaleFlag(locale.locale)}</div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">\${locale.locale}</div>
                    <div class="text-sm text-gray-500">\${getLocaleName(locale.locale)}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                \${getLocaleName(locale.locale)}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                \${new Date(locale.updatedAt || locale.createdAt).toLocaleDateString()}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button onclick="editLocale('\${locale.locale}')" class="text-indigo-600 hover:text-indigo-900">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button onclick="deleteLocale('\${locale.locale}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          \`).join('');

          loading.classList.add('hidden');
          table.classList.remove('hidden');
        } catch (error) {
          console.error('Failed to load locales:', error);
          loading.classList.add('hidden');
          showStatus('Failed to load locales: ' + error.message, 'error');
        }
      }

      // Get locale flag
      function getLocaleFlag(locale) {
        const flags = {
          'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪',
          'it': '🇮🇹', 'pt': '🇵🇹', 'ru': '🇷🇺', 'ja': '🇯🇵',
          'ko': '🇰🇷', 'zh': '🇨🇳', 'ar': '🇸🇦', 'hi': '🇮🇳'
        };
        return flags[locale] || '🏳️';
      }

      // Get locale name
      function getLocaleName(locale) {
        const names = {
          'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
          'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese',
          'ko': 'Korean', 'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi'
        };
        return names[locale] || locale;
      }

      // Close locale management modal
      function closeLocaleManagementModal() {
        document.getElementById('locale-management-modal').classList.add('hidden');
        currentTemplate = null;
        currentLocales = [];
      }

      // Show add locale modal
      function showAddLocaleModal() {
        document.getElementById('add-locale-title').textContent = 'Add Locale';
        document.getElementById('locale-form').reset();
        document.getElementById('add-locale-modal').classList.remove('hidden');
        
        // Update preview
        updateLocalePreview();
      }

      // Close add locale modal
      function closeAddLocaleModal() {
        document.getElementById('add-locale-modal').classList.add('hidden');
      }

      // Update locale preview
      function updateLocalePreview() {
        const baseStructure = currentTemplate?.jsonStructure || {};
        const localeStructure = document.getElementById('locale-json-structure').value;
        
        document.getElementById('preview-base-structure').textContent = JSON.stringify(baseStructure, null, 2);
        document.getElementById('preview-locale-structure').textContent = localeStructure || '{}';
      }

      // Handle locale form submit
      async function handleLocaleSubmit(event) {
        event.preventDefault();
        
        try {
          const formData = new FormData(event.target);
          const localeData = {
            locale: formData.get('locale'),
            jsonStructure: JSON.parse(document.getElementById('locale-json-structure').value || '{}')
          };
          
          const response = await fetch(\`/api/v1/templates/\${currentTemplate.key}/locales\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': \`Bearer \${authToken}\`
            },
            body: JSON.stringify(localeData)
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || \`HTTP \${response.status}: \${response.statusText}\`);
          }
          
          closeAddLocaleModal();
          await loadLocales();
          showStatus('Locale added successfully', 'success');
        } catch (error) {
          console.error('Failed to save locale:', error);
          showStatus('Failed to save locale: ' + error.message, 'error');
        }
      }

      // Delete locale
      async function deleteLocale(locale) {
        if (!confirm(\`Are you sure you want to delete locale "\${locale}"?\`)) {
          return;
        }
        
        try {
          const response = await fetch(\`/api/v1/templates/\${currentTemplate.key}/locales/\${locale}\`, {
            method: 'DELETE',
            headers: {
              'Authorization': \`Bearer \${authToken}\`
            }
          });
          
          if (!response.ok) {
            throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
          }
          
          await loadLocales();
          showStatus('Locale deleted successfully', 'success');
        } catch (error) {
          console.error('Failed to delete locale:', error);
          showStatus('Failed to delete locale: ' + error.message, 'error');
        }
      }

      // Utility functions
      function formatTemplateJSON() {
        const textarea = document.getElementById('template-json-structure');
        try {
          const parsed = JSON.parse(textarea.value);
          textarea.value = JSON.stringify(parsed, null, 2);
        } catch (error) {
          showStatus('Invalid JSON format', 'error');
        }
      }

      function formatVariableSchema() {
        const textarea = document.getElementById('template-variable-schema');
        try {
          const parsed = JSON.parse(textarea.value);
          textarea.value = JSON.stringify(parsed, null, 2);
        } catch (error) {
          showStatus('Invalid JSON format', 'error');
        }
      }

      function formatLocaleJSON() {
        const textarea = document.getElementById('locale-json-structure');
        try {
          const parsed = JSON.parse(textarea.value);
          textarea.value = JSON.stringify(parsed, null, 2);
        } catch (error) {
          showStatus('Invalid JSON format', 'error');
        }
      }

      function loadTemplateExample() {
        const example = {
          "title": {
            "text": "{{title.text}}",
            "size": "28px",
            "color": "#1f2937"
          },
          "body": {
            "paragraphs": ["{{body.paragraphs}}"],
            "font_size": "16px"
          }
        };
        document.getElementById('template-json-structure').value = JSON.stringify(example, null, 2);
      }

      function loadLocaleExample() {
        const example = {
          "title": {
            "text": "¡Bienvenido a {{workspace_name}}!"
          },
          "body": {
            "paragraphs": [
              "Hola {{user_firstname}}, ¡bienvenido a {{workspace_name}}!",
              "Tu cuenta está lista para usar."
            ]
          }
        };
        document.getElementById('locale-json-structure').value = JSON.stringify(example, null, 2);
        updateLocalePreview();
      }

      // JSON Tab Management
      function showJsonTab(tabName, event) {
        // Prevent default behavior to avoid form submission
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        // Hide all tab contents
        document.querySelectorAll('.json-tab-content').forEach(content => {
          content.classList.add('hidden');
        });
        
        // Remove active styling from all tabs
        document.querySelectorAll('[id^="json-tab-"]').forEach(tab => {
          tab.classList.remove('border-purple-500', 'text-purple-600');
          tab.classList.add('border-transparent', 'text-gray-500');
        });
        
        // Show selected tab content
        const content = document.getElementById(\`json-content-\${tabName}\`);
        if (content) {
          content.classList.remove('hidden');
        }
        
        // Add active styling to selected tab
        const tab = document.getElementById(\`json-tab-\${tabName}\`);
        if (tab) {
          tab.classList.remove('border-transparent', 'text-gray-500');
          tab.classList.add('border-purple-500', 'text-purple-600');
        }
        
        // Generate email request JSON if switching to request tab
        if (tabName === 'request') {
          generateEmailRequestExample();
        }
      }

      // Generate email request JSON example
      function generateEmailRequestExample() {
        const templateKey = document.getElementById('template-key')?.value || 'your-template-key';
        const templateName = document.getElementById('template-name')?.value || 'Your Template';
        
        // Get template structure to extract variables
        const templateStructure = document.getElementById('template-json-structure')?.value;
        let variables = {};
        
        try {
          if (templateStructure && templateStructure.trim()) {
            const structure = JSON.parse(templateStructure);
            variables = extractVariablesFromStructure(structure);
          }
        } catch (e) {
          console.warn('Could not parse template structure:', e);
        }
        
        // If no variables found from template structure, use default variables
        if (Object.keys(variables).length === 0) {
          variables = {
            user_name: "{{ user_name }}",
            email_subject: "{{ email_subject }}",
            company_name: "{{ company_name }}",
            workspace_name: "{{ workspace_name }}",
            tenant_id: "{{ tenant_id }}",
            event_id: "{{ event_id }}"
          };
        }
        
        // Generate example email request
        const emailRequest = {
          to: [
            {
              email: "user@example.com",
              name: "{{user_name}}"
            }
          ],
          from: {
            email: "noreply@yourcompany.com",
            name: "{{company_name}}"
          },
          subject: \`{{email_subject}} - \${templateName}\`,
          template: {
            key: templateKey,
            locale: "en"
          },
          variables: variables,
          metadata: {
            tenantId: "{{tenant_id}}",
            source: "api",
            eventId: "{{event_id}}"
          }
        };
        
        // Display the JSON
        const jsonElement = document.getElementById('email-request-json');
        if (jsonElement) {
          jsonElement.textContent = JSON.stringify(emailRequest, null, 2);
        }
      }

      // Extract variables from template structure
      function extractVariablesFromStructure(structure) {
        const variables = {};
        
        // Helper function to extract variables from any object
        function extractVars(obj, prefix = '') {
          if (typeof obj === 'string') {
            // Find {{variable}} patterns
            const matches = obj.match(/\\{\\{([^}]+)\\}\\}/g);
            if (matches) {
              matches.forEach(match => {
                const varName = match.replace(/\\{\\{|\\}\\}/g, '');
                if (varName && !varName.includes(' ')) {
                  variables[varName] = \`{{ \${varName} }}\`;
                }
              });
            }
          } else if (Array.isArray(obj)) {
            obj.forEach((item, index) => extractVars(item, \`\${prefix}[\${index}]\`));
          } else if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
              extractVars(obj[key], prefix ? \`\${prefix}.\${key}\` : key);
            });
          }
        }
        
        extractVars(structure);
        
        // Add common variables if none found
        if (Object.keys(variables).length === 0) {
          variables.user_name = "{{ user_name }}";
          variables.email_subject = "{{ email_subject }}";
          variables.company_name = "{{ company_name }}";
          variables.tenant_id = "{{ tenant_id }}";
          variables.event_id = "{{ event_id }}";
        }
        
        return variables;
      }

      // Copy email request JSON to clipboard
      async function copyEmailRequestJSON() {
        const jsonElement = document.getElementById('email-request-json');
        if (jsonElement) {
          try {
            await navigator.clipboard.writeText(jsonElement.textContent);
            showStatus('Email request JSON copied to clipboard!', 'success');
          } catch (err) {
            console.error('Failed to copy:', err);
            showStatus('Failed to copy to clipboard', 'error');
          }
        }
      }

      // Copy template JSON to clipboard
      async function copyTemplateJSON() {
        const jsonElement = document.getElementById('template-json-structure');
        if (jsonElement) {
          try {
            await navigator.clipboard.writeText(jsonElement.value);
            showStatus('Template JSON copied to clipboard!', 'success');
          } catch (err) {
            console.error('Failed to copy:', err);
            showStatus('Failed to copy to clipboard', 'error');
          }
        }
      }

      // Copy variable schema to clipboard
      async function copyVariableSchema() {
        const jsonElement = document.getElementById('template-variable-schema');
        if (jsonElement) {
          try {
            await navigator.clipboard.writeText(jsonElement.value);
            showStatus('Variable schema copied to clipboard!', 'success');
          } catch (err) {
            console.error('Failed to copy:', err);
            showStatus('Failed to copy to clipboard', 'error');
          }
        }
      }

      // Make functions globally available
      window.viewTemplate = viewTemplate;
      window.showTemplatePreviewModal = showTemplatePreviewModal;
      window.closeTemplatePreviewModal = closeTemplatePreviewModal;
      window.showLoading = showLoading;
      window.hideLoading = hideLoading;

      // Initialize when DOM is loaded
      document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('template-management-tab')) {
          initializeTemplateManagement();
        }
      });
    </script>
  `;
}
