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
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Available
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              \${new Date(template.updatedAt || template.createdAt).toLocaleDateString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <button onclick="viewTemplate('\${template.key}')" class="text-blue-600 hover:text-blue-900" title="View Template">
                  <i class="fas fa-eye"></i>
                </button>
                <button onclick="editSectionBasedTemplate('\${template.key}')" class="text-green-600 hover:text-green-900" title="Edit in Visual Builder">
                  <i class="fas fa-magic"></i>
                </button>
                <button onclick="editTemplate('\${template.key}')" class="text-indigo-600 hover:text-indigo-900" title="Edit JSON">
                  <i class="fas fa-code"></i>
                </button>
                <button onclick="manageLocales('\${template.key}')" class="text-purple-600 hover:text-purple-900" title="Manage Locales">
                  <i class="fas fa-globe"></i>
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
        const status = document.getElementById('status-filter').value;
        
        let filtered = currentTemplates.filter(template => {
          const matchesSearch = !search || 
            template.name.toLowerCase().includes(search) ||
            template.key.toLowerCase().includes(search) ||
            (template.description && template.description.toLowerCase().includes(search));
          
          const matchesCategory = !category || template.category === category;
          const matchesStatus = !status;
          
          return matchesSearch && matchesCategory && matchesStatus;
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
          document.getElementById('template-form-title').textContent = 'Edit Template';
          document.getElementById('template-key').value = currentTemplate.key;
          document.getElementById('template-key').readOnly = true;
          document.getElementById('template-name').value = currentTemplate.name;
          document.getElementById('template-description').value = currentTemplate.description || '';
          document.getElementById('template-category').value = currentTemplate.category;
          document.getElementById('template-json-structure').value = JSON.stringify(currentTemplate.jsonStructure, null, 2);
          document.getElementById('template-variable-schema').value = JSON.stringify(currentTemplate.variableSchema, null, 2);
          
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
          // Open template preview in a new window/tab
          const previewUrl = \`/api/v1/templates/\${templateKey}/preview\`;
          console.log('Opening preview URL:', previewUrl);
          window.open(previewUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        } catch (error) {
          console.error('Failed to open template preview:', error);
          showStatus('Failed to open template preview: ' + error.message, 'error');
        }
      }

      // Show template details
      function showTemplateDetails(template) {
        // This would show a detailed view of the template
        // For now, we'll just show an alert with basic info
        alert(\`Template: \${template.name}\\nKey: \${template.key}\\nCategory: \${template.category}\\nLocales: \${template.availableLocales?.join(', ') || 'None'}\`);
      }

      // Manage locales
      async function manageLocales(templateKey) {
        try {
          const data = await window.EmailGatewayAPI.getTemplate(templateKey);
          currentTemplate = data.template;
          currentLocales = data.template.locales || [];
          
          document.getElementById('locale-template-name').textContent = \`Template: \${currentTemplate.name}\`;
          document.getElementById('locale-management-modal').classList.remove('hidden');
          
          await loadLocales();
        } catch (error) {
          console.error('Failed to load template for locale management:', error);
          showStatus('Failed to load template: ' + error.message, 'error');
        }
      }

      // Load locales
      async function loadLocales() {
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

      // Initialize when DOM is loaded
      document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('template-management-tab')) {
          initializeTemplateManagement();
        }
      });
    </script>
  `;
}
