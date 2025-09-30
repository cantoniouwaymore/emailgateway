// Template Editor JavaScript Functions
let currentTemplate = null;
let isEditing = false;
let autoSaveInterval = null;
let hasUnsavedChanges = false;
let currentLocale = 'en';

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
        const defaultValue = extractDefaults(value, `${path}.${key}`);
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
    }
  }
  
  return config;
}

// Initialize the template editor
function initializeTemplateEditor() {
  const urlParams = new URLSearchParams(window.location.search);
  const templateKey = urlParams.get('template');
  const mode = urlParams.get('mode');
  
  if (templateKey && mode === 'edit') {
    isEditing = true;
    loadTemplateForEditing(templateKey);
  } else {
    isEditing = false;
    document.getElementById('editor-title').textContent = 'Create New Template';
    document.getElementById('editor-subtitle').textContent = 'Build a new email template';
  }
  
  setupChangeDetection();
  setupAutoSave();
  
  // Show initial preview without API call
  showInitialPreview();
}

// Load template for editing
async function loadTemplateForEditing(templateKey) {
  try {
    showLoading('Loading template...');
    
    // Get current locale from selector
    currentLocale = document.getElementById('template-locale').value;
    
    // Always load base template to get locales list
    const data = await window.EmailGatewayAPI.getTemplate(templateKey);
    currentTemplate = data.template;
    
    // Try to pick locale-specific structure
    const localeEntry = Array.isArray(currentTemplate?.locales)
      ? currentTemplate.locales.find(l => l.locale === currentLocale)
      : null;
    const templateData = localeEntry?.jsonStructure || currentTemplate.jsonStructure || {};
    
    // Populate basic information
    document.getElementById('editor-title').textContent = `Edit: ${currentTemplate.name || templateKey}`;
    document.getElementById('editor-subtitle').textContent = `Editing template ${templateKey} (${currentLocale})`;
    document.getElementById('template-key').value = templateKey;
    document.getElementById('template-key').readOnly = true;
    document.getElementById('template-name').value = currentTemplate?.name || '';
    document.getElementById('template-description').value = currentTemplate?.description || '';
    document.getElementById('template-category').value = currentTemplate?.category || 'transactional';
    
    // Load template structure into visual builder
    if (typeof loadTemplateIntoVisualBuilder === 'function') {
      loadTemplateIntoVisualBuilder(templateData || {});
    }
    
    // Show initial preview instead of generating immediately
    showInitialPreview();
    hideLoading();
    
  } catch (error) {
    console.error('Error loading template:', error);
    showStatus('Error loading template: ' + error.message, 'error');
    hideLoading();
  }
}

// Generate template structure from form data
function generateTemplateStructure() {
  // Get basic template info
  const key = document.getElementById('template-key')?.value || '';
  const name = document.getElementById('template-name')?.value || '';
  const description = document.getElementById('template-description')?.value || '';
  const category = document.getElementById('template-category')?.value || 'transactional';
  
  // For now, return a basic structure - in a real implementation, you'd collect data from the visual builder
  return {
    key: key || 'sample-template',
    name: name || 'Sample Template',
    description: description || 'A sample email template',
    category: category,
    structure: {
      header: { tagline: '{{companyName}}' },
      title: { text: '{{title}}' },
      body: { paragraphs: ['{{bodyText}}'] },
      actions: {
        primary: { label: '{{primaryButtonLabel}}', url: '{{primaryButtonUrl}}', style: 'button' },
        secondary: { label: '{{secondaryButtonLabel}}', url: '{{secondaryButtonUrl}}', style: 'button' }
      },
      footer: { copyright: '{{copyright}}' }
    }
  };
}

