export function generateSearchResultsHTML(data: any): string {
  const { email, messages, pagination } = data;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Results - Waymore Transactional Emails Service Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .status-queued { @apply bg-yellow-100 text-yellow-800; }
        .status-sent { @apply bg-green-100 text-green-800; }
        .status-failed { @apply bg-red-100 text-red-800; }
        .status-delivered { @apply bg-blue-100 text-blue-800; }
        .status-bounced { @apply bg-orange-100 text-orange-800; }
        .status-suppressed { @apply bg-gray-100 text-gray-800; }
    </style>
</head>
<body class="bg-gray-50">
    ${generateNavbar()}
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        ${generateHeader(email)}
        ${generateSearchForm(email)}
        ${generateResultsSummary(email, pagination)}
        ${generateMessagesTable(messages, email)}
        ${generatePagination(email, pagination)}
    </main>
</body>
</html>`;
}

function generateNavbar(): string {
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
                    <a href="/admin" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                        <i class="fas fa-arrow-left mr-1"></i>
                        Back to Dashboard
                    </a>
                </div>
            </div>
        </div>
    </nav>`;
}

function generateHeader(email: string): string {
  return `
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Search Results</h1>
        <p class="mt-2 text-gray-600">Emails sent to: <span class="font-mono bg-gray-100 px-2 py-1 rounded">${email}</span></p>
    </div>`;
}

function generateSearchForm(email: string): string {
  return `
    <div class="bg-white shadow rounded-lg mb-6">
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
                        value="${email}"
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
    </div>`;
}

function generateResultsSummary(email: string, pagination: any): string {
  return `
    <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                <i class="fas fa-list mr-2"></i>
                Search Results
            </h3>
            <p class="mt-1 text-sm text-gray-500">
                Found ${pagination.totalCount} messages sent to ${email}
                ${pagination.totalPages > 1 ? `(Page ${pagination.currentPage} of ${pagination.totalPages})` : ''}
            </p>
        </div>
    </div>`;
}

function generateMessagesTable(messages: any[], email: string): string {
  if (messages.length === 0) {
    return `
    <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-12 text-center">
            <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p class="text-gray-500">No emails were found sent to <span class="font-mono bg-gray-100 px-2 py-1 rounded">${email}</span></p>
        </div>
    </div>`;
  }

  return `
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message ID</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${messages.map((message: any) => `
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">${message.messageId}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full status-${message.status.toLowerCase()}">${message.status}</span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">${message.subject}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${message.provider || 'N/A'}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(message.createdAt).toLocaleString()}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="/admin/messages/${message.messageId}" class="text-indigo-600 hover:text-indigo-900">
                                    <i class="fas fa-eye mr-1"></i>
                                    View
                                </a>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}

function generatePagination(email: string, pagination: any): string {
  if (pagination.totalPages <= 1) {
    return '';
  }

  return `
    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
        <div class="flex-1 flex justify-between sm:hidden">
            ${pagination.currentPage > 1 ? `
            <a href="/admin/search?email=${encodeURIComponent(email)}&page=${pagination.currentPage - 1}&limit=${pagination.limit}" 
               class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
            </a>
            ` : ''}
            ${pagination.currentPage < pagination.totalPages ? `
            <a href="/admin/search?email=${encodeURIComponent(email)}&page=${pagination.currentPage + 1}&limit=${pagination.limit}" 
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
                    <a href="/admin/search?email=${encodeURIComponent(email)}&page=${pagination.currentPage - 1}&limit=${pagination.limit}" 
                       class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span class="sr-only">Previous</span>
                        <i class="fas fa-chevron-left"></i>
                    </a>
                    ` : ''}
                    
                    ${generatePaginationLinks(email, pagination)}
                    
                    ${pagination.currentPage < pagination.totalPages ? `
                    <a href="/admin/search?email=${encodeURIComponent(email)}&page=${pagination.currentPage + 1}&limit=${pagination.limit}" 
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

function generatePaginationLinks(email: string, pagination: any): string {
  const links = [];
  for (let i = 0; i < Math.min(5, pagination.totalPages); i++) {
    const pageNum = Math.max(1, pagination.currentPage - 2) + i;
    if (pageNum > pagination.totalPages) break;
    const isCurrentPage = pageNum === pagination.currentPage;
    const pageClass = isCurrentPage 
      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50';
    links.push(`<a href="/admin/search?email=${encodeURIComponent(email)}&page=${pageNum}&limit=${pagination.limit}" 
       class="relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageClass}">
      ${pageNum}
    </a>`);
  }
  return links.join('');
}
