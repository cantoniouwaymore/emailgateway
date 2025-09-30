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
      auto_renewal: string;
    };
    billing: {
      amount: string;
      currency: string;
      period_start: string;
      period_end: string;
      payment_method: string;
      last_four: string;
      invoice_number: string;
      transaction_id: string;
    };
    actions: {
      invoice_url: string;
      manage_subscription_url: string;
      contact_support_url: string;
      invoices_url: string;
    };
  };
  metadata: {
    tenantId: string;
    eventId: string;
    notificationType: string;
    renewalType: string;
    invoiceNumber: string;
  };
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  console.log('📨 Email Payload Structure:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('✅ Email sent successfully (simulated)');
}

async function sendRenewalSuccessTestEmails() {
  try {
    console.log('🚀 Sending Subscription Renewal Success Test Emails...');

    const templateKey = 'subscription-renewal-success';

    // Test data for English email - Monthly renewal
    const englishMonthlyPayload: EmailPayload = {
      to: [{ email: 'john.doe@example.com', name: 'John Doe' }],
      from: { email: 'billing@waymore.io', name: 'Waymore Billing Team' },
      subject: 'Subscription Renewed Successfully - Pro Plan',
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
          auto_renewal: 'Enabled'
        },
        billing: {
          amount: '$29.99',
          currency: 'USD',
          period_start: '2025-02-01',
          period_end: '2025-02-28',
          payment_method: 'Visa',
          last_four: '4242',
          invoice_number: 'INV-2025-002345',
          transaction_id: 'txn_abc123def456'
        },
        actions: {
          invoice_url: 'https://app.waymore.io/billing/invoice/INV-2025-002345',
          manage_subscription_url: 'https://app.waymore.io/billing/manage',
          contact_support_url: 'https://waymore.io/support?topic=billing',
          invoices_url: 'https://app.waymore.io/billing/invoices'
        }
      },
      metadata: {
        tenantId: 'acme_corp',
        eventId: 'subscription-renewal-success',
        notificationType: 'renewal_success',
        renewalType: 'monthly',
        invoiceNumber: 'INV-2025-002345'
      }
    };

    // Test data for Greek email - Annual renewal
    const greekAnnualPayload: EmailPayload = {
      to: [{ email: 'maria.papadopoulos@example.com', name: 'Μαρία Παπαδοπούλου' }],
      from: { email: 'billing@waymore.io', name: 'Ομάδα Χρέωσης Waymore' },
      subject: 'Η Συνδρομή Ανανεώθηκε Επιτυχώς - Business Plan',
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
          billing_cycle: 'Ετήσια',
          auto_renewal: 'Ενεργοποιημένη'
        },
        billing: {
          amount: '€299.99',
          currency: 'EUR',
          period_start: '2025-02-01',
          period_end: '2026-01-31',
          payment_method: 'Mastercard',
          last_four: '5555',
          invoice_number: 'INV-2025-002346',
          transaction_id: 'txn_def456ghi789'
        },
        actions: {
          invoice_url: 'https://app.waymore.io/billing/invoice/INV-2025-002346?lang=el',
          manage_subscription_url: 'https://app.waymore.io/billing/manage?lang=el',
          contact_support_url: 'https://waymore.io/support?topic=billing&lang=el',
          invoices_url: 'https://app.waymore.io/billing/invoices?lang=el'
        }
      },
      metadata: {
        tenantId: 'papadopoulos_corp',
        eventId: 'subscription-renewal-success',
        notificationType: 'renewal_success',
        renewalType: 'annual',
        invoiceNumber: 'INV-2025-002346'
      }
    };

    // Send English email (using base locale) - Monthly renewal
    console.log('📧 Sending English renewal success confirmation (Monthly) - using base locale...');
    await sendEmail(englishMonthlyPayload);
    console.log('✅ English email sent successfully');

    // Send Greek email - Annual renewal
    console.log('📧 Sending Greek renewal success confirmation (Annual)...');
    await sendEmail(greekAnnualPayload);
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
    await sendRenewalSuccessTestEmails();
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

export { sendRenewalSuccessTestEmails };
