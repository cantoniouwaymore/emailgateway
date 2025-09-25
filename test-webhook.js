#!/usr/bin/env node

/**
 * Test script for webhook functionality
 * This script simulates Routee webhook events to test the webhook endpoint
 */

const fetch = require('node-fetch');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const WEBHOOK_URL = `${BASE_URL}/webhooks/routee`;

// Sample Routee webhook payload
const webhookPayload = {
  events: [
    {
      trackingId: 'routee_tracking_123456',
      eventType: 'delivered',
      timestamp: new Date().toISOString(),
      details: {
        recipient: 'test@example.com',
        deliveryTime: new Date().toISOString()
      }
    },
    {
      trackingId: 'routee_tracking_789012',
      eventType: 'bounce',
      timestamp: new Date().toISOString(),
      details: {
        recipient: 'bounced@example.com',
        bounceType: 'hard',
        reason: 'Invalid email address'
      }
    },
    {
      trackingId: 'routee_tracking_345678',
      eventType: 'open',
      timestamp: new Date().toISOString(),
      details: {
        recipient: 'opened@example.com',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }
  ]
};

async function testWebhook() {
  console.log('🧪 Testing webhook endpoint...');
  console.log(`📡 Webhook URL: ${WEBHOOK_URL}`);
  console.log(`📦 Payload: ${JSON.stringify(webhookPayload, null, 2)}`);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Routee-Signature': 'test-signature',
        'X-Routee-Timestamp': Date.now().toString()
      },
      body: JSON.stringify(webhookPayload)
    });

    const result = await response.json();

    console.log(`✅ Response Status: ${response.status}`);
    console.log(`📋 Response Body:`, result);

    if (response.ok) {
      console.log('🎉 Webhook test successful!');
      console.log(`📊 Processed: ${result.processed}, Failed: ${result.failed}, Total: ${result.total}`);
    } else {
      console.log('❌ Webhook test failed');
    }

  } catch (error) {
    console.error('💥 Error testing webhook:', error.message);
    process.exit(1);
  }
}

async function testWebhookWithInvalidPayload() {
  console.log('\n🧪 Testing webhook with invalid payload...');

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ invalid: 'payload' })
    });

    const result = await response.json();

    console.log(`✅ Response Status: ${response.status}`);
    console.log(`📋 Response Body:`, result);

    if (response.status === 400) {
      console.log('🎉 Invalid payload correctly rejected!');
    } else {
      console.log('❌ Expected 400 status for invalid payload');
    }

  } catch (error) {
    console.error('💥 Error testing invalid payload:', error.message);
  }
}

async function testWebhookSignatureValidation() {
  console.log('\n🧪 Testing webhook signature validation...');

  const secret = 'test-secret';
  const timestamp = Date.now().toString();
  const payload = JSON.stringify(webhookPayload);
  
  // Create a valid signature
  const crypto = require('crypto');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(timestamp + payload)
    .digest('hex');

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Routee-Signature': signature,
        'X-Routee-Timestamp': timestamp
      },
      body: payload
    });

    const result = await response.json();

    console.log(`✅ Response Status: ${response.status}`);
    console.log(`📋 Response Body:`, result);

    if (response.ok) {
      console.log('🎉 Signature validation test successful!');
    } else {
      console.log('❌ Signature validation test failed');
    }

  } catch (error) {
    console.error('💥 Error testing signature validation:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting webhook tests...\n');

  // Test 1: Valid webhook payload
  await testWebhook();

  // Test 2: Invalid webhook payload
  await testWebhookWithInvalidPayload();

  // Test 3: Signature validation (if secret is configured)
  if (process.env.ROUTEE_WEBHOOK_SECRET) {
    await testWebhookSignatureValidation();
  } else {
    console.log('\n⚠️  Skipping signature validation test (ROUTEE_WEBHOOK_SECRET not set)');
  }

  console.log('\n✨ Webhook tests completed!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testWebhook, testWebhookWithInvalidPayload, testWebhookSignatureValidation };
