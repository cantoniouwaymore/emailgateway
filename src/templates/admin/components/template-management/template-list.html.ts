export function generateTemplateListSection(): string {
  return `
    <div id="template-management-tab" class="tab-content">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Template Management</h1>
              <p class="text-lg text-gray-600">Manage database-driven email templates with full CRUD operations</p>
            </div>
            <div class="flex space-x-3">
              <button onclick="refreshTemplates()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <i class="fas fa-sync-alt mr-2"></i>Refresh
              </button>
              <button onclick="showSectionBasedTemplateModal()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <i class="fas fa-magic mr-2"></i>Visual Builder
              </button>
              <button onclick="showCreateTemplateModal()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <i class="fas fa-code mr-2"></i>JSON Editor
              </button>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-file-alt text-blue-600 text-lg"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Templates</p>
                <p class="text-2xl font-bold text-gray-900" id="total-templates">-</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-check-circle text-green-600 text-lg"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Active Templates</p>
                <p class="text-2xl font-bold text-gray-900" id="active-templates">-</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-globe text-purple-600 text-lg"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Locales</p>
                <p class="text-2xl font-bold text-gray-900" id="total-locales">-</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-chart-line text-orange-600 text-lg"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Categories</p>
                <p class="text-2xl font-bold text-gray-900" id="total-categories">-</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search Templates</label>
              <input 
                type="text" 
                id="template-search" 
                placeholder="Search by name, key, or description..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                onkeyup="filterTemplates()"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                id="category-filter" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                onchange="filterTemplates()"
              >
                <option value="">All Categories</option>
                <option value="transactional">Transactional</option>
                <option value="marketing">Marketing</option>
                <option value="notification">Notification</option>
                <option value="test">Test</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select 
                id="status-filter" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                onchange="filterTemplates()"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select 
                id="sort-filter" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                onchange="sortTemplates()"
              >
                <option value="name">Name</option>
                <option value="key">Key</option>
                <option value="category">Category</option>
                <option value="created">Created Date</option>
                <option value="updated">Updated Date</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Templates Table -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Templates</h3>
          </div>
          
          <!-- Loading State -->
          <div id="templates-loading" class="p-8 text-center">
            <div class="inline-flex items-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-3"></div>
              <span class="text-gray-600">Loading templates...</span>
            </div>
          </div>

          <!-- Empty State -->
          <div id="templates-empty" class="p-8 text-center hidden">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-file-alt text-gray-400 text-2xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p class="text-gray-600 mb-4">Get started by creating your first template</p>
            <button onclick="showCreateTemplateModal()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <i class="fas fa-plus mr-2"></i>Create Template
            </button>
          </div>

          <!-- Templates Table -->
          <div id="templates-table" class="hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locales</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody id="templates-tbody" class="bg-white divide-y divide-gray-200">
                  <!-- Templates will be populated here -->
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div id="templates-pagination" class="mt-6 flex items-center justify-between">
          <!-- Pagination will be populated here -->
        </div>
      </div>
    </div>
  `;
}
