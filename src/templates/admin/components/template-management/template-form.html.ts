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
                    <label class="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                    <div class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium">
                      <span id="template-name-display">-</span>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <div class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 min-h-[80px]">
                      <span id="template-description-display">-</span>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <div class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium">
                      <span id="template-category-display">-</span>
                    </div>
                  </div>

                </div>

              </div>

              <!-- Developer JSON Section -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-md font-medium text-gray-900">Developer JSON</h4>
                  
                  <!-- Locale Selector (only show when viewing template) -->
                  <div id="locale-selector-container" class="hidden">
                    <div class="flex items-center space-x-2">
                      <label class="text-sm font-medium text-gray-700">Locale:</label>
                      <select id="json-locale-selector" class="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" onchange="onJsonLocaleChange()">
                        <option value="__base__">Base Template (Variables)</option>
                        <!-- Locales will be populated dynamically -->
                      </select>
                    </div>
                  </div>
                </div>
                
                <!-- Tab Navigation -->
                <div class="mb-4">
                  <nav class="flex space-x-8" aria-label="Tabs">
                    <button type="button" onclick="showJsonTab('template', event)" id="json-tab-template" class="whitespace-nowrap py-2 px-1 border-b-2 border-purple-500 font-medium text-sm text-purple-600">
                      Template Structure
                    </button>
                    <button type="button" onclick="showJsonTab('request', event)" id="json-tab-request" class="whitespace-nowrap py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                      Email Request JSON
                    </button>
                    <button type="button" onclick="showJsonTab('variables', event)" id="json-tab-variables" class="whitespace-nowrap py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                      Variable Schema
                    </button>
                  </nav>
                </div>

                <!-- Template Structure Tab -->
                <div id="json-content-template" class="json-tab-content">
                  <div>
                    <textarea 
                      id="template-json-structure" 
                      name="jsonStructure"
                      rows="12"
                      placeholder="Template JSON structure will be displayed here..."
                      readonly
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                    ></textarea>
                    <div class="flex space-x-2 mt-2">
                      <button type="button" onclick="copyTemplateJSON()" class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors">
                        <i class="fas fa-copy mr-1"></i>Copy JSON
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Email Request JSON Tab -->
                <div id="json-content-request" class="json-tab-content hidden">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Request JSON (for sending emails)</label>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <pre id="email-request-json" class="text-sm text-gray-800 overflow-auto max-h-96 whitespace-pre-wrap"></pre>
                    </div>
                    <div class="flex space-x-2 mt-2">
                      <button type="button" onclick="copyEmailRequestJSON()" class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors">
                        <i class="fas fa-copy mr-1"></i>Copy JSON
                      </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">This JSON shows the complete request format for sending emails with this template</p>
                  </div>
                </div>

                <!-- Variable Schema Tab -->
                <div id="json-content-variables" class="json-tab-content hidden">
                  <div>
                    <textarea 
                      id="template-variable-schema" 
                      name="variableSchema"
                      rows="8"
                      placeholder="Variable schema will be displayed here..."
                      readonly
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                    ></textarea>
                    <div class="flex space-x-2 mt-2">
                      <button type="button" onclick="copyVariableSchema()" class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors">
                        <i class="fas fa-copy mr-1"></i>Copy Schema
                      </button>
                    </div>
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
                  Close
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
            <div class="mt-6 flex justify-end">
              <button 
                onclick="closeTemplatePreviewModal()" 
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
