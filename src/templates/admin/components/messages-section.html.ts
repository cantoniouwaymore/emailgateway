import { getRecipientEmail } from '../../../utils/html-helpers';

export function generateMessagesSection(data: any): string {
  const { recentMessages, pagination } = data;
  
  return `
    <div id="messages-tab" class="tab-content">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          <i class="fas fa-envelope mr-3 text-indigo-600"></i>
          Recent Messages
        </h2>
        <p class="text-lg text-gray-600">
          View and manage your recent email messages with delivery status and details
        </p>
      </div>
      
      ${generateRecentMessagesTable(recentMessages, pagination)}
    </div>`;
}

export function generateRecentMessagesTable(recentMessages: any[], pagination?: any): string {
  return `
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                <i class="fas fa-envelope mr-2"></i>
                Recent Messages
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Latest email messages and their delivery status
                ${pagination ? `(${pagination.totalCount} total messages)` : ''}
            </p>
        </div>
        <div class="border-t border-gray-200">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${recentMessages.map((message: any) => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">${message.messageId}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full status-${message.status.toLowerCase()}">${message.status}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${getRecipientEmail(message.toJson)}</td>
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
        </div>
        ${pagination && pagination.totalPages > 1 ? generateMessagesPagination(pagination) : ''}
    </div>`;
}

function generateMessagesPagination(pagination: any): string {
  return `
    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
            ${pagination.currentPage > 1 ? `
            <a href="/admin?page=${pagination.currentPage - 1}&limit=${pagination.limit}" 
               class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
            </a>
            ` : ''}
            ${pagination.currentPage < pagination.totalPages ? `
            <a href="/admin?page=${pagination.currentPage + 1}&limit=${pagination.limit}" 
               class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
            </a>
            ` : ''}
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-700">
                    Showing page <span class="font-medium">${pagination.currentPage}</span> of <span class="font-medium">${pagination.totalPages}</span>
                    (${pagination.totalCount} total messages)
                </p>
            </div>
            <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    ${pagination.currentPage > 1 ? `
                    <a href="/admin?page=${pagination.currentPage - 1}&limit=${pagination.limit}" 
                       class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span class="sr-only">Previous</span>
                        <i class="fas fa-chevron-left"></i>
                    </a>
                    ` : ''}
                    
                    ${generatePaginationLinks(pagination)}
                    
                    ${pagination.currentPage < pagination.totalPages ? `
                    <a href="/admin?page=${pagination.currentPage + 1}&limit=${pagination.limit}" 
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

function generatePaginationLinks(pagination: any): string {
  const links = [];
  for (let i = 0; i < Math.min(5, pagination.totalPages); i++) {
    const pageNum = Math.max(1, pagination.currentPage - 2) + i;
    if (pageNum > pagination.totalPages) break;
    const isCurrentPage = pageNum === pagination.currentPage;
    const pageClass = isCurrentPage 
      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50';
    links.push(`<a href="/admin?page=${pageNum}&limit=${pagination.limit}" 
       class="relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageClass}">
      ${pageNum}
    </a>`);
  }
  return links.join('');
}
