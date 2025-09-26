import { Recipient } from '../types/email';

export function formatUptime(seconds: number): string {
  if (!seconds) return '0s';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

export function getEventTypeClass(eventType: string): string {
  const classes: Record<string, string> = {
    'delivered': 'bg-green-100 text-green-800',
    'bounce': 'bg-red-100 text-red-800',
    'open': 'bg-blue-100 text-blue-800',
    'click': 'bg-purple-100 text-purple-800',
    'spam': 'bg-orange-100 text-orange-800',
    'reject': 'bg-gray-100 text-gray-800'
  };
  return classes[eventType] || 'bg-gray-100 text-gray-800';
}

export function getRecipientEmail(toJson: any): string {
  try {
    const recipients = typeof toJson === 'string' ? JSON.parse(toJson) : toJson;
    if (!recipients || !Array.isArray(recipients)) {
      return 'N/A';
    }
    return recipients[0]?.email || 'N/A';
  } catch {
    return 'N/A';
  }
}

export function getRecipientsList(toJson: any): string {
  try {
    const recipients = typeof toJson === 'string' ? JSON.parse(toJson) : toJson;
    if (!recipients || !Array.isArray(recipients)) {
      return 'N/A';
    }
    return recipients.map((r: Recipient) => `
      <div class="mb-1">
        <span class="font-medium">${r.email}</span>
        ${r.name ? `<span class="text-gray-500">(${r.name})</span>` : ''}
      </div>
    `).join('');
  } catch {
    return 'N/A';
  }
}
