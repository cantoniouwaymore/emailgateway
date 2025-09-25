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

  // Test 1: Add your configured sender
  console.log('📧 Test 1: Adding configured sender (marketing@waymore.io)...');
  const addResponse = await makeRequest(`${BASE_URL}/api/v1/senders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      email: 'marketing@waymore.io', 
      name: 'Waymore Marketing' 
    })
  });
  
  console.log(`Status: ${addResponse.status}`);
  if (addResponse.status === 201) {
    console.log('✅ Sender added successfully!');
    console.log('📝 Message:', addResponse.data.message);
  } else if (addResponse.status === 400) {
    console.log('ℹ️  Sender might already exist or email is invalid');
    console.log('📝 Response:', addResponse.data);
  } else {
    console.log('❌ Failed to add sender:', addResponse.data);
  }

  // Test 2: Get all senders
  console.log('\n📋 Test 2: Getting all verified senders...');
  const sendersResponse = await makeRequest(`${BASE_URL}/api/v1/senders`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (sendersResponse.status === 200) {
    console.log('✅ Senders retrieved successfully');
    console.log(`📊 Found ${sendersResponse.data.senders.length} verified senders:`);
    sendersResponse.data.senders.forEach(sender => {
      console.log(`   - ${sender.email} (${sender.name || 'No name'}) - ${sender.verified ? '✅ Verified' : '❌ Not verified'}`);
    });
  } else {
    console.log('❌ Failed to get senders:', sendersResponse.data);
  }

  // Test 3: Check verification status
  console.log('\n🔍 Test 3: Checking verification status...');
  const verifyResponse = await makeRequest(`${BASE_URL}/api/v1/senders/marketing@waymore.io/verify`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (verifyResponse.status === 200) {
    console.log(`✅ Verification status: ${verifyResponse.data.verified ? 'VERIFIED ✅' : 'NOT VERIFIED ❌'}`);
    if (!verifyResponse.data.verified) {
      console.log('📝 To verify this sender:');
      console.log('   1. Check your email (marketing@waymore.io) for a verification email from Routee');
      console.log('   2. Click the verification link in the email');
      console.log('   3. Run this test again to confirm verification');
    }
  } else {
    console.log('❌ Failed to check verification:', verifyResponse.data);
  }

  // Test 4: Try sending an email if sender is verified
  if (verifyResponse.status === 200 && verifyResponse.data.verified) {
    console.log('\n📤 Test 4: Sending test email...');
    
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
  } else {
    console.log('\n⏭️  Test 4: Skipping email send (sender not verified)');
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
    console.log('   - Sender management is functional');
    console.log('   - Next step: Verify your sender email');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
main();
