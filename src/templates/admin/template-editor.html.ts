import { generateSectionBasedTemplateForm } from './components/template-management/section-based-form.html';
import { generateSectionBasedTemplateScripts } from './components/template-management/section-based-scripts';

export function generateTemplateEditorHTML(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Template Editor - Waymore Email Gateway</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
      <link rel="stylesheet" href="/admin/template-editor/styles.css">
    </head>
    <body class="bg-gray-100 text-gray-800">
      <!-- Status Bar -->
      <div id="status-bar" class="status-bar bg-gray-900 hidden">
        <p id="status-message">Status message will appear here</p>
      </div>

      <div class="flex h-screen editor-container">
        <!-- Left Panel: Template Builder Form -->
        <div class="w-1/3 p-6 overflow-y-auto border-r bg-white editor-form">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 id="editor-title" class="text-2xl font-bold text-gray-900">Create New Template</h1>
              <p id="editor-subtitle" class="text-gray-600">Build a new email template</p>
            </div>
            <div class="flex space-x-2">
              <button onclick="previewTemplate()" class="btn btn-secondary">
                <i class="fas fa-eye mr-2"></i>Preview
              </button>
              <button onclick="testTemplate()" class="btn btn-secondary">
                <i class="fas fa-paper-plane mr-2"></i>Test Email
              </button>
              <button onclick="saveTemplate()" class="btn btn-primary">
                <i class="fas fa-save mr-2"></i>Save
              </button>
              <button onclick="goBack()" class="btn btn-danger">
                <i class="fas fa-arrow-left mr-2"></i>Back
              </button>
            </div>
          </div>

          <!-- Template Info -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="form-label">Template Key</label>
                <input 
                  type="text" 
                  id="template-key" 
                  placeholder="unique-template-key"
                  class="form-input"
                />
              </div>
              <div>
                <label class="form-label">Category</label>
                <div class="relative">
                  <select id="template-category" class="form-input" onchange="handleCategoryChange()">
                    <option value="">Select or create a category...</option>
                    <!-- Existing categories will be populated here -->
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i class="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
                <div id="new-category-input" class="mt-2 hidden">
                  <input 
                    type="text" 
                    id="new-category-text" 
                    placeholder="Enter new category name..."
                    class="form-input"
                    onkeyup="handleNewCategoryInput(event)"
                  />
                  <p class="text-xs text-gray-500 mt-1">Type a new category name and press Enter to create it</p>
                </div>
              </div>
              <div>
                <label class="form-label">Locale</label>
                <select id="template-locale" class="form-input" onchange="onLocaleChange()">
                  <option value="en">English (en)</option>
                  <option value="es">Spanish (es)</option>
                  <option value="fr">French (fr)</option>
                  <option value="de">German (de)</option>
                  <option value="it">Italian (it)</option>
                  <option value="pt">Portuguese (pt)</option>
                  <option value="nl">Dutch (nl)</option>
                  <option value="sv">Swedish (sv)</option>
                  <option value="da">Danish (da)</option>
                  <option value="no">Norwegian (no)</option>
                  <option value="fi">Finnish (fi)</option>
                  <option value="pl">Polish (pl)</option>
                  <option value="ru">Russian (ru)</option>
                  <option value="ja">Japanese (ja)</option>
                  <option value="ko">Korean (ko)</option>
                  <option value="zh">Chinese (zh)</option>
                </select>
              </div>
            </div>
            <div class="mt-4">
              <label class="form-label">Template Name</label>
              <input 
                type="text" 
                id="template-name" 
                placeholder="My Email Template"
                class="form-input"
              />
            </div>
            <div class="mt-4">
              <label class="form-label">Description</label>
              <textarea 
                id="template-description" 
                rows="3"
                placeholder="Describe what this template is used for..."
                class="form-input"
              ></textarea>
            </div>
          </div>

          <!-- Template Builder Form -->
          <form id="template-editor-form" class="space-y-6" onsubmit="event.preventDefault();">
            <div id="template-sections-container">
              ${generateSectionBasedTemplateForm()}
            </div>
          </form>
        </div>

        <!-- Middle Panel: Live Preview -->
        <div class="w-1/3 p-6 overflow-y-auto bg-gray-50 editor-preview border-r">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Live Preview</h2>
          </div>
          <div id="preview-container" class="preview-container">
            <!-- Preview content will be loaded here -->
          </div>
        </div>

        <!-- Right Panel: Detected Variables -->
        <div class="w-1/3 p-6 overflow-y-auto bg-white editor-variables">
          <!-- Detected Variables Section -->
          <div id="detected-variables-section" class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6 hidden border border-blue-200">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <i class="fas fa-code text-blue-600"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-blue-900">Detected Variables</h3>
                  <p class="text-sm text-blue-700">Variables found in your template with fallback values</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button onclick="refreshDetectedVariables()" class="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  <i class="fas fa-sync-alt mr-1"></i>Refresh
                </button>
                <button onclick="clearAllVariableValues()" class="px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors">
                  <i class="fas fa-eraser mr-1"></i>Clear All
                </button>
              </div>
            </div>
            <div id="detected-variables-list" class="space-y-3">
              <!-- Detected variables will be displayed here -->
            </div>
            <div id="no-variables-message" class="text-center py-8 text-gray-500 hidden">
              <i class="fas fa-search text-4xl mb-3 text-gray-300"></i>
              <p class="text-lg font-medium text-gray-700 mb-2">No variables detected</p>
              <p class="text-sm text-gray-500">Add <span class="font-mono bg-gray-100 px-2 py-1 rounded">{{variableName}}</span> patterns in your template text to see them here.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div id="loading-overlay" class="loading-overlay hidden">
        <div class="bg-white p-6 rounded-lg shadow-xl flex items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-4"></div>
          <p class="text-gray-900 font-medium" id="loading-message">Processing...</p>
        </div>
      </div>

      <!-- Include all scripts -->
      <script src="/admin/config.js"></script>
      <script src="/admin/api-client.js"></script>
      ${generateSectionBasedTemplateScripts()}
      <script>
        // Load existing categories for the dropdown
        async function loadExistingCategories() {
          try {
            console.log('🔍 Loading existing categories...');
            console.log('🔍 EmailGatewayAPI available:', !!window.EmailGatewayAPI);
            
            // Wait for API to be available
            if (!window.EmailGatewayAPI) {
              console.log('🔍 EmailGatewayAPI not ready, retrying in 500ms...');
              setTimeout(loadExistingCategories, 500);
              return;
            }
            
            const data = await window.EmailGatewayAPI.getTemplates();
            console.log('🔍 API response:', data);
            
            const templates = data.templates || [];
            console.log('🔍 Templates found:', templates.length);
            console.log('🔍 Templates:', templates.map(t => ({ key: t.key, category: t.category })));
            
            // Get unique categories from templates
            const categories = [...new Set(templates.map(t => t.category))].sort();
            console.log('🔍 Unique categories:', categories);
            
            const categorySelect = document.getElementById('template-category');
            console.log('🔍 Category select element:', categorySelect);
            
            if (categorySelect) {
              // Clear existing options except the first one
              categorySelect.innerHTML = '<option value="">Select or create a category...</option>';
              
              // Add existing categories
              categories.forEach(category => {
                if (category) {
                  const option = document.createElement('option');
                  option.value = category;
                  option.textContent = category;
                  categorySelect.appendChild(option);
                  console.log('🔍 Added category option:', category);
                }
              });
              
              // Add "Create new..." option at the end
              const createNewOption = document.createElement('option');
              createNewOption.value = '__create_new__';
              createNewOption.textContent = 'Create new category...';
              categorySelect.appendChild(createNewOption);
              console.log('🔍 Added create new option');
              
              console.log('🔍 Final dropdown options:', categorySelect.innerHTML);
            } else {
              console.error('🔍 Category select element not found');
            }
          } catch (error) {
            console.error('🔍 Failed to load categories:', error);
            
            // Fallback: add some default categories if API fails
            const categorySelect = document.getElementById('template-category');
            if (categorySelect) {
              const defaultCategories = ['transactional', 'marketing', 'notification', 'system'];
              defaultCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
              });
              
              // Add "Create new..." option at the end
              const createNewOption = document.createElement('option');
              createNewOption.value = '__create_new__';
              createNewOption.textContent = 'Create new category...';
              categorySelect.appendChild(createNewOption);
              
              console.log('🔍 Added default categories as fallback');
            }
          }
        }

        // Handle category dropdown change
        function handleCategoryChange() {
          const categorySelect = document.getElementById('template-category');
          const newCategoryInput = document.getElementById('new-category-input');
          
          if (categorySelect.value === '__create_new__') {
            // Show the input field for creating a new category
            newCategoryInput.classList.remove('hidden');
            newCategoryInput.querySelector('input').focus();
            categorySelect.value = ''; // Reset the select
          } else {
            // Hide the input field
            newCategoryInput.classList.add('hidden');
            newCategoryInput.querySelector('input').value = '';
          }
        }

        // Handle new category input
        function handleNewCategoryInput(event) {
          if (event.key === 'Enter') {
            const input = event.target;
            const newCategory = input.value.trim();
            
            if (newCategory) {
              const categorySelect = document.getElementById('template-category');
              
              // Add the new category to the dropdown
              const option = document.createElement('option');
              option.value = newCategory;
              option.textContent = newCategory;
              option.selected = true;
              
              // Insert before the "Create new..." option
              const createNewOption = categorySelect.querySelector('option[value="__create_new__"]');
              categorySelect.insertBefore(option, createNewOption);
              
              // Hide the input and clear it
              document.getElementById('new-category-input').classList.add('hidden');
              input.value = '';
              
              // Mark as having changes
              if (typeof hasUnsavedChanges !== 'undefined') {
                hasUnsavedChanges = true;
              }
            }
          }
        }

        // Initialize categories when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
          // Load existing categories for the dropdown (with delay to ensure API is ready)
          setTimeout(loadExistingCategories, 1000);
        });
      </script>
      <script>
        // Template Editor JavaScript Functions
        let currentTemplate = null;
        let isEditing = false;
        let hasUnsavedChanges = false;
        let previewUpdateTimeout = null;
        let justSaved = false; // Flag to track if we just saved a template
        let detectedVariables = [];
        let variableValues = {};

        // Safe shims in case later script fails to load
        if (typeof getAuthToken !== 'function') {
          function getAuthToken() {
            return localStorage.getItem('authToken') || '';
          }
        }
        if (typeof showLoading !== 'function') {
          function showLoading() {}
        }
        if (typeof hideLoading !== 'function') {
          function hideLoading() {}
        }
        if (typeof showStatus !== 'function') {
          function showStatus() {}
        }
        if (typeof setupChangeDetection !== 'function') {
          function setupChangeDetection() {}
        }
        if (typeof showInitialPreview !== 'function') {
          function showInitialPreview() {}
        }

        // Create template configuration from variable schema defaults
        function createTemplateConfigFromSchema(variableSchema) {
          
          if (!variableSchema || !variableSchema.properties) {
            return {};
          }
          
          const config = {};
          
          // Extract default values from the variable schema
          function extractDefaults(schema, path = '') {
            
            if (schema.default !== undefined) {
              return schema.default;
            }
            
            if (schema.properties) {
              const result = {};
              for (const [key, value] of Object.entries(schema.properties)) {
                const defaultValue = extractDefaults(value, path + '.' + key);
                if (defaultValue !== undefined) {
                  result[key] = defaultValue;
                }
              }
              return Object.keys(result).length > 0 ? result : undefined;
            }
            
            return undefined;
          }
          
          // Process each section
          for (const [sectionName, sectionSchema] of Object.entries(variableSchema.properties)) {
            const sectionDefaults = extractDefaults(sectionSchema);
            if (sectionDefaults !== undefined) {
              config[sectionName] = sectionDefaults;
            } else {
            }
          }
          
          return config;
        }

        // Initialize the template editor
        function initializeTemplateEditor() {
          
          // Prevent form submission
          const form = document.getElementById('template-editor-form');
          if (form) {
            form.addEventListener('submit', function(event) {
              event.preventDefault();
            });
          }
          
          const urlParams = new URLSearchParams(window.location.search);
          const templateKey = urlParams.get('template');
          const mode = urlParams.get('mode');
          
          
          // If we just saved a template, don't reload to preserve form state
          if (justSaved) {
            justSaved = false; // Reset the flag
            return;
          }
          
          // If we already have a current template and we're just updating the URL, don't reload
          if (currentTemplate && templateKey === currentTemplate.key && mode === 'edit') {
            return;
          }
          
          if (templateKey && mode === 'edit') {
            isEditing = true;
            loadTemplateForEditing(templateKey);
          } else {
            isEditing = false;
            document.getElementById('editor-title').textContent = 'Create New Template';
            document.getElementById('editor-subtitle').textContent = 'Build a new email template';
          }
          
          setupChangeDetection();
          
          // Show initial preview without API call
          showInitialPreview();
        }

        // Load template for editing
        async function loadTemplateForEditing(templateKey) {
          try {
            showLoading('Loading template...');
            
            const response = await fetch('/api/v1/templates/' + templateKey, {
              headers: {
                'Authorization': 'Bearer ' + getAuthToken()
              }
            });
            if (!response.ok) {
              throw new Error('HTTP ' + response.status + ': ' + response.statusText);
            }
            const data = await response.json();
            currentTemplate = data.template;
            
            // Populate basic information
            document.getElementById('editor-title').textContent = 'Edit: ' + currentTemplate.name;
            document.getElementById('editor-subtitle').textContent = 'Editing template ' + currentTemplate.key;
            document.getElementById('template-key').value = currentTemplate.key;
            document.getElementById('template-key').readOnly = true;
            document.getElementById('template-name').value = currentTemplate.name;
            document.getElementById('template-description').value = currentTemplate.description || '';
            document.getElementById('template-category').value = currentTemplate.category;
            
            
            // Load template structure into visual builder (prefer selected locale if available)
            if (typeof loadTemplateIntoVisualBuilder === 'function') {
              var localeSelect = document.getElementById('template-locale');
              var selectedLocale = localeSelect ? (localeSelect.value || 'en') : 'en';
              var localesArr = Array.isArray(currentTemplate && currentTemplate.locales) ? currentTemplate.locales : [];
              var localeMatch = localesArr.find(function(l) { return l && l.locale === selectedLocale; });
              var structureToLoad = (localeMatch && localeMatch.jsonStructure) ? localeMatch.jsonStructure : (currentTemplate.jsonStructure || {});
              loadTemplateIntoVisualBuilder(structureToLoad);
              var subtitleEl = document.getElementById('editor-subtitle');
              if (subtitleEl) {
                subtitleEl.textContent = 'Editing template ' + currentTemplate.key + ' (' + selectedLocale + ')';
              }
            } else {
            }
            
            // Load detected variables from the template
            if (currentTemplate.detectedVariables && currentTemplate.detectedVariables.length > 0) {
              detectedVariables = [...currentTemplate.detectedVariables];
              updateDetectedVariablesDisplay();
            } else {
              // Fallback: detect variables from the JSON structure
              var structureForDetection = (function() {
                var sel = document.getElementById('template-locale');
                var loc = sel ? (sel.value || 'en') : 'en';
                var ls = Array.isArray(currentTemplate && currentTemplate.locales) ? currentTemplate.locales : [];
                var lm = ls.find(function(l){ return l && l.locale === loc; });
                return (lm && lm.jsonStructure) ? lm.jsonStructure : (currentTemplate.jsonStructure || {});
              })();
              const variables = detectVariablesInObject(structureForDetection);
              detectedVariables = [...new Set(variables)];
              updateDetectedVariablesDisplay();
            }
            
            // Show initial preview instead of generating immediately
            showInitialPreview();
            
            // Trigger a preview update after a short delay to ensure form is fully loaded
            setTimeout(() => {
              updatePreview();
            }, 1000);
            
            hideLoading();
            
          } catch (error) {
            showStatus('Error loading template: ' + error.message, 'error');
            hideLoading();
          }
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', initializeTemplateEditor);
      </script>
      <script>
        // Additional template editor functions
        function showLoading(message) {
          document.getElementById('loading-message').textContent = message;
          document.getElementById('loading-overlay').classList.remove('hidden');
        }

        function hideLoading() {
          document.getElementById('loading-overlay').classList.add('hidden');
        }

        function showStatus(message, type) {
          const statusBar = document.getElementById('status-bar');
          const statusMessage = document.getElementById('status-message');
          statusMessage.textContent = message;
          
          // Remove existing type classes
          statusBar.classList.remove('bg-green-900', 'bg-red-900', 'bg-yellow-900', 'bg-blue-900');
          
          // Add new type class
          switch (type) {
            case 'success':
              statusBar.classList.add('bg-green-900');
              break;
            case 'error':
              statusBar.classList.add('bg-red-900');
              break;
            case 'warning':
              statusBar.classList.add('bg-yellow-900');
              break;
            case 'info':
              statusBar.classList.add('bg-blue-900');
              break;
            default:
              statusBar.classList.add('bg-gray-900');
          }
          
          statusBar.classList.remove('hidden');
          
          // Auto-hide after 3 seconds for non-error messages
          if (type !== 'error') {
            setTimeout(() => {
              statusBar.classList.add('hidden');
            }, 3000);
          }
        }

        function showInitialPreview() {
          const previewContainer = document.getElementById('preview-container');
          if (previewContainer) {
            previewContainer.innerHTML = '<div class="text-center text-gray-500 py-12">' +
              '<i class="fas fa-envelope-open-text text-4xl mb-4 text-purple-600"></i>' +
              '<p class="text-lg font-medium text-gray-900">Template Preview</p>' +
              '<p class="text-sm text-gray-600">Start building your template to see the live preview</p>' +
              '<button onclick="generatePreview()" class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">' +
              '<i class="fas fa-eye mr-2"></i>Generate Preview' +
              '</button>' +
              '</div>';
          }
        }

        function getAuthToken() {
          return localStorage.getItem('authToken') || '';
        }

        function setupChangeDetection() {
          // Listen to both forms for changes
          const templateForm = document.getElementById('template-editor-form');
          const sectionForm = document.getElementById('section-template-form');
          
          function handleFormChange(event) {
            hasUnsavedChanges = true;
            debouncedPreviewUpdate();
            // Refresh detected variables when form content changes
            refreshDetectedVariables();
          }
          
          function handleFormCheckboxChange(event) {
            if (event.target.type === 'checkbox') {
              hasUnsavedChanges = true;
              debouncedPreviewUpdate();
              // Refresh detected variables when sections are enabled/disabled
              refreshDetectedVariables();
            }
          }
          
          function handleFormSelectChange(event) {
            if (event.target.tagName === 'SELECT') {
              hasUnsavedChanges = true;
              debouncedPreviewUpdate();
              // Refresh detected variables when selects change
              refreshDetectedVariables();
            }
          }
          
          // Add listeners to template form
          if (templateForm) {
            templateForm.addEventListener('input', handleFormChange);
            templateForm.addEventListener('change', handleFormCheckboxChange);
            templateForm.addEventListener('change', handleFormSelectChange);
          }
          
          // Add listeners to section form
          if (sectionForm) {
            sectionForm.addEventListener('input', handleFormChange);
            sectionForm.addEventListener('change', handleFormCheckboxChange);
            sectionForm.addEventListener('change', handleFormSelectChange);
          }
        }

        // Autosave removed as requested

        // Debounced preview update function
        function debouncedPreviewUpdate() {
          // Clear existing timeout
          if (previewUpdateTimeout) {
            clearTimeout(previewUpdateTimeout);
          }
          
          // Set new timeout for preview update (500ms delay)
          previewUpdateTimeout = setTimeout(() => {
            updatePreview();
          }, 500);
        }

        // Update preview without showing loading
        async function updatePreview() {
          try {
            const templateStructure = generateTemplateStructureFromForm();
            const detectedVars = getVariableValues();
            const titleTextElement = document.getElementById('title-text');
            const actualTitle = titleTextElement?.value || 'Sample Title';

            const requestBody = {
              templateStructure: templateStructure,
              // Only send user-provided test overrides
              variables: { ...detectedVars }
            };
            
            // Send preview request

            const response = await fetch('/api/v1/templates/preview', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getAuthToken()
              },
              body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
              console.error('Preview API failed:', response.status, response.statusText);
              return;
            }
            
            const data = await response.json();
            // Preview generated successfully
            
            const previewContainer = document.getElementById('preview-container');
            if (previewContainer) {
              previewContainer.innerHTML = data.preview;
              // Preview updated successfully
            } else {
              console.error('Preview container not found');
            }
          } catch (error) {
            console.error('Preview update failed:', error);
          }
        }

        // Handle locale change from the dropdown
        async function onLocaleChange() {
          try {
            const selectEl = document.getElementById('template-locale');
            const newLocale = selectEl ? selectEl.value : 'en';
            const templateKey = document.getElementById('template-key')?.value;
            if (!templateKey) {
              return;
            }

            // Offer to save before switching if there are unsaved changes
            if (typeof hasUnsavedChanges !== 'undefined' && hasUnsavedChanges) {
              const confirmed = confirm('You have unsaved changes. Do you want to save before switching locales?');
              if (confirmed && typeof saveTemplate === 'function') {
                await saveTemplate();
              }
            }

            showLoading('Switching locale...');

            // Load base template to inspect locales
            const resp = await fetch('/api/v1/templates/' + templateKey, {
              headers: { 'Authorization': 'Bearer ' + getAuthToken() }
            });
            if (!resp.ok) {
              throw new Error('HTTP ' + resp.status + ': ' + resp.statusText);
            }
            const data = await resp.json();

            currentTemplate = data.template;
            const locales = Array.isArray(currentTemplate?.locales) ? currentTemplate.locales : [];
            const localeEntry = locales.find(l => l.locale === newLocale);
            const structure = localeEntry?.jsonStructure || {};

            if (typeof loadTemplateIntoVisualBuilder === 'function') {
              loadTemplateIntoVisualBuilder(structure);
            }

            // Refresh variables and preview for the newly selected locale
            if (typeof refreshDetectedVariables === 'function') {
              refreshDetectedVariables();
            }
            if (typeof updatePreview === 'function') {
              setTimeout(function() { updatePreview(); }, 100);
            }

            const subtitle = document.getElementById('editor-subtitle');
            if (subtitle) {
              subtitle.textContent = 'Editing template ' + templateKey + ' (' + newLocale + ')';
            }

            if (typeof hasUnsavedChanges !== 'undefined') {
              hasUnsavedChanges = false;
            }

            showStatus(localeEntry ? ('Loaded locale ' + newLocale) : ('Locale ' + newLocale + ' not found. Starting empty.'), 'info');
          } catch (error) {
            const msg = (error && error.message) ? error.message : 'Unknown error';
            showStatus('Failed to switch locale: ' + msg, 'error');
          } finally {
            hideLoading();
          }
        }

        async function saveTemplate() {
          console.log('💾 saveTemplate called');
          
          try {
            showLoading('Saving template...');
            
            // Get the current template structure from the form
            const templateStructure = generateTemplateStructureFromForm();
            console.log('💾 Template structure to save:', templateStructure);
            
            // Get basic template info
            const key = document.getElementById('template-key')?.value || '';
            const name = document.getElementById('template-name')?.value || '';
            const description = document.getElementById('template-description')?.value || '';
            const category = document.getElementById('template-category')?.value || 'transactional';
            
            // Get current locale from the GUI selector
            const selectedLocale = document.getElementById('template-locale')?.value || 'en';
            
            console.log('💾 Save parameters:', { key, name, description, category, selectedLocale });
            console.log('💾 Selected locale for saving:', selectedLocale);
            
            // Prepare the template data
            const templateData = {
              key: key,
              name: name,
              description: description,
              category: category,
              jsonStructure: templateStructure,
              variableSchema: currentTemplate?.variableSchema || {}
            };
            
            // Determine if this is a new template or updating existing
            const isNewTemplate = !currentTemplate || !currentTemplate.key;
            let result;
            
            console.log('💾 Is new template:', isNewTemplate);
            console.log('💾 Current template:', currentTemplate);
            
            if (isNewTemplate) {
              // Create new template with locale
              const response = await fetch('/api/v1/templates', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + getAuthToken()
                },
                body: JSON.stringify({
                  ...templateData,
                  locale: selectedLocale
                })
              });
              
              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || ('HTTP ' + response.status + ': ' + response.statusText));
              }
              
              result = await response.json();
            } else {
              // Update existing template - check if we should save to locale or base template
              if (selectedLocale) {
                // Save to locale-specific structure
                console.log('💾 Saving to locale-specific endpoint:', '/api/v1/templates/' + key + '/locales/' + selectedLocale);
                const response = await fetch('/api/v1/templates/' + key + '/locales/' + selectedLocale, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getAuthToken()
                  },
                  body: JSON.stringify({
                    jsonStructure: templateStructure
                  })
                });
                
                if (!response.ok) {
                  const errorData = await response.json().catch(() => ({}));
                  console.error('💾 Locale save API error:', errorData);
                  throw new Error(errorData.message || ('HTTP ' + response.status + ': ' + response.statusText));
                }
                
                result = await response.json();
                console.log('💾 Locale save API success:', result);
              } else {
                // Save to base template
                console.log('💾 Saving to base template endpoint:', '/api/v1/templates/' + key);
                const response = await fetch('/api/v1/templates/' + key, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getAuthToken()
                  },
                  body: JSON.stringify(templateData)
                });
                
                if (!response.ok) {
                  const errorData = await response.json().catch(() => ({}));
                  console.error('💾 Base template save API error:', errorData);
                  throw new Error(errorData.message || ('HTTP ' + response.status + ': ' + response.statusText));
                }
                
                result = await response.json();
                console.log('💾 Base template save API success:', result);
              }
            }
            
            // Update current template reference - extract template from response
            currentTemplate = result.template;
            hasUnsavedChanges = false;
            justSaved = true; // Set flag to indicate we just saved
            
            const localeMessage = selectedLocale && selectedLocale !== 'en' ? \` for locale \${selectedLocale}\` : '';
            showStatus('Template saved successfully' + localeMessage + '!', 'success');
            hideLoading();
            
            // If this was a new template, update the URL to reflect the edit mode
            if (isNewTemplate && result.template && result.template.key) {
              const newUrl = '/admin/template-editor?template=' + result.template.key + '&mode=edit';
              window.history.replaceState({}, '', newUrl);
            }
            
            // DO NOT reload the template or reset the form - keep current form state
            
          } catch (error) {
            showStatus('Error saving template: ' + error.message, 'error');
            hideLoading();
          }
        }

        async function generatePreview() {
          
          try {
            showLoading('Generating preview...');
            
            // Get the current template structure from the form
            const templateStructure = generateTemplateStructureFromForm();
            
            // Get the actual title from the form if available
            const actualTitle = document.getElementById('title-text')?.value || 'Sample Title';
            
            const requestBody = {
              templateStructure: templateStructure,
              variables: {
                companyName: 'Your Company',
                title: actualTitle,
                bodyText: 'This is a sample email body text that demonstrates how your template will look.',
                primaryButtonLabel: 'Primary Action',
                primaryButtonUrl: '#',
                secondaryButtonLabel: 'Secondary Action',
                secondaryButtonUrl: '#',
                copyright: '&copy; 2024 Your Company. All rights reserved.'
              }
            };
            
            
            
            // Use the existing MJML preview API
            const response = await fetch('/api/v1/templates/preview', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getAuthToken()
              },
              body: JSON.stringify(requestBody)
            });
            
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error('HTTP ' + response.status + ': ' + response.statusText);
            }
            
            const data = await response.json();
            
            const previewContainer = document.getElementById('preview-container');
            
            if (previewContainer) {
              previewContainer.innerHTML = data.preview;
              showStatus('Preview generated successfully!', 'success');
            } else {
              showStatus('Preview container not found', 'error');
            }
            
            hideLoading();
            
          } catch (error) {
            showStatus('Error generating preview: ' + error.message, 'error');
            hideLoading();
            
            // Fallback to simple preview
            const previewContainer = document.getElementById('preview-container');
            if (previewContainer) {
              previewContainer.innerHTML = '<div class="text-center text-gray-500 py-12">' +
                '<i class="fas fa-exclamation-triangle text-4xl mb-4"></i>' +
                '<p class="text-lg font-medium">Preview Error</p>' +
                '<p class="text-sm">Unable to generate preview. Check your template configuration.</p>' +
                '</div>';
            }
          }
        }

        // Generate template structure from form data
        function generateTemplateStructureFromForm() {
          console.log('🚀 generateTemplateStructureFromForm called');
          const structure = {};
          
          // Get basic template info
          const key = document.getElementById('template-key')?.value || '';
          const name = document.getElementById('template-name')?.value || '';
          const description = document.getElementById('template-description')?.value || '';
          const category = document.getElementById('template-category')?.value || 'transactional';
          
          console.log('📋 Basic template info:', { key, name, description, category });
          
          // Header section
          const headerEnabled = document.getElementById('header-enabled')?.checked;
          console.log('🔍 Header enabled:', headerEnabled);
          
          if (headerEnabled) {
            const headerTagline = document.getElementById('header-tagline')?.value || '{{companyName}}';
            const headerLogoUrl = document.getElementById('header-logo-url')?.value || '';
            const headerLogoAlt = document.getElementById('header-logo-alt')?.value || 'Company Logo';
            
            console.log('📋 Header form values:', {
              tagline: headerTagline,
              logoUrl: headerLogoUrl,
              logoAlt: headerLogoAlt
            });
            
            structure.header = {
              tagline: headerTagline,
              logo_url: headerLogoUrl,
              logo_alt: headerLogoAlt
            };
            
            console.log('✅ Header structure created:', structure.header);
          } else {
            console.log('❌ Header not enabled, skipping header section');
          }
          
          // Hero section
          if (document.getElementById('hero-enabled')?.checked) {
            const heroType = document.getElementById('hero-type')?.value || 'none';
            structure.hero = {
              type: heroType
            };
            
            if (heroType === 'icon') {
              structure.hero.icon = document.getElementById('hero-icon')?.value || '🎨';
              structure.hero.icon_size = document.getElementById('hero-icon-size')?.value || '48px';
            } else if (heroType === 'image') {
              structure.hero.image_url = document.getElementById('hero-image-url')?.value || '';
              structure.hero.image_alt = document.getElementById('hero-image-alt')?.value || 'Hero Image';
              structure.hero.image_width = document.getElementById('hero-image-width')?.value || '600px';
            }
          }
          
          // Title section
          const titleEnabled = document.getElementById('title-enabled')?.checked;
          if (titleEnabled) {
            const titleTextElement = document.getElementById('title-text');
            const titleText = titleTextElement?.value;
            structure.title = {
              text: titleText || '{{title}}',
              size: document.getElementById('title-size')?.value || '28px',
              weight: document.getElementById('title-weight')?.value || '700',
              color: document.getElementById('title-color')?.value || '#1f2937',
              align: document.getElementById('title-align')?.value || 'left'
            };
          } else {
          }
          
          // Body section
          if (document.getElementById('body-enabled')?.checked) {
            const paragraphs = Array.from(document.querySelectorAll('#body-paragraphs-container textarea'))
              .map(textarea => textarea.value.trim())
              .filter(text => text.length > 0);
            
            structure.body = {
              paragraphs: paragraphs.length > 0 ? paragraphs : ['{{bodyText}}'],
              font_size: document.getElementById('body-font-size')?.value || '16px',
              line_height: document.getElementById('body-line-height')?.value || '26px'
            };
          }
          
          // Snapshot section
          if (document.getElementById('snapshot-enabled')?.checked) {
            const snapshotTitle = document.getElementById('snapshot-title')?.value || '{{snapshotTitle}}';
            
            const factRows = document.querySelectorAll('#snapshot-facts-container .flex');
            
            const facts = Array.from(factRows)
              .map((row) => {
                const inputs = row.querySelectorAll('input');
                const label = inputs[0]?.value?.trim();
                const value = inputs[1]?.value?.trim();
                if (label && value) {
                  return { label, value };
                }
                return null;
              })
              .filter(fact => fact !== null);
            
            structure.snapshot = {
              title: snapshotTitle,
              style: 'table', // Required for MJML template to render the table
              facts: facts.length > 0 ? facts : [{ label: '{{label}}', value: '{{value}}' }]
            };
          }
          
          // Visual section
          if (document.getElementById('visual-enabled')?.checked) {
            const visualType = document.getElementById('visual-type')?.value || 'none';
            structure.visual = {
              type: visualType
            };

            // Collect progress bars regardless of selected type so both visuals can be used
            const progressBars = Array.from(document.querySelectorAll('#progress-bars-container .border'))
                .map(container => {
                  const inputs = container.querySelectorAll('input');
                  const label = inputs[0]?.value?.trim();
                  const currentRaw = inputs[1]?.value ?? '';
                  const maxRaw = inputs[2]?.value ?? '';
                  const unit = (inputs[3]?.value ?? '').trim();
                  const color = inputs[4]?.value;
                  const description = inputs[5]?.value?.trim();

                  if (!label) { return null; }

                  const current = currentRaw === '' ? '{{currentValue}}' : currentRaw;
                  const max = maxRaw === '' ? '{{maxValue}}' : maxRaw;

                  const isCurrentVariable = typeof current === 'string' && current.includes('{{') && current.includes('}}');
                  const isMaxVariable = typeof max === 'string' && max.includes('{{') && max.includes('}}');

                  let currentValue = current;
                  let maxValue = max;
                  let percentage = 0;

                  if (!isCurrentVariable && !isMaxVariable) {
                    const currentNum = parseFloat(String(current));
                    const maxNum = parseFloat(String(max));
                    if (isFinite(currentNum) && isFinite(maxNum) && maxNum > 0) {
                      currentValue = currentNum;
                      maxValue = maxNum;
                      percentage = Math.round((currentNum / maxNum) * 100);
                    }
                  }

                  return {
                    label,
                    currentValue,
                    maxValue,
                    unit,
                    percentage,
                    color: color || '#3b82f6',
                    description: description || ''
                  };
                })
                .filter(bar => bar !== null);

            structure.visual.progress_bars = progressBars.length > 0 ? progressBars : [];

            // Collect countdown regardless of selected type
            structure.visual.countdown = {
              message: document.getElementById('countdown-message')?.value || '{{countdownMessage}}',
              target_date: document.getElementById('countdown-target-date')?.value || '{{targetDate}}',
              show_days: document.getElementById('countdown-show-days')?.checked || true,
              show_hours: document.getElementById('countdown-show-hours')?.checked || true,
              show_minutes: document.getElementById('countdown-show-minutes')?.checked || true,
              show_seconds: document.getElementById('countdown-show-seconds')?.checked || false
            };
          }
          
          // Actions section
          if (document.getElementById('actions-enabled')?.checked) {
            structure.actions = {};
            
            // Primary button
            const primaryLabel = document.getElementById('primary-button-label')?.value;
            const primaryUrl = document.getElementById('primary-button-url')?.value;
            if (primaryLabel && primaryUrl) {
              structure.actions.primary = {
                label: primaryLabel,
                url: primaryUrl,
                style: 'button',
                color: document.getElementById('primary-button-color')?.value || '#3b82f6',
                text_color: document.getElementById('primary-button-text-color')?.value || '#ffffff'
              };
            }
            
            // Secondary button
            const secondaryLabel = document.getElementById('secondary-button-label')?.value;
            const secondaryUrl = document.getElementById('secondary-button-url')?.value;
            if (secondaryLabel && secondaryUrl) {
              structure.actions.secondary = {
                label: secondaryLabel,
                url: secondaryUrl,
                style: 'button',
                color: document.getElementById('secondary-button-color')?.value || '#6b7280',
                text_color: '#ffffff'
              };
            }
          }
          
          // Support section
          if (document.getElementById('support-enabled')?.checked) {
            const supportLinks = Array.from(document.querySelectorAll('#support-links-container .flex'))
              .map(row => {
                const inputs = row.querySelectorAll('input');
                const label = inputs[0]?.value?.trim();
                const url = inputs[1]?.value?.trim();
                if (label && url) {
                  return { label, url };
                }
                return null;
              })
              .filter(link => link !== null);
            
            structure.support = {
              title: document.getElementById('support-title')?.value || '{{supportTitle}}',
              links: supportLinks.length > 0 ? supportLinks : [{ label: '{{linkLabel}}', url: '{{linkUrl}}' }]
            };
          }
          
          // Footer section
          if (document.getElementById('footer-enabled')?.checked) {
            const socialLinkRows = document.querySelectorAll('#social-links-container .flex');
            
            const socialLinks = Array.from(socialLinkRows)
              .map((row, index) => {
                const select = row.querySelector('select');
                const input = row.querySelector('input[type="url"]');
                const platform = select?.value;
                const url = input?.value?.trim();
                if (platform && url) {
                  return { platform, url };
                }
                return null;
              })
              .filter(link => link !== null);
            
            const legalLinks = Array.from(document.querySelectorAll('#legal-links-container .flex'))
              .map(row => {
                const inputs = row.querySelectorAll('input');
                const label = inputs[0]?.value?.trim();
                const url = inputs[1]?.value?.trim();
                if (label && url) {
                  return { label, url };
                }
                return null;
              })
              .filter(link => link !== null);
            
            structure.footer = {
              tagline: document.getElementById('footer-tagline')?.value || '{{footerTagline}}',
              social_links: socialLinks.length > 0 ? socialLinks : undefined,
              legal_links: legalLinks.length > 0 ? legalLinks : undefined,
              copyright: document.getElementById('footer-copyright')?.value || '{{copyright}}'
            };
          }
          
          console.log('🎯 Final generated structure:', structure);
          console.log('🎯 Structure keys:', Object.keys(structure));
          console.log('🎯 Header in final structure:', structure.header);
          
          return structure;
        }


        function previewTemplate() {
        }

        // Test template function
        async function testTemplate() {
          try {
            showLoading('Preparing test email...');
            
            // Get current template structure
            const templateStructure = generateTemplateStructureFromForm();
            
            // Get test values from detected variables
            const allTestVariables = getVariableValues();
            
            // Filter to only include variables that are placeholders ({{variableName}})
            // NOT values that are hardcoded in the database like button labels
            const testVariables = {};
            for (const [key, value] of Object.entries(allTestVariables)) {
              // Only include simple variables like userFirstName, planName, etc.
              // Skip nested objects like actions, header, footer which are database values
              if (typeof value !== 'object' || value === null) {
                testVariables[key] = value;
              } else {
              }
            }
            
            // Get basic template info
            const templateKey = document.getElementById('template-key')?.value;
            const selectedLocale = document.getElementById('template-locale')?.value || 'en';
            const templateName = document.getElementById('template-name')?.value;
            
            if (!templateKey) {
              throw new Error('Template key is required for testing');
            }
            
            // Save current locale structure first so the test uses the latest form values
            const saveResponse = await fetch('/api/v1/templates/' + templateKey + '/locales/' + selectedLocale, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getAuthToken()
              },
              body: JSON.stringify({
                jsonStructure: templateStructure
              })
            });
            
            if (!saveResponse.ok) {
              const errorText = await saveResponse.text().catch(() => '');
              throw new Error('Failed to save locale ' + selectedLocale + ': ' + (errorText || (saveResponse.status + ' ' + saveResponse.statusText)));
            }
            
            
            // Prompt for test email address
            const testEmail = prompt('Enter test email address:', 'test@example.com');
            if (!testEmail) {
              hideLoading();
              return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(testEmail)) {
              throw new Error('Please enter a valid email address');
            }
            
            // Prepare test email data for admin endpoint
            const testEmailData = {
              to: [{ email: testEmail, name: 'Test User' }],
              from: {
                email: 'marketing@waymore.io',
                name: 'Waymore'
              },
              subject: 'Test: ' + (templateName || 'Template Test'),
              template: {
                key: templateKey,
                locale: selectedLocale
              },
              variables: testVariables,
              metadata: {
                tenantId: 'admin_test',
                source: 'template_editor'
              }
            };
            
            
            // Send test email using Admin API (no authentication required)
            const response = await fetch('/admin/send-test-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(testEmailData)
            });
            
            if (!response.ok) {
              const errorText = await response.text().catch(() => '');
              throw new Error(errorText || ('HTTP ' + response.status + ': ' + response.statusText));
            }
            
            const result = await response.json();
            
            hideLoading();
            showStatus('Test email sent successfully to ' + testEmail + '! Message ID: ' + result.messageId, 'success');
            
          } catch (error) {
            hideLoading();
            showStatus('Failed to send test email: ' + error.message, 'error');
          }
        }

        // Debug helpers removed

        function goBack() {
          if (hasUnsavedChanges) {
            if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
              window.location.href = '/admin#template-management';
            }
          } else {
            window.location.href = '/admin#template-management';
          }
        }

        // Detected Variables Functions
        function refreshDetectedVariables() {
          // Generate template structure from current form
          const templateStructure = generateTemplateStructureFromForm();
          
          // Simple variable detection (mimicking our backend logic)
          const variables = detectVariablesInObject(templateStructure);
          detectedVariables = [...new Set(variables)];
          
          console.log('Detected variables:', detectedVariables);
          
          // Update the UI
          updateDetectedVariablesDisplay();
        }

        function detectVariablesInObject(obj, path = '') {
          const variables = [];
          
          if (obj === null || obj === undefined) {
            return variables;
          }
          
          if (typeof obj === 'string') {
            const matches = obj.match(/\{\{([^}]+)\}\}/g);
            if (matches) {
              matches.forEach(match => {
                const variableName = match.replace(/\{\{|\}\}/g, '').trim();
                variables.push(variableName);
              });
            }
            return variables;
          }
          
          if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
              variables.push(...detectVariablesInObject(item, path + '[' + index + ']'));
            });
          } else if (typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
              const keyPath = path ? (path + '.' + key) : key;
              variables.push(...detectVariablesInObject(obj[key], keyPath));
            });
          }
          
          return variables;
        }

        function updateDetectedVariablesDisplay() {
          const section = document.getElementById('detected-variables-section');
          const list = document.getElementById('detected-variables-list');
          const noVariablesMessage = document.getElementById('no-variables-message');
          
          console.log('Updating variables display. Variables count:', detectedVariables.length);
          console.log('Section element:', section);
          console.log('List element:', list);
          
          // Always show the panel; toggle inner content when empty
          section.classList.remove('hidden');
          
          if (detectedVariables.length === 0) {
            list.classList.add('hidden');
            noVariablesMessage.classList.remove('hidden');
            return;
          }
          
          list.classList.remove('hidden');
          noVariablesMessage.classList.add('hidden');
          
          // Clear existing content
          list.innerHTML = '';
          
          // Add each detected variable
          detectedVariables.forEach(variable => {
            const variableDiv = document.createElement('div');
            variableDiv.className = 'flex items-start justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm';
            
            const variableName = variable.split('|')[0].trim();
            const fallback = variable.includes('|') ? variable.split('|')[1].trim() : '';
            
            let html = '';
            html += '<div class="flex-1 mr-4">';
            html += '<div class="flex items-center space-x-2 mb-2">';
            html += '<div class="font-medium text-gray-900 text-lg">' + variableName + '</div>';
            html += '<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">Variable</span>';
            html += '</div>';
            if (fallback) {
              html += '<div class="text-sm text-gray-600 mb-2">';
              html += '<span class="font-medium">Fallback:</span>';
              html += '<span class="font-mono bg-gray-100 px-2 py-1 rounded text-xs">' + fallback + '</span>';
              html += '</div>';
            } else {
              html += '<div class="text-sm text-gray-500 mb-2">';
              html += '<span class="font-medium">Fallback:</span>';
              html += '<span class="text-gray-400 italic">None</span>';
              html += '</div>';
            }
            html += '<div class="text-xs text-gray-500">';
            html += '<span class="font-medium">Usage:</span> <span class="font-mono">{{' + variableName + (fallback ? ('|' + fallback) : '') + '}}</span>';
            html += '</div>';
            html += '</div>';
            html += '<div class="flex flex-col items-end space-y-2">';
            const currentValue = variableValues[variableName] || '';
            const placeholderValue = currentValue || '{{' + variableName + '}}';
            html += '<input type="text" placeholder="Enter test value..." class="px-3 py-2 border border-gray-300 rounded-lg text-sm w-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="' + placeholderValue + '" data-variable-name="' + encodeURIComponent(variableName) + '" title="Enter a test value to preview this variable (leave empty to show variable name)" />';
            html += '<div class="text-xs text-gray-500 text-right">';
            html += '<i class="fas fa-info-circle mr-1"></i>';
            html += 'Test value';
            html += '</div>';
            html += '</div>';
            
            variableDiv.innerHTML = html;
            // Attach input listener programmatically to avoid inline handler parsing issues
            (function attachListener(rootEl) {
              try {
                const inputEl = rootEl.querySelector('input[type="text"][data-variable-name]');
                if (inputEl) {
                  inputEl.addEventListener('input', function() {
                    const nameAttr = this.getAttribute('data-variable-name') || '';
                    const decodedName = decodeURIComponent(nameAttr);
                    
                    // If user clears the input, remove from variableValues so it falls back to variable name
                    if (this.value.trim() === '') {
                      delete variableValues[decodedName];
                    } else {
                      variableValues[decodedName] = this.value;
                    }
                    
                    if (typeof updateVariableValue === 'function') {
                      updateVariableValue(decodedName, this.value);
                    } else {
                      if (previewUpdateTimeout) { clearTimeout(previewUpdateTimeout); }
                      previewUpdateTimeout = setTimeout(function() { if (typeof updatePreview === 'function') { updatePreview(); } }, 500);
                    }
                  });
                }
              } catch (e) {
                console.warn('Failed to attach variable input listener:', e);
              }
            })(variableDiv);
            
            list.appendChild(variableDiv);
          });
        }

        function updateVariableValue(variableName, value) {
          variableValues[variableName] = value;
          
          // Trigger preview update if auto-preview is enabled
          if (previewUpdateTimeout) {
            clearTimeout(previewUpdateTimeout);
          }
          previewUpdateTimeout = setTimeout(() => {
            updatePreview();
          }, 500);
        }

        function clearAllVariableValues() {
          variableValues = {};
          
          // Reset all input fields to show variable names
          const inputs = document.querySelectorAll('#detected-variables-list input[type="text"]');
          inputs.forEach(input => {
            const variableName = decodeURIComponent(input.getAttribute('data-variable-name') || '');
            input.value = '{{' + variableName + '}}';
          });
          
          // Trigger preview update
          if (previewUpdateTimeout) {
            clearTimeout(previewUpdateTimeout);
          }
          previewUpdateTimeout = setTimeout(() => {
            updatePreview();
          }, 500);
          
          showStatus('All variable values reset to variable names', 'info');
        }

        function getVariableValues() {
          return variableValues;
        }
        
        function getVariableNamesAsDefaults() {
          // Generate template structure to detect all variables
          const templateStructure = generateTemplateStructureFromForm();
          const detectedVariables = detectVariablesInObject(templateStructure);
          
          // Create an object where variable names are their own values
          const defaults = {};
          detectedVariables.forEach(variable => {
            const cleanName = variable.replace(/\{\{|\}\}/g, '').trim();
            defaults[cleanName] = variable; // Use the full {{variable}} format as the default value
          });
          
          return defaults;
        }
        
        // Expose functions globally for inline onclick handlers
        if (typeof window !== 'undefined') {
          // Detected variables panel
          window.refreshDetectedVariables = refreshDetectedVariables;
          window.clearAllVariableValues = clearAllVariableValues;
          // Preview hooks used by other scripts
          window.updatePreview = updatePreview;
          window.generatePreview = generatePreview;
          // Provide a stable previewTemplate entry point
          window.previewTemplate = function() {
            try {
              if (typeof generatePreview === 'function') {
                return generatePreview();
              }
              if (typeof updatePreview === 'function') {
                return updatePreview();
              }
            } catch (e) {
              console.warn('previewTemplate failed:', e);
            }
          };
        }
      </script>
    </body>
    </html>
  `;
}