// Save template
async function saveTemplate() {
  try {
    showLoading('Saving template...');
    
    const templateData = generateTemplateStructure();
    
    if (!templateData.key || !templateData.name) {
      throw new Error('Template key and name are required');
    }
    
    // Get current locale
    currentLocale = document.getElementById('template-locale').value;
    
    let result;
    if (isEditing && currentLocale) {
      // Update locale-specific structure
      result = await window.EmailGatewayAPI.updateLocale(templateData.key, currentLocale, {
        jsonStructure: templateData.jsonStructure
      });
    } else if (isEditing) {
      // Update base template
      result = await window.EmailGatewayAPI.updateTemplate(templateData.key, templateData);
    } else {
      // Create new template
      result = await window.EmailGatewayAPI.createTemplate(templateData);
    }
    
    showStatus(`Template saved successfully${currentLocale ? ' for locale ' + currentLocale : ''}!`, 'success');
    updateLastSaved();
    hasUnsavedChanges = false;
    
    if (!isEditing && result && result.template && result.template.key) {
      // Redirect to edit mode for newly created template
      window.location.href = `/admin/template-editor?template=${result.template.key}&mode=edit`;
    }
    
    hideLoading();
    
  } catch (error) {
    console.error('Error saving template:', error);
    showStatus('Error saving template: ' + error.message, 'error');
    hideLoading();
  }
}

// Handle locale change
async function onLocaleChange() {
  if (!isEditing) return;
  
  const newLocale = document.getElementById('template-locale').value;
  if (!newLocale) return;
  
  // Check for unsaved changes
  if (hasUnsavedChanges) {
    const confirmed = confirm('You have unsaved changes. Do you want to save before switching locales?');
    if (confirmed) {
      await saveTemplate();
    }
  }
  
  currentLocale = newLocale;
  const templateKey = document.getElementById('template-key').value;
  if (!templateKey) return;
  
  try {
    showLoading('Switching locale...');
    // Reload base template and pick locale structure if exists
    const data = await window.EmailGatewayAPI.getTemplate(templateKey);
    currentTemplate = data.template;
    const localeEntry = Array.isArray(currentTemplate?.locales)
      ? currentTemplate.locales.find(l => l.locale === currentLocale)
      : null;
    const templateData = localeEntry?.jsonStructure || {};
    
    if (typeof loadTemplateIntoVisualBuilder === 'function') {
      loadTemplateIntoVisualBuilder(templateData);
    }
    
    document.getElementById('editor-subtitle').textContent = `Editing template ${templateKey} (${currentLocale})`;
    hasUnsavedChanges = false;
    showStatus(localeEntry ? `Loaded locale ${currentLocale}` : `Locale ${currentLocale} not found. Starting empty.`, 'info');
  } catch (error) {
    console.error('Failed to switch locale:', error);
    showStatus('Failed to switch locale: ' + error.message, 'error');
  } finally {
    hideLoading();
  }
}

// Generate preview
async function generatePreview() {
  try {
    showLoading('Generating preview...');
    
    const templateData = generateTemplateStructure();
    
    const data = await window.EmailGatewayAPI.generatePreview(templateData, {
      companyName: 'Your Company',
      title: 'Sample Title',
      bodyText: 'This is a sample email body text that demonstrates how your template will look.',
      primaryButtonLabel: 'Primary Action',
      primaryButtonUrl: '#',
      secondaryButtonLabel: 'Secondary Action',
      secondaryButtonUrl: '#',
      copyright: '© 2024 Your Company. All rights reserved.'
    });
    
    const previewContainer = document.getElementById('preview-container');
    previewContainer.innerHTML = data.preview;
    
    hideLoading();
    
  } catch (error) {
    console.error('Error generating preview:', error);
    showStatus('Error generating preview: ' + error.message, 'error');
    
    // Fallback to simple preview
    const previewContainer = document.getElementById('preview-container');
    previewContainer.innerHTML = `
      <div class="text-center text-gray-500 py-12">
        <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
        <p class="text-lg font-medium">Preview Error</p>
        <p class="text-sm">Unable to generate preview. Check your template configuration.</p>
      </div>
    `;
  }
}

