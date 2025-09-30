import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// JWT token for authentication
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LWNsaWVudCIsImlzcyI6ImVtYWlsLWdhdGV3YXkiLCJhdWQiOiJ3YXltb3JlLXBsYXRmb3JtIiwic2NvcGUiOlsiZW1haWxzOnNlbmQiLCJlbWFpbHM6cmVhZCJdLCJleHAiOjE3NTkyNzYzNzAsImlhdCI6MTc1OTI3Mjc3MH0.p0HNmxK2WKol2StRkfwt9JAW_HMjzKuIr-O1Ut2CXec';
const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const RECIPIENT_EMAIL = 'cantoniou@waymore.io';
const RECIPIENT_NAME = 'Antonio';

// Generate appropriate subject based on template details
function generateSubject(templateName: string, templateKey: string, locale: string): string {
  const localeTag = locale === '__base__' ? 'Base' : locale.toUpperCase();
  
  // Clean up template name for better subject
  const cleanName = templateName
    .replace(/Template$/i, '')
    .replace(/Email$/i, '')
    .trim();
  
  return `[${localeTag}] ${cleanName}`;
}

// Generate sample variables based on template key with actual realistic values
function generateSampleVariables(templateKey: string, locale: string, variableSchema: any): any {
  // Common variables used across all templates with actual values
  const commonVars = {
    user: {
      name: 'Antonio Uwaymore',
      first_name: 'Antonio',
      last_name: 'Uwaymore',
      email: 'cantoniou@waymore.io',
      role: 'Platform Administrator',
      workspace_name: 'Waymore Enterprise',
      user_id: 'usr_ant_001'
    },
    company: {
      name: 'Waymore',
      logo_url: 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png',
      website: 'https://waymore.io',
      support_email: 'support@waymore.io',
      address: '123 Business Street, San Francisco, CA 94105',
      phone: '+1 (555) 123-4567'
    }
  };

  // Get current date for realistic timestamps
  const now = new Date();
  const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const pastDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
  
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  // Locale-specific values
  const localeSpecific = locale === 'el' ? {
    userName: 'Αντώνιος Uwaymore',
    workspaceName: 'Waymore Επιχείρηση',
    planName: 'Πλάνο Pro',
    billingCycle: 'Μηνιαίο',
    currency: '€',
    amount: '24,99',
    autoRenewal: 'Ενεργοποιημένη'
  } : locale === 'es' ? {
    userName: 'Antonio Uwaymore',
    workspaceName: 'Waymore Empresa',
    planName: 'Plan Pro',
    billingCycle: 'Mensual',
    currency: '$',
    amount: '29.99',
    autoRenewal: 'Activada'
  } : locale === 'fr' ? {
    userName: 'Antoine Uwaymore',
    workspaceName: 'Waymore Entreprise',
    planName: 'Plan Pro',
    billingCycle: 'Mensuel',
    currency: '€',
    amount: '24,99',
    autoRenewal: 'Activé'
  } : locale === 'de' ? {
    userName: 'Antonio Uwaymore',
    workspaceName: 'Waymore Unternehmen',
    planName: 'Pro-Plan',
    billingCycle: 'Monatlich',
    currency: '€',
    amount: '24,99',
    autoRenewal: 'Aktiviert'
  } : locale === 'it' ? {
    userName: 'Antonio Uwaymore',
    workspaceName: 'Waymore Azienda',
    planName: 'Piano Pro',
    billingCycle: 'Mensile',
    currency: '€',
    amount: '24,99',
    autoRenewal: 'Attivato'
  } : {
    userName: 'Antonio Uwaymore',
    workspaceName: 'Waymore Enterprise',
    planName: 'Pro Plan',
    billingCycle: 'Monthly',
    currency: '$',
    amount: '29.99',
    autoRenewal: 'Enabled'
  };

  // Template-specific variables based on key patterns with complete realistic data
  const templateSpecificVars: Record<string, any> = {
    'forgot-password': {
      ...commonVars,
      user: {
        ...commonVars.user,
        name: localeSpecific.userName,
        first_name: 'Antonio'
      },
      reset: {
        reset_url: 'https://app.waymore.io/auth/reset-password?token=rst_7k9mxpq4w2n8v5c3b1z6h',
        reset_token: 'rst_7k9mxpq4w2n8v5c3b1z6h',
        expiry_hours: 24,
        expiry_time: '23:59 UTC on October 1, 2025',
        requested_ip: '203.0.113.42',
        requested_location: 'San Francisco, CA, USA',
        requested_device: 'Chrome on macOS',
        requested_at: now.toISOString()
      },
      security: {
        support_url: 'https://waymore.io/support/security',
        account_url: 'https://app.waymore.io/account/security'
      }
    },
    'universal-showcase': {
      ...commonVars,
      header: {
        logo_url: 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png',
        logo_alt: 'Waymore',
        tagline: 'Complete Email Template System'
      },
      hero: {
        type: 'icon',
        icon: '🎨',
        background_color: '#f3f4f6'
      },
      title: {
        text: 'Universal Template Showcase - All Features Demonstrated',
        size: '28px',
        weight: '700',
        color: '#1f2937',
        align: 'center'
      },
      body: {
        paragraphs: [
          'Welcome to the comprehensive showcase of our universal email template system. This email demonstrates every available section and customization option.',
          'Each component can be individually styled and configured to match your brand guidelines. The template supports multiple languages, responsive design, and extensive personalization.',
          'Explore all the features below to see what\'s possible with our flexible template engine.'
        ]
      },
      snapshot: {
        title: 'Template System Capabilities',
        facts: [
          { label: 'Available Sections', value: '12+' },
          { label: 'Customization Points', value: '75+' },
          { label: 'Supported Languages', value: '6' },
          { label: 'Responsive Design', value: 'Mobile-First' }
        ],
        style: 'table'
      },
      actions: {
        primary: {
          label: 'View Documentation',
          url: 'https://docs.waymore.io/email-templates',
          style: 'button',
          color: '#7c3aed',
          text_color: '#ffffff'
        },
        secondary: {
          label: 'Contact Support',
          url: 'mailto:support@waymore.io',
          style: 'button',
          color: '#6b7280',
          text_color: '#ffffff'
        }
      },
      visual: {
        type: 'progress_bars',
        progress_bars: [
          {
            label: 'Feature Completeness',
            current: 100,
            max: 100,
            unit: '%',
            percentage: 100,
            color: '#10b981',
            description: 'All planned features implemented'
          },
          {
            label: 'Localization Coverage',
            current: 6,
            max: 10,
            unit: ' languages',
            percentage: 60,
            color: '#3b82f6',
            description: '6 of 10 target languages'
          }
        ]
      },
      support: {
        title: 'Need Help?',
        links: [
          { label: 'Documentation', url: 'https://docs.waymore.io' },
          { label: 'API Reference', url: 'https://docs.waymore.io/api' },
          { label: 'Contact Support', url: 'mailto:support@waymore.io' }
        ]
      },
      footer: {
        logo: {
          width: '120px',
          url: 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png',
          alt: 'Waymore'
        },
        tagline: 'Empowering businesses with intelligent email automation',
        copyright: '© 2025 Waymore Technologies. All rights reserved.',
        social_links: [
          { platform: 'twitter', url: 'https://twitter.com/waymore' },
          { platform: 'linkedin', url: 'https://linkedin.com/company/waymore' },
          { platform: 'github', url: 'https://github.com/waymore' }
        ],
        legal_links: [
          { label: 'Privacy Policy', url: 'https://waymore.io/privacy' },
          { label: 'Terms of Service', url: 'https://waymore.io/terms' },
          { label: 'Unsubscribe', url: 'https://waymore.io/unsubscribe' }
        ]
      }
    },
    'subscription-renewal-reminder': {
      ...commonVars,
      user: {
        ...commonVars.user,
        name: localeSpecific.userName,
        workspace_name: localeSpecific.workspaceName
      },
      subscription: {
        plan_name: localeSpecific.planName,
        renewal_date: formatDate(futureDate),
        days_until_expiry: 7,
        billing_cycle: localeSpecific.billingCycle,
        next_amount: `${localeSpecific.currency}${localeSpecific.amount}`,
        currency: localeSpecific.currency === '€' ? 'EUR' : 'USD',
        auto_renewal: localeSpecific.autoRenewal,
        urgency_percentage: 100,
        subscription_id: 'sub_pro_20250923',
        started_date: '2024-09-30'
      },
      actions: {
        manage_subscription_url: 'https://app.waymore.io/billing/manage?sub=sub_pro_20250923',
        billing_portal_url: 'https://app.waymore.io/billing',
        contact_support_url: 'https://waymore.io/support?topic=renewal'
      },
      // Progress bar and countdown variables
      currentValue: '7',
      countdownMessage: locale === 'el' ? 'Η συνδρομή σας λήγει σε' : 'Your subscription expires in',
      targetDate: futureDate.toISOString()
    },
    'subscription-renewal-success': {
      ...commonVars,
      user: {
        ...commonVars.user,
        name: localeSpecific.userName,
        workspace_name: localeSpecific.workspaceName
      },
      subscription: {
        plan_name: localeSpecific.planName,
        renewal_date: formatDate(now),
        next_billing_date: formatDate(futureDate),
        amount_charged: `${localeSpecific.currency}${localeSpecific.amount}`,
        currency: localeSpecific.currency === '€' ? 'EUR' : 'USD',
        payment_method: 'Visa •••• 4242',
        billing_cycle: localeSpecific.billingCycle,
        subscription_id: 'sub_pro_20250923',
        transaction_id: 'txn_' + now.getTime()
      },
      actions: {
        view_invoice_url: 'https://app.waymore.io/billing/invoices/inv_2025_09_30',
        manage_subscription_url: 'https://app.waymore.io/billing/manage',
        billing_portal_url: 'https://app.waymore.io/billing',
        download_receipt_url: 'https://app.waymore.io/billing/receipts/rcpt_2025_09_30.pdf'
      },
      invoice: {
        invoice_number: 'INV-2025-09-30-001',
        invoice_date: formatDate(now),
        invoice_url: 'https://app.waymore.io/billing/invoices/inv_2025_09_30'
      }
    },
    'payment-failure': {
      ...commonVars,
      user: {
        ...commonVars.user,
        name: localeSpecific.userName,
        workspace_name: localeSpecific.workspaceName
      },
      subscription: {
        plan_name: localeSpecific.planName,
        amount_due: `${localeSpecific.currency}${localeSpecific.amount}`,
        currency: localeSpecific.currency === '€' ? 'EUR' : 'USD',
        billing_date: formatDate(pastDate),
        retry_date: formatDate(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)),
        days_until_suspension: 3,
        subscription_id: 'sub_pro_20250923',
        billing_cycle: localeSpecific.billingCycle
      },
      payment: {
        payment_method: 'Visa •••• 4242',
        last_four: '4242',
        card_brand: 'Visa',
        failure_reason: 'Insufficient funds in account',
        failure_code: 'insufficient_funds',
        attempt_count: 1,
        max_attempts: 3,
        attempted_at: pastDate.toISOString()
      },
      actions: {
        update_payment_url: 'https://app.waymore.io/billing/payment-methods?urgent=true',
        billing_portal_url: 'https://app.waymore.io/billing',
        contact_support_url: 'https://waymore.io/support?topic=payment-failure',
        retry_payment_url: 'https://app.waymore.io/billing/retry-payment?sub=sub_pro_20250923'
      }
    },
    'usage-limit': {
      ...commonVars,
      user: {
        ...commonVars.user,
        name: localeSpecific.userName,
        workspace_name: localeSpecific.workspaceName
      },
      usage: {
        resource_name: 'API Calls',
        resource_type: 'api_requests',
        current_usage: 8000,
        limit: 10000,
        percentage: 80,
        remaining: 2000,
        period: 'this billing cycle',
        period_start: formatDate(new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)),
        period_end: formatDate(futureDate),
        reset_date: formatDate(futureDate),
        days_until_reset: 7
      },
      plan: {
        current_plan: localeSpecific.planName,
        upgrade_plan: 'Enterprise Plan',
        upgrade_limit: 100000
      },
      actions: {
        upgrade_url: 'https://app.waymore.io/billing/upgrade?source=usage-warning',
        usage_dashboard_url: 'https://app.waymore.io/usage/details',
        manage_subscription_url: 'https://app.waymore.io/billing/manage',
        learn_more_url: 'https://waymore.io/pricing'
      }
    },
    'hard-limit': {
      ...commonVars,
      user: {
        ...commonVars.user,
        name: localeSpecific.userName,
        workspace_name: localeSpecific.workspaceName
      },
      usage: {
        resource_name: 'API Calls',
        resource_type: 'api_requests',
        current_usage: 10000,
        limit: 10000,
        percentage: 100,
        remaining: 0,
        period: 'this billing cycle',
        period_start: formatDate(new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)),
        period_end: formatDate(futureDate),
        reset_date: formatDate(futureDate),
        days_until_reset: 7,
        overage_count: 150
      },
      plan: {
        current_plan: localeSpecific.planName,
        upgrade_plan: 'Enterprise Plan',
        upgrade_limit: 100000
      },
      actions: {
        upgrade_url: 'https://app.waymore.io/billing/upgrade?source=hard-limit&urgent=true',
        usage_dashboard_url: 'https://app.waymore.io/usage/details',
        contact_support_url: 'https://waymore.io/support?topic=quota-exceeded',
        learn_more_url: 'https://waymore.io/pricing'
      }
    },
    'upgrade-success': {
      ...commonVars,
      user: {
        ...commonVars.user,
        name: localeSpecific.userName,
        workspace_name: localeSpecific.workspaceName
      },
      subscription: {
        old_plan_name: 'Basic Plan',
        old_plan_amount: `${localeSpecific.currency}9.99`,
        new_plan_name: localeSpecific.planName,
        new_plan_amount: `${localeSpecific.currency}${localeSpecific.amount}`,
        effective_date: formatDate(now),
        next_billing_date: formatDate(futureDate),
        new_amount: `${localeSpecific.currency}${localeSpecific.amount}`,
        currency: localeSpecific.currency === '€' ? 'EUR' : 'USD',
        billing_cycle: localeSpecific.billingCycle,
        prorated_charge: `${localeSpecific.currency}15.00`,
        subscription_id: 'sub_pro_20250930'
      },
      features: {
        new_features: [
          'Unlimited API calls (vs 10,000/month)',
          '24/7 Priority email & chat support',
          'Advanced analytics & reporting',
          'Custom integrations & webhooks',
          'Team collaboration (up to 10 users)',
          'SLA guarantee (99.9% uptime)'
        ],
        retained_features: [
          'Email delivery infrastructure',
          'Template management',
          'Basic analytics'
        ]
      },
      actions: {
        view_invoice_url: 'https://app.waymore.io/billing/invoices/inv_upgrade_2025_09_30',
        manage_subscription_url: 'https://app.waymore.io/billing/manage',
        explore_features_url: 'https://app.waymore.io/features/pro',
        get_started_url: 'https://docs.waymore.io/getting-started/pro'
      }
    },
    'downgrade-confirmation': {
      ...commonVars,
      user: {
        ...commonVars.user,
        name: localeSpecific.userName,
        workspace_name: localeSpecific.workspaceName
      },
      subscription: {
        old_plan_name: localeSpecific.planName,
        old_plan_amount: `${localeSpecific.currency}${localeSpecific.amount}`,
        new_plan_name: 'Basic Plan',
        new_plan_amount: `${localeSpecific.currency}9.99`,
        effective_date: formatDate(futureDate),
        next_billing_date: formatDate(futureDate),
        new_amount: `${localeSpecific.currency}9.99`,
        currency: localeSpecific.currency === '€' ? 'EUR' : 'USD',
        billing_cycle: localeSpecific.billingCycle,
        subscription_id: 'sub_basic_20251007'
      },
      features: {
        removed_features: [
          'Priority 24/7 support (downgraded to email-only)',
          'Advanced analytics & custom reports',
          'Custom integrations & webhooks',
          'Team collaboration features',
          'Unlimited API calls (reduced to 10,000/month)'
        ],
        retained_features: [
          'Core email delivery',
          'Template management (up to 5 templates)',
          'Basic analytics dashboard',
          'Standard email support'
        ]
      },
      actions: {
        manage_subscription_url: 'https://app.waymore.io/billing/manage',
        upgrade_url: 'https://app.waymore.io/billing/upgrade?return=true',
        contact_support_url: 'https://waymore.io/support?topic=downgrade',
        cancel_downgrade_url: 'https://app.waymore.io/billing/cancel-downgrade?sub=sub_basic_20251007'
      }
    },
    'saas-quota-research': {
      ...commonVars,
      user: {
        ...commonVars.user,
        name: localeSpecific.userName,
        workspace_name: localeSpecific.workspaceName
      },
      title: 'SaaS Quota Management Research - Complete Template Showcase',
      research: {
        study_name: 'Enterprise SaaS Usage Patterns Study 2025',
        participant_id: 'PART-' + now.getTime(),
        completion_percentage: 75
      },
      usage: {
        resource_name: 'API Calls',
        current_usage: 7500,
        limit: 10000,
        percentage: 75
      },
      actions: {
        primary: {
          label: 'View Full Report',
          url: 'https://app.waymore.io/research/saas-quotas'
        },
        secondary: {
          label: 'Download PDF',
          url: 'https://app.waymore.io/research/saas-quotas/download'
        }
      }
    }
  };

  // Find matching template variables
  for (const [key, vars] of Object.entries(templateSpecificVars)) {
    if (templateKey.includes(key) || key.includes(templateKey)) {
      return vars;
    }
  }

  // Default to common variables
  return commonVars;
}

