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
    downgrade: {
      old_plan: string;
      new_plan: string;
      effective_date: string;
      downgrade_type: string;
    };
    billing: {
      savings_amount: string;
      currency: string;
      next_invoice_date: string;
      billing_cycle: string;
    };
    limitations: {
      category_1: string;
      category_2: string;
      item_1: string;
      item_2: string;
      item_3: string;
      item_4: string;
      item_5: string;
      item_6: string;
    };
    actions: {
      plan_details_url: string;
      billing_url: string;
      contact_support_url: string;
    };
  };
  metadata: {
    tenantId: string;
    eventId: string;
    notificationType: string;
    downgradeType: string;
    fromPlan: string;
    toPlan: string;
  };
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  console.log('📨 Email Payload Structure:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('✅ Email sent successfully (simulated)');
}

async function sendDowngradeConfirmationTestEmails() {
  try {
    console.log('🚀 Sending Subscription Downgrade Confirmation Test Emails...');

    const templateKey = 'subscription-downgrade-confirmation';

    // Test data for English email - Business to Pro downgrade
    const englishBusinessToProPayload: EmailPayload = {
      to: [{ email: 'john.doe@example.com', name: 'John Doe' }],
      from: { email: 'billing@waymore.io', name: 'Waymore Billing Team' },
      subject: 'Plan Downgrade Confirmed - Business to Pro Plan',
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
        downgrade: {
          old_plan: 'Business Plan',
          new_plan: 'Pro Plan',
          effective_date: '2025-02-01',
          downgrade_type: 'End of Billing Period'
        },
        billing: {
          savings_amount: '$50.00',
          currency: 'USD',
          next_invoice_date: '2025-02-01',
          billing_cycle: 'month'
        },
        limitations: {
          category_1: 'Reduced Limits',
          category_2: 'Limited Features',
          item_1: '30,000 contacts (down from 100,000)',
          item_2: 'Limited events tracking (down from unlimited)',
          item_3: '50GB storage (down from 500GB)',
          item_4: 'Basic analytics dashboard',
          item_5: 'Standard integrations only',
          item_6: 'Email support (no priority access)'
        },
        actions: {
          plan_details_url: 'https://app.waymore.io/billing/plan-details?downgrade=true',
          billing_url: 'https://app.waymore.io/billing',
          contact_support_url: 'https://waymore.io/support?topic=downgrade-confirmation'
        }
      },
      metadata: {
        tenantId: 'acme_corp',
        eventId: 'subscription-downgrade-confirmation',
        notificationType: 'downgrade_confirmation',
        downgradeType: 'end_of_period',
        fromPlan: 'business',
        toPlan: 'pro'
      }
    };

    // Test data for Greek email - Pro to Starter downgrade
    const greekProToStarterPayload: EmailPayload = {
      to: [{ email: 'maria.papadopoulos@example.com', name: 'Μαρία Παπαδοπούλου' }],
      from: { email: 'billing@waymore.io', name: 'Ομάδα Χρέωσης Waymore' },
      subject: 'Η Κατάβαση Προγράμματος Επιβεβαιώθηκε - Pro σε Starter Plan',
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
        downgrade: {
          old_plan: 'Pro Plan',
          new_plan: 'Starter Plan',
          effective_date: '2025-02-01',
          downgrade_type: 'Τέλος Περιόδου Χρέωσης'
        },
        billing: {
          savings_amount: '€20.00',
          currency: 'EUR',
          next_invoice_date: '2025-02-01',
          billing_cycle: 'μήνα'
        },
        limitations: {
          category_1: 'Μειωμένα Όρια',
          category_2: 'Περιορισμένες Λειτουργίες',
          item_1: '5,000 επαφές (από 30,000)',
          item_2: '1,000 events ανά μήνα (από 10,000)',
          item_3: '5GB αποθήκευση (από 50GB)',
          item_4: 'Βασικό dashboard αναλυτικών',
          item_5: 'Χωρίς API ενσωματώσεις',
          item_6: 'Email υποστήριξη μόνο'
        },
        actions: {
          plan_details_url: 'https://app.waymore.io/billing/plan-details?downgrade=true&lang=el',
          billing_url: 'https://app.waymore.io/billing?lang=el',
          contact_support_url: 'https://waymore.io/support?topic=downgrade-confirmation&lang=el'
        }
      },
      metadata: {
        tenantId: 'papadopoulos_corp',
        eventId: 'subscription-downgrade-confirmation',
        notificationType: 'downgrade_confirmation',
        downgradeType: 'end_of_period',
        fromPlan: 'pro',
        toPlan: 'starter'
      }
    };

    // Send English email (using base locale) - Business to Pro downgrade
    console.log('📧 Sending English downgrade confirmation (Business → Pro) - using base locale...');
    await sendEmail(englishBusinessToProPayload);
    console.log('✅ English email sent successfully');

    // Send Greek email - Pro to Starter downgrade
    console.log('📧 Sending Greek downgrade confirmation (Pro → Starter)...');
    await sendEmail(greekProToStarterPayload);
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
    await sendDowngradeConfirmationTestEmails();
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

export { sendDowngradeConfirmationTestEmails };
