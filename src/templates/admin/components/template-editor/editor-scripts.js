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
    
    const response = await fetch(`/api/v1/templates/${templateKey}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    currentTemplate = data.template;
    
    // Populate basic information
    document.getElementById('editor-title').textContent = `Edit: ${currentTemplate.name}`;
    document.getElementById('editor-subtitle').textContent = `Editing template ${currentTemplate.key}`;
    document.getElementById('template-key').value = currentTemplate.key;
    document.getElementById('template-key').readOnly = true;
    document.getElementById('template-name').value = currentTemplate.name;
    document.getElementById('template-description').value = currentTemplate.description || '';
    document.getElementById('template-category').value = currentTemplate.category;
    
    // Load template structure into visual builder
    console.log('Template loaded:', currentTemplate);
    console.log('JSON Structure:', currentTemplate.jsonStructure);
    console.log('Variable Schema:', currentTemplate.variableSchema);
    console.log('loadTemplateIntoVisualBuilder function available:', typeof loadTemplateIntoVisualBuilder);
    
    if (typeof loadTemplateIntoVisualBuilder === 'function') {
      // Load the actual template structure with {{}} patterns for editing
      console.log('Loading JSON Structure:', currentTemplate.jsonStructure);
      loadTemplateIntoVisualBuilder(currentTemplate.jsonStructure);
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
    
    const url = isEditing ? 
      `/api/v1/templates/${currentTemplate.key}` : 
      '/api/v1/templates';
    const method = isEditing ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(templateData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    showStatus('Template saved successfully!', 'success');
    updateLastSaved();
    hasUnsavedChanges = false;
    
    if (!isEditing) {
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

// Generate preview
async function generatePreview() {
  try {
    showLoading('Generating preview...');
    
    const templateData = generateTemplateStructure();
    
    const response = await fetch('/api/v1/templates/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        templateStructure: templateData,
        variables: {
          companyName: 'Your Company',
          title: 'Sample Title',
          bodyText: 'This is a sample email body text that demonstrates how your template will look.',
          primaryButtonLabel: 'Primary Action',
          primaryButtonUrl: '#',
          secondaryButtonLabel: 'Secondary Action',
          secondaryButtonUrl: '#',
          copyright: '© 2024 Your Company. All rights reserved.'
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
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
          
          const response = await fetch(\`/api/v1/templates/\${templateKey}\`, {
            headers: {
              'Authorization': \`Bearer \${getAuthToken()}\`
            }
          });
          
          if (!response.ok) {
            throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
          currentTemplate = data.template;
          
          // Populate basic information
          document.getElementById('editor-title').textContent = \`Edit: \${currentTemplate.name}\`;
          document.getElementById('editor-subtitle').textContent = \`Editing template \${currentTemplate.key}\`;
          document.getElementById('template-key').value = currentTemplate.key;
          document.getElementById('template-key').readOnly = true;
          document.getElementById('template-name').value = currentTemplate.name;
          document.getElementById('template-description').value = currentTemplate.description || '';
          document.getElementById('template-category').value = currentTemplate.category;
          
          // Load template structure into visual builder
          console.log('Template loaded:', currentTemplate);
          console.log('JSON Structure:', currentTemplate.jsonStructure);
          console.log('Variable Schema:', currentTemplate.variableSchema);
          console.log('loadTemplateIntoVisualBuilder function available:', typeof loadTemplateIntoVisualBuilder);
          
          if (typeof loadTemplateIntoVisualBuilder === 'function') {
            // For editing, we need to create a structure with actual values from the variable schema defaults
            // rather than variable placeholders
            const templateConfig = createTemplateConfigFromSchema(currentTemplate.variableSchema);
            console.log('Created template config:', templateConfig);
            loadTemplateIntoVisualBuilder(templateConfig);
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
          
          const url = isEditing ? 
            \`/api/v1/templates/\${currentTemplate.key}\` : 
            '/api/v1/templates';
          const method = isEditing ? 'PUT' : 'POST';
          
          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': \`Bearer \${getAuthToken()}\`
            },
            body: JSON.stringify(templateData)
          });
          
          if (!response.ok) {
            throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
          }
          
          const result = await response.json();
          showStatus('Template saved successfully!', 'success');
          updateLastSaved();
          hasUnsavedChanges = false;
          
          if (!isEditing) {
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
          
          const response = await fetch('/api/v1/templates/preview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': \`Bearer \${getAuthToken()}\`
            },
            body: JSON.stringify({
              templateStructure: templateData,
              variables: {
                companyName: 'Your Company',
                title: 'Sample Title',
                bodyText: 'This is a sample email body text that demonstrates how your template will look.',
                primaryButtonLabel: 'Primary Action',
                primaryButtonUrl: '#',
                secondaryButtonLabel: 'Secondary Action',
                secondaryButtonUrl: '#',
                copyright: '© 2024 Your Company. All rights reserved.'
              }
            })
          });
          
          if (!response.ok) {
            throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
          }
          
          const data = await response.json();
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

      // Initialize when DOM is loaded
      document.addEventListener('DOMContentLoaded', initializeTemplateEditor);
    </script>
  `;
}
