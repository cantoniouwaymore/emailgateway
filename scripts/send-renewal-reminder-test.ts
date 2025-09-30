import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EmailPayload {
  to: Array<{ email: string; name: string }>;
  from: { email: string; name: string };
  subject: string;
  template: { key: string; locale: string };
  variables: {
    user: {
      name: string;
      email: string;
      role: string;
      workspace_name: string;
    };
    company: {
      name: string;
      logo_url: string;
      website: string;
      support_email: string;
    };
    subscription: {
      plan_name: string;
      renewal_date: string;
      days_until_expiry: number;
      billing_cycle: string;
      next_amount: string;
      currency: string;
      auto_renewal: string;
      urgency_percentage: number;
    };
    actions: {
      manage_subscription_url: string;
      billing_portal_url: string;
      contact_support_url: string;
    };
  };
  metadata: {
    tenantId: string;
    eventId: string;
    notificationType: string;
    daysUntilExpiry: number;
  };
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  console.log('📨 Email Payload Structure:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('✅ Email sent successfully (simulated)');
}

async function sendRenewalReminderTestEmails() {
  try {
    console.log('🚀 Sending Subscription Renewal Reminder Test Emails...');

    const templateKey = 'subscription-renewal-reminder-7d';

    // Test data for English email
    const englishPayload: EmailPayload = {
      to: [{ email: 'john.doe@example.com', name: 'John Doe' }],
      from: { email: 'billing@waymore.io', name: 'Waymore Billing Team' },
      subject: 'Subscription Renewal Reminder - 7 Days',
      template: { key: templateKey, locale: '__base__' },
      variables: {
        user: {
          name: 'John',
          email: 'john.doe@example.com',
          role: 'Workspace Owner',
          workspace_name: 'Acme Corporation'
        },
        company: {
          name: 'Waymore',
          logo_url: 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png',
          website: 'https://waymore.io',
          support_email: 'support@waymore.io'
        },
        subscription: {
          plan_name: 'Pro Plan',
          renewal_date: '2025-02-15',
          days_until_expiry: 7,
          billing_cycle: 'Monthly',
          next_amount: '$29.99',
          currency: 'USD',
          auto_renewal: 'Enabled',
          urgency_percentage: 100
        },
        actions: {
          manage_subscription_url: 'https://app.waymore.io/billing/manage?token=abc123',
          billing_portal_url: 'https://app.waymore.io/billing',
          contact_support_url: 'https://waymore.io/support?topic=subscription-renewal'
        }
      },
      metadata: {
        tenantId: 'acme_corp',
        eventId: 'subscription-renewal-reminder-7d',
        notificationType: 'subscription_renewal_reminder',
        daysUntilExpiry: 7
      }
    };

    // Test data for Greek email
    const greekPayload: EmailPayload = {
      to: [{ email: 'maria.papadopoulos@example.com', name: 'Μαρία Παπαδοπούλου' }],
      from: { email: 'billing@waymore.io', name: 'Ομάδα Χρέωσης Waymore' },
      subject: 'Υπενθύμιση Ανανέωσης Συνδρομής - 7 Ημέρες',
      template: { key: templateKey, locale: 'el' },
      variables: {
        user: {
          name: 'Μαρία',
          email: 'maria.papadopoulos@example.com',
          role: 'Διευθύντρια Χώρου Εργασίας',
          workspace_name: 'Εταιρεία Παπαδόπουλος'
        },
        company: {
          name: 'Waymore',
          logo_url: 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png',
          website: 'https://waymore.io',
          support_email: 'support@waymore.io'
        },
        subscription: {
          plan_name: 'Πλάνο Pro',
          renewal_date: '2025-02-15',
          days_until_expiry: 7,
          billing_cycle: 'Μηνιαίο',
          next_amount: '€24.99',
          currency: 'EUR',
          auto_renewal: 'Ενεργοποιημένη',
          urgency_percentage: 100
        },
        actions: {
          manage_subscription_url: 'https://app.waymore.io/billing/manage?token=def456&lang=el',
          billing_portal_url: 'https://app.waymore.io/billing?lang=el',
          contact_support_url: 'https://waymore.io/support?topic=subscription-renewal&lang=el'
        }
      },
      metadata: {
        tenantId: 'papadopoulos_corp',
        eventId: 'subscription-renewal-reminder-7d',
        notificationType: 'subscription_renewal_reminder',
        daysUntilExpiry: 7
      }
    };

    // Send English email (using base locale)
    console.log('📧 Sending English renewal reminder email (using base locale)...');
    await sendEmail(englishPayload);
    console.log('✅ English email sent successfully');

    // Send Greek email
    console.log('📧 Sending Greek renewal reminder email...');
    await sendEmail(greekPayload);
    console.log('✅ Greek email sent successfully');

    console.log('🎉 All test emails sent successfully!');
    console.log('🎉 Test email script completed successfully');

  } catch (error) {
    console.error('❌ Error sending test emails:', error);
    throw error;
  }
}

// Run the script
async function main() {
  try {
    await sendRenewalReminderTestEmails();
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { sendRenewalReminderTestEmails };
