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
      icon: '⚠️',
      icon_size: '48px'
    },
    title: {
      text: 'Usage Limit Warning - 80% Reached',
      size: '28px',
      weight: '700',
      color: '#f59e0b',
      align: 'center'
    },
    body: {
      intro: 'Hi {{user.name}},',
      paragraphs: [
        'You\'ve reached 80% of your {{usage.metric_name}} limit for your {{subscription.plan_name}} subscription.',
        'You\'ve used {{usage.current_usage}} of {{usage.limit}} {{usage.metric_name}} this {{subscription.billing_cycle}}.',
        'To avoid service interruption when you reach 100%, we recommend upgrading your plan or adjusting your usage.',
        'Don\'t worry - you still have {{usage.remaining}} {{usage.metric_name}} available until your next billing cycle.'
      ],
      note: 'This is a friendly warning to help you stay ahead of your usage limits. Consider upgrading your plan to avoid any interruptions.',
      font_size: '16px',
      line_height: '26px'
    },
    snapshot: {
      title: 'Usage Details',
      facts: [
        { label: 'Current Plan', value: '{{subscription.plan_name}}' },
        { label: 'Metric', value: '{{usage.metric_name}}' },
        { label: 'Used', value: '{{usage.current_usage}} / {{usage.limit}}' },
        { label: 'Remaining', value: '{{usage.remaining}} {{usage.metric_name}}' },
        { label: 'Usage Percentage', value: '{{usage.percentage}}%' },
        { label: 'Billing Cycle', value: '{{subscription.billing_cycle}}' }
      ],
      style: 'table'
    },
    visual: {
      type: 'progress',
      progress_bars: [
        {
          label: '{{usage.metric_name}} Usage',
          current: '{{usage.current_usage}}',
          max: '{{usage.limit}}',
          unit: '{{usage.metric_name}}',
          percentage: '{{usage.percentage}}',
          color: '#f59e0b',
          description: '{{usage.percentage}}% of your {{usage.metric_name}} limit used'
        }
      ]
    },
    actions: {
      primary: {
        label: 'Upgrade Plan',
        url: '{{actions.upgrade_url}}',
        style: 'button',
        color: '#f59e0b',
        text_color: '#ffffff'
      },
      secondary: {
        label: 'Manage Usage',
        url: '{{actions.manage_usage_url}}',
        style: 'link',
        color: '#6b7280'
      }
    },
    support: {
      title: 'Need help?',
      links: [
        { label: 'Usage FAQ', url: '{{company.website}}/usage-faq' },
        { label: 'Contact Support', url: '{{actions.contact_support_url}}' },
        { label: 'View Plans', url: '{{actions.upgrade_url}}' }
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

async function createUsageLimitTemplate() {
  try {
    console.log('🚀 Creating Usage Limit Warning Template...');

    // Template data with comprehensive variable schema
    const templateData: TemplateData = {
      key: 'usage-limit-warning-80pct',
      name: 'Usage Limit Warning - 80% Reached',
      description: 'Notifies users when they reach 80% of their subscription usage limit to encourage proactive action',
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
              current_period_start: { type: 'string' },
              current_period_end: { type: 'string' }
            },
            required: ['plan_name', 'billing_cycle']
          },
          usage: {
            type: 'object',
            properties: {
              metric_name: { type: 'string' },
              current_usage: { type: 'number' },
              limit: { type: 'number' },
              remaining: { type: 'number' },
              percentage: { type: 'number' },
              warning_threshold: { type: 'number' }
            },
            required: ['metric_name', 'current_usage', 'limit', 'remaining', 'percentage']
          },
          actions: {
            type: 'object',
            properties: {
              upgrade_url: { type: 'string' },
              manage_usage_url: { type: 'string' },
              contact_support_url: { type: 'string' }
            },
            required: ['upgrade_url']
          }
        },
        required: ['user', 'company', 'subscription', 'usage', 'actions']
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

    console.log('🎉 Usage Limit Warning Template created successfully!');
    console.log('📧 Template Key: usage-limit-warning-80pct');
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
        icon: '⚠️',
        icon_size: '48px'
      },
      title: {
        text: 'Προειδοποίηση Ορίου Χρήσης - 80% Έφτασε',
        size: '28px',
        weight: '700',
        color: '#f59e0b',
        align: 'center'
      },
      body: {
        intro: 'Γεια σας {{user.name}},',
        paragraphs: [
          'Έχετε φτάσει στο 80% του ορίου {{usage.metric_name}} για τη συνδρομή {{subscription.plan_name}} σας.',
          'Έχετε χρησιμοποιήσει {{usage.current_usage}} από {{usage.limit}} {{usage.metric_name}} αυτόν τον {{subscription.billing_cycle}}.',
          'Για να αποφύγετε διακοπή υπηρεσίας όταν φτάσετε στο 100%, συνιστούμε να αναβαθμίσετε το πρόγραμμά σας ή να προσαρμόσετε τη χρήση σας.',
          'Μην ανησυχείτε - έχετε ακόμα {{usage.remaining}} {{usage.metric_name}} διαθέσιμα μέχρι τον επόμενο κύκλο χρέωσής σας.'
        ],
        note: 'Αυτή είναι μια φιλική προειδοποίηση για να σας βοηθήσει να παραμείνετε μπροστά από τα όρια χρήσης σας. Εξετάστε την αναβάθμιση του προγράμματός σας για να αποφύγετε οποιεσδήποτε διακοπές.',
        font_size: '16px',
        line_height: '26px'
      },
      snapshot: {
        title: 'Λεπτομέρειες Χρήσης',
        facts: [
          { label: 'Τρέχον Πρόγραμμα', value: '{{subscription.plan_name}}' },
          { label: 'Μετρικό', value: '{{usage.metric_name}}' },
          { label: 'Χρησιμοποιημένο', value: '{{usage.current_usage}} / {{usage.limit}}' },
          { label: 'Υπόλοιπο', value: '{{usage.remaining}} {{usage.metric_name}}' },
          { label: 'Ποσοστό Χρήσης', value: '{{usage.percentage}}%' },
          { label: 'Κύκλος Χρέωσης', value: '{{subscription.billing_cycle}}' }
        ],
        style: 'table'
      },
      visual: {
        type: 'progress',
        progress_bars: [
          {
            label: 'Χρήση {{usage.metric_name}}',
            current: '{{usage.current_usage}}',
            max: '{{usage.limit}}',
            unit: '{{usage.metric_name}}',
            percentage: '{{usage.percentage}}',
            color: '#f59e0b',
            description: '{{usage.percentage}}% του ορίου {{usage.metric_name}} σας χρησιμοποιήθηκε'
          }
        ]
      },
      actions: {
        primary: {
          label: 'Αναβάθμιση Προγράμματος',
          url: '{{actions.upgrade_url}}',
          style: 'button',
          color: '#f59e0b',
          text_color: '#ffffff'
        },
        secondary: {
          label: 'Διαχείριση Χρήσης',
          url: '{{actions.manage_usage_url}}',
          style: 'link',
          color: '#6b7280'
        }
      },
      support: {
        title: 'Χρειάζεστε βοήθεια;',
        links: [
          { label: 'Συχνές Ερωτήσεις Χρήσης', url: '{{company.website}}/usage-faq' },
          { label: 'Επικοινωνία με Υποστήριξη', url: '{{actions.contact_support_url}}' },
          { label: 'Προβολή Προγραμμάτων', url: '{{actions.upgrade_url}}' }
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
    await createUsageLimitTemplate();
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

export { createUsageLimitTemplate };