// Generate preview HTML (fallback)
function generatePreviewHTML(templateData) {
  // This is a simplified preview generator
  // In a real implementation, you'd use the actual template engine
  let html = '<div class="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">';
  
  if (templateData.header) {
    html += `
      <div class="bg-gray-50 px-6 py-4 border-b">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-purple-100 rounded flex items-center justify-center mr-3">
              <i class="fas fa-envelope text-purple-600"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">${templateData.header.tagline || 'Company'}</h3>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  html += '<div class="p-6">';
  
  if (templateData.title) {
    html += `
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        ${templateData.title.text || '{{title}}'}
      </h1>
    `;
  }
  
  if (templateData.body && templateData.body.paragraphs) {
    templateData.body.paragraphs.forEach(paragraph => {
      html += `<p class="text-gray-700 mb-4">${paragraph || '{{bodyText}}'}</p>`;
    });
  }
  
  if (templateData.actions) {
    html += '<div class="mt-6 flex space-x-3">';
    if (templateData.actions.primary) {
      html += `
        <a href="#" class="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          ${templateData.actions.primary.label || '{{primaryButtonLabel}}'}
        </a>
      `;
    }
    if (templateData.actions.secondary) {
      html += `
        <a href="#" class="inline-block bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
          ${templateData.actions.secondary.label || '{{secondaryButtonLabel}}'}
        </a>
      `;
    }
    html += '</div>';
  }
  
  html += '</div>';
  
  if (templateData.footer) {
    html += `
      <div class="bg-gray-50 px-6 py-4 border-t">
        <p class="text-sm text-gray-600 text-center">
          ${templateData.footer.copyright || '{{copyright}}'}
        </p>
      </div>
    `;
  }
  
  html += '</div>';
  return html;
}

// Show initial preview without API call
function showInitialPreview() {
  const previewContainer = document.getElementById('preview-container');
  if (previewContainer) {
    previewContainer.innerHTML = `
      <div class="text-center text-gray-500 py-12">
        <i class="fas fa-envelope-open-text text-4xl mb-4 text-purple-600"></i>
        <p class="text-lg font-medium text-gray-900">Template Preview</p>
        <p class="text-sm text-gray-600">Start building your template to see the live preview</p>
        <button onclick="generatePreview()" class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <i class="fas fa-eye mr-2"></i>Generate Preview
        </button>
      </div>
    `;
  }
}

// Preview template in new window
function previewTemplate() {
  // Open preview in new window
  const templateData = generateTemplateStructure();
  const previewWindow = window.open('', '_blank', 'width=800,height=600');
  const previewHTML = generatePreviewHTML(templateData);
  previewWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Template Preview</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 p-8">
      ${previewHTML}
    </body>
    </html>
  `);
}

// Go back to template management
function goBack() {
  if (hasUnsavedChanges) {
    if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
      window.location.href = '/admin#template-management';
    }
  } else {
    window.location.href = '/admin#template-management';
  }
}

// Show loading overlay
function showLoading(message) {
  document.getElementById('loading-message').textContent = message;
  document.getElementById('loading-overlay').classList.remove('hidden');
}

// Hide loading overlay
function hideLoading() {
  document.getElementById('loading-overlay').classList.add('hidden');
}

// Show status message
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

// Update status message
function updateStatus(message, type) {
  showStatus(message, type);
}

// Update last saved time
function updateLastSaved() {
  const lastSaved = document.getElementById('last-saved');
  lastSaved.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
}

// Get auth token
function getAuthToken() {
  // Get auth token from localStorage or cookies
  return localStorage.getItem('authToken') || '';
}

// Setup change detection
function setupChangeDetection() {
  const form = document.getElementById('template-editor-form');
  if (form) {
    form.addEventListener('input', () => {
      hasUnsavedChanges = true;
      // Don't auto-generate preview on every input change
      // This was causing the infinite loop
      // clearTimeout(window.previewTimeout);
      // window.previewTimeout = setTimeout(() => {
      //   generatePreview();
      // }, 1000);
    });
  }
}

// Setup auto-save
function setupAutoSave() {
  // Auto-save every 30 seconds
  autoSaveInterval = setInterval(() => {
    if (hasUnsavedChanges) {
      saveTemplate();
    }
  }, 30000);
}

