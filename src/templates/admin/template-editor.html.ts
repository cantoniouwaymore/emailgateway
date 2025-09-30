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
                <select id="template-category" class="form-input">
                  <option value="transactional">Transactional</option>
                  <option value="marketing">Marketing</option>
                  <option value="notification">Notification</option>
                  <option value="system">System</option>
                </select>
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
          <form id="template-editor-form" class="space-y-6" onsubmit="event.preventDefault(); return false;">
            <div id="template-sections-container">
              ${generateSectionBasedTemplateForm()}
            </div>
          </form>
        </div>

        <!-- Middle Panel: Live Preview -->
        <div class="w-1/3 p-6 overflow-y-auto bg-gray-50 editor-preview border-r">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Live Preview</h2>
            <button onclick="debugPreview()" class="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
              Debug
            </button>
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
        // Template Editor JavaScript Functions
        let currentTemplate = null;
        let isEditing = false;
        let hasUnsavedChanges = false;
        let previewUpdateTimeout = null;
        let justSaved = false; // Flag to track if we just saved a template

        // Create template configuration from variable schema defaults
        function createTemplateConfigFromSchema(variableSchema) {
          console.log('🔧 CREATING TEMPLATE CONFIG FROM SCHEMA');
          console.log('🔧 Input Variable Schema:', variableSchema);
          
          if (!variableSchema || !variableSchema.properties) {
            console.log('⚠️ Invalid or missing variable schema properties, returning empty config');
            return {};
          }
          
          const config = {};
          
          // Extract default values from the variable schema
          function extractDefaults(schema, path = '') {
            console.log(\`🔧 Extracting defaults from path: \${path}\`, schema);
            
            if (schema.default !== undefined) {
              console.log(\`✅ Found default value: \${path} = \${schema.default}\`);
              return schema.default;
            }
            
            if (schema.properties) {
              console.log(\`🔍 Processing properties for: \${path}\`);
              const result = {};
              for (const [key, value] of Object.entries(schema.properties)) {
                const defaultValue = extractDefaults(value, \`\${path}.\${key}\`);
                if (defaultValue !== undefined) {
                  result[key] = defaultValue;
                }
              }
              console.log(\`🔧 Properties result for \${path}:\`, result);
              return Object.keys(result).length > 0 ? result : undefined;
            }
            
            return undefined;
          }
          
          // Process each section
          console.log('🔧 Processing sections from variable schema');
          for (const [sectionName, sectionSchema] of Object.entries(variableSchema.properties)) {
            console.log(\`🔧 Processing section: \${sectionName}\`);
            const sectionDefaults = extractDefaults(sectionSchema);
            if (sectionDefaults !== undefined) {
              config[sectionName] = sectionDefaults;
              console.log(\`✅ Added section defaults for \${sectionName}:\`, sectionDefaults);
            } else {
              console.log(\`⚠️ No defaults found for section: \${sectionName}\`);
            }
          }
          
          console.log('🔧 Final Template Config:', config);
          return config;
        }

        // Initialize the template editor
        function initializeTemplateEditor() {
          console.log('initializeTemplateEditor called');
          console.log('Current URL:', window.location.href);
          console.log('Current search:', window.location.search);
          console.log('Stack trace:', new Error().stack);
          
          // Prevent form submission
          const form = document.getElementById('template-editor-form');
          if (form) {
            form.addEventListener('submit', function(event) {
              console.log('Form submit prevented');
              event.preventDefault();
              return false;
            });
          }
          
          const urlParams = new URLSearchParams(window.location.search);
          const templateKey = urlParams.get('template');
          const mode = urlParams.get('mode');
          
          console.log('URL params - templateKey:', templateKey, 'mode:', mode);
          console.log('currentTemplate:', currentTemplate);
          
          // If we just saved a template, don't reload to preserve form state
          if (justSaved) {
            console.log('Just saved template, skipping reload to preserve form state');
            justSaved = false; // Reset the flag
            return;
          }
          
          // If we already have a current template and we're just updating the URL, don't reload
          if (currentTemplate && templateKey === currentTemplate.key && mode === 'edit') {
            console.log('Template already loaded, skipping reload to preserve form state');
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
            console.log('🔄 LOADING TEMPLATE FOR EDITING');
            console.log('Template Key:', templateKey);
            showLoading('Loading template...');
            
            const response = await fetch(\`/api/v1/templates/\${templateKey}\`, {
              headers: {
                'Authorization': \`Bearer \${getAuthToken()}\`
              }
            });
            
            console.log('📡 API Response Status:', response.status);
            console.log('📡 API Response OK:', response.ok);
            
            if (!response.ok) {
              throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
            }
            
            const data = await response.json();
            console.log('📦 Raw API Response:', data);
            currentTemplate = data.template;
            console.log('✅ Current Template Set:', currentTemplate);
            
            // Populate basic information
            console.log('📝 POPULATING FORM FIELDS');
            document.getElementById('editor-title').textContent = \`Edit: \${currentTemplate.name}\`;
            document.getElementById('editor-subtitle').textContent = \`Editing template \${currentTemplate.key}\`;
            document.getElementById('template-key').value = currentTemplate.key;
            document.getElementById('template-key').readOnly = true;
            document.getElementById('template-name').value = currentTemplate.name;
            document.getElementById('template-description').value = currentTemplate.description || '';
            document.getElementById('template-category').value = currentTemplate.category;
            
            console.log('📝 Form Fields Populated:');
            console.log('  - Key:', currentTemplate.key);
            console.log('  - Name:', currentTemplate.name);
            console.log('  - Description:', currentTemplate.description);
            console.log('  - Category:', currentTemplate.category);
            
            // Load template structure into visual builder
            console.log('Template loaded:', currentTemplate);
            console.log('JSON Structure:', currentTemplate.jsonStructure);
            console.log('Variable Schema:', currentTemplate.variableSchema);
            console.log('loadTemplateIntoVisualBuilder function available:', typeof loadTemplateIntoVisualBuilder);
            
            if (typeof loadTemplateIntoVisualBuilder === 'function') {
              console.log('🎛️ LOADING TEMPLATE INTO VISUAL BUILDER');
              // Load the actual template structure from the database
              console.log('🎛️ Loading JSON Structure:', currentTemplate.jsonStructure);
              loadTemplateIntoVisualBuilder(currentTemplate.jsonStructure);
              console.log('✅ Template loaded into visual builder successfully');
            } else {
              console.error('❌ loadTemplateIntoVisualBuilder function not found!');
              console.log('Available functions:', Object.keys(window).filter(key => typeof window[key] === 'function' && key.includes('load')));
            }
            
            // Load detected variables from the template
            console.log('🔍 LOADING DETECTED VARIABLES FROM TEMPLATE');
            if (currentTemplate.detectedVariables && currentTemplate.detectedVariables.length > 0) {
              detectedVariables = [...currentTemplate.detectedVariables];
              console.log('📋 Loaded detected variables:', detectedVariables);
              updateDetectedVariablesDisplay();
            } else {
              // Fallback: detect variables from the JSON structure
              console.log('🔍 No detected variables in template, detecting from JSON structure...');
              const variables = detectVariablesInObject(currentTemplate.jsonStructure);
              detectedVariables = [...new Set(variables)];
              console.log('📋 Detected variables from structure:', detectedVariables);
              updateDetectedVariablesDisplay();
            }
            
            // Show initial preview instead of generating immediately
            showInitialPreview();
            
            // Trigger a preview update after a short delay to ensure form is fully loaded
            setTimeout(() => {
              console.log('🔍 Triggering initial preview update after template load');
              updatePreview();
            }, 1000);
            
            hideLoading();
            
          } catch (error) {
            console.error('Error loading template:', error);
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
            previewContainer.innerHTML = \`
              <div class="text-center text-gray-500 py-12">
                <i class="fas fa-envelope-open-text text-4xl mb-4 text-purple-600"></i>
                <p class="text-lg font-medium text-gray-900">Template Preview</p>
                <p class="text-sm text-gray-600">Start building your template to see the live preview</p>
                <button onclick="generatePreview()" class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <i class="fas fa-eye mr-2"></i>Generate Preview
                </button>
              </div>
            \`;
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
            console.log('🔍 Form input event triggered by:', event.target.id);
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
            console.log('🔍 UpdatePreview called - getting current form values');
            // Get the current template structure from the form
            const templateStructure = generateTemplateStructureFromForm();
            console.log('🔍 UpdatePreview - Template Structure:', templateStructure);
            
            // Get detected variables and their values
            const detectedVars = getVariableValues();
            
            // Get the actual title from the form if available
            const titleTextElement = document.getElementById('title-text');
            const actualTitle = titleTextElement?.value || 'Sample Title';
            console.log('🔍 UpdatePreview - Title text element found:', !!titleTextElement);
            console.log('🔍 UpdatePreview - Title text field value:', titleTextElement?.value);
            console.log('🔍 UpdatePreview - Title enabled:', document.getElementById('title-enabled')?.checked);
            console.log('🔍 UpdatePreview using title:', actualTitle);
            
            // Merge with default values for preview
            const previewVariables = {
              companyName: 'Your Company',
              title: actualTitle,
              bodyText: 'This is a sample email body text that demonstrates how your template will look.',
              primaryButtonLabel: 'Primary Action',
              primaryButtonUrl: '#',
              secondaryButtonLabel: 'Secondary Action',
              secondaryButtonUrl: '#',
              copyright: '© 2024 Your Company. All rights reserved.',
              ...detectedVars // Override with user-provided values
            };
            
            console.log('🔍 UpdatePreview - Preview Variables:', previewVariables);
            
            // Use the centralized API client for preview generation
            console.log('🚀 Sending preview API request...');
            const data = await window.EmailGatewayAPI.generatePreview(templateStructure, previewVariables);
            
            console.log('📡 Preview API response received');
            console.log('📦 Preview API response data:', data);
            console.log('📦 Preview HTML length:', data.preview?.length || 0);
            
            const previewContainer = document.getElementById('preview-container');
            console.log('🎯 Preview container found:', !!previewContainer);
            
            if (previewContainer) {
              console.log('✅ Updating preview container with new HTML');
              previewContainer.innerHTML = data.preview;
              console.log('✅ Preview container updated successfully');
            } else {
              console.error('❌ Preview container not found!');
            }
            
          } catch (error) {
            console.error('❌ Error updating preview:', error);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error stack:', error.stack);
            // Don't show error messages for real-time updates to avoid spam
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

            // Load base template to inspect locales with robust fallback
            let data;
            if (typeof window !== 'undefined' && window.EmailGatewayAPI) {
              try {
                data = await window.EmailGatewayAPI.getTemplate(templateKey);
              } catch (e) {
                // Fallback to direct fetch if centralized client fails
                const resp = await fetch('/api/v1/templates/' + templateKey, {
                  headers: { 'Authorization': 'Bearer ' + getAuthToken() }
                });
                if (!resp.ok) {
                  throw new Error('HTTP ' + resp.status + ': ' + resp.statusText);
                } else {
                  data = await resp.json();
                }
              }
            } else {
              const resp = await fetch('/api/v1/templates/' + templateKey, {
                headers: { 'Authorization': 'Bearer ' + getAuthToken() }
              });
              if (!resp.ok) {
                throw new Error('HTTP ' + resp.status + ': ' + resp.statusText);
              } else {
                data = await resp.json();
              }
            }

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
            console.error('Failed to switch locale:', error);
            const msg = (error && error.message) ? error.message : 'Unknown error';
            showStatus('Failed to switch locale: ' + msg, 'error');
          } finally {
            hideLoading();
          }
        }

        async function saveTemplate() {
          console.log('💾 SAVE TEMPLATE FUNCTION CALLED');
          
          try {
            showLoading('Saving template...');
            
            // Get the current template structure from the form
            console.log('📋 COLLECTING FORM DATA');
            const templateStructure = generateTemplateStructureFromForm();
            console.log('📋 Template Structure:', templateStructure);
            
            // Get basic template info
            const key = document.getElementById('template-key')?.value || '';
            const name = document.getElementById('template-name')?.value || '';
            const description = document.getElementById('template-description')?.value || '';
            const category = document.getElementById('template-category')?.value || 'transactional';
            
            console.log('📋 Basic Template Info:');
            console.log('  - Key:', key);
            console.log('  - Name:', name);
            console.log('  - Description:', description);
            console.log('  - Category:', category);
            
            // Prepare the template data
            const templateData = {
              key: key,
              name: name,
              description: description,
              category: category,
              jsonStructure: templateStructure,
              variableSchema: currentTemplate?.variableSchema || {}
            };
            
            console.log('📦 PREPARED TEMPLATE DATA:', templateData);
            
            // Determine if this is a new template or updating existing
            const isNewTemplate = !currentTemplate || !currentTemplate.key;
            const url = isNewTemplate ? '/api/v1/templates' : \`/api/v1/templates/\${key}\`;
            const method = isNewTemplate ? 'POST' : 'PUT';
            
            console.log('🌐 API REQUEST DETAILS:');
            console.log('  - Is New Template:', isNewTemplate);
            console.log('  - URL:', url);
            console.log('  - Method:', method);
            console.log('  - Current Template:', currentTemplate);
            
            console.log('🚀 SENDING API REQUEST');
            const response = await fetch(url, {
              method: method,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${getAuthToken()}\`
              },
              body: JSON.stringify(templateData)
            });
            
            console.log('📡 API RESPONSE RECEIVED:');
            console.log('  - Status:', response.status);
            console.log('  - OK:', response.ok);
            console.log('  - Status Text:', response.statusText);
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              console.error('❌ API ERROR:', errorData);
              throw new Error(errorData.message || \`HTTP \${response.status}: \${response.statusText}\`);
            }
            
            const result = await response.json();
            console.log('✅ TEMPLATE SAVED SUCCESSFULLY:');
            console.log('  - Full Response:', result);
            console.log('  - Template Key:', result.template?.key);
            console.log('  - Template Name:', result.template?.name);
            
            // Update current template reference - extract template from response
            console.log('🔄 UPDATING TEMPLATE STATE');
            currentTemplate = result.template;
            hasUnsavedChanges = false;
            justSaved = true; // Set flag to indicate we just saved
            
            console.log('✅ State Updated:');
            console.log('  - Current Template:', currentTemplate);
            console.log('  - Template Key:', currentTemplate?.key);
            console.log('  - Has Unsaved Changes:', hasUnsavedChanges);
            console.log('  - Just Saved Flag:', justSaved);
            
            showStatus('Template saved successfully!', 'success');
            hideLoading();
            
            // If this was a new template, update the URL to reflect the edit mode
            if (isNewTemplate && result.template && result.template.key) {
              const newUrl = \`/admin/template-editor?template=\${result.template.key}&mode=edit\`;
              console.log('🔗 UPDATING URL FOR NEW TEMPLATE:');
              console.log('  - From:', window.location.href);
              console.log('  - To:', newUrl);
              window.history.replaceState({}, '', newUrl);
              console.log('  - URL after update:', window.location.href);
              console.log('  - URL search params:', window.location.search);
            }
            
            // DO NOT reload the template or reset the form - keep current form state
            console.log('✅ SAVE COMPLETE - FORM DATA PRESERVED');
            
          } catch (error) {
            console.error('❌ SAVE TEMPLATE ERROR:', error);
            console.error('❌ Error Message:', error.message);
            console.error('❌ Error Stack:', error.stack);
            showStatus('Error saving template: ' + error.message, 'error');
            hideLoading();
          }
        }

        async function generatePreview() {
          console.log('👁️ GENERATE PREVIEW FUNCTION CALLED');
          
          try {
            showLoading('Generating preview...');
            
            // Get the current template structure from the form
            console.log('📋 COLLECTING FORM DATA FOR PREVIEW');
            const templateStructure = generateTemplateStructureFromForm();
            console.log('📋 Template Structure:', templateStructure);
            
            // Get the actual title from the form if available
            const actualTitle = document.getElementById('title-text')?.value || 'Sample Title';
            console.log('🔍 GeneratePreview - Title text field value:', document.getElementById('title-text')?.value);
            console.log('🔍 GeneratePreview - Title enabled:', document.getElementById('title-enabled')?.checked);
            console.log('🔍 Using title for preview:', actualTitle);
            
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
                copyright: '© 2024 Your Company. All rights reserved.'
              }
            };
            
            console.log('🔍 GeneratePreview - Request Body:', requestBody);
            
            console.log('🚀 SENDING PREVIEW REQUEST');
            console.log('📦 Request Body:', requestBody);
            
            // Use the existing MJML preview API
            const response = await fetch('/api/v1/templates/preview', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${getAuthToken()}\`
              },
              body: JSON.stringify(requestBody)
            });
            
            console.log('📡 PREVIEW RESPONSE RECEIVED');
            console.log('📡 Response Status:', response.status);
            console.log('📡 Response OK:', response.ok);
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error('❌ Preview API Error:', errorText);
              throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
            }
            
            const data = await response.json();
            console.log('📦 Preview Response Data:', data);
            console.log('📦 Preview HTML Length:', data.preview?.length || 0);
            
            const previewContainer = document.getElementById('preview-container');
            console.log('🎯 Preview Container Found:', !!previewContainer);
            console.log('🎯 Preview Container ID:', previewContainer?.id);
            
            if (previewContainer) {
              console.log('✅ SETTING PREVIEW HTML');
              previewContainer.innerHTML = data.preview;
              showStatus('Preview generated successfully!', 'success');
              console.log('✅ Preview HTML set successfully');
            } else {
              console.error('❌ Preview container not found!');
              showStatus('Preview container not found', 'error');
            }
            
            hideLoading();
            
          } catch (error) {
            console.error('Error generating preview:', error);
            showStatus('Error generating preview: ' + error.message, 'error');
            hideLoading();
            
            // Fallback to simple preview
            const previewContainer = document.getElementById('preview-container');
            if (previewContainer) {
              previewContainer.innerHTML = \`
                <div class="text-center text-gray-500 py-12">
                  <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                  <p class="text-lg font-medium">Preview Error</p>
                  <p class="text-sm">Unable to generate preview. Check your template configuration.</p>
                </div>
              \`;
            }
          }
        }

        // Generate template structure from form data
        function generateTemplateStructureFromForm() {
          console.log('📋 GENERATING TEMPLATE STRUCTURE FROM FORM');
          const structure = {};
          
          // Get basic template info
          const key = document.getElementById('template-key')?.value || '';
          const name = document.getElementById('template-name')?.value || '';
          const description = document.getElementById('template-description')?.value || '';
          const category = document.getElementById('template-category')?.value || 'transactional';
          
          console.log('📋 Basic Info:', { key, name, description, category });
          
          // Header section
          const headerEnabled = document.getElementById('header-enabled')?.checked;
          console.log('📋 Header Enabled:', headerEnabled);
          if (headerEnabled) {
            structure.header = {
              tagline: document.getElementById('header-tagline')?.value || '{{companyName}}',
              logoUrl: document.getElementById('header-logo-url')?.value || '',
              logoAlt: document.getElementById('header-logo-alt')?.value || 'Company Logo'
            };
            console.log('📋 Header Structure:', structure.header);
          }
          
          // Hero section
          if (document.getElementById('hero-enabled')?.checked) {
            const heroType = document.getElementById('hero-type')?.value || 'none';
            structure.hero = {
              type: heroType
            };
            
            if (heroType === 'icon') {
              structure.hero.icon = document.getElementById('hero-icon')?.value || '🎨';
              structure.hero.iconSize = document.getElementById('hero-icon-size')?.value || '48px';
            } else if (heroType === 'image') {
              structure.hero.imageUrl = document.getElementById('hero-image-url')?.value || '';
              structure.hero.imageAlt = document.getElementById('hero-image-alt')?.value || 'Hero Image';
              structure.hero.imageWidth = document.getElementById('hero-image-width')?.value || '600px';
            }
          }
          
          // Title section
          const titleEnabled = document.getElementById('title-enabled')?.checked;
          console.log('🔍 Title section enabled:', titleEnabled);
          if (titleEnabled) {
            const titleTextElement = document.getElementById('title-text');
            const titleText = titleTextElement?.value;
            console.log('🔍 Title text element found:', !!titleTextElement);
            console.log('🔍 Title text element value:', titleText);
            console.log('🔍 Title section enabled, title text:', titleText);
            structure.title = {
              text: titleText || '{{title}}',
              size: document.getElementById('title-size')?.value || '28px',
              weight: document.getElementById('title-weight')?.value || '700',
              color: document.getElementById('title-color')?.value || '#1f2937',
              align: document.getElementById('title-align')?.value || 'left'
            };
            console.log('🔍 Title structure created:', structure.title);
          } else {
            console.log('🔍 Title section disabled, skipping title structure');
          }
          
          // Body section
          if (document.getElementById('body-enabled')?.checked) {
            const paragraphs = Array.from(document.querySelectorAll('#body-paragraphs-container textarea'))
              .map(textarea => textarea.value.trim())
              .filter(text => text.length > 0);
            
            structure.body = {
              paragraphs: paragraphs.length > 0 ? paragraphs : ['{{bodyText}}'],
              fontSize: document.getElementById('body-font-size')?.value || '16px',
              lineHeight: document.getElementById('body-line-height')?.value || '26px'
            };
          }
          
          // Snapshot section
          if (document.getElementById('snapshot-enabled')?.checked) {
            const facts = Array.from(document.querySelectorAll('#snapshot-facts-container .flex'))
              .map(row => {
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
              title: document.getElementById('snapshot-title')?.value || '{{snapshotTitle}}',
              facts: facts.length > 0 ? facts : [{ label: '{{label}}', value: '{{value}}' }]
            };
          }
          
          // Visual section
          if (document.getElementById('visual-enabled')?.checked) {
            const visualType = document.getElementById('visual-type')?.value || 'none';
            structure.visual = {
              type: visualType
            };
            
            if (visualType === 'progress') {
              const progressBars = Array.from(document.querySelectorAll('#progress-bars-container .border'))
                .map(container => {
                  const inputs = container.querySelectorAll('input');
                  const label = inputs[0]?.value?.trim();
                  const current = inputs[1]?.value;
                  const max = inputs[2]?.value;
                  const unit = inputs[3]?.value?.trim();
                  const color = inputs[4]?.value;
                  const description = inputs[5]?.value?.trim();
                  
                  if (label && current && max && unit) {
                    return {
                      label,
                      currentValue: parseFloat(current),
                      maxValue: parseFloat(max),
                      unit,
                      percentage: Math.round((parseFloat(current) / parseFloat(max)) * 100),
                      color: color || '#3b82f6',
                      description: description || ''
                    };
                  }
                  return null;
                })
                .filter(bar => bar !== null);
                
              structure.visual.progressBars = progressBars.length > 0 ? progressBars : [];
            } else if (visualType === 'countdown') {
              structure.visual.countdown = {
                message: document.getElementById('countdown-message')?.value || '{{countdownMessage}}',
                targetDate: document.getElementById('countdown-target-date')?.value || '{{targetDate}}',
                showDays: document.getElementById('countdown-show-days')?.checked || true,
                showHours: document.getElementById('countdown-show-hours')?.checked || true,
                showMinutes: document.getElementById('countdown-show-minutes')?.checked || true,
                showSeconds: document.getElementById('countdown-show-seconds')?.checked || false
              };
            }
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
            console.log('📋 Footer section enabled, collecting social links...');
            const socialLinkRows = document.querySelectorAll('#social-links-container .flex');
            console.log('📋 Social link rows found:', socialLinkRows.length);
            
            const socialLinks = Array.from(socialLinkRows)
              .map((row, index) => {
                const select = row.querySelector('select');
                const input = row.querySelector('input[type="url"]');
                const platform = select?.value;
                const url = input?.value?.trim();
                console.log('📋 Social link ' + index + ': platform="' + platform + '", url="' + url + '"');
                if (platform && url) {
                  return { platform, url };
                }
                return null;
              })
              .filter(link => link !== null);
            
            console.log('📋 Collected social links:', socialLinks);
              
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
            
            console.log('📋 Footer structure created:', structure.footer);
          }
          
          console.log('📋 FINAL TEMPLATE STRUCTURE:', structure);
          return structure;
        }


        function previewTemplate() {
          console.log('Preview template function called');
        }

        // Test template function
        async function testTemplate() {
          try {
            console.log('🧪 TEST TEMPLATE FUNCTION CALLED');
            showLoading('Preparing test email...');
            
            // Get current template structure
            const templateStructure = generateTemplateStructureFromForm();
            console.log('📋 Template Structure for Test:', templateStructure);
            
            // Get test values from detected variables
            const allTestVariables = getVariableValues();
            console.log('📋 All Test Variables:', allTestVariables);
            
            // Filter to only include variables that are placeholders ({{variableName}})
            // NOT values that are hardcoded in the database like button labels
            const testVariables = {};
            for (const [key, value] of Object.entries(allTestVariables)) {
              // Only include simple variables like userFirstName, planName, etc.
              // Skip nested objects like actions, header, footer which are database values
              if (typeof value !== 'object' || value === null) {
                testVariables[key] = value;
              } else {
                console.log('🚫 Skipping nested object variable:', key, value);
              }
            }
            console.log('📋 Filtered Test Variables (placeholders only):', testVariables);
            
            // Get basic template info
            const templateKey = document.getElementById('template-key')?.value;
            const selectedLocale = document.getElementById('template-locale')?.value || 'en';
            const templateName = document.getElementById('template-name')?.value;
            
            if (!templateKey) {
              throw new Error('Template key is required for testing');
            }
            
            // Save current locale structure first so the test uses the latest form values
            console.log('💾 Saving locale before testing...', selectedLocale);
            console.log('📋 Locale Structure being saved:', JSON.stringify(templateStructure, null, 2));
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
            
            console.log('✅ Template saved successfully');
            
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
            
            console.log('📧 Sending Test Email via Admin Endpoint:', JSON.stringify(testEmailData, null, 2));
            
            // Send test email using Backend API (authenticated)
            const response = await fetch('/api/v1/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getAuthToken(),
                'Idempotency-Key': 'editor-' + Date.now() + '-' + Math.random().toString(36).slice(2)
              },
              body: JSON.stringify(testEmailData)
            });
            
            if (!response.ok) {
              const errorText = await response.text().catch(() => '');
              throw new Error(errorText || ('HTTP ' + response.status + ': ' + response.statusText));
            }
            
            const result = await response.json();
            console.log('✅ Test Email Sent Successfully:', result);
            
            hideLoading();
            showStatus('Test email sent successfully to ' + testEmail + '! Message ID: ' + result.messageId, 'success');
            
          } catch (error) {
            console.error('❌ Test Email Error:', error);
            hideLoading();
            showStatus('Failed to send test email: ' + error.message, 'error');
          }
        }

        // Debug function for testing preview
        function debugPreview() {
          console.log('🐛 DEBUG PREVIEW FUNCTION CALLED');
          
          // Check if preview container exists
          const previewContainer = document.getElementById('preview-container');
          console.log('🎯 Preview Container Found:', !!previewContainer);
          console.log('🎯 Preview Container Element:', previewContainer);
          
          if (previewContainer) {
            console.log('🎯 Preview Container HTML:', previewContainer.innerHTML);
            console.log('🎯 Preview Container Classes:', previewContainer.className);
            console.log('🎯 Preview Container Style:', previewContainer.style.cssText);
          }
          
          // Test title text input
          const titleTextElement = document.getElementById('title-text');
          console.log('🎯 Title Text Element Found:', !!titleTextElement);
          console.log('🎯 Title Text Element Value:', titleTextElement?.value);
          
          // Test form detection
          const templateForm = document.getElementById('template-editor-form');
          const sectionForm = document.getElementById('section-template-form');
          console.log('🎯 Template Form Found:', !!templateForm);
          console.log('🎯 Section Form Found:', !!sectionForm);
          
          // Test simple HTML injection
          if (previewContainer) {
            const currentTime = new Date().toLocaleTimeString();
            const titleValue = titleTextElement?.value || 'No Title';
            previewContainer.innerHTML = 
              '<div class="text-center text-green-500 py-8">' +
                '<i class="fas fa-check-circle text-4xl mb-4"></i>' +
                '<p class="text-lg font-medium">Debug Test Successful!</p>' +
                '<p class="text-sm">Preview container is working</p>' +
                '<p class="text-sm">Title Text Value: "' + titleValue + '"</p>' +
                '<p class="text-xs text-gray-500 mt-2">Time: ' + currentTime + '</p>' +
              '</div>';
            console.log('✅ Debug HTML injected successfully');
          } else {
            console.error('❌ Preview container not found!');
          }
        }

        // Debug function specifically for social links
        function debugSocialLinks() {
          console.log('🔗 DEBUG SOCIAL LINKS FUNCTION CALLED');
          
          // Check if footer is enabled
          const footerEnabled = document.getElementById('footer-enabled')?.checked;
          console.log('🔗 Footer enabled:', footerEnabled);
          
          if (!footerEnabled) {
            console.log('🔗 Footer is disabled, enabling it first...');
            document.getElementById('footer-enabled').checked = true;
          }
          
          // Check social links container
          const socialContainer = document.getElementById('social-links-container');
          console.log('🔗 Social links container found:', !!socialContainer);
          
          if (socialContainer) {
            const socialRows = socialContainer.querySelectorAll('.flex');
            console.log('🔗 Social link rows found:', socialRows.length);
            
            socialRows.forEach((row, index) => {
              const select = row.querySelector('select');
              const input = row.querySelector('input[type="url"]');
              console.log('🔗 Row ' + index + ' - Select found:', !!select, 'Input found:', !!input);
              if (select) console.log('🔗 Row ' + index + ' - Platform value:', select.value);
              if (input) console.log('🔗 Row ' + index + ' - URL value:', input.value);
            });
          }
          
          // Generate template structure and check social links
          const structure = generateTemplateStructureFromForm();
          console.log('🔗 Generated structure footer:', structure.footer);
          console.log('🔗 Social links in structure:', structure.footer?.social_links);
        }

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
        let detectedVariables = [];
        let variableValues = {};

        function refreshDetectedVariables() {
          console.log('🔄 Refreshing detected variables...');
          
          // Generate template structure from current form
          const templateStructure = generateTemplateStructureFromForm();
          
          // Simple variable detection (mimicking our backend logic)
          const variables = detectVariablesInObject(templateStructure);
          detectedVariables = [...new Set(variables)];
          
          console.log('📋 Detected variables:', detectedVariables);
          
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
              variables.push(...detectVariablesInObject(item, \`\${path}[\${index}]\`));
            });
          } else if (typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
              const keyPath = path ? \`\${path}.\${key}\` : key;
              variables.push(...detectVariablesInObject(obj[key], keyPath));
            });
          }
          
          return variables;
        }

        function updateDetectedVariablesDisplay() {
          const section = document.getElementById('detected-variables-section');
          const list = document.getElementById('detected-variables-list');
          const noVariablesMessage = document.getElementById('no-variables-message');
          
          if (detectedVariables.length === 0) {
            section.classList.add('hidden');
            return;
          }
          
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
            
            variableDiv.innerHTML = \`
              <div class="flex-1 mr-4">
                <div class="flex items-center space-x-2 mb-2">
                  <div class="font-medium text-gray-900 text-lg">\${variableName}</div>
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">Variable</span>
                </div>
                \${fallback ? \`
                  <div class="text-sm text-gray-600 mb-2">
                    <span class="font-medium">Fallback:</span> 
                    <span class="font-mono bg-gray-100 px-2 py-1 rounded text-xs">\${fallback}</span>
                  </div>
                \` : \`
                  <div class="text-sm text-gray-500 mb-2">
                    <span class="font-medium">Fallback:</span> 
                    <span class="text-gray-400 italic">None</span>
                  </div>
                \`}
                <div class="text-xs text-gray-500">
                  <span class="font-medium">Usage:</span> <span class="font-mono">{{\${variableName}\${fallback ? '|' + fallback : ''}}}</span>
                </div>
              </div>
              <div class="flex flex-col items-end space-y-2">
                <input 
                  type="text" 
                  placeholder="Test value..."
                  class="px-3 py-2 border border-gray-300 rounded-lg text-sm w-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value="\${variableValues[variableName] || ''}"
                  onchange="updateVariableValue('\${variableName}', this.value)"
                  title="Enter a test value to preview this variable"
                />
                <div class="text-xs text-gray-500 text-right">
                  <i class="fas fa-info-circle mr-1"></i>
                  Test value
                </div>
              </div>
            \`;
            
            list.appendChild(variableDiv);
          });
        }

        function updateVariableValue(variableName, value) {
          variableValues[variableName] = value;
          console.log('📝 Updated variable:', variableName, '=', value);
          
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
          console.log('🧹 Cleared all variable values');
          
          // Clear all input fields
          const inputs = document.querySelectorAll('#detected-variables-list input[type="text"]');
          inputs.forEach(input => {
            input.value = '';
          });
          
          // Trigger preview update
          if (previewUpdateTimeout) {
            clearTimeout(previewUpdateTimeout);
          }
          previewUpdateTimeout = setTimeout(() => {
            updatePreview();
          }, 500);
          
          showStatus('All variable values cleared', 'info');
        }

        function getVariableValues() {
          return variableValues;
        }
      </script>
    </body>
    </html>
  `;
}