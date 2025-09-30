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
      icon: '📉',
      icon_size: '48px'
    },
    title: {
      text: 'Plan Downgrade Confirmed',
      size: '28px',
      weight: '700',
      color: '#6b7280',
      align: 'center'
    },
    body: {
      intro: 'Hi {{user.name}},',
      paragraphs: [
        'Your subscription has been successfully changed from {{downgrade.old_plan}} to {{downgrade.new_plan}}.',
        'The downgrade will take effect on {{downgrade.effective_date}}, and you\'ll see the reduced cost reflected in your next billing cycle.',
        'Please note that some features and higher limits from your previous plan will no longer be available after the effective date.',
        'We understand that business needs change, and we\'re here to help you optimize your Waymore experience within your new plan limits.'
      ],
      note: 'You can view your new plan details and current usage anytime through your account dashboard.',
      font_size: '16px',
      line_height: '26px'
    },
    snapshot: {
      title: 'Downgrade Details',
      facts: [
        { label: 'Previous Plan', value: '{{downgrade.old_plan}}' },
        { label: 'New Plan', value: '{{downgrade.new_plan}}' },
        { label: 'Effective Date', value: '{{downgrade.effective_date}}' },
        { label: 'Cost Savings', value: '{{billing.savings_amount}} {{billing.currency}} per {{billing.billing_cycle}}' },
        { label: 'Next Invoice Date', value: '{{billing.next_invoice_date}}' },
        { label: 'Downgrade Type', value: '{{downgrade.downgrade_type}}' }
      ],
      style: 'table'
    },
    visual: {
      type: 'progress',
      progress_bars: [
        {
          label: 'New Plan Status',
          current: 'Scheduled',
          max: 'Active',
          unit: '',
          percentage: '0',
          color: '#6b7280',
          description: 'Downgrade scheduled for {{downgrade.effective_date}}'
        }
      ]
    },
    limitations: {
      title: 'New Plan Limits & Features',
      items: [
        {
          category: '{{limitations.category_1}}',
          items: [
            '{{limitations.item_1}}',
            '{{limitations.item_2}}',
            '{{limitations.item_3}}'
          ]
        },
        {
          category: '{{limitations.category_2}}',
          items: [
            '{{limitations.item_4}}',
            '{{limitations.item_5}}',
            '{{limitations.item_6}}'
          ]
        }
      ]
    },
    actions: {
      primary: {
        label: 'View New Plan Details',
        url: '{{actions.plan_details_url}}',
        style: 'button',
        color: '#6b7280',
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
      title: 'Need help adjusting to your new plan?',
      links: [
        { label: 'Plan Comparison Guide', url: '{{company.website}}/plans' },
        { label: 'Usage Optimization Tips', url: '{{company.website}}/usage-tips' },
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

async function createDowngradeConfirmationTemplate() {
  try {
    console.log('🚀 Creating Subscription Downgrade Confirmation Template...');

    // Template data with comprehensive variable schema
    const templateData: TemplateData = {
      key: 'subscription-downgrade-confirmation',
      name: 'Subscription Downgrade Confirmation',
      description: 'Confirms successful plan downgrade with new limits, effective date, and billing impact',
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
          downgrade: {
            type: 'object',
            properties: {
              old_plan: { type: 'string' },
              new_plan: { type: 'string' },
              effective_date: { type: 'string' },
              downgrade_type: { type: 'string' }
            },
            required: ['old_plan', 'new_plan', 'effective_date']
          },
          billing: {
            type: 'object',
            properties: {
              savings_amount: { type: 'string' },
              currency: { type: 'string' },
              next_invoice_date: { type: 'string' },
              billing_cycle: { type: 'string' }
            },
            required: ['savings_amount', 'currency', 'next_invoice_date']
          },
          limitations: {
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
        required: ['user', 'company', 'downgrade', 'billing', 'limitations', 'actions']
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

    console.log('🎉 Subscription Downgrade Confirmation Template created successfully!');
    console.log('📧 Template Key: subscription-downgrade-confirmation');
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
        icon: '📉',
        icon_size: '48px'
      },
      title: {
        text: 'Η Κατάβαση Προγράμματος Επιβεβαιώθηκε',
        size: '28px',
        weight: '700',
        color: '#6b7280',
        align: 'center'
      },
      body: {
        intro: 'Γεια σας {{user.name}},',
        paragraphs: [
          'Η συνδρομή σας άλλαξε επιτυχώς από {{downgrade.old_plan}} σε {{downgrade.new_plan}}.',
          'Η κατάβαση θα τεθεί σε ισχύ στις {{downgrade.effective_date}}, και θα δείτε τη μειωμένη χρέωση στον επόμενο κύκλο χρέωσής σας.',
          'Παρακαλώ σημειώστε ότι ορισμένες λειτουργίες και υψηλότερα όρια από το προηγούμενο πρόγραμμά σας δεν θα είναι πλέον διαθέσιμα μετά την ημερομηνία ισχύος.',
          'Καταλαβαίνουμε ότι οι επιχειρηματικές ανάγκες αλλάζουν, και είμαστε εδώ για να σας βοηθήσουμε να βελτιστοποιήσετε την εμπειρία σας στο Waymore στα όρια του νέου προγράμματός σας.'
        ],
        note: 'Μπορείτε να δείτε τις λεπτομέρειες του νέου προγράμματός σας και την τρέχουσα χρήση ανά πάσα στιγμή μέσω του ταμπλό σας.',
        font_size: '16px',
        line_height: '26px'
      },
      snapshot: {
        title: 'Λεπτομέρειες Κατάβασης',
        facts: [
          { label: 'Προηγούμενο Πρόγραμμα', value: '{{downgrade.old_plan}}' },
          { label: 'Νέο Πρόγραμμα', value: '{{downgrade.new_plan}}' },
          { label: 'Ημερομηνία Ισχύος', value: '{{downgrade.effective_date}}' },
          { label: 'Οικονομία Κόστους', value: '{{billing.savings_amount}} {{billing.currency}} ανά {{billing.billing_cycle}}' },
          { label: 'Ημερομηνία Επόμενου Τιμολογίου', value: '{{billing.next_invoice_date}}' },
          { label: 'Τύπος Κατάβασης', value: '{{downgrade.downgrade_type}}' }
        ],
        style: 'table'
      },
      visual: {
        type: 'progress',
        progress_bars: [
          {
            label: 'Κατάσταση Νέου Προγράμματος',
            current: 'Προγραμματισμένο',
            max: 'Ενεργό',
            unit: '',
            percentage: '0',
            color: '#6b7280',
            description: 'Η κατάβαση προγραμματίστηκε για {{downgrade.effective_date}}'
          }
        ]
      },
      limitations: {
        title: 'Νέα Όρια & Λειτουργίες Προγράμματος',
        items: [
          {
            category: '{{limitations.category_1}}',
            items: [
              '{{limitations.item_1}}',
              '{{limitations.item_2}}',
              '{{limitations.item_3}}'
            ]
          },
          {
            category: '{{limitations.category_2}}',
            items: [
              '{{limitations.item_4}}',
              '{{limitations.item_5}}',
              '{{limitations.item_6}}'
            ]
          }
        ]
      },
      actions: {
        primary: {
          label: 'Προβολή Λεπτομερειών Νέου Προγράμματος',
          url: '{{actions.plan_details_url}}',
          style: 'button',
          color: '#6b7280',
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
        title: 'Χρειάζεστε βοήθεια για προσαρμογή στο νέο σας πρόγραμμα;',
        links: [
          { label: 'Οδηγός Σύγκρισης Προγραμμάτων', url: '{{company.website}}/plans' },
          { label: 'Συμβουλές Βελτιστοποίησης Χρήσης', url: '{{company.website}}/usage-tips' },
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
    await createDowngradeConfirmationTemplate();
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

export { createDowngradeConfirmationTemplate };
