#!/usr/bin/env node

/**
 * Comprehensive Test Script for Database Template System
 * 
 * This script tests all aspects of the database-driven template system:
 * - Template CRUD operations
 * - Locale management
 * - Template validation
 * - Email rendering with database templates
 * - API endpoints
 */

const BASE_URL = 'http://localhost:3000';

// Test data
const testTemplate = {
  key: 'test-template',
  name: 'Test Template',
  description: 'A test template for validation',
  category: 'test',
  variableSchema: {
    type: 'object',
    required: ['test_field'],
    properties: {
      test_field: {
        type: 'string',
        description: 'Test field'
      }
    }
  },
  jsonStructure: {
    title: {
      text: '{{test_field}}'
    },
    body: {
      paragraphs: ['Test content']
    }
  }
};

const testVariables = {
  test_field: 'Hello from database template!',
  workspace_name: 'Test Corp',
  user_firstname: 'Test User'
};

async function makeRequest(method, endpoint, data = null, headers = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    // Handle 204 No Content responses
    if (response.status === 204) {
      return {
        status: response.status,
        data: null,
        success: true
      };
    }
    
    const result = await response.json();
    
    return {
      status: response.status,
      data: result,
      success: response.ok
    };
  } catch (error) {
    return {
      status: 0,
      data: { error: error.message },
      success: false
    };
  }
}

async function getAuthToken() {
  const result = await makeRequest('GET', '/test-token');
  if (result.success) {
    return result.data.token;
  }
  throw new Error('Failed to get auth token');
}

