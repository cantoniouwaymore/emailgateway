export function generateSearchSection(data: any): string {
  const { searchResults, searchQuery, pagination } = data;
  
  return `
    <div id="search-tab" class="tab-content">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          <i class="fas fa-search mr-3 text-indigo-600"></i>
          Search Messages
        </h2>
        <p class="text-lg text-gray-600">
          Search for emails sent to specific recipients and view detailed delivery information
        </p>
      </div>
      
      ${generateSearchForm(searchQuery)}
      ${searchResults ? generateSearchResults(searchResults, searchQuery, pagination) : generateSearchInstructions()}
    </div>`;
}

function generateSearchForm(searchQuery?: string): string {
  return `
    <div class="bg-white shadow-lg rounded-xl mb-8 border border-gray-100">
      <div class="px-6 py-8 sm:px-8">
        <div class="text-center mb-8">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
            <i class="fas fa-search text-2xl text-indigo-600"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            Search by Recipient
          </h3>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Find all emails sent to a specific email address with detailed delivery information
          </p>
        </div>
        
        <form method="GET" action="/admin" class="max-w-2xl mx-auto">
          <input type="hidden" name="search" value="true">
          <div class="space-y-6">
            <div>
              <label for="email" class="block text-lg font-semibold text-gray-700 mb-3">
                <i class="fas fa-envelope mr-2 text-indigo-600"></i>
                Email Address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fas fa-at text-gray-400 text-lg"></i>
                </div>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  value="${searchQuery || ''}"
                  class="block w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-300"
                  placeholder="Enter email address to search"
                  required
                >
              </div>
              <p class="mt-2 text-sm text-gray-500">
                <i class="fas fa-info-circle mr-1"></i>
                Enter the recipient's email address to find all messages sent to them
              </p>
            </div>
            
            <div class="flex justify-center">
              <button 
                type="submit" 
                class="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transform hover:scale-105 transition-all duration-200"
              >
                <i class="fas fa-search mr-3 text-xl"></i>
                Search Messages
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>`;
}

function generateSearchInstructions(): string {
  return `
    <div class="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-xl border border-gray-200">
      <div class="px-8 py-16 text-center">
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-6">
          <i class="fas fa-search text-3xl text-indigo-600"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Ready to Search Messages?</h3>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Enter an email address above to discover all messages sent to that recipient with detailed delivery information
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div class="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mx-auto mb-4">
              <i class="fas fa-envelope text-xl text-indigo-600"></i>
            </div>
            <h4 class="text-lg font-semibold text-gray-900 mb-2">Find All Messages</h4>
            <p class="text-gray-600">Search by recipient email to find every message sent to them</p>
          </div>
          
          <div class="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div class="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mx-auto mb-4">
              <i class="fas fa-filter text-xl text-green-600"></i>
            </div>
            <h4 class="text-lg font-semibold text-gray-900 mb-2">Delivery Status</h4>
            <p class="text-gray-600">View delivery status, bounces, opens, and other events</p>
          </div>
          
          <div class="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div class="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mx-auto mb-4">
              <i class="fas fa-chart-line text-xl text-purple-600"></i>
            </div>
            <h4 class="text-lg font-semibold text-gray-900 mb-2">Message History</h4>
            <p class="text-gray-600">Track the complete message journey and timeline</p>
          </div>
        </div>
      </div>
    </div>`;
}