// Cleanup on page unload
window.addEventListener('beforeunload', function(e) {
  if (hasUnsavedChanges) {
    e.preventDefault();
    e.returnValue = '';
  }
});

// Cleanup intervals
window.addEventListener('unload', function() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeTemplateEditor);

// Expose handlers needed by inline HTML attributes
if (typeof window !== 'undefined') {
  window.onLocaleChange = onLocaleChange;
}

// Export function for use in template editor HTML
export function generateTemplateEditorScripts() {
  return `
    <script>
      // Template Editor JavaScript Functions
      let currentTemplate = null;
      let isEditing = false;
      let autoSaveInterval = null;
      let hasUnsavedChanges = false;

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
              const defaultValue = extractDefaults(value, \`\${path}.\${key}\`);
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
          }
        }
        
        return config;
      }

      // Initialize the template editor
      function initializeTemplateEditor() {
        const urlParams = new URLSearchParams(window.location.search);
        const templateKey = urlParams.get('template');
        const mode = urlParams.get('mode');
        
        // Load existing categories for the dropdown (with delay to ensure API is ready)
        setTimeout(loadExistingCategories, 1000);
        
        if (templateKey && mode === 'edit') {
          isEditing = true;
          loadTemplateForEditing(templateKey);
        } else {
          isEditing = false;
          document.getElementById('editor-title').textContent = 'Create New Template';
          document.getElementById('editor-subtitle').textContent = 'Build a new email template';
        }
        
        setupChangeDetection();
        setupAutoSave();
        
        // Show initial preview without API call
        showInitialPreview();
      }

      // Load template for editing
      async function loadTemplateForEditing(templateKey) {
        try {
          showLoading('Loading template...');
          
          // Get current locale from selector
          const currentLocale = document.getElementById('template-locale').value || 'en';
          
          // Always load base template to get locales list
          const data = await window.EmailGatewayAPI.getTemplate(templateKey);
          currentTemplate = data.template;
          
          // Try to pick locale-specific structure
          const localeEntry = Array.isArray(currentTemplate?.locales)
            ? currentTemplate.locales.find(l => l.locale === currentLocale)
            : null;
          const templateData = localeEntry?.jsonStructure || currentTemplate.jsonStructure || {};
          
          // Populate basic information
          document.getElementById('editor-title').textContent = \`Edit: \${currentTemplate.name || templateKey}\`;
          document.getElementById('editor-subtitle').textContent = \`Editing template \${templateKey} (\${currentLocale})\`;
          document.getElementById('template-key').value = templateKey;
          document.getElementById('template-key').readOnly = true;
          document.getElementById('template-name').value = currentTemplate?.name || '';
          document.getElementById('template-description').value = currentTemplate?.description || '';
          document.getElementById('template-category').value = currentTemplate?.category || 'transactional';
          
          // Load template structure into visual builder
          console.log('Template loaded:', currentTemplate);
          console.log('Current locale:', currentLocale);
          console.log('Locale entry:', localeEntry);
          console.log('Template data to load:', templateData);
          console.log('loadTemplateIntoVisualBuilder function available:', typeof loadTemplateIntoVisualBuilder);
          
          if (typeof loadTemplateIntoVisualBuilder === 'function') {
            // Load the locale-specific template structure from the database
            console.log('Loading template structure from database:', templateData);
            loadTemplateIntoVisualBuilder(templateData);
          } else {
            console.error('loadTemplateIntoVisualBuilder function not found!');
            console.log('Available functions:', Object.keys(window).filter(key => typeof window[key] === 'function' && key.includes('load')));
          }
          
          // Show initial preview instead of generating immediately
          showInitialPreview();
          hideLoading();
          
        } catch (error) {
          console.error('Error loading template:', error);
          showStatus('Error loading template: ' + error.message, 'error');
          hideLoading();
        }
      }

      // Generate template structure from form data
      function generateTemplateStructure() {
        // Get basic template info
        const key = document.getElementById('template-key')?.value || '';
        const name = document.getElementById('template-name')?.value || '';
        const description = document.getElementById('template-description')?.value || '';
        let category = document.getElementById('template-category')?.value || '';
        
        // Handle new category creation
        if (category === '__create_new__' || category === '') {
          category = 'transactional'; // Default fallback
        }
        
        // For now, return a basic structure - in a real implementation, you'd collect data from the visual builder
        return {
          key: key || 'sample-template',
          name: name || 'Sample Template',
          description: description || 'A sample email template',
          category: category,
          structure: {
            header: { tagline: '{{companyName}}' },
            title: { text: '{{title}}' },
            body: { paragraphs: ['{{bodyText}}'] },
            actions: {
              primary: { label: '{{primaryButtonLabel}}', url: '{{primaryButtonUrl}}', style: 'button' },
              secondary: { label: '{{secondaryButtonLabel}}', url: '{{secondaryButtonUrl}}', style: 'button' }
            },
            footer: { copyright: '{{copyright}}' }
          }
        };
      }

      // Save template
      async function saveTemplate() {
        try {
          showLoading('Saving template...');
          
          const templateData = generateTemplateStructure();
          
          if (!templateData.key || !templateData.name) {
            throw new Error('Template key and name are required');
          }
          
          let result;
          if (isEditing && currentLocale) {
            // Update locale-specific structure
            result = await window.EmailGatewayAPI.updateLocale(templateData.key, currentLocale, {
              jsonStructure: templateData.jsonStructure
            });
          } else if (isEditing) {
            // Update base template
            result = await window.EmailGatewayAPI.updateTemplate(templateData.key, templateData);
          } else {
            // Create new template
            result = await window.EmailGatewayAPI.createTemplate(templateData);
          }
          
          showStatus('Template saved successfully${currentLocale ? ' for locale ' + currentLocale : ''}!', 'success');
          updateLastSaved();
          hasUnsavedChanges = false;
          
          if (!isEditing && result && result.template && result.template.key) {
            // Redirect to edit mode for newly created template
            window.location.href = \`/admin/template-editor?template=\${result.template.key}&mode=edit\`;
          }
          
          hideLoading();
          
        } catch (error) {
          console.error('Error saving template:', error);
          showStatus('Error saving template: ' + error.message, 'error');
          hideLoading();
        }
      }

      // Generate preview
      async function generatePreview() {
        try {
          showLoading('Generating preview...');
          
          const templateData = generateTemplateStructure();
          
          const data = await window.EmailGatewayAPI.generatePreview(templateData, {
            companyName: 'Your Company',
            title: 'Sample Title',
            bodyText: 'This is a sample email body text that demonstrates how your template will look.',
            primaryButtonLabel: 'Primary Action',
            primaryButtonUrl: '#',
            secondaryButtonLabel: 'Secondary Action',
            secondaryButtonUrl: '#',
            copyright: '© 2024 Your Company. All rights reserved.'
          });
          
          const previewContainer = document.getElementById('preview-container');
          previewContainer.innerHTML = data.preview;
          
          hideLoading();
          
        } catch (error) {
          console.error('Error generating preview:', error);
          showStatus('Error generating preview: ' + error.message, 'error');
          
          // Fallback to simple preview
          const previewContainer = document.getElementById('preview-container');
          previewContainer.innerHTML = \`
            <div class="text-center text-gray-500 py-12">
              <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
              <p class="text-lg font-medium">Preview Error</p>
              <p class="text-sm">Unable to generate preview. Check your template configuration.</p>
            </div>
          \`;
        }
      }

      // Generate preview HTML (fallback)
      function generatePreviewHTML(templateData) {
        // This is a simplified preview generator
        // In a real implementation, you'd use the actual template engine
        let html = '<div class="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">';
        
        if (templateData.header) {
          html += \`
            <div class="bg-gray-50 px-6 py-4 border-b">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-purple-100 rounded flex items-center justify-center mr-3">
                    <i class="fas fa-envelope text-purple-600"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">\${templateData.header.tagline || 'Company'}</h3>
                  </div>
                </div>
              </div>
            </div>
          \`;
        }
        
        html += '<div class="p-6">';
        
        if (templateData.title) {
          html += \`
            <h1 class="text-2xl font-bold text-gray-900 mb-4">
              \${templateData.title.text || '{{title}}'}
            </h1>
          \`;
        }
        
        if (templateData.body && templateData.body.paragraphs) {
          templateData.body.paragraphs.forEach(paragraph => {
            html += \`<p class="text-gray-700 mb-4">\${paragraph || '{{bodyText}}'}</p>\`;
          });
        }
        
        if (templateData.actions) {
          html += '<div class="mt-6 flex space-x-3">';
          if (templateData.actions.primary) {
            html += \`
              <a href="#" class="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                \${templateData.actions.primary.label || '{{primaryButtonLabel}}'}
              </a>
            \`;
          }
          if (templateData.actions.secondary) {
            html += \`
              <a href="#" class="inline-block bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                \${templateData.actions.secondary.label || '{{secondaryButtonLabel}}'}
              </a>
            \`;
          }
          html += '</div>';
        }
        
        html += '</div>';
        
        if (templateData.footer) {
          html += \`
            <div class="bg-gray-50 px-6 py-4 border-t">
              <p class="text-sm text-gray-600 text-center">
                \${templateData.footer.copyright || '{{copyright}}'}
              </p>
            </div>
          \`;
        }
        
        html += '</div>';
        return html;
      }

      // Show initial preview without API call
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

      // Preview template in new window
      function previewTemplate() {
        // Open preview in new window
        const templateData = generateTemplateStructure();
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        const previewHTML = generatePreviewHTML(templateData);
        previewWindow.document.write(\`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Template Preview</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-gray-100 p-8">
            \${previewHTML}
          </body>
          </html>
        \`);
      }

      // Go back to template management
      function goBack() {
        if (hasUnsavedChanges) {
          if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
            window.location.href = '/admin#template-management';
          }
        } else {
          window.location.href = '/admin#template-management';
        }
      }

      // Show loading overlay
      function showLoading(message) {
        document.getElementById('loading-message').textContent = message;
        document.getElementById('loading-overlay').classList.remove('hidden');
      }

      // Hide loading overlay
      function hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
      }

      // Show status message
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

      // Update status message
      function updateStatus(message, type) {
        showStatus(message, type);
      }

      // Update last saved time
      function updateLastSaved() {
        const lastSaved = document.getElementById('last-saved');
        lastSaved.textContent = \`Last saved: \${new Date().toLocaleTimeString()}\`;
      }

      // Get auth token
      function getAuthToken() {
        // Get auth token from localStorage or cookies
        return localStorage.getItem('authToken') || '';
      }

      // Setup change detection
      function setupChangeDetection() {
        const form = document.getElementById('template-editor-form');
        if (form) {
          form.addEventListener('input', () => {
            hasUnsavedChanges = true;
            // Don't auto-generate preview on every input change
            // This was causing the infinite loop
            // clearTimeout(window.previewTimeout);
            // window.previewTimeout = setTimeout(() => {
            //   generatePreview();
            // }, 1000);
          });
        }
      }

      // Setup auto-save
      function setupAutoSave() {
        // Auto-save every 30 seconds
        autoSaveInterval = setInterval(() => {
          if (hasUnsavedChanges) {
            saveTemplate();
          }
        }, 30000);
      }

      // Cleanup on page unload
      window.addEventListener('beforeunload', function(e) {
        if (hasUnsavedChanges) {
          e.preventDefault();
          e.returnValue = '';
        }
      });

      // Cleanup intervals
      window.addEventListener('unload', function() {
        if (autoSaveInterval) {
          clearInterval(autoSaveInterval);
        }
      });

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
            hasUnsavedChanges = true;
          }
        }
      }

      // Initialize when DOM is loaded
      document.addEventListener('DOMContentLoaded', initializeTemplateEditor);

      // Expose functions globally for HTML onclick handlers
      window.handleCategoryChange = handleCategoryChange;
      window.handleNewCategoryInput = handleNewCategoryInput;
      window.loadExistingCategories = loadExistingCategories; // For debugging
    </script>
  `;
}
