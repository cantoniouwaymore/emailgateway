import fetch from 'node-fetch';
import { randomUUID } from 'crypto';

// JWT token for authentication
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LWNsaWVudCIsImlzcyI6ImVtYWlsLWdhdGV3YXkiLCJhdWQiOiJ3YXltb3JlLXBsYXRmb3JtIiwic2NvcGUiOlsiZW1haWxzOnNlbmQiLCJlbWFpbHM6cmVhZCJdLCJleHAiOjE3NTkyNzYzNzAsImlhdCI6MTc1OTI3Mjc3MH0.p0HNmxK2WKol2StRkfwt9JAW_HMjzKuIr-O1Ut2CXec';
const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function sendGreekTest() {
  console.log('📧 Sending Greek Locale Test - Subscription Renewal Reminder (Ελληνικά)\n');

  try {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Greek localized variables
    const variables = {
      user: {
        name: 'Αντώνιος Uwaymore',
        first_name: 'Αντώνιος',
        email: 'cantoniou@waymore.io',
        role: 'Διαχειριστής Πλατφόρμας',
        workspace_name: 'Waymore Επιχείρηση'
      },
      company: {
        name: 'Waymore',
        logo_url: 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png',
        website: 'https://waymore.io',
        support_email: 'support@waymore.io'
      },
      subscription: {
        plan_name: 'Πλάνο Pro',
        renewal_date: formatDate(futureDate),
        days_until_expiry: 7,
        billing_cycle: 'Μηνιαίο',
        next_amount: '€24,99',
        currency: 'EUR',
        auto_renewal: 'Ενεργοποιημένη',
        urgency_percentage: 100,
        subscription_id: 'sub_pro_20250923',
        started_date: '2024-09-30'
      },
      actions: {
        manage_subscription_url: 'https://app.waymore.io/billing/manage?sub=sub_pro_20250923&lang=el',
        billing_portal_url: 'https://app.waymore.io/billing?lang=el',
        contact_support_url: 'https://waymore.io/support?topic=renewal&lang=el'
      },
      // Progress bar variables
      currentValue: '7',
      countdownMessage: 'Η συνδρομή σας λήγει σε',
      targetDate: futureDate.toISOString()
    };

    const emailRequest = {
      to: [
        {
          email: 'cantoniou@waymore.io',
          name: 'Αντώνιος Uwaymore'
        }
      ],
      subject: '✅ ΔΟΚΙΜΗ - Ανανέωση Συνδρομής σε 7 Ημέρες - Πλάνο Pro',
      template: {
        key: 'subscription-renewal-reminder-7d',
        locale: 'el'  // Greek locale
      },
      variables: variables,
      metadata: {
        tenantId: 'waymore-test',
        eventId: 'greek-verification-test'
      }
    };

    console.log('📋 Template: Subscription Renewal Reminder - 7 Days');
    console.log('🌍 Locale: el (Ελληνικά - Greek)');
    console.log('📧 Recipient: cantoniou@waymore.io');
    console.log('📌 Subject:', emailRequest.subject);
    console.log('\n📦 Sample Variable Values (Greek):');
    console.log('   - User Name:', variables.user.name);
    console.log('   - Workspace:', variables.user.workspace_name);
    console.log('   - Plan:', variables.subscription.plan_name);
    console.log('   - Amount:', variables.subscription.next_amount);
    console.log('   - Billing Cycle:', variables.subscription.billing_cycle);
    console.log('   - Auto Renewal:', variables.subscription.auto_renewal);
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
      console.log('✅ Greek email sent successfully!');
      console.log('📧 Message ID:', responseData.messageId);
      console.log('📊 Status:', responseData.status);
      console.log('\n💡 Check your inbox at cantoniou@waymore.io');
      console.log('💡 The email should contain actual Greek values, NOT {{variable}} placeholders');
      console.log('\n📝 Expected content (in Greek):');
      console.log('   - "Γεια σας Αντώνιος Uwaymore" (not {{user.name}})');
      console.log('   - "Πλάνο Pro" (not {{subscription.plan_name}})');
      console.log('   - "€24,99" (not {{subscription.next_amount}})');
      console.log('   - "Μηνιαίο" for billing cycle (not {{subscription.billing_cycle}})');
      console.log('   - "Ενεργοποιημένη" for auto-renewal (not {{subscription.auto_renewal}})');
    } else {
      console.log('❌ Failed to send email');
      console.log('📋 Response:', JSON.stringify(responseData, null, 2));
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

sendGreekTest();
