#!/usr/bin/env node

/**
 * Send Showcase Email - SaaS Quota Research
 * 
 * This script demonstrates how to use the showcase template to send
 * a realistic SaaS quota research email with comprehensive data.
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000';
const JWT_TOKEN = 'test-token'; // Replace with actual JWT token

async function sendShowcaseEmail(locale = 'en') {
  console.log(`📧 Sending showcase email in ${locale.toUpperCase()}...`);
  
  const emailData = {
    to: [
      {
        email: 'john.doe@example.com',
        name: 'John Doe'
      }
    ],
    from: {
      email: 'research@waymore.io',
      name: 'Waymore Research Team'
    },
    subject: locale === 'es' 
      ? 'Ayúdanos a Mejorar Tu Experiencia - Encuesta de Investigación'
      : 'Help Us Improve Your Experience - Research Survey',
    template: {
      key: 'saas-quota-research-showcase',
      locale: locale
    },
    variables: {
      user: {
        name: locale === 'es' ? 'Juan' : 'John',
        email: 'john.doe@example.com',
        role: 'Product Manager',
        department: 'Engineering',
        avatar_url: 'https://i.pravatar.cc/150?img=1'
      },
      company: {
        name: 'Waymore',
        domain: 'waymore.io',
        logo_url: 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png',
        website: 'https://waymore.io',
        dashboard_url: 'https://app.waymore.io/dashboard',
        faq_url: 'https://waymore.io/faq',
        support_url: 'https://waymore.io/support',
        upgrade_url: 'https://app.waymore.io/upgrade',
        twitter_url: 'https://twitter.com/waymore',
        linkedin_url: 'https://linkedin.com/company/waymore',
        github_url: 'https://github.com/waymore',
        privacy_url: 'https://waymore.io/privacy',
        terms_url: 'https://waymore.io/terms'
      },
      quota: {
        current_usage: 7500,
        limit: 10000,
        percentage: 75,
        period: locale === 'es' ? 'Mensual' : 'Monthly',
        reset_date: locale === 'es' ? '1 de marzo, 2024' : 'March 1, 2024'
      },
      usage: {
        api_calls: 7500,
        storage_gb: 12.5,
        users_count: 8,
        integrations: 5
      },
      research: {
        title: locale === 'es' 
          ? 'Ayúdanos a Mejorar Tu Experiencia'
          : 'Help Us Improve Your Experience',
        description: locale === 'es'
          ? 'Estamos realizando una investigación para entender mejor cómo usas nuestra plataforma y cómo podemos mejorar tu experiencia.'
          : 'We\'re conducting research to better understand how you use our platform and how we can improve your experience.',
        questions: locale === 'es' 
          ? [
              '¿Qué funcionalidades usas más frecuentemente?',
              '¿Qué mejoras te gustaría ver en la plataforma?',
              '¿Cómo calificarías tu experiencia general?'
            ]
          : [
              'What features do you use most frequently?',
              'What improvements would you like to see?',
              'How would you rate your overall experience?'
            ],
        deadline: locale === 'es' ? '15 de marzo, 2024' : 'March 15, 2024',
        incentive: locale === 'es' ? 'recibirás un crédito de $50 en tu cuenta' : 'you\'ll receive a $50 credit to your account',
        survey_url: `https://waymore.io/research/survey?token=abc123&lang=${locale}`
      },
      security: {
        last_login: locale === 'es' ? 'Hace 2 horas' : '2 hours ago',
        ip_address: '192.168.1.100',
        location: locale === 'es' ? 'Madrid, España' : 'Madrid, Spain',
        device: 'MacBook Pro',
        browser: 'Chrome 120.0'
      }
    },
    metadata: {
      tenantId: 'waymore_demo',
      eventId: 'quota_research_survey',
      notificationType: 'research',
      campaignId: 'quota_research_2024_q1',
      userId: 'user_12345'
    }
  };

  try {
    console.log('📤 Sending email request...');
    
    const response = await fetch(`${API_BASE_URL}/api/v1/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Idempotency-Key': `showcase-${locale}-${Date.now()}`
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📊 Status:', result.status);
    
    return result;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🎯 Sending SaaS Quota Research Showcase Emails');
    console.log('📋 Demonstrating comprehensive template usage\n');
    
    // Send English email
    console.log('🇺🇸 Sending English email...');
    await sendShowcaseEmail('en');
    
    console.log('\n🇪🇸 Sending Spanish email...');
    await sendShowcaseEmail('es');
    
    console.log('\n🎉 Both emails sent successfully!');
    console.log('📧 Check your email client to see the results');
    console.log('🔗 View template in admin:', 'http://localhost:3000/admin/template-editor?template=saas-quota-research-showcase&mode=edit');
    
    console.log('\n📊 Email Features Demonstrated:');
    console.log('✅ Personalized content with user data');
    console.log('✅ Dynamic quota usage visualization');
    console.log('✅ Multi-language support (EN/ES)');
    console.log('✅ Realistic SaaS metrics and data');
    console.log('✅ Professional branding and styling');
    console.log('✅ Call-to-action buttons with tracking');
    console.log('✅ Comprehensive footer with links');
    console.log('✅ Security information display');
    console.log('✅ Progress bars with usage data');
    console.log('✅ Facts table with current usage');
    
  } catch (error) {
    console.error('💥 Failed to send showcase emails:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { sendShowcaseEmail };
