#!/usr/bin/env node

const http = require('http');

async function testAPI() {
  console.log('🧪 Testing Email Gateway API...\n');

  // Test 1: Get test token
  console.log('1️⃣ Getting test token...');
  try {
    const tokenResponse = await makeRequest('GET', '/test-token');
    const tokenData = JSON.parse(tokenResponse);
    console.log('✅ Test token generated:', tokenData.token.substring(0, 20) + '...');
    
    const token = tokenData.token;

    // Test 2: Send email
    console.log('\n2️⃣ Sending test email...');
    const emailPayload = {
      to: [{ email: 'test@example.com', name: 'Test User' }],
      from: { email: 'no-reply@waymore.io', name: 'Waymore' },
      subject: 'Test Email from Gateway',
      template: { key: 'notifications/universal', locale: 'en' },
      variables: {
        email_title: 'Welcome to Waymore! 🚀',
        facts: [
          { label: 'Account Type', value: 'Premium' },
          { label: 'Created', value: '2024-01-01' },
          { label: 'Status', value: 'Active' }
        ],
        cta_primary: {
          label: 'Get Started',
          url: 'https://app.waymore.io'
        }
      },
      metadata: { tenantId: 'wm_test_123' }
    };

    const emailResponse = await makeRequest('POST', '/api/v1/emails', emailPayload, {
      'Authorization': `Bearer ${token}`,
      'Idempotency-Key': `test-${Date.now()}`
    });

    const emailResult = JSON.parse(emailResponse);
    console.log('✅ Email queued successfully:', emailResult);
    
    const messageId = emailResult.messageId;

    // Test 3: Check message status
    console.log('\n3️⃣ Checking message status...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    const statusResponse = await makeRequest('GET', `/api/v1/messages/${messageId}`, null, {
      'Authorization': `Bearer ${token}`
    });

    const statusResult = JSON.parse(statusResponse);
    console.log('✅ Message status:', statusResult);

    // Test 4: Health check
    console.log('\n4️⃣ Checking health...');
    const healthResponse = await makeRequest('GET', '/health');
    const healthResult = JSON.parse(healthResponse);
    console.log('✅ Health check:', healthResult.status);

    console.log('\n🎉 All tests passed! Email Gateway is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
    process.exit(1);
  }
}

function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData);
        } else {
          const error = new Error(`HTTP ${res.statusCode}: ${responseData}`);
          error.response = responseData;
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Run tests
testAPI().catch(console.error);
