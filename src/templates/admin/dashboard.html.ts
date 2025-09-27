import { generateHealthSection } from './components/health-section.html';
import { generateMessagesSection } from './components/messages-section.html';
import { generateWebhooksSection } from './components/webhooks-section.html';
import { generateSearchSection } from './components/search-section.html';
import { generateTemplatesSection } from './components/templates-section.html';
import { generateDocumentationSection } from './components/documentation-section.html';
import { generateAIPlaygroundSection, generateAIPlaygroundScript } from './components/ai-playground-section.html';
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
        
        /* OpenAI-style documentation CSS */
        .docs-page { @apply min-h-screen bg-white; }
        .ovr-page { @apply max-w-6xl mx-auto px-6 py-12; }
        .ovr-section { @apply mb-16; }
        .ovr-intro { @apply bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8; }
        .ovr-intro-text { @apply text-gray-900; }
        .text-default { @apply text-gray-700; }
        .text-secondary { @apply text-gray-500; }
        .text-tertiary { @apply text-gray-400; }
        .text-emphasis { @apply text-gray-900; }
        .pointer { @apply ml-2; }
        
        .code-sample { @apply bg-gray-900 rounded-lg overflow-hidden; }
        .code-sample-header { @apply flex items-center justify-between p-4 border-b border-gray-700; }
        .code-sample-title { @apply text-gray-400; }
        .exclude-from-copy { @apply flex items-center; }
        .fsluc { @apply inline-flex items-center px-3 py-1 rounded-md bg-gray-800 text-gray-300 text-sm; }
        .ktL9G { @apply mr-2; }
        .FJZOe { @apply ml-1; }
        .lkCln { @apply inline-flex items-center px-3 py-1 rounded-md text-gray-400 hover:text-gray-200 transition-colors; }
        .NBPKZ { @apply flex items-center; }
        ._4jUWi { @apply flex items-center justify-center; }
        .pdMy8 { @apply w-4 h-4; }
        
        .code-sample-body { @apply p-4; }
        .code-sample-body-small { @apply p-3; }
        .code-sample-body-with-header { @apply border-t border-gray-700; }
        .code-block { @apply relative; }
        .code-sample-pre { @apply text-sm text-gray-100 leading-relaxed; }
        .react-syntax-highlighter-line-number { @apply text-gray-500 pr-4 text-right select-none; }
        
        .ovr-build { @apply mt-16; }
        .ovr-build-grid { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6; }
        .icon-item { @apply flex items-start p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200; }
        .icon-item-icon { @apply flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 mr-4; }
        .icon-item-right { @apply flex-1; }
        .icon-item-title { @apply flex items-center justify-between mb-2; }
        .icon-item-title.body-large { @apply text-lg font-semibold text-gray-900; }
        .icon-item-desc { @apply text-sm text-gray-600; }
        .body-small { @apply text-sm; }
        .body-large { @apply text-base; }
        
        .ovr-footer-grid { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8; }
        .ovr-footer-item { @apply text-center p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200; }
        .ovr-footer-title { @apply text-lg font-semibold text-gray-900; }
        .ovr-footer-desc { @apply text-sm text-gray-600; }
        
        /* Dark mode support */
        .dark-mode { @apply bg-gray-900 text-gray-100; }
        .dark-mode .hljs { @apply bg-gray-900; }
        .dark-mode .hljs-keyword { @apply text-blue-400; }
        .dark-mode .hljs-string { @apply text-green-400; }
        .dark-mode .hljs-attr { @apply text-yellow-400; }
        .dark-mode .hljs-built_in { @apply text-purple-400; }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .ovr-page { @apply px-4 py-8; }
            .ovr-intro { @apply p-6; }
            .ovr-build-grid { @apply grid-cols-1; }
            .ovr-footer-grid { @apply grid-cols-1 md:grid-cols-2; }
        }
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
        ${generateAIPlaygroundSection({})}
        ${generateDocumentationSection({})}
        ${generateRefreshButton()}
    </main>
    ${generateDashboardScript()}
    ${generateAIPlaygroundScript()}
</body>
</html>`;
}

