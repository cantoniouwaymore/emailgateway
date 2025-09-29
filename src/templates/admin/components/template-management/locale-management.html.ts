export function generateLocaleManagementModal(): string {
  return `
    <!-- Locale Management Modal -->
    <div id="locale-management-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
      <div class="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Locale Management</h3>
              <p class="text-sm text-gray-600" id="locale-template-name">Template: -</p>
            </div>
            <div class="flex space-x-3">
              <button onclick="showAddLocaleModal()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <i class="fas fa-plus mr-2"></i>Add Locale
              </button>
              <button onclick="closeLocaleManagementModal()" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="mt-6">
            <!-- Locales List -->
            <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h4 class="text-md font-medium text-gray-900">Available Locales</h4>
              </div>
              
              <!-- Loading State -->
              <div id="locales-loading" class="p-8 text-center">
                <div class="inline-flex items-center">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-3"></div>
                  <span class="text-gray-600">Loading locales...</span>
                </div>
              </div>

              <!-- Empty State -->
              <div id="locales-empty" class="p-8 text-center hidden">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-globe text-gray-400 text-2xl"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No locales found</h3>
                <p class="text-gray-600 mb-4">Add locales to provide translations for this template</p>
                <button onclick="showAddLocaleModal()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <i class="fas fa-plus mr-2"></i>Add Locale
                </button>
              </div>

              <!-- Locales Table -->
              <div id="locales-table" class="hidden">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locale</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody id="locales-tbody" class="bg-white divide-y divide-gray-200">
                      <!-- Locales will be populated here -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Locale Modal -->
    <div id="add-locale-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900" id="add-locale-title">Add Locale</h3>
            <button onclick="closeAddLocaleModal()" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="mt-6">
            <form id="locale-form" onsubmit="handleLocaleSubmit(event)">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Locale Information -->
                <div class="space-y-4">
                  <h4 class="text-md font-medium text-gray-900">Locale Information</h4>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Locale Code *</label>
                    <select 
                      id="locale-code" 
                      name="locale"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select a locale</option>
                      <option value="en">English (en)</option>
                      <option value="es">Spanish (es)</option>
                      <option value="fr">French (fr)</option>
                      <option value="de">German (de)</option>
                      <option value="it">Italian (it)</option>
                      <option value="pt">Portuguese (pt)</option>
                      <option value="ru">Russian (ru)</option>
                      <option value="ja">Japanese (ja)</option>
                      <option value="ko">Korean (ko)</option>
                      <option value="zh">Chinese (zh)</option>
                      <option value="ar">Arabic (ar)</option>
                      <option value="hi">Hindi (hi)</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1">Select the locale for this translation</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Language Name</label>
                    <input 
                      type="text" 
                      id="locale-language-name" 
                      readonly
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Flag</label>
                    <div id="locale-flag" class="text-4xl">🏳️</div>
                  </div>
                </div>

                <!-- Locale Content -->
                <div class="space-y-4">
                  <h4 class="text-md font-medium text-gray-900">Locale Content</h4>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">JSON Structure Override</label>
                    <textarea 
                      id="locale-json-structure" 
                      name="jsonStructure"
                      rows="12"
                      placeholder="Enter locale-specific JSON structure overrides..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                    ></textarea>
                    <div class="flex space-x-2 mt-2">
                      <button type="button" onclick="formatLocaleJSON()" class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                        <i class="fas fa-code mr-1"></i>Format
                      </button>
                      <button type="button" onclick="validateLocaleJSON()" class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors">
                        <i class="fas fa-check-circle mr-1"></i>Validate
                      </button>
                      <button type="button" onclick="loadLocaleExample()" class="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors">
                        <i class="fas fa-file-import mr-1"></i>Load Example
                      </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Only include fields that differ from the base template</p>
                  </div>
                </div>
              </div>

              <!-- Preview Section -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <h4 class="text-md font-medium text-gray-900 mb-4">Preview</h4>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h5 class="text-sm font-medium text-gray-700 mb-2">Base Template</h5>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <pre id="preview-base-structure" class="text-sm text-gray-800 overflow-auto max-h-32"></pre>
                    </div>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium text-gray-700 mb-2">Locale Override</h5>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <pre id="preview-locale-structure" class="text-sm text-gray-800 overflow-auto max-h-32"></pre>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="mt-8 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onclick="closeAddLocaleModal()" 
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onclick="previewLocale()" 
                  class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <i class="fas fa-eye mr-2"></i>Preview
                </button>
                <button 
                  type="submit" 
                  class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <i class="fas fa-save mr-2"></i>Save Locale
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}
