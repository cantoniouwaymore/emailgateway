import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// JWT token for authentication
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LWNsaWVudCIsImlzcyI6ImVtYWlsLWdhdGV3YXkiLCJhdWQiOiJ3YXltb3JlLXBsYXRmb3JtIiwic2NvcGUiOlsiZW1haWxzOnNlbmQiLCJlbWFpbHM6cmVhZCJdLCJleHAiOjE3NTkyNzYzNzAsImlhdCI6MTc1OTI3Mjc3MH0.p0HNmxK2WKol2StRkfwt9JAW_HMjzKuIr-O1Ut2CXec';
const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function debugSingleTemplate() {
  console.log('🔍 DEBUG: Testing Single Template\n');

  try {
    // Fetch the renewal reminder template
    const templateKey = 'subscription-renewal-reminder-7d';
    const locale = '__base__';
    
    console.log(`📋 Fetching template: ${templateKey}`);
    const template = await prisma.template.findUnique({
      where: { key: templateKey },
      include: { locales: true }
    });

    if (!template) {
      console.log('❌ Template not found!');
      return;
    }

    console.log(`✅ Template found: ${template.name}`);
    console.log(`   Variable Schema:`, JSON.stringify(template.variableSchema, null, 2));
    console.log(`   JSON Structure keys:`, Object.keys(template.jsonStructure as any));
    console.log('');

    // Prepare comprehensive test variables
    const now = new Date();
    const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

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
        subscription_id: 'sub_pro_20250923'
      },
      actions: {
        manage_subscription_url: 'https://app.waymore.io/billing/manage',
        billing_portal_url: 'https://app.waymore.io/billing',
        contact_support_url: 'https://waymore.io/support'
      }
    };

    console.log('📦 Variables being sent:');
    console.log(JSON.stringify(variables, null, 2));
    console.log('');

    // Prepare email request
    const emailRequest = {
      to: [
        {
          email: 'cantoniou@waymore.io',
          name: 'Antonio Uwaymore'
        }
      ],
      subject: '[DEBUG] Subscription Renewal Reminder - Testing Variables',
      template: {
        key: templateKey,
        locale: locale
      },
      variables: variables,
      metadata: {
        tenantId: 'debug-test',
        eventId: 'debug-renewal-test'
      }
    };

    console.log('📤 Email Request Payload:');
    console.log(JSON.stringify(emailRequest, null, 2));
    console.log('');

    const idempotencyKey = randomUUID();
    
    console.log(`🌐 Sending to: ${API_URL}/api/v1/emails`);
    console.log(`🔑 Idempotency Key: ${idempotencyKey}\n`);
    
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
    
    console.log('📨 API Response:');
    console.log(JSON.stringify(responseData, null, 2));
    console.log('');
    
    if (response.ok) {
      console.log(`✅ Email sent successfully!`);
      console.log(`   Message ID: ${responseData.messageId}`);
      console.log(`   Status: ${responseData.status}`);
      
      // Wait a moment and check the message in database
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('\n🔍 Checking message in database...');
      const message = await prisma.message.findUnique({
        where: { messageId: responseData.messageId }
      });
      
      if (message) {
        console.log('   Variables stored in DB:', JSON.stringify(message.variablesJson, null, 2));
        console.log('   Template Key:', message.templateKey);
        console.log('   Locale:', message.locale);
        console.log('   Status:', message.status);
      }
    } else {
      console.log('❌ Failed to send email');
      console.log('   Error:', JSON.stringify(responseData, null, 2));
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('   Stack:', error.stack);
  }
}

async function main() {
  try {
    await debugSingleTemplate();
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { debugSingleTemplate };
