export function generateNavbar(): string {
  return `
    <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold text-gray-900">
                        <i class="fas fa-envelope mr-2"></i>
                        Waymore Transactional Emails Service Admin
                    </h1>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-500" id="last-updated">
                        <i class="fas fa-clock mr-1"></i>
                        ${new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>
        </div>
    </nav>`;
}

export function generateHeader(): string {
  return `
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Waymore Transactional Emails Service Dashboard</h1>
        <p class="mt-2 text-gray-600">Monitor email delivery status and system health</p>
    </div>`;
}

export function generateSearchSection(): string {
  return `
    <div class="mb-8">
        <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                    <i class="fas fa-search mr-2"></i>
                    Search by Recipient
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    Search for all emails sent to a specific email address
                </p>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                <form method="GET" action="/admin/search" class="flex gap-4">
                    <div class="flex-1">
                        <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter email address to search"
                            required
                        >
                    </div>
                    <div class="flex items-end">
                        <button 
                            type="submit" 
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <i class="fas fa-search mr-2"></i>
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
}

export function generateTabNavigation(): string {
  return `
    <div class="mb-8">
        <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button onclick="showTab('documentation')" id="documentation-tab-btn" class="tab-button active whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                    <i class="fas fa-book mr-2"></i>
                    Documentation
                </button>
                <button onclick="showTab('templates')" id="templates-tab-btn" class="tab-button whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                    <i class="fas fa-code mr-2"></i>
                    Transactional Template Playground
                </button>
                <button onclick="showTab('ai-playground')" id="ai-playground-tab-btn" class="tab-button whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                    <i class="fas fa-robot mr-2"></i>
                    AI Playground
                </button>
                <button onclick="showTab('messages')" id="messages-tab-btn" class="tab-button whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                    <i class="fas fa-envelope mr-2"></i>
                    Messages
                </button>
                <button onclick="showTab('webhooks')" id="webhooks-tab-btn" class="tab-button whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                    <i class="fas fa-webhook mr-2"></i>
                    Webhooks
                </button>
                <button onclick="showTab('search')" id="search-tab-btn" class="tab-button whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                    <i class="fas fa-search mr-2"></i>
                    Search
                </button>
                <button onclick="showTab('health')" id="health-tab-btn" class="tab-button whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                    <i class="fas fa-heartbeat mr-2"></i>
                    System Health
                </button>
            </nav>
        </div>
    </div>`;
}

export function generateRefreshButton(): string {
  return `
    <div id="refresh-button-container" class="mt-6 flex justify-end" style="display: none;">
        <button onclick="location.reload()" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <i class="fas fa-sync-alt mr-2"></i>
            Refresh Data
        </button>
    </div>`;
}

export function generateDashboardScript(): string {
  return `
    <script>
        // Tab functionality
        function showTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Remove active class from all tab buttons
            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach(button => {
                button.classList.remove('active', 'border-indigo-500', 'text-indigo-600');
                button.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
            });
            
            // Show selected tab content
            const selectedTab = document.getElementById(tabName + '-tab');
            if (selectedTab) {
                selectedTab.style.display = 'block';
            }
            
            // Activate selected tab button
            const selectedButton = document.getElementById(tabName + '-tab-btn');
            if (selectedButton) {
                selectedButton.classList.add('active', 'border-indigo-500', 'text-indigo-600');
                selectedButton.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
            }
            
            // Show/hide refresh button based on tab
            const refreshButton = document.getElementById('refresh-button-container');
            if (refreshButton) {
                // Tabs that need refresh: health, messages, webhooks, search
                const tabsWithRefresh = ['health', 'messages', 'webhooks', 'search'];
                if (tabsWithRefresh.includes(tabName)) {
                    refreshButton.style.display = 'flex';
                } else {
                    refreshButton.style.display = 'none';
                }
            }
            
            // Update URL hash to remember the current tab
            if (window.location.hash !== '#' + tabName) {
                window.history.replaceState(null, null, '#' + tabName);
            }
            
            // Initialize AI Playground when tab is shown
            if (tabName === 'ai-playground' && typeof initializeAIPlayground === 'function') {
                initializeAIPlayground();
            }
        }
        
        // Auto-refresh every 30 seconds (but not for AI Playground or Templates tab)
        setInterval(() => {
            const currentTab = window.location.hash.substring(1);
            if (currentTab !== 'ai-playground' && currentTab !== 'templates') {
                location.reload();
            }
        }, 30000);
        
        // Function to get event type CSS class
        function getEventTypeClass(eventType) {
            const classes = {
                'delivered': 'bg-green-100 text-green-800',
                'bounce': 'bg-red-100 text-red-800',
                'open': 'bg-blue-100 text-blue-800',
                'click': 'bg-purple-100 text-purple-800',
                'spam': 'bg-orange-100 text-orange-800',
                'reject': 'bg-gray-100 text-gray-800'
            };
            return classes[eventType] || 'bg-gray-100 text-gray-800';
        }
        
        // Initialize with appropriate tab active
        document.addEventListener('DOMContentLoaded', function() {
            // Check for hash fragment to determine which tab to show
            const hash = window.location.hash;
            if (hash) {
                const tabName = hash.substring(1); // Remove the # symbol
                if (['documentation', 'templates', 'ai-playground', 'messages', 'webhooks', 'search', 'health'].includes(tabName)) {
                    showTab(tabName);
                    return;
                }
            }
            
            // Check if we have search results and switch to search tab
            const searchResults = document.querySelector('#search-tab .bg-white.shadow-xl');
            if (searchResults && searchResults.innerHTML.trim() !== '') {
                showTab('search');
            } else {
                showTab('documentation');
            }
        });
    </script>`;
}
