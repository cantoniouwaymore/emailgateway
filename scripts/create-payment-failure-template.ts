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
      icon: '💳',
      icon_size: '48px'
    },
    title: {
      text: 'Payment Failed - Action Required',
      size: '28px',
      weight: '700',
      color: '#dc2626',
      align: 'center'
    },
    body: {
      intro: 'Hi {{user.name}},',
      paragraphs: [
        'We were unable to process your payment for your {{payment.plan_name}} subscription.',
        'Your payment of {{payment.amount}} {{payment.currency}} failed due to: {{payment.failure_reason}}',
        'We\'ll automatically retry your payment {{retry.next_attempt}}. You have {{retry.days_until_suspension}} days to resolve this before your subscription is suspended.',
        'To avoid service interruption, please update your payment method now.'
      ],
      note: 'Don\'t worry - we\'ll automatically retry your payment. However, to avoid service interruption, please update your payment method as soon as possible.',
      font_size: '16px',
      line_height: '26px'
    },
    snapshot: {
      title: 'Payment Details',
      facts: [
        { label: 'Plan', value: '{{payment.plan_name}}' },
        { label: 'Amount', value: '{{payment.amount}} {{payment.currency}}' },
        { label: 'Payment Method', value: '{{payment.payment_method}} ending in {{payment.last_four}}' },
        { label: 'Failure Reason', value: '{{payment.failure_reason}}' },
        { label: 'Attempt', value: '{{payment.attempt_number}} of {{retry.max_attempts}}' },
        { label: 'Next Retry', value: '{{retry.next_attempt}}' }
      ],
      style: 'table'
    },
    visual: {
      type: 'progress',
      progress_bars: [
        {
          label: 'Payment Attempts',
          current: '{{payment.attempt_number}}',
          max: '{{retry.max_attempts}}',
          unit: 'attempts',
          percentage: '{{payment.attempt_percentage}}',
          color: '#dc2626',
          description: '{{payment.attempt_number}} of {{retry.max_attempts}} attempts used'
        }
      ]
    },
    actions: {
      primary: {
        label: 'Update Payment Method',
        url: '{{actions.update_payment_url}}',
        style: 'button',
        color: '#dc2626',
        text_color: '#ffffff'
      },
      secondary: {
        label: 'View Billing Portal',
        url: '{{actions.billing_portal_url}}',
        style: 'link',
        color: '#6b7280'
      }
    },
    support: {
      title: 'Need help?',
      links: [
        { label: 'Payment FAQ', url: '{{company.website}}/billing-faq' },
        { label: 'Contact Support', url: '{{actions.contact_support_url}}' },
        { label: 'Update Payment Method', url: '{{actions.update_payment_url}}' }
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

async function createPaymentFailureTemplate() {
  try {
    console.log('🚀 Creating Payment Failure Notification Template...');

    // Template data with comprehensive variable schema
    const templateData: TemplateData = {
      key: 'payment-failure-attempt-1',
      name: 'Payment Failure Notification - First Attempt',
      description: 'Notifies users when their first payment attempt fails, including retry schedule and corrective action guidance',
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
          payment: {
            type: 'object',
            properties: {
              plan_name: { type: 'string' },
              amount: { type: 'string' },
              currency: { type: 'string' },
              failure_reason: { type: 'string' },
              payment_method: { type: 'string' },
              last_four: { type: 'string' },
              attempt_number: { type: 'number' }
            },
            required: ['plan_name', 'amount', 'currency', 'failure_reason', 'attempt_number']
          },
          retry: {
            type: 'object',
            properties: {
              next_attempt: { type: 'string' },
              max_attempts: { type: 'number' },
              days_until_suspension: { type: 'number' }
            },
            required: ['next_attempt', 'max_attempts']
          },
          actions: {
            type: 'object',
            properties: {
              update_payment_url: { type: 'string' },
              billing_portal_url: { type: 'string' },
              contact_support_url: { type: 'string' }
            },
            required: ['update_payment_url']
          }
        },
        required: ['user', 'company', 'payment', 'retry', 'actions']
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

    console.log('🎉 Payment Failure Template created successfully!');
    console.log('📧 Template Key: payment-failure-attempt-1');
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
        icon: '💳',
        icon_size: '48px'
      },
      title: {
        text: 'Αποτυχία Πληρωμής - Απαιτείται Δράση',
        size: '28px',
        weight: '700',
        color: '#dc2626',
        align: 'center'
      },
      body: {
        intro: 'Γεια σας {{user.name}},',
        paragraphs: [
          'Δεν καταφέραμε να επεξεργαστούμε την πληρωμή σας για τη συνδρομή {{payment.plan_name}}.',
          'Η πληρωμή σας των {{payment.amount}} {{payment.currency}} απέτυχε λόγω: {{payment.failure_reason}}',
          'Θα προσπαθήσουμε αυτόματα ξανά την πληρωμή σας {{retry.next_attempt}}. Έχετε {{retry.days_until_suspension}} ημέρες για να λύσετε αυτό το θέμα πριν η συνδρομή σας ανασταλεί.',
          'Για να αποφύγετε διακοπή της υπηρεσίας, παρακαλώ ενημερώστε τη μέθοδο πληρωμής σας τώρα.'
        ],
        note: 'Μην ανησυχείτε - θα προσπαθήσουμε αυτόματα ξανά την πληρωμή σας. Ωστόσο, για να αποφύγετε διακοπή της υπηρεσίας, παρακαλώ ενημερώστε τη μέθοδο πληρωμής σας όσο το δυνατόν συντομότερα.',
        font_size: '16px',
        line_height: '26px'
      },
      snapshot: {
        title: 'Λεπτομέρειες Πληρωμής',
        facts: [
          { label: 'Πλάνο', value: '{{payment.plan_name}}' },
          { label: 'Ποσό', value: '{{payment.amount}} {{payment.currency}}' },
          { label: 'Μέθοδος Πληρωμής', value: '{{payment.payment_method}} που τελειώνει σε {{payment.last_four}}' },
          { label: 'Λόγος Αποτυχίας', value: '{{payment.failure_reason}}' },
          { label: 'Προσπάθεια', value: '{{payment.attempt_number}} από {{retry.max_attempts}}' },
          { label: 'Επόμενη Προσπάθεια', value: '{{retry.next_attempt}}' }
        ],
        style: 'table'
      },
      visual: {
        type: 'progress',
        progress_bars: [
          {
            label: 'Προσπάθειες Πληρωμής',
            current: '{{payment.attempt_number}}',
            max: '{{retry.max_attempts}}',
            unit: 'προσπάθειες',
            percentage: '{{payment.attempt_percentage}}',
            color: '#dc2626',
            description: '{{payment.attempt_number}} από {{retry.max_attempts}} προσπάθειες χρησιμοποιήθηκαν'
          }
        ]
      },
      actions: {
        primary: {
          label: 'Ενημέρωση Μεθόδου Πληρωμής',
          url: '{{actions.update_payment_url}}',
          style: 'button',
          color: '#dc2626',
          text_color: '#ffffff'
        },
        secondary: {
          label: 'Προβολή Πύλης Χρέωσης',
          url: '{{actions.billing_portal_url}}',
          style: 'link',
          color: '#6b7280'
        }
      },
      support: {
        title: 'Χρειάζεστε βοήθεια;',
        links: [
          { label: 'Συχνές Ερωτήσεις Πληρωμών', url: '{{company.website}}/billing-faq' },
          { label: 'Επικοινωνία με Υποστήριξη', url: '{{actions.contact_support_url}}' },
          { label: 'Ενημέρωση Μεθόδου Πληρωμής', url: '{{actions.update_payment_url}}' }
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
if (require.main === module) {
  createPaymentFailureTemplate()
    .then(() => {
      console.log('🎉 Script completed successfully');
      process.exit(0);
    })
    .catch((error: any) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { createPaymentFailureTemplate };