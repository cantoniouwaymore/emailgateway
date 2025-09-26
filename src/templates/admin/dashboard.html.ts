import { generateHealthSection } from './components/health-section.html';
import { generateMessagesSection } from './components/messages-section.html';
import { generateWebhooksSection } from './components/webhooks-section.html';
import { generateSearchSection } from './components/search-section.html';
import { generateTemplatesSection } from './components/templates-section.html';
import { generateDocumentationSection } from './components/documentation-section.html';
import { 
  generateNavbar, 
  generateHeader, 
  generateTabNavigation, 
  generateRefreshButton, 
  generateDashboardScript 
} from './components/shared-components.html';

export function generateDashboardHTML(data: any): string {
  const { health, serviceHealth, systemMetrics, recentMessages, stats, queueDepth, failedCount, sentCount, recentWebhookEvents, pagination, searchResults, searchQuery, searchPagination } = data;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Waymore Transactional Emails Service Admin</title>
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
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .tab-button.active { @apply border-indigo-500 text-indigo-600; }
        .tab-button { @apply border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300; }
    </style>
</head>
<body class="bg-gray-50">
    ${generateNavbar()}
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        ${generateHeader()}
        ${generateTabNavigation()}
        ${generateHealthSection({ health, serviceHealth, systemMetrics, queueDepth, sentCount, failedCount })}
        ${generateMessagesSection({ recentMessages, pagination })}
        ${generateWebhooksSection({ recentWebhookEvents })}
        ${generateSearchSection({ searchResults, searchQuery, pagination: searchPagination })}
        ${generateTemplatesSection({})}
        ${generateDocumentationSection({})}
        ${generateRefreshButton()}
    </main>
    ${generateDashboardScript()}
</body>
</html>`;
}

