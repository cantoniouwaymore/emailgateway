import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TemplateData {
  key: string;
  name: string;
  description: string;
  category: string;
  variableSchema: any;
  jsonStructure: any;
}

interface LocaleData {
  locale: string;
  jsonStructure: any;
}

function generateBaseLocaleWithContent(): any {
  return {
    header: {
      logo_url: '{{company.logo_url}}',
      logo_alt: '{{company.name}}',
      tagline: '{{company.tagline|Empowering your business}}'
    },
    hero: {
      type: 'icon',
      icon: '✅',
      icon_size: '48px'
    },
    title: {
      text: 'Subscription Renewed Successfully',
      size: '28px',
      weight: '700',
      color: '#059669',
      align: 'center'
    },
    body: {
      intro: 'Hi {{user.name}},',
      paragraphs: [
        'Great news! Your {{subscription.plan_name}} subscription has been successfully renewed.',
        'Your payment of {{billing.amount}} {{billing.currency}} has been processed and your service will continue uninterrupted.',
        'Your new billing period runs from {{billing.period_start}} to {{billing.period_end}}.',
        'Thank you for your continued trust in {{company.name}}. We\'re excited to keep supporting your business growth.'
      ],
      note: 'You can access your invoice and billing history anytime through your account dashboard.',
      font_size: '16px',
      line_height: '26px'
    },
    snapshot: {
      title: 'Renewal Details',
      facts: [
        { label: 'Plan', value: '{{subscription.plan_name}}' },
        { label: 'Amount Charged', value: '{{billing.amount}} {{billing.currency}}' },
        { label: 'Payment Method', value: '{{billing.payment_method}} ending in {{billing.last_four}}' },
        { label: 'Billing Period', value: '{{billing.period_start}} to {{billing.period_end}}' },
        { label: 'Invoice Number', value: '{{billing.invoice_number}}' },
        { label: 'Transaction ID', value: '{{billing.transaction_id}}' }
      ],
      style: 'table'
    },
    visual: {
      type: 'progress',
      progress_bars: [
        {
          label: 'Subscription Status',
          current: 'Active',
          max: 'Active',
          unit: '',
          percentage: '100',
          color: '#059669',
          description: 'Your subscription is active and will continue uninterrupted'
        }
      ]
    },
    actions: {
      primary: {
        label: 'View Invoice',
        url: '{{actions.invoice_url}}',
        style: 'button',
        color: '#059669',
        text_color: '#ffffff'
      },
      secondary: {
        label: 'Manage Subscription',
        url: '{{actions.manage_subscription_url}}',
        style: 'link',
        color: '#6b7280'
      }
    },
    support: {
      title: 'Need help?',
      links: [
        { label: 'Billing FAQ', url: '{{company.website}}/billing-faq' },
        { label: 'Contact Support', url: '{{actions.contact_support_url}}' },
        { label: 'View All Invoices', url: '{{actions.invoices_url}}' }
      ]
    },
    footer: {
      tagline: 'Empowering your business',
      social_links: [
        { platform: 'twitter', url: 'https://twitter.com/waymore' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/waymore' }
      ],
      legal_links: [
        { label: 'Privacy Policy', url: '{{company.website}}/privacy' },
        { label: 'Terms of Service', url: '{{company.website}}/terms' }
      ],
      copyright: '© 2025 {{company.name}}. All rights reserved.'
    }
  };
}

async function createRenewalSuccessTemplate() {
  try {
    console.log('🚀 Creating Subscription Renewal Success Template...');

    // Template data with comprehensive variable schema
    const templateData: TemplateData = {
      key: 'subscription-renewal-success',
      name: 'Subscription Renewal Success Confirmation',
      description: 'Confirms successful subscription renewal with billing details and invoice access',
      category: 'notification',
      variableSchema: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
              workspace_name: { type: 'string' }
            },
            required: ['name', 'email', 'workspace_name']
          },
          company: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              logo_url: { type: 'string' },
              website: { type: 'string' },
              support_email: { type: 'string' }
            },
            required: ['name', 'logo_url']
          },
          subscription: {
            type: 'object',
            properties: {
              plan_name: { type: 'string' },
              billing_cycle: { type: 'string' },
              auto_renewal: { type: 'string' }
            },
            required: ['plan_name', 'billing_cycle']
          },
          billing: {
            type: 'object',
            properties: {
              amount: { type: 'string' },
              currency: { type: 'string' },
              period_start: { type: 'string' },
              period_end: { type: 'string' },
              payment_method: { type: 'string' },
              last_four: { type: 'string' },
              invoice_number: { type: 'string' },
              transaction_id: { type: 'string' }
            },
            required: ['amount', 'currency', 'period_start', 'period_end']
          },
          actions: {
            type: 'object',
            properties: {
              invoice_url: { type: 'string' },
              manage_subscription_url: { type: 'string' },
              contact_support_url: { type: 'string' },
              invoices_url: { type: 'string' }
            },
            required: ['invoice_url']
          }
        },
        required: ['user', 'company', 'subscription', 'billing', 'actions']
      },
      jsonStructure: generateBaseLocaleWithContent()
    };

    // Create the template
    console.log('📝 Creating base template...');
    const template = await prisma.template.create({
      data: {
        key: templateData.key,
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        variableSchema: templateData.variableSchema,
        jsonStructure: templateData.jsonStructure
      }
    });

    console.log(`✅ Template created: ${template.key}`);

    // Create base template locale (__base__) - this will serve as English with full content
    console.log('🌐 Creating base template locale (serves as English with full content)...');
    const baseLocaleWithContent = generateBaseLocaleWithContent();
    await prisma.templateLocale.create({
      data: {
        templateId: template.id,
        locale: '__base__',
        jsonStructure: baseLocaleWithContent
      }
    });

    // Create Greek locale
    await addGreekLocale(template.id);

    console.log('🎉 Subscription Renewal Success Template created successfully!');
    console.log('📧 Template Key: subscription-renewal-success');
    console.log('🌍 Locales: __base__ (serves as English), el');

  } catch (error) {
    console.error('❌ Error creating template:', error);
    throw error;
  }
}

