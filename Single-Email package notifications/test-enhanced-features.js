#!/usr/bin/env node

/**
 * Test script for Single-Email Package Notifications
 * Demonstrates all enhanced features of the transactional template
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  console.log(`\n${colors.bold}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}${message}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

function logFeature(feature, description) {
  console.log(`${colors.green}✅ ${colors.bold}${feature}${colors.reset}: ${description}`);
}

function logTemplate(template, theme, features) {
  console.log(`\n${colors.yellow}📧 ${template}${colors.reset}`);
  console.log(`   ${colors.blue}Theme:${colors.reset} ${theme}`);
  console.log(`   ${colors.blue}Features:${colors.reset} ${features.join(', ')}`);
}

async function sendEmail(templateFile, token) {
  const templatePath = path.join(__dirname, templateFile);
  const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  
  const response = await fetch('http://localhost:3000/api/v1/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `${templateFile}-${Date.now()}`
    },
    body: JSON.stringify(templateData)
  });
  
  const result = await response.json();
  return result;
}

async function checkMessageStatus(messageId, token) {
  const response = await fetch(`http://localhost:3000/api/v1/messages/${messageId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  return result;
}

async function main() {
  try {
    logHeader('Single-Email Package Notifications - Enhanced Features Demo');
    
    // Get JWT token
    log('🔑 Getting JWT token...', 'yellow');
    const tokenResponse = await fetch('http://localhost:3000/test-token');
    const tokenData = await tokenResponse.json();
    const token = tokenData.token;
    
    if (!token) {
      throw new Error('Failed to get JWT token');
    }
    
    log('✅ JWT token obtained', 'green');
    
    // List all template files
    const templateFiles = [
      'test-transactional-enhanced-welcome.json',
      'test-transactional-enhanced-payment-success.json',
      'test-transactional-enhanced-payment-failure-attempt-1.json',
      'test-transactional-enhanced-payment-failure-final.json',
      'test-transactional-enhanced-renewal-7.json',
      'test-transactional-enhanced-renewal-1-day.json',
      'test-transactional-enhanced-renewal-confirmation.json',
      'test-transactional-enhanced-upgrade-confirmation.json',
      'test-transactional-enhanced-downgrade-confirmation.json',
      'test-transactional-enhanced-usage-80.json',
      'test-transactional-enhanced-usage-100.json'
    ];
    
    logHeader('Enhanced Template Features');
    
    logFeature('Dynamic Images', 'Custom images with fallback to Waymore logo');
    logFeature('Multi-Button Support', 'Side-by-side primary and secondary buttons');
    logFeature('Social Media Integration', 'Twitter, LinkedIn, GitHub, Facebook, Instagram');
    logFeature('Custom Themes', 'Color-coded themes based on notification type');
    logFeature('Facts Tables', 'Structured data display for key information');
    logFeature('Multi-Language Support', 'English, Spanish, French, German, Italian, Portuguese');
    logFeature('Rich HTML Content', 'Formatted content with emojis and styling');
    logFeature('Personalization', 'User-specific content and data');
    logFeature('Routee Callbacks', 'Status tracking (delivery) + Event tracking (opens/clicks)');
    logFeature('Webhook Integration', 'Real-time delivery status updates via ngrok');
    
    logHeader('Template Overview');
    
    const templateInfo = [
      { name: 'Welcome', theme: 'Blue (Info)', features: ['All social links', 'Multi-language (6)', 'Facts table'] },
      { name: 'Payment Success', theme: 'Green (Success)', features: ['Custom image', 'Multi-button', 'Facts table'] },
      { name: 'Payment Failure (1st)', theme: 'Yellow (Warning)', features: ['Multi-button', 'Facts table', 'Warning theme'] },
      { name: 'Payment Failure (Final)', theme: 'Red (Urgent)', features: ['Multi-button', 'Facts table', 'Urgent theme'] },
      { name: 'Renewal Reminder (7d)', theme: 'Blue (Info)', features: ['Multi-button', 'Facts table', 'Info theme'] },
      { name: 'Renewal Reminder (1d)', theme: 'Yellow (Warning)', features: ['Multi-button', 'Facts table', 'Warning theme'] },
      { name: 'Renewal Confirmation', theme: 'Green (Success)', features: ['Multi-button', 'Facts table', 'Success theme'] },
      { name: 'Plan Upgrade', theme: 'Green (Success)', features: ['Multi-button', 'Facts table', 'Success theme'] },
      { name: 'Plan Downgrade', theme: 'Red (Warning)', features: ['Multi-button', 'Facts table', 'Warning theme'] },
      { name: 'Usage Warning (80%)', theme: 'Yellow (Warning)', features: ['Multi-button', 'Facts table', 'Warning theme'] },
      { name: 'Usage Limit (100%)', theme: 'Red (Urgent)', features: ['Multi-button', 'Facts table', 'Urgent theme'] }
    ];
    
    templateInfo.forEach(info => {
      logTemplate(info.name, info.theme, info.features);
    });
    
    logHeader('Sending Test Emails');
    
    const results = [];
    
    for (const templateFile of templateFiles) {
      try {
        log(`📤 Sending ${templateFile}...`, 'yellow');
        const result = await sendEmail(templateFile, token);
        
        if (result.messageId) {
          log(`✅ Queued: ${result.messageId}`, 'green');
          results.push({ file: templateFile, messageId: result.messageId, status: 'queued' });
        } else {
          log(`❌ Failed: ${JSON.stringify(result)}`, 'red');
          results.push({ file: templateFile, messageId: null, status: 'failed', error: result });
        }
      } catch (error) {
        log(`❌ Error sending ${templateFile}: ${error.message}`, 'red');
        results.push({ file: templateFile, messageId: null, status: 'error', error: error.message });
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    logHeader('Email Status Check');
    
    // Wait a moment for processing
    log('⏳ Waiting for email processing...', 'yellow');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    for (const result of results) {
      if (result.messageId) {
        try {
          const status = await checkMessageStatus(result.messageId, token);
          const statusColor = status.status === 'SENT' ? 'green' : 
                            status.status === 'FAILED' ? 'red' : 'yellow';
          log(`📧 ${result.file}: ${status.status}`, statusColor);
        } catch (error) {
          log(`❌ Error checking ${result.file}: ${error.message}`, 'red');
        }
      }
    }
    
    logHeader('Demo Complete');
    
    log('🎉 Enhanced features demonstration completed!', 'green');
    log('📧 Check your email inbox to see the enhanced templates in action.', 'cyan');
    log('📡 Monitor Routee callbacks via ngrok dashboard: http://localhost:4040', 'magenta');
    log('📚 See README.md for detailed documentation and customization options.', 'blue');
    
    logHeader('Routee Callback Information');
    log('🔗 Webhook URL: https://your-ngrok-url.ngrok.io/webhooks/routee', 'cyan');
    log('📊 ngrok Dashboard: http://localhost:4040', 'cyan');
    log('📋 Callback Types: Status (delivery) + Events (opens/clicks)', 'cyan');
    log('⚡ Strategy: OnChange - callbacks sent whenever status changes', 'cyan');
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  log('❌ This script requires Node.js 18+ or a fetch polyfill', 'red');
  process.exit(1);
}

main();
