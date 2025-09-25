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

async function addSender(token, email, name) {
  console.log(`📧 Adding sender: ${email} (${name})...`);
  
  const response = await makeRequest(`${BASE_URL}/api/v1/senders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, name })
  });
  
  if (response.status === 201) {
    console.log('✅ Sender added successfully');
    console.log('📝 Message:', response.data.message);
    return true;
  } else if (response.status === 501) {
    console.log('ℹ️  Sender management requires real Routee API implementation');
    console.log('📝 To use real Routee API, configure:');
    console.log('   ROUTEE_CLIENT_ID="your-client-id"');
    console.log('   ROUTEE_CLIENT_SECRET="your-client-secret"');
    return false;
  } else {
    console.error('❌ Failed to add sender:', response.data);
    return false;
  }
}

async function getSenders(token) {
  console.log('📋 Getting verified senders...');
  
  const response = await makeRequest(`${BASE_URL}/api/v1/senders`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 200) {
    console.log('✅ Senders retrieved successfully');
    console.log(`📊 Found ${response.data.senders.length} verified senders:`);
    response.data.senders.forEach(sender => {
      console.log(`   - ${sender.email} (${sender.name || 'No name'}) - ${sender.verified ? '✅ Verified' : '❌ Not verified'}`);
    });
    return response.data.senders;
  } else if (response.status === 501) {
    console.log('ℹ️  Sender management requires real Routee API implementation');
    return [];
  } else {
    console.error('❌ Failed to get senders:', response.data);
    return [];
  }
}

async function checkSenderVerification(token, email) {
  console.log(`🔍 Checking verification status for: ${email}...`);
  
  const response = await makeRequest(`${BASE_URL}/api/v1/senders/${encodeURIComponent(email)}/verify`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 200) {
    console.log(`✅ Verification status: ${response.data.verified ? 'VERIFIED' : 'NOT VERIFIED'}`);
    return response.data.verified;
  } else if (response.status === 501) {
    console.log('ℹ️  Sender management requires real Routee API implementation');
    return false;
  } else {
    console.error('❌ Failed to check verification:', response.data);
    return false;
  }
}

async function checkHealth() {
  console.log('🏥 Checking health status...');
  
  const response = await makeRequest(`${BASE_URL}/health`);
  
  if (response.status === 200) {
    console.log('✅ Health check passed');
    if (response.data.checks && response.data.checks.providers) {
      const providers = response.data.checks.providers;
      console.log(`📊 Provider status: ${providers.status}`);
      console.log(`📋 Available providers: ${providers.available.join(', ')}`);
      console.log(`🎯 Active provider: ${providers.active}`);
      
      if (providers.details && providers.details.verifiedSendersCount !== undefined) {
        console.log(`📧 Verified senders: ${providers.details.verifiedSendersCount}`);
        if (providers.details.verifiedSenders && providers.details.verifiedSenders.length > 0) {
          console.log('📋 Verified sender emails:');
          providers.details.verifiedSenders.forEach(email => {
            console.log(`   - ${email}`);
          });
        }
      }
    }
  } else {
    console.error('❌ Health check failed:', response.data);
  }
}

async function sendTestEmail(token, fromEmail) {
  console.log(`📤 Sending test email from: ${fromEmail}...`);
  
  const emailPayload = {
    to: [{ email: 'cantoniou@waymore.io', name: 'Antonio' }],
    from: { email: fromEmail, name: 'Email Gateway Test' },
    subject: '🧪 Sender Verification Test',
    template: { key: 'notifications/universal', locale: 'en' },
    variables: {
      email_title: 'Sender Verification Test',
      user_name: 'Antonio',
      facts: [
        { label: 'Test Type', value: 'Sender Verification' },
        { label: 'From Address', value: fromEmail },
        { label: 'Timestamp', value: new Date().toISOString() }
      ]
    }
  };
  
  const response = await makeRequest(`${BASE_URL}/api/v1/emails`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `test-sender-${Date.now()}`
    },
    body: JSON.stringify(emailPayload)
  });
  
  if (response.status === 202) {
    console.log('✅ Test email queued successfully');
    console.log(`📧 Message ID: ${response.data.messageId}`);
    return response.data.messageId;
  } else {
    console.error('❌ Failed to send test email:', response.data);
    return null;
  }
}

async function main() {
  console.log('🚀 Routee Sender Management Test\n');
  
  try {
    // Get authentication token
    const token = await getTestToken();
    console.log();
    
    // Check current health
    await checkHealth();
    console.log();
    
    // Test sender management
    const testEmail = 'no-reply@waymore.io';
    const testName = 'Waymore Platform';
    
    console.log('📧 Testing sender management...\n');
    
    // Add a sender
    const senderAdded = await addSender(token, testEmail, testName);
    console.log();
    
    // Get all senders
    const senders = await getSenders(token);
    console.log();
    
    // Check verification status
    const isVerified = await checkSenderVerification(token, testEmail);
    console.log();
    
    // Send test email if sender is verified
    if (isVerified) {
      await sendTestEmail(token, testEmail);
    } else {
      console.log('ℹ️  Skipping test email - sender not verified');
      console.log('📝 Please check your email for verification instructions');
    }
    
    console.log('\n✅ Sender management test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
main();
