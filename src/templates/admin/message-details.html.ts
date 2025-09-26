export function generateMessageDetailsHTML(data: any): string {
  const { message } = data;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message Details - Waymore Transactional Emails Service Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
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
    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        ${generateHeader()}
        ${generateMessageInfo(message)}
        ${generateEmailContent(message)}
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

function generateHeader(): string {
  return `
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Message Details</h1>
        <p class="mt-2 text-gray-600">Detailed information about email message</p>
    </div>`;
}

function generateMessageInfo(message: any): string {
  return `
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                <i class="fas fa-info-circle mr-2"></i>
                Message Information
            </h3>
        </div>
        <div class="border-t border-gray-200">
            <dl>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Message ID</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">${message.messageId}</dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Status</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full status-${message.status.toLowerCase()}">${message.status}</span>
                    </dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Attempts</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${message.attempts}</dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Provider</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${message.provider || 'N/A'}</dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Provider Message ID</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">${message.providerMessageId || 'N/A'}</dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Created At</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${new Date(message.createdAt).toLocaleString()}</dd>
                </div>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Updated At</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${new Date(message.updatedAt).toLocaleString()}</dd>
                </div>
                ${message.lastError ? `
                <div class="bg-red-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-red-500">Last Error</dt>
                    <dd class="mt-1 text-sm text-red-900 sm:mt-0 sm:col-span-2 font-mono">${message.lastError}</dd>
                </div>
                ` : ''}
            </dl>
        </div>
    </div>`;
}

function generateEmailContent(message: any): string {
  return `
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                <i class="fas fa-envelope mr-2"></i>
                Email Content
            </h3>
        </div>
        <div class="border-t border-gray-200">
            <dl>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Subject</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${message.subject}</dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Recipients</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        ${getRecipientsList(message.toJson)}
                    </dd>
                </div>
            </dl>
        </div>
    </div>`;
}

function getRecipientsList(toJson: any): string {
  try {
    const recipients = typeof toJson === 'string' ? JSON.parse(toJson) : toJson;
    if (!recipients || !Array.isArray(recipients)) {
      return 'N/A';
    }
    return recipients.map((r: any) => `
      <div class="mb-1">
        <span class="font-medium">${r.email}</span>
        ${r.name ? `<span class="text-gray-500">(${r.name})</span>` : ''}
      </div>
    `).join('');
  } catch {
    return 'N/A';
  }
}
