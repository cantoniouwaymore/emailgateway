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
    upgrade: {
      old_plan: string;
      new_plan: string;
      effective_date: string;
      upgrade_type: string;
    };
    billing: {
      prorated_amount: string;
      currency: string;
      next_invoice_date: string;
      billing_cycle: string;
    };
    features: {
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
    upgradeType: string;
    fromPlan: string;
    toPlan: string;
  };
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  console.log('📨 Email Payload Structure:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('✅ Email sent successfully (simulated)');
}

async function sendUpgradeSuccessTestEmails() {
  try {
    console.log('🚀 Sending Subscription Upgrade Success Test Emails...');

    const templateKey = 'subscription-upgrade-success';

    // Test data for English email - Pro to Business upgrade
    const englishProToBusinessPayload: EmailPayload = {
      to: [{ email: 'john.doe@example.com', name: 'John Doe' }],
      from: { email: 'billing@waymore.io', name: 'Waymore Upgrade Team' },
      subject: 'Plan Upgrade Successful - Pro to Business Plan',
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
        upgrade: {
          old_plan: 'Pro Plan',
          new_plan: 'Business Plan',
          effective_date: '2025-01-15',
          upgrade_type: 'Immediate Upgrade'
        },
        billing: {
          prorated_amount: '$15.83',
          currency: 'USD',
          next_invoice_date: '2025-02-01',
          billing_cycle: 'Monthly'
        },
        features: {
          category_1: 'Enhanced Limits',
          category_2: 'New Features',
          item_1: '100,000 contacts (up from 30,000)',
          item_2: 'Unlimited events tracking',
          item_3: '500GB storage (up from 50GB)',
          item_4: 'Advanced analytics dashboard',
          item_5: 'Custom integrations API',
          item_6: 'Priority support access'
        },
        actions: {
          plan_details_url: 'https://app.waymore.io/billing/plan-details?upgrade=true',
          billing_url: 'https://app.waymore.io/billing',
          contact_support_url: 'https://waymore.io/support?topic=upgrade-success'
        }
      },
      metadata: {
        tenantId: 'acme_corp',
        eventId: 'subscription-upgrade-success',
        notificationType: 'upgrade_success',
        upgradeType: 'immediate',
        fromPlan: 'pro',
        toPlan: 'business'
      }
    };

    // Test data for Greek email - Starter to Pro upgrade
    const greekStarterToProPayload: EmailPayload = {
      to: [{ email: 'maria.papadopoulos@example.com', name: 'Μαρία Παπαδοπούλου' }],
      from: { email: 'billing@waymore.io', name: 'Ομάδα Αναβάθμισης Waymore' },
      subject: 'Η Αναβάθμιση Προγράμματος Επιτυχής - Starter σε Pro Plan',
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
        upgrade: {
          old_plan: 'Starter Plan',
          new_plan: 'Pro Plan',
          effective_date: '2025-01-15',
          upgrade_type: 'Αναβάθμιση Επόμενης Περιόδου'
        },
        billing: {
          prorated_amount: '€8.33',
          currency: 'EUR',
          next_invoice_date: '2025-02-01',
          billing_cycle: 'Μηνιαίο'
        },
        features: {
          category_1: 'Βελτιωμένα Όρια',
          category_2: 'Νέες Λειτουργίες',
          item_1: '30,000 επαφές (από 5,000)',
          item_2: '10,000 events ανά μήνα (από 1,000)',
          item_3: '50GB αποθήκευση (από 5GB)',
          item_4: 'Βασικό dashboard αναλυτικών',
          item_5: 'API ενσωματώσεις',
          item_6: 'Email υποστήριξη'
        },
        actions: {
          plan_details_url: 'https://app.waymore.io/billing/plan-details?upgrade=true&lang=el',
          billing_url: 'https://app.waymore.io/billing?lang=el',
          contact_support_url: 'https://waymore.io/support?topic=upgrade-success&lang=el'
        }
      },
      metadata: {
        tenantId: 'papadopoulos_corp',
        eventId: 'subscription-upgrade-success',
        notificationType: 'upgrade_success',
        upgradeType: 'next_period',
        fromPlan: 'starter',
        toPlan: 'pro'
      }
    };

    // Send English email (using base locale) - Pro to Business upgrade
    console.log('📧 Sending English upgrade success confirmation (Pro → Business) - using base locale...');
    await sendEmail(englishProToBusinessPayload);
    console.log('✅ English email sent successfully');

    // Send Greek email - Starter to Pro upgrade
    console.log('📧 Sending Greek upgrade success confirmation (Starter → Pro)...');
    await sendEmail(greekStarterToProPayload);
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
    await sendUpgradeSuccessTestEmails();
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

export { sendUpgradeSuccessTestEmails };
