#!/usr/bin/env node

/**
 * Test script to verify CTA buttons and countdown functionality
 */

const { TemplateEngine } = require('./dist/templates/engine');

async function testTemplateFixes() {
  console.log('🧪 Testing template fixes...');

  try {
    const templateEngine = new TemplateEngine();
    
    // Test with button style actions and countdown
    const renderedTemplate = await templateEngine.renderTemplate({
      key: 'universal-showcase',
      locale: 'en',
      variables: {
        // Actions with button style
        actions: {
          show: true,
          primary: {
            show: true,
            label: 'Test Primary Button',
            url: 'https://example.com/primary',
            style: 'button',
            color: '#dc2626',
            text_color: '#ffffff'
          },
          secondary: {
            show: true,
            label: 'Test Secondary Button',
            url: 'https://example.com/secondary',
            style: 'button',
            color: '#6b7280',
            text_color: '#ffffff'
          },
          padding: '0px 0px 40px 0px'
        },
        
        // Countdown section
        countdown: {
          show: true,
          message: 'Limited Time Offer!',
          target_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          show_days: true,
          show_hours: true,
          show_minutes: true,
          show_seconds: false,
          padding: '0px 0px 30px 0px'
        },
        
        // Minimal other sections
        title: {
          show: true,
          text: 'Test Template Fixes',
          size: '32px',
          weight: '700',
          color: '#1f2937',
          align: 'center',
          padding: '40px 0px 20px 0px'
        },
        
        body: {
          show: true,
          paragraphs: [
            'This template tests the CTA button and countdown fixes.',
            'The buttons should render as proper buttons, not links.',
            'The countdown should show the remaining time.'
          ],
          font_size: '16px',
          line_height: '26px',
          color: '#374151',
          padding: '0px 0px 30px 0px'
        }
      }
    });

    console.log('✅ Template rendered successfully');
    console.log('📧 HTML length:', renderedTemplate.html?.length || 0);
    console.log('📝 Text length:', renderedTemplate.text?.length || 0);
    console.log('📋 Subject:', renderedTemplate.subject);

    // Check for button elements in HTML
    const hasButtons = renderedTemplate.html?.includes('mj-button') || renderedTemplate.html?.includes('button');
    console.log('🔘 Contains button elements:', hasButtons);

    // Check for countdown elements in HTML
    const hasCountdown = renderedTemplate.html?.includes('countdown') || renderedTemplate.html?.includes('Limited Time Offer');
    console.log('⏰ Contains countdown elements:', hasCountdown);

    // Save the test template
    const fs = require('fs');
    const path = require('path');
    
    const outputPath = path.join(__dirname, 'test-template-fixes.html');
    fs.writeFileSync(outputPath, renderedTemplate.html);
    console.log('💾 Test template saved to:', outputPath);

    // Check specific elements
    if (renderedTemplate.html?.includes('Test Primary Button')) {
      console.log('✅ Primary button text found in HTML');
    } else {
      console.log('❌ Primary button text NOT found in HTML');
    }

    if (renderedTemplate.html?.includes('Test Secondary Button')) {
      console.log('✅ Secondary button text found in HTML');
    } else {
      console.log('❌ Secondary button text NOT found in HTML');
    }

    if (renderedTemplate.html?.includes('Limited Time Offer')) {
      console.log('✅ Countdown message found in HTML');
    } else {
      console.log('❌ Countdown message NOT found in HTML');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📋 Stack:', error.stack);
  }
}

// Run the test
testTemplateFixes();
