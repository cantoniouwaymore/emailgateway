/**
 * Waymore Transactional Emails Service API Usage Examples
 * 
 * This file demonstrates how to use the Waymore Transactional Emails Service API programmatically.
 * Copy and modify these examples for your application.
 */

const BASE_URL = 'http://localhost:3000';

// Example 1: Get JWT Token
async function getJWTToken() {
  try {
    const response = await fetch(`${BASE_URL}/test-token`);
    const data = await response.json();
    console.log('JWT Token:', data.token);
    return data.token;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
}

// Example 2: Send Email
async function sendEmail(jwtToken) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        'Idempotency-Key': `example-${Date.now()}`
      },
      body: JSON.stringify({
        from: {
          email: "marketing@waymore.io",
          name: "Waymore Team"
        },
        subject: "Welcome to Waymore Platform",
        template: {
          key: "universal",
          locale: "en"
        },
        to: [
          {
            email: "recipient@example.com",
            name: "Recipient Name"
          }
        ],
        variables: {
          title: "Welcome to Waymore",
          details: "Thank you for joining our platform!",
          status: "New User",
          provider: "Waymore Platform"
        }
      })
    });

    const data = await response.json();
    console.log('Email sent:', data);
    return data.messageId;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Example 3: Check Message Status
async function checkMessageStatus(messageId, jwtToken) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/messages/${messageId}`, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });
    const data = await response.json();
    console.log('Message status:', data);
    return data;
  } catch (error) {
    console.error('Error checking status:', error);
    throw error;
  }
}

// Example 4: Send Email with Webhook
async function sendEmailWithWebhook(jwtToken) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        'Idempotency-Key': `webhook-example-${Date.now()}`
      },
      body: JSON.stringify({
        from: {
          email: "marketing@waymore.io",
          name: "Waymore Team"
        },
        subject: "Email with Webhook",
        template: {
          key: "universal",
          locale: "en"
        },
        to: [
          {
            email: "recipient@example.com",
            name: "Recipient Name"
          }
        ],
        webhookUrl: "https://your-app.com/webhooks/email-status",
        variables: {
          title: "Webhook Test",
          details: "This email includes webhook notifications.",
          status: "Webhook Enabled",
          provider: "Waymore Platform"
        }
      })
    });

    const data = await response.json();
    console.log('Email with webhook sent:', data);
    return data.messageId;
  } catch (error) {
    console.error('Error sending email with webhook:', error);
    throw error;
  }
}

// Example 5: Send to Multiple Recipients
async function sendToMultipleRecipients(jwtToken) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        'Idempotency-Key': `multi-recipient-${Date.now()}`
      },
      body: JSON.stringify({
        from: {
          email: "marketing@waymore.io",
          name: "Waymore Team"
        },
        subject: "Important Update",
        template: {
          key: "universal",
          locale: "en"
        },
        to: [
          {
            email: "user1@example.com",
            name: "User One"
          },
          {
            email: "user2@example.com",
            name: "User Two"
          }
        ],
        cc: [
          {
            email: "manager@example.com",
            name: "Manager"
          }
        ],
        variables: {
          title: "Important Update",
          details: "We have an important update for you.",
          status: "Update Required",
          provider: "Waymore Platform"
        }
      })
    });

    const data = await response.json();
    console.log('Multi-recipient email sent:', data);
    return data.messageId;
  } catch (error) {
    console.error('Error sending multi-recipient email:', error);
    throw error;
  }
}

// Example 6: Check System Health
async function checkSystemHealth() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('System health:', data);
    return data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
}

// Example 7: Simulate Webhook Event
async function simulateWebhookEvent(providerMessageId) {
  try {
    const response = await fetch(`${BASE_URL}/webhooks/routee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        events: [
          {
            trackingId: providerMessageId,
            eventType: "delivered",
            timestamp: new Date().toISOString(),
            details: {
              recipient: "recipient@example.com",
              deliveryTime: new Date().toISOString()
            }
          }
        ]
      })
    });

    const data = await response.json();
    console.log('Webhook event processed:', data);
    return data;
  } catch (error) {
    console.error('Error simulating webhook:', error);
    throw error;
  }
}

// Complete Example: Full Email Flow
async function completeEmailFlow() {
  try {
    console.log('🚀 Starting complete email flow...');
    
    // 1. Check system health
    console.log('\n1. Checking system health...');
    await checkSystemHealth();
    
    // 2. Get JWT token
    console.log('\n2. Getting JWT token...');
    const token = await getJWTToken();
    
    // 3. Send email
    console.log('\n3. Sending email...');
    const messageId = await sendEmail(token);
    
    // 4. Check message status
    console.log('\n4. Checking message status...');
    await checkMessageStatus(messageId, token);
    
    // 5. Wait a moment for processing
    console.log('\n5. Waiting for email processing...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 6. Check status again
    console.log('\n6. Checking final status...');
    await checkMessageStatus(messageId, token);
    
    console.log('\n✅ Complete email flow finished!');
    console.log(`📱 Check admin dashboard: ${BASE_URL}/admin`);
    
  } catch (error) {
    console.error('❌ Error in complete flow:', error);
  }
}

// Export functions for use in other files
module.exports = {
  getJWTToken,
  sendEmail,
  checkMessageStatus,
  sendEmailWithWebhook,
  sendToMultipleRecipients,
  checkSystemHealth,
  simulateWebhookEvent,
  completeEmailFlow
};

// Run complete example if this file is executed directly
if (require.main === module) {
  completeEmailFlow();
}
