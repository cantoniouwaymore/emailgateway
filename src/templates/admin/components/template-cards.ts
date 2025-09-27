// Template cards for the playground
export function generateTemplateCards(): string {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="templates-grid">
      <!-- Welcome Template -->
      <div class="group bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200 template-card" data-category="user">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-hand-wave text-blue-600 text-lg"></i>
          </div>
          <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">User</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Welcome Email</h3>
        <p class="text-gray-600 text-sm mb-4">Complete onboarding experience with tips, facts table, and CTAs</p>
        <div class="flex items-center justify-between">
          <button onclick="copyTemplate('welcome')" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Copy Template <i class="fas fa-copy ml-1"></i>
          </button>
          <div class="flex items-center text-xs text-gray-500">
            <i class="fas fa-mobile-alt mr-1"></i>
            <span>Responsive</span>
          </div>
        </div>
      </div>

      <!-- Payment Success Template -->
      <div class="group bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200 template-card" data-category="billing">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-check-circle text-green-600 text-lg"></i>
          </div>
          <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Billing</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Payment Success</h3>
        <p class="text-gray-600 text-sm mb-4">Transaction confirmation with billing details and receipt download</p>
        <div class="flex items-center justify-between">
          <button onclick="copyTemplate('payment-success')" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Copy Template <i class="fas fa-copy ml-1"></i>
          </button>
          <div class="flex items-center text-xs text-gray-500">
            <i class="fas fa-receipt mr-1"></i>
            <span>Receipt</span>
          </div>
        </div>
      </div>

      <!-- Renewal Reminder Template -->
      <div class="group bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200 template-card" data-category="billing">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-clock text-orange-600 text-lg"></i>
          </div>
          <span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">Billing</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Renewal Reminder</h3>
        <p class="text-gray-600 text-sm mb-4">Subscription renewal reminder with payment information and facts</p>
        <div class="flex items-center justify-between">
          <button onclick="copyTemplate('renewal-7')" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Copy Template <i class="fas fa-copy ml-1"></i>
          </button>
          <div class="flex items-center text-xs text-gray-500">
            <i class="fas fa-calendar mr-1"></i>
            <span>7 days</span>
          </div>
        </div>
      </div>

      <!-- Usage Warning Template -->
      <div class="group bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200 template-card" data-category="usage">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-yellow-600 text-lg"></i>
          </div>
          <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Usage</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Usage Warning</h3>
        <p class="text-gray-600 text-sm mb-4">Threshold alerts with upgrade options and usage details</p>
        <div class="flex items-center justify-between">
          <button onclick="copyTemplate('usage-80')" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Copy Template <i class="fas fa-copy ml-1"></i>
          </button>
          <div class="flex items-center text-xs text-gray-500">
            <i class="fas fa-chart-line mr-1"></i>
            <span>80% usage</span>
          </div>
        </div>
      </div>

      <!-- Upgrade Confirmation Template -->
      <div class="group bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200 template-card" data-category="billing">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-arrow-up text-indigo-600 text-lg"></i>
          </div>
          <span class="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">Billing</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Upgrade Confirmation</h3>
        <p class="text-gray-600 text-sm mb-4">Plan upgrade confirmation with new features and benefits</p>
        <div class="flex items-center justify-between">
          <button onclick="copyTemplate('upgrade')" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Copy Template <i class="fas fa-copy ml-1"></i>
          </button>
          <div class="flex items-center text-xs text-gray-500">
            <i class="fas fa-star mr-1"></i>
            <span>Premium</span>
          </div>
        </div>
      </div>

      <!-- Payment Failure Template -->
      <div class="group bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200 template-card" data-category="billing">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-times-circle text-red-600 text-lg"></i>
          </div>
          <span class="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Billing</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Payment Failure</h3>
        <p class="text-gray-600 text-sm mb-4">Failed payment notification with retry instructions and facts</p>
        <div class="flex items-center justify-between">
          <button onclick="copyTemplate('payment-failure')" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Copy Template <i class="fas fa-copy ml-1"></i>
          </button>
          <div class="flex items-center text-xs text-gray-500">
            <i class="fas fa-credit-card mr-1"></i>
            <span>Retry</span>
          </div>
        </div>
      </div>

      <!-- Invoice Template -->
      <div class="group bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200 template-card" data-category="billing">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-file-invoice text-purple-600 text-lg"></i>
          </div>
          <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Billing</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Invoice</h3>
        <p class="text-gray-600 text-sm mb-4">Professional invoice with payment details and download options</p>
        <div class="flex items-center justify-between">
          <button onclick="copyTemplate('invoice')" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Copy Template <i class="fas fa-copy ml-1"></i>
          </button>
          <div class="flex items-center text-xs text-gray-500">
            <i class="fas fa-download mr-1"></i>
            <span>PDF</span>
          </div>
        </div>
      </div>

      <!-- Password Reset Template -->
      <div class="group bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200 template-card" data-category="user">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-key text-gray-600 text-lg"></i>
          </div>
          <span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Security</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Password Reset</h3>
        <p class="text-gray-600 text-sm mb-4">Security reset with expiration notice and IP tracking</p>
        <div class="flex items-center justify-between">
          <button onclick="copyTemplate('password-reset')" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Copy Template <i class="fas fa-copy ml-1"></i>
          </button>
          <div class="flex items-center text-xs text-gray-500">
            <i class="fas fa-shield-alt mr-1"></i>
            <span>Secure</span>
          </div>
        </div>
      </div>

      <!-- Monthly Report Template -->
      <div class="group bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200 template-card" data-category="usage">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-chart-bar text-cyan-600 text-lg"></i>
          </div>
          <span class="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs font-medium rounded-full">Analytics</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Monthly Report</h3>
        <p class="text-gray-600 text-sm mb-4">Analytics report with key metrics and performance data</p>
        <div class="flex items-center justify-between">
          <button onclick="copyTemplate('monthly-report')" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Copy Template <i class="fas fa-copy ml-1"></i>
          </button>
          <div class="flex items-center text-xs text-gray-500">
            <i class="fas fa-analytics mr-1"></i>
            <span>Metrics</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
