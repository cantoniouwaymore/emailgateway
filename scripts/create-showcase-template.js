#!/usr/bin/env node

/**
 * Create Showcase Template - SaaS Quota Research Email
 * 
 * This script creates a comprehensive showcase template that demonstrates
 * all capabilities from the Transactional Template Guide with a SaaS quota
 * research theme. Includes English and Spanish locales.
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000';
const JWT_TOKEN = 'test-token'; // Replace with actual JWT token

async function createShowcaseTemplate() {
  console.log('🚀 Creating comprehensive showcase template...');
  
  const templateData = {
    key: 'saas-quota-research-showcase',
    name: 'SaaS Quota Research - Comprehensive Showcase',
    description: 'Complete showcase template demonstrating all transactional email capabilities with SaaS quota research theme',
    category: 'transactional',
    variableSchema: {
      type: 'object',
      required: ['user', 'company', 'quota', 'usage', 'research'],
      properties: {
        user: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            department: { type: 'string' },
            avatar_url: { type: 'string' }
          }
        },
        company: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            domain: { type: 'string' },
            logo_url: { type: 'string' },
            website: { type: 'string' }
          }
        },
        quota: {
          type: 'object',
          properties: {
            current_usage: { type: 'number' },
            limit: { type: 'number' },
            percentage: { type: 'number' },
            period: { type: 'string' },
            reset_date: { type: 'string' }
          }
        },
        usage: {
          type: 'object',
          properties: {
            api_calls: { type: 'number' },
            storage_gb: { type: 'number' },
            users_count: { type: 'number' },
            integrations: { type: 'number' }
          }
        },
        research: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            questions: { type: 'array', items: { type: 'string' } },
            deadline: { type: 'string' },
            incentive: { type: 'string' }
          }
        },
        security: {
          type: 'object',
          properties: {
            last_login: { type: 'string' },
            ip_address: { type: 'string' },
            location: { type: 'string' },
            device: { type: 'string' },
            browser: { type: 'string' }
          }
        }
      }
    },
    jsonStructure: {
      header: {
        logo_url: '{{company.logo_url}}',
        logo_alt: '{{company.name}}',
        tagline: '{{company.name}} - Empowering your business'
      },
      hero: {
        type: 'icon',
        icon: '📊',
        icon_size: '64px'
      },
      title: {
        text: '{{research.title}}',
        size: '32px',
        weight: '700',
        color: '#1f2937',
        align: 'center'
      },
      body: {
        paragraphs: [
          'Hi {{user.name}},',
          '{{research.description}}',
          'Your current usage shows {{quota.percentage}}% of your {{quota.period}} quota. This research will help us understand how to better serve your needs.',
          'The survey takes just 3 minutes and {{research.incentive}}.'
        ],
        font_size: '16px',
        line_height: '26px'
      },
      snapshot: {
        title: 'Your Current Usage',
        facts: [
          { label: 'API Calls', value: '{{usage.api_calls}}' },
          { label: 'Storage Used', value: '{{usage.storage_gb}} GB' },
          { label: 'Team Members', value: '{{usage.users_count}}' },
          { label: 'Integrations', value: '{{usage.integrations}}' },
          { label: 'Usage Period', value: '{{quota.period}}' },
          { label: 'Reset Date', value: '{{quota.reset_date}}' }
        ],
        style: 'table'
      },
      visual: {
        type: 'progress',
        progress_bars: [
          {
            label: 'API Usage',
            current: '{{quota.current_usage}}',
            max: '{{quota.limit}}',
            unit: 'calls',
            percentage: '{{quota.percentage}}',
            color: '#3b82f6',
            description: '{{quota.percentage}}% of monthly API calls used'
          }
        ]
      },
      actions: {
        primary: {
          label: 'Start Research Survey',
          url: '{{research.survey_url}}',
          style: 'button',
          color: '#10b981',
          text_color: '#ffffff'
        },
        secondary: {
          label: 'View Usage Dashboard',
          url: '{{company.dashboard_url}}',
          style: 'button',
          color: '#6b7280',
          text_color: '#ffffff'
        }
      },
      support: {
        title: 'Need help?',
        links: [
          { label: 'Usage FAQ', url: '{{company.faq_url}}' },
          { label: 'Contact Support', url: '{{company.support_url}}' },
          { label: 'Upgrade Plan', url: '{{company.upgrade_url}}' }
        ]
      },
      footer: {
        tagline: '{{company.name}} - Empowering your business',
        social_links: [
          { platform: 'twitter', url: '{{company.twitter_url}}' },
          { platform: 'linkedin', url: '{{company.linkedin_url}}' },
          { platform: 'github', url: '{{company.github_url}}' }
        ],
        legal_links: [
          { label: 'Privacy Policy', url: '{{company.privacy_url}}' },
          { label: 'Terms of Service', url: '{{company.terms_url}}' }
        ],
        copyright: '© 2024 {{company.name}}. All rights reserved.'
      },
      theme: {
        font_family: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        font_size: '16px',
        text_color: '#2c3e50',
        heading_color: '#1a1a1a',
        background_color: '#ffffff',
        body_background: '#f8fafc',
        muted_text_color: '#64748b',
        border_color: '#e2e8f0',
        primary_button_color: '#10b981',
        primary_button_text_color: '#ffffff',
        secondary_button_color: '#6b7280',
        secondary_button_text_color: '#ffffff'
      }
    }
  };

  try {
    console.log('📤 Sending template creation request...');
    
    const response = await fetch(`${API_BASE_URL}/api/v1/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT_TOKEN}`
      },
      body: JSON.stringify(templateData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log('✅ Template created successfully!');
    console.log('📋 Template ID:', result.template?.id);
    console.log('🔑 Template Key:', result.template?.key);
    
    return result.template;
  } catch (error) {
    console.error('❌ Error creating template:', error.message);
    throw error;
  }
}

async function addEnglishLocale(templateKey) {
  console.log('🇺🇸 Adding English locale...');
  
  const englishData = {
    jsonStructure: {
      header: {
        logo_url: 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png',
        logo_alt: 'Waymore',
        tagline: 'Waymore - Empowering your business'
      },
      hero: {
        type: 'icon',
        icon: '📊',
        icon_size: '64px'
      },
      title: {
        text: 'Help Us Improve Your Experience',
        size: '32px',
        weight: '700',
        color: '#1f2937',
        align: 'center'
      },
      body: {
        paragraphs: [
          'Hi John,',
          'We\'re conducting research to better understand how you use our platform and how we can improve your experience.',
          'Your current usage shows 75% of your monthly quota. This research will help us understand how to better serve your needs.',
          'The survey takes just 3 minutes and you\'ll receive a $50 credit to your account.'
        ],
        font_size: '16px',
        line_height: '26px'
      },
      snapshot: {
        title: 'Your Current Usage',
        facts: [
          { label: 'API Calls', value: '7,500' },
          { label: 'Storage Used', value: '12.5 GB' },
          { label: 'Team Members', value: '8' },
          { label: 'Integrations', value: '5' },
          { label: 'Usage Period', value: 'Monthly' },
          { label: 'Reset Date', value: 'March 1, 2024' }
        ],
        style: 'table'
      },
      visual: {
        type: 'progress',
        progress_bars: [
          {
            label: 'API Usage',
            current: 7500,
            max: 10000,
            unit: 'calls',
            percentage: 75,
            color: '#3b82f6',
            description: '75% of monthly API calls used'
          }
        ]
      },
      actions: {
        primary: {
          label: 'Start Research Survey',
          url: 'https://waymore.io/research/survey?token=abc123',
          style: 'button',
          color: '#10b981',
          text_color: '#ffffff'
        },
        secondary: {
          label: 'View Usage Dashboard',
          url: 'https://app.waymore.io/dashboard',
          style: 'button',
          color: '#6b7280',
          text_color: '#ffffff'
        }
      },
      support: {
        title: 'Need help?',
        links: [
          { label: 'Usage FAQ', url: 'https://waymore.io/faq' },
          { label: 'Contact Support', url: 'https://waymore.io/support' },
          { label: 'Upgrade Plan', url: 'https://app.waymore.io/upgrade' }
        ]
      },
      footer: {
        tagline: 'Waymore - Empowering your business',
        social_links: [
          { platform: 'twitter', url: 'https://twitter.com/waymore' },
          { platform: 'linkedin', url: 'https://linkedin.com/company/waymore' },
          { platform: 'github', url: 'https://github.com/waymore' }
        ],
        legal_links: [
          { label: 'Privacy Policy', url: 'https://waymore.io/privacy' },
          { label: 'Terms of Service', url: 'https://waymore.io/terms' }
        ],
        copyright: '© 2024 Waymore. All rights reserved.'
      }
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/templates/${templateKey}/locales/en`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT_TOKEN}`
      },
      body: JSON.stringify(englishData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
    }

    console.log('✅ English locale added successfully!');
  } catch (error) {
    console.error('❌ Error adding English locale:', error.message);
    throw error;
  }
}

async function addSpanishLocale(templateKey) {
  console.log('🇪🇸 Adding Spanish locale...');
  
  const spanishData = {
    jsonStructure: {
      header: {
        logo_url: 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png',
        logo_alt: 'Waymore',
        tagline: 'Waymore - Potenciando tu negocio'
      },
      hero: {
        type: 'icon',
        icon: '📊',
        icon_size: '64px'
      },
      title: {
        text: 'Ayúdanos a Mejorar Tu Experiencia',
        size: '32px',
        weight: '700',
        color: '#1f2937',
        align: 'center'
      },
      body: {
        paragraphs: [
          'Hola Juan,',
          'Estamos realizando una investigación para entender mejor cómo usas nuestra plataforma y cómo podemos mejorar tu experiencia.',
          'Tu uso actual muestra 75% de tu cuota mensual. Esta investigación nos ayudará a entender cómo servirte mejor.',
          'La encuesta toma solo 3 minutos y recibirás un crédito de $50 en tu cuenta.'
        ],
        font_size: '16px',
        line_height: '26px'
      },
      snapshot: {
        title: 'Tu Uso Actual',
        facts: [
          { label: 'Llamadas API', value: '7,500' },
          { label: 'Almacenamiento Usado', value: '12.5 GB' },
          { label: 'Miembros del Equipo', value: '8' },
          { label: 'Integraciones', value: '5' },
          { label: 'Período de Uso', value: 'Mensual' },
          { label: 'Fecha de Reinicio', value: '1 de marzo, 2024' }
        ],
        style: 'table'
      },
      visual: {
        type: 'progress',
        progress_bars: [
          {
            label: 'Uso de API',
            current: 7500,
            max: 10000,
            unit: 'llamadas',
            percentage: 75,
            color: '#3b82f6',
            description: '75% de llamadas API mensuales usadas'
          }
        ]
      },
      actions: {
        primary: {
          label: 'Iniciar Encuesta de Investigación',
          url: 'https://waymore.io/research/survey?token=abc123&lang=es',
          style: 'button',
          color: '#10b981',
          text_color: '#ffffff'
        },
        secondary: {
          label: 'Ver Panel de Uso',
          url: 'https://app.waymore.io/dashboard?lang=es',
          style: 'button',
          color: '#6b7280',
          text_color: '#ffffff'
        }
      },
      support: {
        title: '¿Necesitas ayuda?',
        links: [
          { label: 'FAQ de Uso', url: 'https://waymore.io/faq?lang=es' },
          { label: 'Contactar Soporte', url: 'https://waymore.io/support?lang=es' },
          { label: 'Actualizar Plan', url: 'https://app.waymore.io/upgrade?lang=es' }
        ]
      },
      footer: {
        tagline: 'Waymore - Potenciando tu negocio',
        social_links: [
          { platform: 'twitter', url: 'https://twitter.com/waymore' },
          { platform: 'linkedin', url: 'https://linkedin.com/company/waymore' },
          { platform: 'github', url: 'https://github.com/waymore' }
        ],
        legal_links: [
          { label: 'Política de Privacidad', url: 'https://waymore.io/privacy?lang=es' },
          { label: 'Términos de Servicio', url: 'https://waymore.io/terms?lang=es' }
        ],
        copyright: '© 2024 Waymore. Todos los derechos reservados.'
      }
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/templates/${templateKey}/locales/es`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT_TOKEN}`
      },
      body: JSON.stringify(spanishData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
    }

    console.log('✅ Spanish locale added successfully!');
  } catch (error) {
    console.error('❌ Error adding Spanish locale:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🎯 Creating SaaS Quota Research Showcase Template');
    console.log('📋 This template demonstrates all capabilities from the guide');
    console.log('🌍 Including English and Spanish locales\n');
    
    // Create base template
    const template = await createShowcaseTemplate();
    
    // Add locales
    await addEnglishLocale(template.key);
    await addSpanishLocale(template.key);
    
    console.log('\n🎉 Showcase template created successfully!');
    console.log('📧 Template Key:', template.key);
    console.log('🌍 Locales: en, es');
    console.log('🔗 View in admin:', `http://localhost:3000/admin/template-editor?template=${template.key}&mode=edit`);
    
    console.log('\n📊 Template Features Demonstrated:');
    console.log('✅ Header with logo and tagline');
    console.log('✅ Hero section with icon');
    console.log('✅ Dynamic title with styling');
    console.log('✅ Multi-paragraph body with custom fonts');
    console.log('✅ Facts table with usage data');
    console.log('✅ Progress bars with usage visualization');
    console.log('✅ Dual action buttons (primary/secondary)');
    console.log('✅ Support links section');
    console.log('✅ Footer with social and legal links');
    console.log('✅ Custom theme with colors and fonts');
    console.log('✅ Multi-language support (EN/ES)');
    console.log('✅ Realistic SaaS quota research content');
    
  } catch (error) {
    console.error('💥 Failed to create showcase template:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createShowcaseTemplate, addEnglishLocale, addSpanishLocale };