function generateSearchResults(searchResults: any[], searchQuery: string, pagination?: any): string {
  if (searchResults.length === 0) {
    return `
      <div class="bg-gradient-to-br from-red-50 to-orange-50 shadow-lg rounded-xl border border-red-200">
        <div class="px-8 py-16 text-center">
          <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <i class="fas fa-search text-3xl text-red-600"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">No Messages Found</h3>
          <p class="text-lg text-gray-600 mb-6">
            No emails were found sent to 
            <span class="font-mono bg-white px-3 py-2 rounded-lg border border-red-200 text-red-800 font-semibold">
              ${searchQuery}
            </span>
          </p>
          <div class="bg-white rounded-xl p-6 shadow-md border border-red-100 max-w-2xl mx-auto">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Try these suggestions:</h4>
            <ul class="text-left text-gray-600 space-y-2">
              <li class="flex items-center">
                <i class="fas fa-check-circle text-green-500 mr-3"></i>
                Verify the email address is correct
              </li>
              <li class="flex items-center">
                <i class="fas fa-check-circle text-green-500 mr-3"></i>
                Check if messages were sent to this recipient
              </li>
              <li class="flex items-center">
                <i class="fas fa-check-circle text-green-500 mr-3"></i>
                Try searching with a different email address
              </li>
            </ul>
          </div>
        </div>
      </div>`;
  }

  return `
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg rounded-xl mb-8 border border-indigo-200">
      <div class="px-6 py-8 sm:px-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mr-4">
              <i class="fas fa-list text-xl text-indigo-600"></i>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-gray-900">
                Search Results
              </h3>
              <p class="text-lg text-gray-600 mt-1">
                Found <span class="font-semibold text-indigo-700">${pagination?.totalCount || searchResults.length}</span> messages sent to 
                <span class="font-mono bg-white px-3 py-1 rounded-lg border border-indigo-200 text-indigo-800">
                  ${searchQuery}
                </span>
                ${pagination && pagination.totalPages > 1 ? `(Page ${pagination.currentPage} of ${pagination.totalPages})` : ''}
              </p>
            </div>
          </div>
          <div class="hidden sm:block">
            <div class="bg-white rounded-lg px-4 py-2 border border-indigo-200">
              <div class="flex items-center text-sm text-gray-600">
                <i class="fas fa-chart-bar mr-2 text-indigo-500"></i>
                <span class="font-medium">${searchResults.length} results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <i class="fas fa-hashtag mr-2 text-indigo-500"></i>
                Message ID
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <i class="fas fa-info-circle mr-2 text-indigo-500"></i>
                Status
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <i class="fas fa-envelope mr-2 text-indigo-500"></i>
                Subject
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <i class="fas fa-server mr-2 text-indigo-500"></i>
                Provider
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <i class="fas fa-clock mr-2 text-indigo-500"></i>
                Created
              </th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <i class="fas fa-cog mr-2 text-indigo-500"></i>
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            ${searchResults.map((message: any) => `
              <tr class="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 border-b border-gray-100">
                <td class="px-6 py-6 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <i class="fas fa-hashtag text-xs text-indigo-600"></i>
                    </div>
                    <div class="text-sm font-mono text-gray-900 font-medium">${message.messageId}</div>
                  </div>
                </td>
                <td class="px-6 py-6 whitespace-nowrap">
                  <span class="inline-flex px-3 py-2 text-sm font-semibold rounded-full status-${message.status.toLowerCase()} shadow-sm">
                    <i class="fas fa-circle text-xs mr-2 opacity-75"></i>
                    ${message.status}
                  </span>
                </td>
                <td class="px-6 py-6 text-sm text-gray-900 max-w-xs">
                  <div class="flex items-center">
                    <i class="fas fa-envelope text-gray-400 mr-2 text-xs"></i>
                    <span class="truncate font-medium">${message.subject}</span>
                  </div>
                </td>
                <td class="px-6 py-6 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                      <i class="fas fa-server text-xs text-gray-600"></i>
                    </div>
                    <span class="text-sm text-gray-600 font-medium">${message.provider || 'N/A'}</span>
                  </div>
                </td>
                <td class="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex items-center">
                    <i class="fas fa-clock text-gray-400 mr-2 text-xs"></i>
                    <span>${new Date(message.createdAt).toLocaleString()}</span>
                  </div>
                </td>
                <td class="px-6 py-6 whitespace-nowrap text-sm font-medium">
                  <a href="/admin/messages/${message.messageId}" 
                     class="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-md">
                    <i class="fas fa-eye mr-2"></i>
                    View Details
                  </a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    
    ${pagination && pagination.totalPages > 1 ? generateSearchPagination(searchQuery, pagination) : ''}`;
}

function generateSearchPagination(searchQuery: string, pagination: any): string {
  return `
    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
      <div class="flex-1 flex justify-between sm:hidden">
        ${pagination.currentPage > 1 ? `
        <a href="/admin?search=true&email=${encodeURIComponent(searchQuery)}&searchPage=${pagination.currentPage - 1}&searchLimit=${pagination.limit}#search" 
           class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Previous
        </a>
        ` : ''}
        ${pagination.currentPage < pagination.totalPages ? `
        <a href="/admin?search=true&email=${encodeURIComponent(searchQuery)}&searchPage=${pagination.currentPage + 1}&searchLimit=${pagination.limit}#search" 
           class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Next
        </a>
        ` : ''}
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing page <span class="font-medium">${pagination.currentPage}</span> of <span class="font-medium">${pagination.totalPages}</span>
            (${pagination.totalCount} total results)
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            ${pagination.currentPage > 1 ? `
            <a href="/admin?search=true&email=${encodeURIComponent(searchQuery)}&searchPage=${pagination.currentPage - 1}&searchLimit=${pagination.limit}#search" 
               class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span class="sr-only">Previous</span>
              <i class="fas fa-chevron-left"></i>
            </a>
            ` : ''}
            
            ${generateSearchPaginationLinks(searchQuery, pagination)}
            
            ${pagination.currentPage < pagination.totalPages ? `
            <a href="/admin?search=true&email=${encodeURIComponent(searchQuery)}&searchPage=${pagination.currentPage + 1}&searchLimit=${pagination.limit}#search" 
               class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span class="sr-only">Next</span>
              <i class="fas fa-chevron-right"></i>
            </a>
            ` : ''}
          </nav>
        </div>
      </div>
    </div>`;
}

function generateSearchPaginationLinks(searchQuery: string, pagination: any): string {
  const links = [];
  for (let i = 0; i < Math.min(5, pagination.totalPages); i++) {
    const pageNum = Math.max(1, pagination.currentPage - 2) + i;
    if (pageNum > pagination.totalPages) break;
    const isCurrentPage = pageNum === pagination.currentPage;
    const pageClass = isCurrentPage 
      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50';
    links.push(`<a href="/admin?search=true&email=${encodeURIComponent(searchQuery)}&searchPage=${pageNum}&searchLimit=${pagination.limit}#search" 
       class="relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageClass}">
      ${pageNum}
    </a>`);
  }
  return links.join('');
}
