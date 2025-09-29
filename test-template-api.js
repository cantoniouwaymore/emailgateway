#!/usr/bin/env node

/**
 * Test script for template API
 */

const { TemplateEngine } = require('./dist/templates/engine');

async function testTemplateAPI() {
  console.log('🧪 Testing template API...');

  try {
    const engine = new TemplateEngine();

    // Test 1: Get available templates
    console.log('\n1. Getting available templates...');
    const templates = await engine.getAvailableTemplates();
    console.log('Available templates:', JSON.stringify(templates, null, 2));

    // Test 2: Get specific template
    console.log('\n2. Getting transactional template...');
    const template = await engine.getTemplate('transactional');
    console.log('Template details:', {
      key: template?.key,
      name: template?.name,
      locales: template?.locales?.map(l => l.locale)
    });

    console.log('\n✅ Template API tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testTemplateAPI()
    .then(() => {
      console.log('✅ Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testTemplateAPI };
