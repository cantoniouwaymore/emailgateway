#!/usr/bin/env node

/**
 * Test script to verify template preview shows placeholders instead of actual values
 */

const fetch = require('node-fetch');

async function testTemplatePreview() {
  console.log('🧪 Testing template preview with placeholders...');

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

    // Check for placeholders instead of actual values
    const hasPlaceholders = html.includes('{{') && html.includes('}}');
    console.log('🔍 Contains placeholders:', hasPlaceholders);

    // Check for specific placeholders
    const placeholders = [
      '{{logo_url}}',
      '{{tagline}}',
      '{{text}}',
      '{{paragraph_1}}',
      '{{fact_label_1}}',
      '{{fact_value_1}}'
    ];

    console.log('\n📋 Checking for specific placeholders:');
    placeholders.forEach(placeholder => {
      const found = html.includes(placeholder);
      console.log(`  ${found ? '✅' : '❌'} ${placeholder}: ${found ? 'Found' : 'Not found'}`);
    });

    // Check that we DON'T have actual values
    const actualValues = [
      'Update Payment Method',
      'Contact Support',
      'Limited Time Offer',
      'Waymore',
      'Template Showcase'
    ];

    console.log('\n🚫 Checking that actual values are NOT present:');
    actualValues.forEach(value => {
      const found = html.includes(value);
      console.log(`  ${found ? '❌' : '✅'} "${value}": ${found ? 'Found (should not be)' : 'Not found (good)'}`);
    });

    // Save the preview HTML for inspection
    const fs = require('fs');
    const path = require('path');
    
    const outputPath = path.join(__dirname, 'template-preview-test.html');
    fs.writeFileSync(outputPath, html);
    console.log('\n💾 Preview HTML saved to:', outputPath);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testTemplatePreview();
