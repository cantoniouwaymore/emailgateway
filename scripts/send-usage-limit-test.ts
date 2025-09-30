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
      billing_cycle: string;
      current_period_start: string;
      current_period_end: string;
    };
    usage: {
      metric_name: string;
      current_usage: number;
      limit: number;
      remaining: number;
      percentage: number;
      warning_threshold: number;
    };
    actions: {
      upgrade_url: string;
      manage_usage_url: string;
      contact_support_url: string;
    };
  };
  metadata: {
    tenantId: string;
    eventId: string;
    notificationType: string;
    usagePercentage: number;
  };
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  console.log('📨 Email Payload Structure:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('✅ Email sent successfully (simulated)');
}

async function sendUsageLimitTestEmails() {
  try {
    console.log('🚀 Sending Usage Limit Warning Test Emails...');

    const templateKey = 'usage-limit-warning-80pct';

    // Test data for English email - Contacts usage
    const englishContactsPayload: EmailPayload = {
      to: [{ email: 'john.doe@example.com', name: 'John Doe' }],
      from: { email: 'billing@waymore.io', name: 'Waymore Usage Team' },
      subject: 'Usage Limit Warning - 80% of Contacts Limit Reached',
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
          billing_cycle: 'Monthly',
          current_period_start: '2025-01-01',
          current_period_end: '2025-01-31'
        },
        usage: {
          metric_name: 'contacts',
          current_usage: 24000,
          limit: 30000,
          remaining: 6000,
          percentage: 80,
          warning_threshold: 80
        },
        actions: {
          upgrade_url: 'https://app.waymore.io/billing/upgrade?token=abc123',
          manage_usage_url: 'https://app.waymore.io/usage/contacts',
          contact_support_url: 'https://waymore.io/support?topic=usage-limits'
        }
      },
      metadata: {
        tenantId: 'acme_corp',
        eventId: 'usage-limit-warning-80pct',
        notificationType: 'usage_limit_warning',
        usagePercentage: 80
      }
    };

    // Test data for Greek email - Events usage
    const greekEventsPayload: EmailPayload = {
      to: [{ email: 'maria.papadopoulos@example.com', name: 'Μαρία Παπαδοπούλου' }],
      from: { email: 'billing@waymore.io', name: 'Ομάδα Χρήσης Waymore' },
      subject: 'Προειδοποίηση Ορίου Χρήσης - 80% του Ορίου Events Έφτασε',
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
          plan_name: 'Business Plan',
          billing_cycle: 'Μηνιαίο',
          current_period_start: '2025-01-01',
          current_period_end: '2025-01-31'
        },
        usage: {
          metric_name: 'events',
          current_usage: 800000,
          limit: 1000000,
          remaining: 200000,
          percentage: 80,
          warning_threshold: 80
        },
        actions: {
          upgrade_url: 'https://app.waymore.io/billing/upgrade?token=def456&lang=el',
          manage_usage_url: 'https://app.waymore.io/usage/events?lang=el',
          contact_support_url: 'https://waymore.io/support?topic=usage-limits&lang=el'
        }
      },
      metadata: {
        tenantId: 'papadopoulos_corp',
        eventId: 'usage-limit-warning-80pct',
        notificationType: 'usage_limit_warning',
        usagePercentage: 80
      }
    };

    // Send English email (using base locale) - Contacts usage
    console.log('📧 Sending English usage limit warning (Contacts) - using base locale...');
    await sendEmail(englishContactsPayload);
    console.log('✅ English email sent successfully');

    // Send Greek email - Events usage
    console.log('📧 Sending Greek usage limit warning (Events)...');
    await sendEmail(greekEventsPayload);
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
    await sendUsageLimitTestEmails();
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

export { sendUsageLimitTestEmails };
