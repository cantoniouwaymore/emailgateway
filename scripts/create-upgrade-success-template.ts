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
      icon: '🚀',
      icon_size: '48px'
    },
    title: {
      text: 'Plan Upgrade Successful',
      size: '28px',
      weight: '700',
      color: '#059669',
      align: 'center'
    },
    body: {
      intro: 'Hi {{user.name}},',
      paragraphs: [
        'Congratulations! Your subscription has been successfully upgraded from {{upgrade.old_plan}} to {{upgrade.new_plan}}.',
        'Your new plan is now active and you have immediate access to all the enhanced features and higher limits.',
        'The upgrade took effect on {{upgrade.effective_date}} and will be reflected in your next billing cycle.',
        'Thank you for upgrading! We\'re excited to help you scale your business with these powerful new capabilities.'
      ],
      note: 'You can view your new plan details and manage your subscription anytime through your account dashboard.',
      font_size: '16px',
      line_height: '26px'
    },
    snapshot: {
      title: 'Upgrade Details',
      facts: [
        { label: 'Previous Plan', value: '{{upgrade.old_plan}}' },
        { label: 'New Plan', value: '{{upgrade.new_plan}}' },
        { label: 'Effective Date', value: '{{upgrade.effective_date}}' },
        { label: 'Prorated Charge', value: '{{billing.prorated_amount}} {{billing.currency}}' },
        { label: 'Next Invoice Date', value: '{{billing.next_invoice_date}}' },
        { label: 'Upgrade Type', value: '{{upgrade.upgrade_type}}' }
      ],
      style: 'table'
    },
    visual: {
      type: 'progress',
      progress_bars: [
        {
          label: 'New Plan Status',
          current: 'Active',
          max: 'Active',
          unit: '',
          percentage: '100',
          color: '#059669',
          description: 'Your {{upgrade.new_plan}} plan is now active with all features unlocked'
        }
      ]
    },
    features: {
      title: 'New Features & Limits',
      items: [
        {
          category: '{{features.category_1}}',
          items: [
            '{{features.item_1}}',
            '{{features.item_2}}',
            '{{features.item_3}}'
          ]
        },
        {
          category: '{{features.category_2}}',
          items: [
            '{{features.item_4}}',
            '{{features.item_5}}',
            '{{features.item_6}}'
          ]
        }
      ]
    },
    actions: {
      primary: {
        label: 'View New Plan Details',
        url: '{{actions.plan_details_url}}',
        style: 'button',
        color: '#059669',
        text_color: '#ffffff'
      },
      secondary: {
        label: 'Manage Billing',
        url: '{{actions.billing_url}}',
        style: 'link',
        color: '#6b7280'
      }
    },
    support: {
      title: 'Need help with your new plan?',
      links: [
        { label: 'Plan Comparison Guide', url: '{{company.website}}/plans' },
        { label: 'Feature Documentation', url: '{{company.website}}/features' },
        { label: 'Contact Support', url: '{{actions.contact_support_url}}' },
        { label: 'View Billing Details', url: '{{actions.billing_url}}' }
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

async function createUpgradeSuccessTemplate() {
  try {
    console.log('🚀 Creating Subscription Upgrade Success Template...');

    // Template data with comprehensive variable schema
    const templateData: TemplateData = {
      key: 'subscription-upgrade-success',
      name: 'Subscription Upgrade Success Confirmation',
      description: 'Confirms successful plan upgrade with new features, limits, and billing details',
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
          upgrade: {
            type: 'object',
            properties: {
              old_plan: { type: 'string' },
              new_plan: { type: 'string' },
              effective_date: { type: 'string' },
              upgrade_type: { type: 'string' }
            },
            required: ['old_plan', 'new_plan', 'effective_date']
          },
          billing: {
            type: 'object',
            properties: {
              prorated_amount: { type: 'string' },
              currency: { type: 'string' },
              next_invoice_date: { type: 'string' },
              billing_cycle: { type: 'string' }
            },
            required: ['prorated_amount', 'currency', 'next_invoice_date']
          },
          features: {
            type: 'object',
            properties: {
              category_1: { type: 'string' },
              category_2: { type: 'string' },
              item_1: { type: 'string' },
              item_2: { type: 'string' },
              item_3: { type: 'string' },
              item_4: { type: 'string' },
              item_5: { type: 'string' },
              item_6: { type: 'string' }
            },
            required: ['category_1', 'category_2', 'item_1', 'item_2', 'item_3', 'item_4', 'item_5', 'item_6']
          },
          actions: {
            type: 'object',
            properties: {
              plan_details_url: { type: 'string' },
              billing_url: { type: 'string' },
              contact_support_url: { type: 'string' }
            },
            required: ['plan_details_url', 'billing_url']
          }
        },
        required: ['user', 'company', 'upgrade', 'billing', 'features', 'actions']
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

    console.log('🎉 Subscription Upgrade Success Template created successfully!');
    console.log('📧 Template Key: subscription-upgrade-success');
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
        icon: '🚀',
        icon_size: '48px'
      },
      title: {
        text: 'Η Αναβάθμιση Προγράμματος Επιτυχής',
        size: '28px',
        weight: '700',
        color: '#059669',
        align: 'center'
      },
      body: {
        intro: 'Γεια σας {{user.name}},',
        paragraphs: [
          'Συγχαρητήρια! Η συνδρομή σας αναβαθμίστηκε επιτυχώς από {{upgrade.old_plan}} σε {{upgrade.new_plan}}.',
          'Το νέο σας πρόγραμμα είναι τώρα ενεργό και έχετε άμεση πρόσβαση σε όλες τις βελτιωμένες λειτουργίες και υψηλότερα όρια.',
          'Η αναβάθμιση τέθηκε σε ισχύ στις {{upgrade.effective_date}} και θα αντικατοπτριστεί στον επόμενο κύκλο χρέωσής σας.',
          'Σας ευχαριστούμε για την αναβάθμιση! Είμαστε ενθουσιασμένοι να σας βοηθήσουμε να κλιμακωθεί η επιχείρησή σας με αυτές τις ισχυρές νέες δυνατότητες.'
        ],
        note: 'Μπορείτε να δείτε τις λεπτομέρειες του νέου προγράμματός σας και να διαχειριστείτε τη συνδρομή σας ανά πάσα στιγμή μέσω του ταμπλό σας.',
        font_size: '16px',
        line_height: '26px'
      },
      snapshot: {
        title: 'Λεπτομέρειες Αναβάθμισης',
        facts: [
          { label: 'Προηγούμενο Πρόγραμμα', value: '{{upgrade.old_plan}}' },
          { label: 'Νέο Πρόγραμμα', value: '{{upgrade.new_plan}}' },
          { label: 'Ημερομηνία Ισχύος', value: '{{upgrade.effective_date}}' },
          { label: 'Αναλογική Χρέωση', value: '{{billing.prorated_amount}} {{billing.currency}}' },
          { label: 'Ημερομηνία Επόμενου Τιμολογίου', value: '{{billing.next_invoice_date}}' },
          { label: 'Τύπος Αναβάθμισης', value: '{{upgrade.upgrade_type}}' }
        ],
        style: 'table'
      },
      visual: {
        type: 'progress',
        progress_bars: [
          {
            label: 'Κατάσταση Νέου Προγράμματος',
            current: 'Ενεργό',
            max: 'Ενεργό',
            unit: '',
            percentage: '100',
            color: '#059669',
            description: 'Το πρόγραμμα {{upgrade.new_plan}} σας είναι τώρα ενεργό με όλες τις λειτουργίες ξεκλειδωμένες'
          }
        ]
      },
      features: {
        title: 'Νέες Λειτουργίες & Όρια',
        items: [
          {
            category: '{{features.category_1}}',
            items: [
              '{{features.item_1}}',
              '{{features.item_2}}',
              '{{features.item_3}}'
            ]
          },
          {
            category: '{{features.category_2}}',
            items: [
              '{{features.item_4}}',
              '{{features.item_5}}',
              '{{features.item_6}}'
            ]
          }
        ]
      },
      actions: {
        primary: {
          label: 'Προβολή Λεπτομερειών Νέου Προγράμματος',
          url: '{{actions.plan_details_url}}',
          style: 'button',
          color: '#059669',
          text_color: '#ffffff'
        },
        secondary: {
          label: 'Διαχείριση Χρέωσης',
          url: '{{actions.billing_url}}',
          style: 'link',
          color: '#6b7280'
        }
      },
      support: {
        title: 'Χρειάζεστε βοήθεια με το νέο σας πρόγραμμα;',
        links: [
          { label: 'Οδηγός Σύγκρισης Προγραμμάτων', url: '{{company.website}}/plans' },
          { label: 'Τεκμηρίωση Λειτουργιών', url: '{{company.website}}/features' },
          { label: 'Επικοινωνία με Υποστήριξη', url: '{{actions.contact_support_url}}' },
          { label: 'Προβολή Λεπτομερειών Χρέωσης', url: '{{actions.billing_url}}' }
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
    await createUpgradeSuccessTemplate();
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

export { createUpgradeSuccessTemplate };
