// Import all email template examples
import { getWelcomeExample } from './welcome';
import { getPaymentSuccessExample } from './payment-success';
import { getPaymentFailureExample } from './payment-failure';
import { getRenewalExample } from './subscription-renewal';
import { getUpgradeExample } from './subscription-upgrade';
import { getUsageExample } from './usage-alert';
import { getInvoiceExample } from './invoice';
import { getPasswordResetExample } from './password-reset';
import { getMonthlyReportExample } from './monthly-report';
import { getDarkModeExample } from './dark-mode';
import { getCountdownExample } from './countdown';

// Export all email template examples
export { getWelcomeExample } from './welcome';
export { getPaymentSuccessExample } from './payment-success';
export { getPaymentFailureExample } from './payment-failure';
export { getRenewalExample } from './subscription-renewal';
export { getUpgradeExample } from './subscription-upgrade';
export { getUsageExample } from './usage-alert';
export { getInvoiceExample } from './invoice';
export { getPasswordResetExample } from './password-reset';
export { getMonthlyReportExample } from './monthly-report';
export { getDarkModeExample } from './dark-mode';
export { getCountdownExample } from './countdown';

// Example categories for better organization
export const EXAMPLE_CATEGORIES = {
  onboarding: ['welcome'],
  payments: ['payment-success', 'payment-failure', 'invoice'],
  subscriptions: ['subscription-renewal', 'subscription-upgrade'],
  notifications: ['usage-alert', 'monthly-report'],
  security: ['password-reset'],
  features: ['dark-mode'],
  marketing: ['countdown']
} as const;

// Helper function to get all examples
export function getAllExamples() {
  return {
    welcome: getWelcomeExample(),
    paymentSuccess: getPaymentSuccessExample(),
    paymentFailure: getPaymentFailureExample(),
    renewal: getRenewalExample(),
    upgrade: getUpgradeExample(),
    usage: getUsageExample(),
    invoice: getInvoiceExample(),
    passwordReset: getPasswordResetExample(),
    monthlyReport: getMonthlyReportExample(),
    darkMode: getDarkModeExample(),
    countdown: getCountdownExample()
  };
}
