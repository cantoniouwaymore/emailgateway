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
      icon: '🚫',
      icon_size: '48px'
    },
    title: {
      text: 'Usage Limit Reached - Action Required',
      size: '28px',
      weight: '700',
      color: '#dc2626',
      align: 'center'
    },
    body: {
      intro: 'Hi {{user.name}},',
      paragraphs: [
        'You\'ve reached 100% of your {{usage.metric_name}} limit for your {{subscription.plan_name}} subscription.',
        'You\'ve used all {{usage.limit}} {{usage.metric_name}} this {{subscription.billing_cycle}}, and no further usage is possible until you upgrade your plan.',
        'This means certain actions may be blocked (such as importing new contacts or tracking additional events) until you increase your limits.',
        'To continue working without disruption, please upgrade your plan immediately.'
      ],
      note: 'Don\'t worry - your existing data is safe. You just need to upgrade your plan to continue adding new {{usage.metric_name}}.',
      font_size: '16px',
      line_height: '26px'
    },
    snapshot: {
      title: 'Usage Details',
      facts: [
        { label: 'Current Plan', value: '{{subscription.plan_name}}' },
        { label: 'Metric', value: '{{usage.metric_name}}' },
        { label: 'Used', value: '{{usage.current_usage}} / {{usage.limit}}' },
        { label: 'Remaining', value: '0 {{usage.metric_name}}' },
        { label: 'Usage Percentage', value: '100%' },
        { label: 'Status', value: 'Limit Reached' }
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
          percentage: '100',
          color: '#dc2626',
          description: '100% of your {{usage.metric_name}} limit has been reached'
        }
      ]
    },
    actions: {
      primary: {
        label: 'Upgrade Plan Now',
        url: '{{actions.upgrade_url}}',
        style: 'button',
        color: '#dc2626',
        text_color: '#ffffff'
      },
      secondary: {
        label: 'View Usage Details',
        url: '{{actions.usage_details_url}}',
        style: 'link',
        color: '#6b7280'
      }
    },
    support: {
      title: 'Need immediate help?',
      links: [
        { label: 'Usage Limits FAQ', url: '{{company.website}}/usage-limits-faq' },
        { label: 'Contact Support', url: '{{actions.contact_support_url}}' },
        { label: 'Upgrade Now', url: '{{actions.upgrade_url}}' }
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

async function createHardLimitTemplate() {
  try {
    console.log('🚀 Creating Hard Limit Reached Template...');

    // Template data with comprehensive variable schema
    const templateData: TemplateData = {
      key: 'hard-limit-reached-100pct',
      name: 'Hard Limit Reached - 100% Usage',
      description: 'Notifies users when they reach 100% of their subscription usage limit and actions are blocked',
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
              percentage: { type: 'number' },
              limit_reached_at: { type: 'string' }
            },
            required: ['metric_name', 'current_usage', 'limit', 'percentage']
          },
          actions: {
            type: 'object',
            properties: {
              upgrade_url: { type: 'string' },
              usage_details_url: { type: 'string' },
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

    console.log('🎉 Hard Limit Reached Template created successfully!');
    console.log('📧 Template Key: hard-limit-reached-100pct');
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
        icon: '🚫',
        icon_size: '48px'
      },
      title: {
        text: 'Έφτασε το Όριο Χρήσης - Απαιτείται Δράση',
        size: '28px',
        weight: '700',
        color: '#dc2626',
        align: 'center'
      },
      body: {
        intro: 'Γεια σας {{user.name}},',
        paragraphs: [
          'Έχετε φτάσει στο 100% του ορίου {{usage.metric_name}} για τη συνδρομή {{subscription.plan_name}} σας.',
          'Έχετε χρησιμοποιήσει όλα τα {{usage.limit}} {{usage.metric_name}} αυτόν τον {{subscription.billing_cycle}}, και δεν είναι δυνατή περαιτέρω χρήση μέχρι να αναβαθμίσετε το πρόγραμμά σας.',
          'Αυτό σημαίνει ότι ορισμένες ενέργειες μπορεί να αποκλειστούν (όπως η εισαγωγή νέων επαφών ή η παρακολούθηση επιπλέον events) μέχρι να αυξήσετε τα όριά σας.',
          'Για να συνεχίσετε να εργάζεστε χωρίς διακοπές, παρακαλώ αναβαθμίστε το πρόγραμμά σας αμέσως.'
        ],
        note: 'Μην ανησυχείτε - τα υπάρχοντα δεδομένα σας είναι ασφαλή. Απλά χρειάζεται να αναβαθμίσετε το πρόγραμμά σας για να συνεχίσετε να προσθέτετε νέα {{usage.metric_name}}.',
        font_size: '16px',
        line_height: '26px'
      },
      snapshot: {
        title: 'Λεπτομέρειες Χρήσης',
        facts: [
          { label: 'Τρέχον Πρόγραμμα', value: '{{subscription.plan_name}}' },
          { label: 'Μετρικό', value: '{{usage.metric_name}}' },
          { label: 'Χρησιμοποιημένο', value: '{{usage.current_usage}} / {{usage.limit}}' },
          { label: 'Υπόλοιπο', value: '0 {{usage.metric_name}}' },
          { label: 'Ποσοστό Χρήσης', value: '100%' },
          { label: 'Κατάσταση', value: 'Όριο Έφτασε' }
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
            percentage: '100',
            color: '#dc2626',
            description: 'Το 100% του ορίου {{usage.metric_name}} σας έχει φτάσει'
          }
        ]
      },
      actions: {
        primary: {
          label: 'Αναβάθμιση Προγράμματος Τώρα',
          url: '{{actions.upgrade_url}}',
          style: 'button',
          color: '#dc2626',
          text_color: '#ffffff'
        },
        secondary: {
          label: 'Προβολή Λεπτομερειών Χρήσης',
          url: '{{actions.usage_details_url}}',
          style: 'link',
          color: '#6b7280'
        }
      },
      support: {
        title: 'Χρειάζεστε άμεση βοήθεια;',
        links: [
          { label: 'Συχνές Ερωτήσεις Ορίων Χρήσης', url: '{{company.website}}/usage-limits-faq' },
          { label: 'Επικοινωνία με Υποστήριξη', url: '{{actions.contact_support_url}}' },
          { label: 'Αναβάθμιση Τώρα', url: '{{actions.upgrade_url}}' }
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
    await createHardLimitTemplate();
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

export { createHardLimitTemplate };
