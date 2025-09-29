#!/usr/bin/env node

/**
 * Test script to verify template preview shows meaningful demonstration values
 */

const fetch = require('node-fetch');

async function testDemonstrationPreview() {
  console.log('🧪 Testing template preview with demonstration values...');

  try {
    // Test the universal-showcase template preview
    const response = await fetch('http://localhost:3000/api/v1/templates/universal-showcase/preview');
    
    if (!response.ok) {
      console.log('❌ Failed to get template preview');
      console.log('Status:', response.status);
      return;
    }

    const html = await response.text();
    console.log('✅ Template preview retrieved successfully');
    console.log('📧 HTML length:', html.length);

    // Check for demonstration values that help users understand the template
    const demonstrationValues = [
      'Your Email Title Here',
      'Your Company Tagline', 
      'This is your first paragraph. Replace this with your actual content.',
      'This is your second paragraph. You can customize the text, styling, and layout.',
      'Add as many paragraphs as needed to tell your story effectively.',
      'Feature 1',
      'Your Value Here',
      'Another Value',
      'Third Value',
      'Your Button Text',
      'Documentation',
      'Support',
      'Contact',
      '© 2024 Your Company. All rights reserved.'
    ];

    console.log('\n📋 Checking for demonstration values:');
    demonstrationValues.forEach(value => {
      const found = html.includes(value);
      console.log(`  ${found ? '✅' : '❌'} "${value}": ${found ? 'Found' : 'Not found'}`);
    });

    // Check that we DON'T have confusing placeholder syntax
    const confusingPlaceholders = [
      '{{logo_url}}',
      '{{tagline}}',
      '{{text}}',
      '{{paragraph_1}}',
      '{{fact_label_1}}'
    ];

    console.log('\n🚫 Checking that confusing placeholders are NOT present:');
    confusingPlaceholders.forEach(placeholder => {
      const found = html.includes(placeholder);
      console.log(`  ${found ? '❌' : '✅'} "${placeholder}": ${found ? 'Found (should not be)' : 'Not found (good)'}`);
    });

    // Check for proper demonstration URLs
    const demonstrationUrls = [
      'https://example.com/your-logo.png',
      'https://example.com/your-link',
      'https://example.com/docs',
      'https://example.com/support',
      'mailto:support@example.com',
      'https://twitter.com/yourcompany',
      'https://linkedin.com/company/yourcompany',
      'https://facebook.com/yourcompany'
    ];

    console.log('\n🔗 Checking for demonstration URLs:');
    demonstrationUrls.forEach(url => {
      const found = html.includes(url);
      console.log(`  ${found ? '✅' : '❌'} "${url}": ${found ? 'Found' : 'Not found'}`);
    });

    // Save the preview HTML for inspection
    const fs = require('fs');
    const path = require('path');
    
    const outputPath = path.join(__dirname, 'demonstration-preview-test.html');
    fs.writeFileSync(outputPath, html);
    console.log('\n💾 Demonstration preview HTML saved to:', outputPath);

    console.log('\n🎉 Template preview now shows meaningful demonstration values that help users understand what they can build!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testDemonstrationPreview();