async function sendEmail(templateKey: string, locale: string, variables: any, subject: string): Promise<boolean> {
  try {
    const emailRequest = {
      to: [
        {
          email: RECIPIENT_EMAIL,
          name: RECIPIENT_NAME
        }
      ],
      subject,
      template: {
        key: templateKey,
        locale
      },
      variables,
      metadata: {
        tenantId: 'waymore',
        eventId: `template-showcase-${templateKey}-${locale}`
      }
    };

    const idempotencyKey = randomUUID();
    
    const response = await fetch(`${API_URL}/api/v1/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(emailRequest)
    });

    const responseData = await response.json();
    
    if (response.ok) {
      console.log(`  ✅ Sent successfully - Message ID: ${responseData.messageId}`);
      return true;
    } else {
      console.log(`  ❌ Failed to send - ${JSON.stringify(responseData)}`);
      return false;
    }
  } catch (error: any) {
    console.log(`  ❌ Error: ${error.message}`);
    return false;
  }
}

async function sendAllTemplates() {
  console.log('🚀 Starting to send all templates to cantoniou@waymore.io\n');

  try {
    // Fetch all templates with their locales
    const templates = await prisma.template.findMany({
      include: {
        locales: true
      },
      orderBy: {
        key: 'asc'
      }
    });

    console.log(`📋 Found ${templates.length} templates in database\n`);

    let totalSent = 0;
    let totalFailed = 0;

    // Process each template
    for (const template of templates) {
      console.log(`📧 Template: ${template.name} (${template.key})`);
      console.log(`   Category: ${template.category}`);
      console.log(`   Locales: ${template.locales.length > 0 ? template.locales.map(l => l.locale).join(', ') : 'Base only'}\n`);

      // Send base template (using __base__ locale)
      console.log(`  📤 Sending base locale...`);
      const baseVariables = generateSampleVariables(template.key, '__base__', template.variableSchema);
      const baseSubject = generateSubject(template.name, template.key, '__base__');
      const baseSuccess = await sendEmail(template.key, '__base__', baseVariables, baseSubject);
      
      if (baseSuccess) {
        totalSent++;
      } else {
        totalFailed++;
      }

      // Add a small delay between emails
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send each locale variant
      for (const locale of template.locales) {
        console.log(`  📤 Sending locale: ${locale.locale}...`);
        const localeVariables = generateSampleVariables(template.key, locale.locale, template.variableSchema);
        const localeSubject = generateSubject(template.name, template.key, locale.locale);
        const localeSuccess = await sendEmail(template.key, locale.locale, localeVariables, localeSubject);
        
        if (localeSuccess) {
          totalSent++;
        } else {
          totalFailed++;
        }

        // Add a small delay between emails
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(''); // Empty line for readability
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   Total templates: ${templates.length}`);
    console.log(`   Emails sent successfully: ${totalSent}`);
    console.log(`   Emails failed: ${totalFailed}`);
    console.log('='.repeat(60));
    console.log('\n✨ All done!');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    throw error;
  }
}

// Run the script
async function main() {
  try {
    await sendAllTemplates();
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

export { sendAllTemplates };
