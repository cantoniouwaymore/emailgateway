import fetch from 'node-fetch';
import { randomUUID } from 'crypto';

// JWT token for authentication
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LWNsaWVudCIsImlzcyI6ImVtYWlsLWdhdGV3YXkiLCJhdWQiOiJ3YXltb3JlLXBsYXRmb3JtIiwic2NvcGUiOlsiZW1haWxzOnNlbmQiLCJlbWFpbHM6cmVhZCJdLCJleHAiOjE3NTkyNzYzNzAsImlhdCI6MTc1OTI3Mjc3MH0.p0HNmxK2WKol2StRkfwt9JAW_HMjzKuIr-O1Ut2CXec';
const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function sendSingleTest() {
  console.log('📧 Sending Single Test Email - Subscription Renewal Reminder (English)\n');

  try {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Complete realistic variables
    const variables = {
      user: {
        name: 'Antonio Uwaymore',
        first_name: 'Antonio',
        email: 'cantoniou@waymore.io',
        role: 'Platform Administrator',
        workspace_name: 'Waymore Enterprise'
      },
      company: {
        name: 'Waymore',
        logo_url: 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png',
        website: 'https://waymore.io',
        support_email: 'support@waymore.io'
      },
      subscription: {
        plan_name: 'Pro Plan',
        renewal_date: formatDate(futureDate),
        days_until_expiry: 7,
        billing_cycle: 'Monthly',
        next_amount: '$29.99',
        currency: 'USD',
        auto_renewal: 'Enabled',
        urgency_percentage: 100,
        subscription_id: 'sub_pro_20250923',
        started_date: '2024-09-30'
      },
      actions: {
        manage_subscription_url: 'https://app.waymore.io/billing/manage?sub=sub_pro_20250923',
        billing_portal_url: 'https://app.waymore.io/billing',
        contact_support_url: 'https://waymore.io/support?topic=renewal'
      },
      // Progress bar variables
      currentValue: '7',
      countdownMessage: 'Your subscription expires in',
      targetDate: futureDate.toISOString()
    };

    const emailRequest = {
      to: [
        {
          email: 'cantoniou@waymore.io',
          name: 'Antonio Uwaymore'
        }
      ],
      subject: '✅ TEST - Subscription Renewal in 7 Days - Pro Plan',
      template: {
        key: 'subscription-renewal-reminder-7d',
        locale: '__base__'  // Base English locale
      },
      variables: variables,
      metadata: {
        tenantId: 'waymore-test',
        eventId: 'final-verification-test'
      }
    };

    console.log('📋 Template: Subscription Renewal Reminder - 7 Days');
    console.log('🌍 Locale: __base__ (English)');
    console.log('📧 Recipient: cantoniou@waymore.io');
    console.log('📌 Subject:', emailRequest.subject);
    console.log('\n📦 Sample Variable Values:');
    console.log('   - User Name:', variables.user.name);
    console.log('   - Workspace:', variables.user.workspace_name);
    console.log('   - Plan:', variables.subscription.plan_name);
    console.log('   - Amount:', variables.subscription.next_amount);
    console.log('   - Renewal Date:', variables.subscription.renewal_date);
    console.log('   - Days Until Expiry:', variables.subscription.days_until_expiry);
    console.log('\n🚀 Sending...\n');

    const idempotencyKey = randomUUID();
    
    const response = await fetch(`${API_URL}/api/v1/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(emailRequest)
    });

    const responseData = await response.json();
    
    if (response.ok) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Message ID:', responseData.messageId);
      console.log('📊 Status:', responseData.status);
      console.log('\n💡 Check your inbox at cantoniou@waymore.io');
      console.log('💡 The email should contain actual values, NOT {{variable}} placeholders');
      console.log('\n📝 Expected content:');
      console.log('   - "Hello Antonio Uwaymore" (not {{user.name}})');
      console.log('   - "Pro Plan" (not {{subscription.plan_name}})');
      console.log('   - "$29.99" (not {{subscription.next_amount}})');
      console.log('   - Actual renewal date (not {{subscription.renewal_date}})');
    } else {
      console.log('❌ Failed to send email');
      console.log('📋 Response:', JSON.stringify(responseData, null, 2));
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

sendSingleTest();
