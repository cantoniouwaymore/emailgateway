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
      percentage: number;
      limit_reached_at: string;
    };
    actions: {
      upgrade_url: string;
      usage_details_url: string;
      contact_support_url: string;
    };
  };
  metadata: {
    tenantId: string;
    eventId: string;
    notificationType: string;
    usagePercentage: number;
    urgent: boolean;
  };
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  console.log('📨 Email Payload Structure:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('✅ Email sent successfully (simulated)');
}

async function sendHardLimitTestEmails() {
  try {
    console.log('🚀 Sending Hard Limit Reached Test Emails...');

    const templateKey = 'hard-limit-reached-100pct';

    // Test data for English email - Contacts usage
    const englishContactsPayload: EmailPayload = {
      to: [{ email: 'john.doe@example.com', name: 'John Doe' }],
      from: { email: 'billing@waymore.io', name: 'Waymore Limit Team' },
      subject: 'URGENT: Usage Limit Reached - Contacts Import Blocked',
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
          current_usage: 30000,
          limit: 30000,
          percentage: 100,
          limit_reached_at: '2025-01-15T14:30:00Z'
        },
        actions: {
          upgrade_url: 'https://app.waymore.io/billing/upgrade?token=abc123&urgent=true',
          usage_details_url: 'https://app.waymore.io/usage/contacts?limit_reached=true',
          contact_support_url: 'https://waymore.io/support?topic=limit-reached&urgent=true'
        }
      },
      metadata: {
        tenantId: 'acme_corp',
        eventId: 'hard-limit-reached-100pct',
        notificationType: 'hard_limit_reached',
        usagePercentage: 100,
        urgent: true
      }
    };

    // Test data for Greek email - Storage usage
    const greekStoragePayload: EmailPayload = {
      to: [{ email: 'maria.papadopoulos@example.com', name: 'Μαρία Παπαδοπούλου' }],
      from: { email: 'billing@waymore.io', name: 'Ομάδα Ορίων Waymore' },
      subject: 'ΕΠΕΙΓΟΝ: Έφτασε το Όριο Χρήσης - Αποθήκευση Μπλοκαρίστηκε',
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
          metric_name: 'storage',
          current_usage: 50000000000, // 50GB in bytes
          limit: 50000000000,
          percentage: 100,
          limit_reached_at: '2025-01-15T16:45:00Z'
        },
        actions: {
          upgrade_url: 'https://app.waymore.io/billing/upgrade?token=def456&lang=el&urgent=true',
          usage_details_url: 'https://app.waymore.io/usage/storage?lang=el&limit_reached=true',
          contact_support_url: 'https://waymore.io/support?topic=limit-reached&lang=el&urgent=true'
        }
      },
      metadata: {
        tenantId: 'papadopoulos_corp',
        eventId: 'hard-limit-reached-100pct',
        notificationType: 'hard_limit_reached',
        usagePercentage: 100,
        urgent: true
      }
    };

    // Send English email (using base locale) - Contacts usage
    console.log('📧 Sending English hard limit notification (Contacts) - using base locale...');
    await sendEmail(englishContactsPayload);
    console.log('✅ English email sent successfully');

    // Send Greek email - Storage usage
    console.log('📧 Sending Greek hard limit notification (Storage)...');
    await sendEmail(greekStoragePayload);
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
    await sendHardLimitTestEmails();
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

export { sendHardLimitTestEmails };
