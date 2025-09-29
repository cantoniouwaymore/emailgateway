#!/usr/bin/env node

/**
 * Script to send the Universal Showcase Template from database to cantoniou@waymore.io
 */

// No template engine imports needed - we're only sending email with template key and variables

async function sendUniversalShowcase() {
  console.log('🚀 Sending Universal Showcase Template...');

  try {
    console.log('📤 Preparing to send email...');
    
    // Get JWT token (for development)
    const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LWNsaWVudCIsImlzcyI6ImVtYWlsLWdhdGV3YXkiLCJhdWQiOiJ3YXltb3JlLXBsYXRmb3JtIiwic2NvcGUiOlsiZW1haWxzOnNlbmQiLCJlbWFpbHM6cmVhZCJdLCJleHAiOjE3NTkxNDMxMTIsImlhdCI6MTc1OTEzOTUxMn0.BKK6zOq-q0SMw5FQwHrwvFU9Mxp0t9Cd3_ldi_H0YrY';
    console.log('🔑 Using fresh JWT token');

    // Prepare email request - ONLY template key, locale, and variable values
    const emailRequest = {
      to: [
        {
          email: 'cantoniou@waymore.io',
          name: 'Antonio'
        }
      ],
      subject: 'Universal Template Showcase',
      template: {
        key: 'universal-showcase',
        locale: 'en'
      },
      variables: {
        // Only the actual values that need to be replaced in the template
        header: {
          logo_url: 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png',
          logo_alt: 'Waymore',
          tagline: 'Template Showcase'
        },
        hero: {
          type: 'icon',
          icon: '🎨'
        },
        title: {
          text: 'Universal Template Showcase',
          size: '32px',
          weight: '700',
          color: '#1f2937',
          align: 'center'
        },
        body: {
          paragraphs: [
            'This template showcases ALL available sections and customization options.',
            'You can customize every aspect of your email template using the object-based structure.',
            'Each section can be shown or hidden, and styled according to your brand guidelines.'
          ]
        },
        snapshot: {
          title: 'Template Features',
          facts: [
            { label: 'Sections Available', value: '9' },
            { label: 'Customization Options', value: '50+' },
            { label: 'Theme Support', value: 'Complete' },
            { label: 'Responsive Design', value: 'Yes' }
          ],
          style: 'table'
        },
        actions: {
          primary: {
            label: 'Update Payment Method',
            url: 'https://app.waymore.io/billing/payment-methods',
            style: 'button',
            color: '#dc2626',
            text_color: '#ffffff'
          },
          secondary: {
            label: 'Contact Support',
            url: 'mailto:billing@waymore.io',
            style: 'button',
            color: '#6b7280',
            text_color: '#ffffff'
          }
        },
        visual: {
          type: 'progress_bars',
          progress_bars: [
            {
              label: 'Template Completion',
              current: 100,
              max: 100,
              unit: '%',
              percentage: 100,
              color: '#10b981',
              description: 'All features implemented'
            }
          ]
        },
        countdown: {
          message: 'Limited Time Offer!',
          target_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          show_days: true,
          show_hours: true,
          show_minutes: true,
          show_seconds: false
        },
        support: {
          title: 'Need help?',
          links: [
            { label: 'Documentation', url: 'https://docs.example.com' },
            { label: 'Contact Support', url: 'mailto:support@example.com' }
          ]
        },
        footer: {
          logo: {
            width: '120px',
            url: 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png',
            alt: 'Waymore'
          },
          tagline: 'Empowering your business',
          copyright: '© 2024 Company. All rights reserved.',
          social_links: [
            { platform: 'twitter', url: 'https://twitter.com/company' },
            { platform: 'linkedin', url: 'https://linkedin.com/company/company' }
          ],
          legal_links: [
            { label: 'Privacy Policy', url: 'https://example.com/privacy' },
            { label: 'Terms of Service', url: 'https://example.com/terms' }
          ]
        }
      },
      metadata: {
        tenantId: 'waymore',
        eventId: 'universal-showcase-demo'
      }
    };

    // Send email via API
    const fetch = require('node-fetch');
    const crypto = require('crypto');
    
    const apiUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    const idempotencyKey = crypto.randomUUID();
    
    console.log('🌐 Sending request to:', `${apiUrl}/api/v1/emails`);
    console.log('🔑 Using idempotency key:', idempotencyKey);
    
    const response = await fetch(`${apiUrl}/api/v1/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(emailRequest)
    });

    const responseData = await response.json();
    
    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Message ID:', responseData.messageId);
      console.log('📊 Status:', responseData.status);
    } else {
      console.log('❌ Failed to send email');
      console.log('📋 Response:', JSON.stringify(responseData, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📋 Stack:', error.stack);
  }
}

// Run the script
sendUniversalShowcase();
