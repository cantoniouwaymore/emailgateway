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
      icon: '⏰',
      icon_size: '48px'
    },
    title: {
      text: 'Subscription Renewal Reminder',
      size: '28px',
      weight: '700',
      color: '#2563eb',
      align: 'center'
    },
    body: {
      intro: 'Hi {{user.name}},',
      paragraphs: [
        'Your {{subscription.plan_name}} subscription will expire in {{subscription.days_until_expiry}} days on {{subscription.renewal_date}}.',
        'To ensure uninterrupted service, please review your billing information and confirm your renewal.',
        'You can manage your subscription, update payment methods, or upgrade your plan at any time.',
        'Don\'t worry - we\'ll send you another reminder closer to your renewal date if needed.'
      ],
      note: 'We want to make sure you don\'t experience any service interruption. Please take a moment to confirm your subscription renewal.',
      font_size: '16px',
      line_height: '26px'
    },
    snapshot: {
      title: 'Subscription Details',
      facts: [
        { label: 'Current Plan', value: '{{subscription.plan_name}}' },
        { label: 'Renewal Date', value: '{{subscription.renewal_date}}' },
        { label: 'Days Until Expiry', value: '{{subscription.days_until_expiry}} days' },
        { label: 'Billing Cycle', value: '{{subscription.billing_cycle}}' },
        { label: 'Next Invoice', value: '{{subscription.next_amount}} {{subscription.currency}}' },
        { label: 'Auto-Renewal', value: '{{subscription.auto_renewal|Enabled}}' }
      ],
      style: 'table'
    },
    visual: {
      type: 'progress',
      progress_bars: [
        {
          label: 'Days Until Renewal',
          current: '{{subscription.days_until_expiry}}',
          max: '7',
          unit: 'days',
          percentage: '{{subscription.urgency_percentage}}',
          color: '#2563eb',
          description: '{{subscription.days_until_expiry}} days until your subscription expires'
        }
      ]
    },
    actions: {
      primary: {
        label: 'Manage Subscription',
        url: '{{actions.manage_subscription_url}}',
        style: 'button',
        color: '#2563eb',
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
        { label: 'Renewal FAQ', url: '{{company.website}}/renewal-faq' },
        { label: 'Contact Support', url: '{{actions.contact_support_url}}' },
        { label: 'Manage Subscription', url: '{{actions.manage_subscription_url}}' }
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

async function createRenewalReminderTemplate() {
  try {
    console.log('🚀 Creating Subscription Renewal Reminder Template...');

    // Template data with comprehensive variable schema
    const templateData: TemplateData = {
      key: 'subscription-renewal-reminder-7d',
      name: 'Subscription Renewal Reminder - 7 Days',
      description: 'Reminds users 7 days before subscription expiry to take action for uninterrupted service',
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
              renewal_date: { type: 'string' },
              days_until_expiry: { type: 'number' },
              billing_cycle: { type: 'string' },
              next_amount: { type: 'string' },
              currency: { type: 'string' },
              auto_renewal: { type: 'string' },
              urgency_percentage: { type: 'number' }
            },
            required: ['plan_name', 'renewal_date', 'days_until_expiry', 'billing_cycle', 'next_amount', 'currency']
          },
          actions: {
            type: 'object',
            properties: {
              manage_subscription_url: { type: 'string' },
              billing_portal_url: { type: 'string' },
              contact_support_url: { type: 'string' }
            },
            required: ['manage_subscription_url']
          }
        },
        required: ['user', 'company', 'subscription', 'actions']
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

    console.log('🎉 Subscription Renewal Reminder Template created successfully!');
    console.log('📧 Template Key: subscription-renewal-reminder-7d');
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
        icon: '⏰',
        icon_size: '48px'
      },
      title: {
        text: 'Υπενθύμιση Ανανέωσης Συνδρομής',
        size: '28px',
        weight: '700',
        color: '#2563eb',
        align: 'center'
      },
      body: {
        intro: 'Γεια σας {{user.name}},',
        paragraphs: [
          'Η συνδρομή σας {{subscription.plan_name}} θα λήξει σε {{subscription.days_until_expiry}} ημέρες στις {{subscription.renewal_date}}.',
          'Για να διασφαλίσετε αδιάκοπη υπηρεσία, παρακαλώ ελέγξτε τις πληροφορίες χρέωσής σας και επιβεβαιώστε την ανανέωσή σας.',
          'Μπορείτε να διαχειριστείτε τη συνδρομή σας, να ενημερώσετε μεθόδους πληρωμής ή να αναβαθμίσετε το πρόγραμμά σας ανά πάσα στιγμή.',
          'Μην ανησυχείτε - θα σας στείλουμε μια άλλη υπενθύμιση πιο κοντά στην ημερομηνία ανανέωσής σας εάν χρειαστεί.'
        ],
        note: 'Θέλουμε να διασφαλίσουμε ότι δεν θα βιώσετε καμία διακοπή υπηρεσίας. Παρακαλώ αφιερώστε μια στιγμή για να επιβεβαιώσετε την ανανέωση της συνδρομής σας.',
        font_size: '16px',
        line_height: '26px'
      },
      snapshot: {
        title: 'Λεπτομέρειες Συνδρομής',
        facts: [
          { label: 'Τρέχον Πρόγραμμα', value: '{{subscription.plan_name}}' },
          { label: 'Ημερομηνία Ανανέωσης', value: '{{subscription.renewal_date}}' },
          { label: 'Ημέρες Μέχρι τη Λήξη', value: '{{subscription.days_until_expiry}} ημέρες' },
          { label: 'Κύκλος Χρέωσης', value: '{{subscription.billing_cycle}}' },
          { label: 'Επόμενος Λογαριασμός', value: '{{subscription.next_amount}} {{subscription.currency}}' },
          { label: 'Αυτόματη Ανανέωση', value: '{{subscription.auto_renewal|Ενεργοποιημένη}}' }
        ],
        style: 'table'
      },
      visual: {
        type: 'progress',
        progress_bars: [
          {
            label: 'Ημέρες Μέχρι την Ανανέωση',
            current: '{{subscription.days_until_expiry}}',
            max: '7',
            unit: 'ημέρες',
            percentage: '{{subscription.urgency_percentage}}',
            color: '#2563eb',
            description: '{{subscription.days_until_expiry}} ημέρες μέχρι τη λήξη της συνδρομής σας'
          }
        ]
      },
      actions: {
        primary: {
          label: 'Διαχείριση Συνδρομής',
          url: '{{actions.manage_subscription_url}}',
          style: 'button',
          color: '#2563eb',
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
          { label: 'Συχνές Ερωτήσεις Ανανέωσης', url: '{{company.website}}/renewal-faq' },
          { label: 'Επικοινωνία με Υποστήριξη', url: '{{actions.contact_support_url}}' },
          { label: 'Διαχείριση Συνδρομής', url: '{{actions.manage_subscription_url}}' }
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
    await createRenewalReminderTemplate();
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

export { createRenewalReminderTemplate };
