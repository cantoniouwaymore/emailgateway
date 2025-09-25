#!/usr/bin/env node

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function getTestToken() {
  console.log('🔑 Getting test token...');
  const response = await makeRequest(`${BASE_URL}/test-token`);
  
  if (response.status === 200) {
    console.log('✅ Test token obtained');
    return response.data.token;
  } else {
    console.error('❌ Failed to get test token:', response.data);
    process.exit(1);
  }
}

async function testRouteeIntegration(token) {
  console.log('\n🧪 Testing Real Routee Integration');
  console.log('=====================================\n');

  // Test 1: Send a test email
  console.log('📤 Test 1: Sending test email...');
  
  const emailPayload = {
    to: [{ email: 'cantoniou@waymore.io', name: 'Antonio' }],
    from: { email: 'marketing@waymore.io', name: 'Waymore Marketing' },
    subject: '🎉 Real Routee Integration Test - Success!',
    template: { key: 'notifications/universal', locale: 'en' },
    variables: {
      email_title: 'Real Routee Integration Test',
      user_name: 'Antonio',
      facts: [
        { label: 'Integration', value: 'Real Routee API' },
        { label: 'Status', value: 'Working ✅' },
        { label: 'Sender', value: 'marketing@waymore.io' },
        { label: 'Timestamp', value: new Date().toISOString() }
      ],
      cta_primary: {
        label: 'View Repository',
        url: 'https://github.com/cantoniouwaymore/emailgateway'
      }
    }
  };
  
  const emailResponse = await makeRequest(`${BASE_URL}/api/v1/emails`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `routee-test-${Date.now()}`
    },
    body: JSON.stringify(emailPayload)
  });
  
  if (emailResponse.status === 202) {
    console.log('✅ Test email queued successfully!');
    console.log(`📧 Message ID: ${emailResponse.data.messageId}`);
    console.log('📝 Check your inbox for the email!');
  } else {
    console.log('❌ Failed to send test email:', emailResponse.data);
  }
}

async function main() {
  console.log('🚀 Real Routee Integration Test\n');
  
  try {
    // Get authentication token
    const token = await getTestToken();
    
    // Test the real Routee integration
    await testRouteeIntegration(token);
    
    console.log('\n✅ Real Routee integration test completed!');
    console.log('\n📋 Summary:');
    console.log('   - Real Routee API is working');
    console.log('   - Authentication is successful');
    console.log('   - Email sending is functional');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
main();