async function runTests() {
  console.log('🧪 Starting Database Template System Tests\n');
  
  let authToken;
  try {
    authToken = await getAuthToken();
    console.log('✅ Authentication token obtained');
  } catch (error) {
    console.error('❌ Failed to get auth token:', error.message);
    return;
  }

  const headers = { 'Authorization': `Bearer ${authToken}` };
  let testResults = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: List existing templates
  console.log('\n📋 Test 1: List existing templates');
  const listResult = await makeRequest('GET', '/api/v1/templates');
  if (listResult.success && listResult.data.templates) {
    console.log(`✅ Found ${listResult.data.count} templates`);
    testResults.passed++;
    testResults.tests.push({ name: 'List templates', status: 'PASS' });
  } else {
    console.log('❌ Failed to list templates');
    testResults.failed++;
    testResults.tests.push({ name: 'List templates', status: 'FAIL' });
  }

  // Test 2: Get specific template
  console.log('\n📋 Test 2: Get transactional template');
  const getTemplateResult = await makeRequest('GET', '/api/v1/templates/transactional');
  if (getTemplateResult.success && getTemplateResult.data.template) {
    console.log('✅ Retrieved transactional template');
    testResults.passed++;
    testResults.tests.push({ name: 'Get template', status: 'PASS' });
  } else {
    console.log('❌ Failed to get template');
    testResults.failed++;
    testResults.tests.push({ name: 'Get template', status: 'FAIL' });
  }

  // Test 3: Create new template
  console.log('\n📋 Test 3: Create new template');
  const createResult = await makeRequest('POST', '/api/v1/templates', testTemplate, headers);
  if (createResult.success) {
    console.log('✅ Created test template');
    testResults.passed++;
    testResults.tests.push({ name: 'Create template', status: 'PASS' });
  } else {
    console.log('❌ Failed to create template:', createResult.data);
    testResults.failed++;
    testResults.tests.push({ name: 'Create template', status: 'FAIL' });
  }

  // Test 4: Validate template variables
  console.log('\n📋 Test 4: Validate template variables');
  const validateResult = await makeRequest('POST', '/api/v1/templates/transactional/validate', {
    variables: {
      ...testVariables,
      dashboard_url: 'https://app.test.com/dashboard' // Add required field
    }
  }, headers);
  if (validateResult.success && validateResult.data.valid) {
    console.log('✅ Template validation passed');
    testResults.passed++;
    testResults.tests.push({ name: 'Validate template', status: 'PASS' });
  } else {
    console.log('❌ Template validation failed:', validateResult.data);
    testResults.failed++;
    testResults.tests.push({ name: 'Validate template', status: 'FAIL' });
  }

  // Test 5: Get template variables schema
  console.log('\n📋 Test 5: Get template variables schema');
  const variablesResult = await makeRequest('GET', '/api/v1/templates/transactional/variables', null, headers);
  if (variablesResult.success && variablesResult.data.template) {
    console.log('✅ Retrieved template variables schema');
    testResults.passed++;
    testResults.tests.push({ name: 'Get template variables', status: 'PASS' });
  } else {
    console.log('❌ Failed to get template variables');
    testResults.failed++;
    testResults.tests.push({ name: 'Get template variables', status: 'FAIL' });
  }

  // Test 6: Get template documentation
  console.log('\n📋 Test 6: Get template documentation');
  const docsResult = await makeRequest('GET', '/api/v1/templates/transactional/docs', null, headers);
  if (docsResult.success && docsResult.data.documentation) {
    console.log('✅ Retrieved template documentation');
    testResults.passed++;
    testResults.tests.push({ name: 'Get template docs', status: 'PASS' });
  } else {
    console.log('❌ Failed to get template documentation');
    testResults.failed++;
    testResults.tests.push({ name: 'Get template docs', status: 'FAIL' });
  }

  // Test 7: Add locale to template
  console.log('\n📋 Test 7: Add French locale to transactional template');
  const addLocaleResult = await makeRequest('POST', '/api/v1/templates/transactional/locales', {
    locale: 'fr',
    jsonStructure: {
      title: {
        text: 'Bienvenue sur {{workspace_name}}!'
      },
      body: {
        paragraphs: [
          'Bonjour {{user_firstname}}, bienvenue sur {{workspace_name}}!',
          'Votre compte est prêt à utiliser.'
        ]
      }
    }
  }, headers);
  if (addLocaleResult.success) {
    console.log('✅ Added French locale');
    testResults.passed++;
    testResults.tests.push({ name: 'Add locale', status: 'PASS' });
  } else {
    console.log('❌ Failed to add locale:', addLocaleResult.data);
    testResults.failed++;
    testResults.tests.push({ name: 'Add locale', status: 'FAIL' });
  }

  // Test 8: Send email with database template
  console.log('\n📋 Test 8: Send email with database template');
  const emailResult = await makeRequest('POST', '/api/v1/emails', {
    to: [{ email: 'test@example.com', name: 'Test User' }],
    from: { email: 'noreply@waymore.io', name: 'Waymore' },
    subject: 'Database Template Test',
    template: {
      key: 'transactional',
      locale: 'en'
    },
    variables: testVariables
  }, { ...headers, 'Idempotency-Key': `test-${Date.now()}` });
  
  if (emailResult.success && emailResult.data.messageId) {
    console.log(`✅ Email queued successfully with message ID: ${emailResult.data.messageId}`);
    testResults.passed++;
    testResults.tests.push({ name: 'Send email with database template', status: 'PASS' });
  } else {
    console.log('❌ Failed to send email:', emailResult.data);
    testResults.failed++;
    testResults.tests.push({ name: 'Send email with database template', status: 'FAIL' });
  }

  // Test 9: Send email with French locale
  console.log('\n📋 Test 9: Send email with French locale');
  const frenchEmailResult = await makeRequest('POST', '/api/v1/emails', {
    to: [{ email: 'test@example.com', name: 'Test User' }],
    from: { email: 'noreply@waymore.io', name: 'Waymore' },
    subject: 'Test Template Français',
    template: {
      key: 'transactional',
      locale: 'fr'
    },
    variables: testVariables
  }, { ...headers, 'Idempotency-Key': `test-fr-${Date.now()}` });
  
  if (frenchEmailResult.success && frenchEmailResult.data.messageId) {
    console.log(`✅ French email queued successfully with message ID: ${frenchEmailResult.data.messageId}`);
    testResults.passed++;
    testResults.tests.push({ name: 'Send email with French locale', status: 'PASS' });
  } else {
    console.log('❌ Failed to send French email:', frenchEmailResult.data);
    testResults.failed++;
    testResults.tests.push({ name: 'Send email with French locale', status: 'FAIL' });
  }

  // Test 10: Update template
  console.log('\n📋 Test 10: Update test template');
  const updateResult = await makeRequest('PUT', '/api/v1/templates/test-template', {
    ...testTemplate,
    description: 'Updated test template description'
  }, headers);
  if (updateResult.success) {
    console.log('✅ Updated test template');
    testResults.passed++;
    testResults.tests.push({ name: 'Update template', status: 'PASS' });
  } else {
    console.log('❌ Failed to update template:', updateResult.data);
    testResults.failed++;
    testResults.tests.push({ name: 'Update template', status: 'FAIL' });
  }

  // Test 11: Delete test template
  console.log('\n📋 Test 11: Delete test template');
  const deleteResult = await makeRequest('DELETE', '/api/v1/templates/test-template', null, headers);
  if (deleteResult.success || deleteResult.status === 204) {
    console.log('✅ Deleted test template');
    testResults.passed++;
    testResults.tests.push({ name: 'Delete template', status: 'PASS' });
  } else {
    console.log('❌ Failed to delete template:', deleteResult.data);
    testResults.failed++;
    testResults.tests.push({ name: 'Delete template', status: 'FAIL' });
  }

  // Test 12: Delete French locale
  console.log('\n📋 Test 12: Delete French locale');
  const deleteLocaleResult = await makeRequest('DELETE', '/api/v1/templates/transactional/locales/fr', null, headers);
  if (deleteLocaleResult.success || deleteLocaleResult.status === 204) {
    console.log('✅ Deleted French locale');
    testResults.passed++;
    testResults.tests.push({ name: 'Delete locale', status: 'PASS' });
  } else {
    console.log('❌ Failed to delete locale:', deleteLocaleResult.data);
    testResults.failed++;
    testResults.tests.push({ name: 'Delete locale', status: 'FAIL' });
  }

  // Print test summary
  console.log('\n📊 Test Summary');
  console.log('================');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  console.log('\n📋 Detailed Results:');
  testResults.tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${test.name}: ${test.status}`);
  });

  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! Database template system is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the implementation.');
  }
}

// Run tests
runTests().catch(console.error);