async function addGreekLocale(templateId: string): Promise<void> {
  console.log('🇬🇷 Adding Greek locale...');
  
  const greekLocale: LocaleData = {
    locale: 'el',
    jsonStructure: {
      header: {
        logo_url: '{{company.logo_url}}',
        logo_alt: '{{company.name}}',
        tagline: '{{company.tagline|Ενδυναμώνοντας την επιχείρησή σας}}'
      },
      hero: {
        type: 'icon',
        icon: '✅',
        icon_size: '48px'
      },
      title: {
        text: 'Η Συνδρομή Ανανεώθηκε Επιτυχώς',
        size: '28px',
        weight: '700',
        color: '#059669',
        align: 'center'
      },
      body: {
        intro: 'Γεια σας {{user.name}},',
        paragraphs: [
          'Εξαιρετικά νέα! Η συνδρομή {{subscription.plan_name}} σας ανανεώθηκε επιτυχώς.',
          'Η πληρωμή σας των {{billing.amount}} {{billing.currency}} επεξεργάστηκε και η υπηρεσία σας θα συνεχιστεί χωρίς διακοπές.',
          'Η νέα περίοδος χρέωσής σας διαρκεί από {{billing.period_start}} έως {{billing.period_end}}.',
          'Σας ευχαριστούμε για τη συνεχή εμπιστοσύνη σας στην {{company.name}}. Είμαστε ενθουσιασμένοι να συνεχίσουμε να υποστηρίζουμε την ανάπτυξη της επιχείρησής σας.'
        ],
        note: 'Μπορείτε να αποκτήσετε πρόσβαση στο τιμολόγιό σας και στο ιστορικό χρέωσής σας ανά πάσα στιγμή μέσω του ταμπλό σας.',
        font_size: '16px',
        line_height: '26px'
      },
      snapshot: {
        title: 'Λεπτομέρειες Ανανέωσης',
        facts: [
          { label: 'Πρόγραμμα', value: '{{subscription.plan_name}}' },
          { label: 'Ποσό Χρέωσης', value: '{{billing.amount}} {{billing.currency}}' },
          { label: 'Μέθοδος Πληρωμής', value: '{{billing.payment_method}} που τελειώνει σε {{billing.last_four}}' },
          { label: 'Περίοδος Χρέωσης', value: '{{billing.period_start}} έως {{billing.period_end}}' },
          { label: 'Αριθμός Τιμολογίου', value: '{{billing.invoice_number}}' },
          { label: 'Αναγνωριστικό Συναλλαγής', value: '{{billing.transaction_id}}' }
        ],
        style: 'table'
      },
      visual: {
        type: 'progress',
        progress_bars: [
          {
            label: 'Κατάσταση Συνδρομής',
            current: 'Ενεργή',
            max: 'Ενεργή',
            unit: '',
            percentage: '100',
            color: '#059669',
            description: 'Η συνδρομή σας είναι ενεργή και θα συνεχιστεί χωρίς διακοπές'
          }
        ]
      },
      actions: {
        primary: {
          label: 'Προβολή Τιμολογίου',
          url: '{{actions.invoice_url}}',
          style: 'button',
          color: '#059669',
          text_color: '#ffffff'
        },
        secondary: {
          label: 'Διαχείριση Συνδρομής',
          url: '{{actions.manage_subscription_url}}',
          style: 'link',
          color: '#6b7280'
        }
      },
      support: {
        title: 'Χρειάζεστε βοήθεια;',
        links: [
          { label: 'Συχνές Ερωτήσεις Χρέωσης', url: '{{company.website}}/billing-faq' },
          { label: 'Επικοινωνία με Υποστήριξη', url: '{{actions.contact_support_url}}' },
          { label: 'Προβολή Όλων των Τιμολογίων', url: '{{actions.invoices_url}}' }
        ]
      },
      footer: {
        tagline: 'Ενδυναμώνοντας την επιχείρησή σας',
        social_links: [
          { platform: 'twitter', url: 'https://twitter.com/waymore' },
          { platform: 'linkedin', url: 'https://linkedin.com/company/waymore' }
        ],
        legal_links: [
          { label: 'Πολιτική Απορρήτου', url: '{{company.website}}/privacy' },
          { label: 'Όροι Υπηρεσίας', url: '{{company.website}}/terms' }
        ],
        copyright: '© 2025 {{company.name}}. Όλα τα δικαιώματα διατηρούνται.'
      }
    }
  };

  await prisma.templateLocale.create({
    data: {
      templateId: templateId,
      locale: greekLocale.locale,
      jsonStructure: greekLocale.jsonStructure
    }
  });

  console.log('✅ Greek locale added');
}

// Run the script
async function main() {
  try {
    await createRenewalSuccessTemplate();
    console.log('🎉 Script completed successfully');
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

export { createRenewalSuccessTemplate };
