export function generateTemplateFormModal(): string {
  return `
    <!-- Create/Edit Template Modal -->
    <div id="template-form-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900" id="template-form-title">Create Template</h3>
            <button onclick="closeTemplateFormModal()" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="mt-6">
            <form id="template-form" onsubmit="handleTemplateSubmit(event)">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Basic Information -->
                <div class="space-y-4">
                  <h4 class="text-md font-medium text-gray-900">Basic Information</h4>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Template Key *</label>
                    <input 
                      type="text" 
                      id="template-key" 
                      name="key"
                      required
                      placeholder="e.g., welcome-email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <p class="text-xs text-gray-500 mt-1">Unique identifier for the template (lowercase, hyphens only)</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
                    <input 
                      type="text" 
                      id="template-name" 
                      name="name"
                      required
                      placeholder="e.g., Welcome Email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      id="template-description" 
                      name="description"
                      rows="3"
                      placeholder="Brief description of the template..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select 
                      id="template-category" 
                      name="category"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select a category</option>
                      <option value="transactional">Transactional</option>
                      <option value="marketing">Marketing</option>
                      <option value="notification">Notification</option>
                      <option value="test">Test</option>
                    </select>
                  </div>

                </div>

                <!-- Template Structure -->
                <div class="space-y-4">
                  <h4 class="text-md font-medium text-gray-900">Template Structure</h4>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">JSON Structure</label>
                    <textarea 
                      id="template-json-structure" 
                      name="jsonStructure"
                      rows="12"
                      placeholder="Enter template JSON structure..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                    ></textarea>
                    <div class="flex space-x-2 mt-2">
                      <button type="button" onclick="formatTemplateJSON()" class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                        <i class="fas fa-code mr-1"></i>Format
                      </button>
                      <button type="button" onclick="validateTemplateJSON()" class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors">
                        <i class="fas fa-check-circle mr-1"></i>Validate
                      </button>
                      <button type="button" onclick="loadTemplateExample()" class="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors">
                        <i class="fas fa-file-import mr-1"></i>Load Example
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Variable Schema Section -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <h4 class="text-md font-medium text-gray-900 mb-4">Variable Schema</h4>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">JSON Schema for Variables</label>
                  <textarea 
                    id="template-variable-schema" 
                    name="variableSchema"
                    rows="8"
                    placeholder="Enter JSON schema for template variables..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                  ></textarea>
                  <div class="flex space-x-2 mt-2">
                    <button type="button" onclick="formatVariableSchema()" class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                      <i class="fas fa-code mr-1"></i>Format
                    </button>
                    <button type="button" onclick="generateVariableSchema()" class="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors">
                      <i class="fas fa-magic mr-1"></i>Generate from Structure
                    </button>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="mt-8 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onclick="closeTemplateFormModal()" 
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onclick="previewTemplate()" 
                  class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <i class="fas fa-eye mr-2"></i>Preview
                </button>
                <button 
                  type="submit" 
                  class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <i class="fas fa-save mr-2"></i>Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Preview Modal -->
    <div id="template-preview-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
      <div class="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Template Preview</h3>
            <button onclick="closeTemplatePreviewModal()" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="mt-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- JSON Structure Preview -->
              <div>
                <h4 class="text-md font-medium text-gray-900 mb-4">JSON Structure</h4>
                <div class="bg-gray-50 rounded-lg p-4">
                  <pre id="preview-json-structure" class="text-sm text-gray-800 overflow-auto max-h-96"></pre>
                </div>
              </div>

              <!-- Email Preview -->
              <div>
                <h4 class="text-md font-medium text-gray-900 mb-4">Email Preview</h4>
                <div class="border border-gray-300 rounded-lg bg-gray-50 p-4">
                  <div id="preview-email-content" class="text-center text-gray-500 py-8">
                    <i class="fas fa-envelope text-4xl mb-4"></i>
                    <p>Preview will appear here</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Preview Actions -->
            <div class="mt-6 flex justify-end space-x-3">
              <button 
                onclick="closeTemplatePreviewModal()" 
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button 
                onclick="testTemplatePreview()" 
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <i class="fas fa-paper-plane mr-2"></i>Send Test Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
