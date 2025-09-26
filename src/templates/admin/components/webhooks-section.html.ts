import { getEventTypeClass } from '../../../utils/html-helpers';

export function generateWebhooksSection(data: any): string {
  const { recentWebhookEvents } = data;
  
  return `
    <div id="webhooks-tab" class="tab-content">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          <i class="fas fa-webhook mr-3 text-indigo-600"></i>
          Webhook Events
        </h2>
        <p class="text-lg text-gray-600">
          Monitor webhook events and delivery notifications from your email providers
        </p>
      </div>
      
      ${generateWebhookEventsSection(recentWebhookEvents)}
    </div>`;
}

function generateWebhookEventsSection(recentWebhookEvents: any[]): string {
  return `
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                <i class="fas fa-bell mr-2"></i>
                Provider Status Updates
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Latest webhook events from email providers (delivery status, bounces, opens, etc.)
            </p>
        </div>
        <div class="border-t border-gray-200">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${recentWebhookEvents && recentWebhookEvents.length > 0 ? recentWebhookEvents.map((event: any) => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeClass(event.eventType)}">${event.eventType}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">${event.messageId}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${event.provider}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(event.createdAt).toLocaleString()}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <a href="/admin/messages/${event.messageId}" class="text-indigo-600 hover:text-indigo-900">
                                        <i class="fas fa-eye mr-1"></i>
                                        View Message
                                    </a>
                                </td>
                            </tr>
                        `).join('') : `
                            <tr>
                                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                                    <i class="fas fa-info-circle mr-2"></i>
                                    No webhook events received yet. Events will appear here when providers send status updates.
                                </td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}
