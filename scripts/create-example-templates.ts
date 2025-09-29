#!/usr/bin/env ts-node

/**
 * Create Example Templates Script
 * 
 * This script creates example transactional email templates in the database
 * based on the user's requirements. These templates will be ready for users
 * to use immediately.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Template data based on user requirements
const exampleTemplates = [
  {
    key: 'welcome-email',
    name: 'Welcome Email',
    description: 'Complete onboarding experience with tips, facts table, and CTAs',
    category: 'user',
    variables: {
      header: {
        logo_url: 'https://waymore.io/logo.png',
        logo_alt: 'Waymore Logo',
        tagline: 'Welcome to Waymore!'
      },
      title: {
        text: 'Welcome to Waymore, {{user_firstname}}!',
        size: '32px',
        weight: 'bold',
        color: '#1f2937',
        align: 'center'
      },
      body: {
        paragraphs: [
          'We\'re thrilled to have you join our community! You\'re now part of thousands of users who trust Waymore for their email needs.',
          'To get you started, here are some helpful tips and resources:'
        ]
      },
      snapshot: {
        title: 'Getting Started',
        facts: [
          { label: 'Account Type', value: '{{account_type}}' },
          { label: 'Plan', value: '{{plan_name}}' },
          { label: 'Next Billing', value: '{{next_billing_date}}' },
          { label: 'Support Email', value: 'support@waymore.io' }
        ]
      },
      actions: {
        primary: {
          label: 'Explore Dashboard',
          url: '{{dashboard_url}}',
          style: 'solid',
          color: '#7c3aed'
        },
        secondary: {
          label: 'View Documentation',
          url: '{{docs_url}}',
          style: 'outline'
        }
      },
      support: {
        title: 'Need Help?',
        links: [
          { label: 'Getting Started Guide', url: '{{getting_started_url}}' },
          { label: 'API Documentation', url: '{{api_docs_url}}' },
          { label: 'Contact Support', url: 'mailto:support@waymore.io' }
        ]
      },
      footer: {
        tagline: 'Building the future of email communication',
        social_links: [
          { platform: 'Twitter', url: 'https://twitter.com/waymore' },
          { platform: 'LinkedIn', url: 'https://linkedin.com/company/waymore' }
        ],
        legal_links: [
          { label: 'Privacy Policy', url: '{{privacy_url}}' },
          { label: 'Terms of Service', url: '{{terms_url}}' }
        ],
        copyright: '© 2024 Waymore. All rights reserved.'
      }
    }
  },
  {
    key: 'payment-success',
    name: 'Payment Success',
    description: 'Transaction confirmation with billing details and receipt download',
    category: 'billing',
    variables: {
      header: {
        logo_url: 'https://waymore.io/logo.png',
        logo_alt: 'Waymore Logo',
        tagline: 'Payment Confirmed'
      },
      title: {
        text: 'Payment Successful!',
        size: '32px',
        weight: 'bold',
        color: '#059669',
        align: 'center'
      },
      body: {
        paragraphs: [
          'Thank you for your payment! Your transaction has been processed successfully.',
          'Here are the details of your payment:'
        ]
      },
      snapshot: {
        title: 'Payment Details',
        facts: [
          { label: 'Transaction ID', value: '{{transaction_id}}' },
          { label: 'Amount', value: '{{amount}}' },
          { label: 'Payment Method', value: '{{payment_method}}' },
          { label: 'Date', value: '{{payment_date}}' },
          { label: 'Status', value: 'Completed' }
        ]
      },
      actions: {
        primary: {
          label: 'Download Receipt',
          url: '{{receipt_url}}',
          style: 'solid',
          color: '#059669'
        },
        secondary: {
          label: 'View Invoice',
          url: '{{invoice_url}}',
          style: 'outline'
        }
      },
      support: {
        title: 'Questions about your payment?',
        links: [
          { label: 'Billing Support', url: 'mailto:billing@waymore.io' },
          { label: 'View Billing History', url: '{{billing_history_url}}' }
        ]
      }
    }
  },
  {
    key: 'renewal-reminder',
    name: 'Renewal Reminder',
    description: 'Subscription renewal reminder with payment information and facts',
    category: 'billing',
    variables: {
      header: {
        logo_url: 'https://waymore.io/logo.png',
        logo_alt: 'Waymore Logo',
        tagline: 'Renewal Reminder'
      },
      title: {
        text: 'Your Subscription Renews Soon',
        size: '32px',
        weight: 'bold',
        color: '#d97706',
        align: 'center'
      },
      body: {
        paragraphs: [
          'Your {{plan_name}} subscription will renew in {{days_until_renewal}} days.',
          'To ensure uninterrupted service, please ensure your payment method is up to date.'
        ]
      },
      snapshot: {
        title: 'Renewal Information',
        facts: [
          { label: 'Current Plan', value: '{{plan_name}}' },
          { label: 'Renewal Date', value: '{{renewal_date}}' },
          { label: 'Amount Due', value: '{{renewal_amount}}' },
          { label: 'Payment Method', value: '{{payment_method}}' }
        ]
      },
      actions: {
        primary: {
          label: 'Update Payment Method',
          url: '{{payment_url}}',
          style: 'solid',
          color: '#d97706'
        },
        secondary: {
          label: 'View Billing',
          url: '{{billing_url}}',
          style: 'outline'
        }
      }
    }
  },
  {
    key: 'usage-warning',
    name: 'Usage Warning',
    description: 'Threshold alerts with upgrade options and usage details',
    category: 'usage',
    variables: {
      header: {
        logo_url: 'https://waymore.io/logo.png',
        logo_alt: 'Waymore Logo',
        tagline: 'Usage Alert'
      },
      title: {
        text: 'You\'re Approaching Your Usage Limit',
        size: '32px',
        weight: 'bold',
        color: '#dc2626',
        align: 'center'
      },
      body: {
        paragraphs: [
          'You\'ve used {{usage_percentage}}% of your {{plan_name}} plan allowance.',
          'Consider upgrading to avoid service interruption.'
        ]
      },
      visual: {
        type: 'progress',
        progress_bars: [
          {
            label: 'Email Usage',
            current: '{{current_usage}}',
            max: '{{usage_limit}}',
            unit: 'emails',
            percentage: '{{usage_percentage}}',
            color: '#dc2626',
            description: '{{usage_percentage}}% of monthly limit used'
          }
        ]
      },
      snapshot: {
        title: 'Usage Summary',
        facts: [
          { label: 'Current Usage', value: '{{current_usage}} emails' },
          { label: 'Monthly Limit', value: '{{usage_limit}} emails' },
          { label: 'Remaining', value: '{{remaining_usage}} emails' },
          { label: 'Reset Date', value: '{{reset_date}}' }
        ]
      },
      actions: {
        primary: {
          label: 'Upgrade Plan',
          url: '{{upgrade_url}}',
          style: 'solid',
          color: '#dc2626'
        },
        secondary: {
          label: 'View Usage Details',
          url: '{{usage_url}}',
          style: 'outline'
        }
      }
    }
  },
  {
    key: 'upgrade-confirmation',
    name: 'Upgrade Confirmation',
    description: 'Plan upgrade confirmation with new features and benefits',
    category: 'billing',
    variables: {
      header: {
        logo_url: 'https://waymore.io/logo.png',
        logo_alt: 'Waymore Logo',
        tagline: 'Upgrade Complete!'
      },
      title: {
        text: 'Welcome to {{new_plan_name}}!',
        size: '32px',
        weight: 'bold',
        color: '#7c3aed',
        align: 'center'
      },
      body: {
        paragraphs: [
          'Congratulations! You\'ve successfully upgraded to {{new_plan_name}}.',
          'Here\'s what you now have access to:'
        ]
      },
      snapshot: {
        title: 'New Features',
        facts: [
          { label: 'New Plan', value: '{{new_plan_name}}' },
          { label: 'Email Limit', value: '{{new_email_limit}}' },
          { label: 'API Calls', value: '{{new_api_limit}}' },
          { label: 'Support Level', value: '{{new_support_level}}' }
        ]
      },
      actions: {
        primary: {
          label: 'Explore New Features',
          url: '{{features_url}}',
          style: 'solid',
          color: '#7c3aed'
        },
        secondary: {
          label: 'View Billing',
          url: '{{billing_url}}',
          style: 'outline'
        }
      }
    }
  },
  {
    key: 'payment-failure',
    name: 'Payment Failure',
    description: 'Failed payment notification with retry instructions and facts',
    category: 'billing',
    variables: {
      header: {
        logo_url: 'https://waymore.io/logo.png',
        logo_alt: 'Waymore Logo',
        tagline: 'Payment Issue'
      },
      title: {
        text: 'Payment Failed',
        size: '32px',
        weight: 'bold',
        color: '#dc2626',
        align: 'center'
      },
      body: {
        paragraphs: [
          'We were unable to process your payment for {{plan_name}}.',
          'Please update your payment method to avoid service interruption.'
        ]
      },
      snapshot: {
        title: 'Payment Details',
        facts: [
          { label: 'Failed Amount', value: '{{failed_amount}}' },
          { label: 'Payment Method', value: '{{payment_method}}' },
          { label: 'Failure Reason', value: '{{failure_reason}}' },
          { label: 'Retry Date', value: '{{retry_date}}' }
        ]
      },
      actions: {
        primary: {
          label: 'Update Payment Method',
          url: '{{payment_url}}',
          style: 'solid',
          color: '#dc2626'
        },
        secondary: {
          label: 'Contact Support',
          url: 'mailto:billing@waymore.io',
          style: 'outline'
        }
      }
    }
  },
  {
    key: 'invoice',
    name: 'Invoice',
    description: 'Professional invoice with payment details and download options',
    category: 'billing',
    variables: {
      header: {
        logo_url: 'https://waymore.io/logo.png',
        logo_alt: 'Waymore Logo',
        tagline: 'Invoice'
      },
      title: {
        text: 'Invoice #{{invoice_number}}',
        size: '32px',
        weight: 'bold',
        color: '#1f2937',
        align: 'center'
      },
      body: {
        paragraphs: [
          'Thank you for your business! Here\'s your invoice for {{invoice_period}}.',
          'Payment is due by {{due_date}}.'
        ]
      },
      snapshot: {
        title: 'Invoice Details',
        facts: [
          { label: 'Invoice Number', value: '{{invoice_number}}' },
          { label: 'Issue Date', value: '{{issue_date}}' },
          { label: 'Due Date', value: '{{due_date}}' },
          { label: 'Total Amount', value: '{{total_amount}}' },
          { label: 'Status', value: '{{payment_status}}' }
        ]
      },
      actions: {
        primary: {
          label: 'Download PDF',
          url: '{{pdf_url}}',
          style: 'solid',
          color: '#1f2937'
        },
        secondary: {
          label: 'Pay Now',
          url: '{{payment_url}}',
          style: 'outline'
        }
      }
    }
  },
  {
    key: 'password-reset',
    name: 'Password Reset',
    description: 'Security reset with expiration notice and IP tracking',
    category: 'security',
    variables: {
      header: {
        logo_url: 'https://waymore.io/logo.png',
        logo_alt: 'Waymore Logo',
        tagline: 'Security Notice'
      },
      title: {
        text: 'Password Reset Request',
        size: '32px',
        weight: 'bold',
        color: '#dc2626',
        align: 'center'
      },
      body: {
        paragraphs: [
          'We received a request to reset your password for your Waymore account.',
          'If you made this request, click the button below to reset your password. This link will expire in {{expiration_hours}} hours.'
        ]
      },
      snapshot: {
        title: 'Security Information',
        facts: [
          { label: 'Request Time', value: '{{request_time}}' },
          { label: 'IP Address', value: '{{ip_address}}' },
          { label: 'User Agent', value: '{{user_agent}}' },
          { label: 'Expires', value: '{{expiration_time}}' }
        ]
      },
      actions: {
        primary: {
          label: 'Reset Password',
          url: '{{reset_url}}',
          style: 'solid',
          color: '#dc2626'
        },
        secondary: {
          label: 'Contact Support',
          url: 'mailto:security@waymore.io',
          style: 'outline'
        }
      },
      support: {
        title: 'Didn\'t request this?',
        links: [
          { label: 'Ignore this email', url: '#' },
          { label: 'Contact Security Team', url: 'mailto:security@waymore.io' }
        ]
      }
    }
  },
  {
    key: 'monthly-report',
    name: 'Monthly Report',
    description: 'Analytics report with key metrics and performance data',
    category: 'analytics',
    variables: {
      header: {
        logo_url: 'https://waymore.io/logo.png',
        logo_alt: 'Waymore Logo',
        tagline: 'Monthly Report'
      },
      title: {
        text: 'Your {{month}} {{year}} Report',
        size: '32px',
        weight: 'bold',
        color: '#1f2937',
        align: 'center'
      },
      body: {
        paragraphs: [
          'Here\'s a summary of your email activity for {{month}} {{year}}.',
          'Keep up the great work!'
        ]
      },
      snapshot: {
        title: 'Key Metrics',
        facts: [
          { label: 'Emails Sent', value: '{{emails_sent}}' },
          { label: 'Delivery Rate', value: '{{delivery_rate}}%' },
          { label: 'Open Rate', value: '{{open_rate}}%' },
          { label: 'Click Rate', value: '{{click_rate}}%' },
          { label: 'Bounce Rate', value: '{{bounce_rate}}%' }
        ]
      },
      visual: {
        type: 'progress',
        progress_bars: [
          {
            label: 'Monthly Usage',
            current: '{{current_usage}}',
            max: '{{monthly_limit}}',
            unit: 'emails',
            percentage: '{{usage_percentage}}',
            color: '#3b82f6',
            description: '{{usage_percentage}}% of monthly limit used'
          }
        ]
      },
      actions: {
        primary: {
          label: 'View Full Report',
          url: '{{report_url}}',
          style: 'solid',
          color: '#3b82f6'
        },
        secondary: {
          label: 'Export Data',
          url: '{{export_url}}',
          style: 'outline'
        }
      }
    }
  }
];

async function createExampleTemplates() {
  try {
    console.log('🚀 Creating example templates...');

    for (const templateData of exampleTemplates) {
      // Check if template already exists
      const existingTemplate = await prisma.template.findUnique({
        where: { key: templateData.key }
      });

      if (existingTemplate) {
        console.log(`⚠️  Template "${templateData.key}" already exists. Skipping.`);
        continue;
      }

      // Create variable schema based on the template variables
      const variableSchema = generateVariableSchema(templateData.variables);

      // Create the template
      const template = await prisma.template.create({
        data: {
          key: templateData.key,
          name: templateData.name,
          description: templateData.description,
          category: templateData.category,
          isActive: true,
          variableSchema,
          jsonStructure: templateData.variables
        }
      });

      console.log(`✅ Created template: ${template.key}`);

      // Create English locale
      const englishLocale = await prisma.templateLocale.create({
        data: {
          templateId: template.id,
          locale: 'en',
          jsonStructure: templateData.variables
        }
      });

      console.log(`✅ Created English locale for: ${template.key}`);
    }

    console.log('🎉 All example templates created successfully!');
  } catch (error) {
    console.error('❌ Error creating example templates:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function generateVariableSchema(variables: any): any {
  // Generate a basic JSON schema for the variables
  return {
    type: 'object',
    properties: generatePropertiesFromVariables(variables),
    required: extractRequiredFields(variables)
  };
}

function generatePropertiesFromVariables(obj: any, prefix = ''): any {
  const properties: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      properties[key] = {
        type: 'object',
        properties: generatePropertiesFromVariables(value, fullKey)
      };
    } else if (Array.isArray(value)) {
      properties[key] = {
        type: 'array',
        items: {
          type: 'object',
          properties: generatePropertiesFromVariables(value[0] || {}, fullKey)
        }
      };
    } else {
      properties[key] = {
        type: 'string',
        description: `Value for ${fullKey}`
      };
    }
  }
  
  return properties;
}

function extractRequiredFields(obj: any, prefix = ''): string[] {
  const required: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      required.push(...extractRequiredFields(value, fullKey));
    } else if (Array.isArray(value)) {
      // For arrays, we'll consider them optional for now
      continue;
    } else {
      // Add all string fields as required
      required.push(fullKey);
    }
  }
  
  return required;
}

// Run the script
if (require.main === module) {
  createExampleTemplates()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { createExampleTemplates };
