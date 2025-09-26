#!/usr/bin/env node

/**
 * Routee Callback Monitor for Single-Email Package
 * Monitors webhook callbacks from Routee and displays status updates
 */

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

function logCallback(trackingId, status, timestamp) {
  const statusColor = status === 'delivered' ? 'green' : 
                     status === 'bounce' || status === 'failed' ? 'red' : 'yellow';
  
  console.log(`${colors.blue}📡 Callback:${colors.reset} ${trackingId}`);
  console.log(`   ${colors.blue}Status:${colors.reset} ${colors[statusColor]}${status.toUpperCase()}${colors.reset}`);
  console.log(`   ${colors.blue}Time:${colors.reset} ${new Date(timestamp * 1000).toLocaleString()}`);
  console.log('');
}

async function checkWebhookEndpoint() {
  try {
    const response = await fetch('http://localhost:3000/health');
    const health = await response.json();
    
    if (health.checks?.providers?.status === 'ok') {
      log('✅ Email Gateway is running and healthy', 'green');
      return true;
    } else {
      log('❌ Email Gateway is not healthy', 'red');
      return false;
    }
  } catch (error) {
    log('❌ Cannot connect to Email Gateway', 'red');
    log(`   Make sure the API server is running on port 3000`, 'yellow');
    return false;
  }
}

async function checkNgrokStatus() {
  try {
    const response = await fetch('http://localhost:4040/api/tunnels');
    const data = await response.json();
    
    if (data.tunnels && data.tunnels.length > 0) {
      const httpsTunnel = data.tunnels.find(t => t.proto === 'https');
      if (httpsTunnel) {
        log('✅ ngrok tunnel is active', 'green');
        log(`   Public URL: ${httpsTunnel.public_url}`, 'cyan');
        log(`   Webhook URL: ${httpsTunnel.public_url}/webhooks/routee`, 'cyan');
        return httpsTunnel.public_url;
      }
    }
    
    log('❌ No HTTPS tunnel found in ngrok', 'red');
    return null;
  } catch (error) {
    log('❌ Cannot connect to ngrok dashboard', 'red');
    log(`   Make sure ngrok is running: ngrok http 3000`, 'yellow');
    return null;
  }
}

async function monitorCallbacks() {
  logHeader('Routee Callback Monitor');
  
  // Check prerequisites
  const isHealthy = await checkWebhookEndpoint();
  if (!isHealthy) {
    process.exit(1);
  }
  
  const webhookUrl = await checkNgrokStatus();
  if (!webhookUrl) {
    process.exit(1);
  }
  
  logHeader('Monitoring Setup');
  log('🔗 Webhook URL: ' + webhookUrl + '/webhooks/routee', 'cyan');
  log('📊 ngrok Dashboard: http://localhost:4040', 'cyan');
  log('📋 Callback Types: Status (delivery) + Events (opens/clicks)', 'cyan');
  log('⚡ Strategy: OnChange - callbacks sent whenever status changes', 'cyan');
  
  logHeader('Callback Event Types');
  log('📤 send → SENT (Email sent to provider)', 'yellow');
  log('✅ delivered → DELIVERED (Email successfully delivered)', 'green');
  log('👁️ opened → DELIVERED (Email opened by recipient)', 'green');
  log('❌ bounce → BOUNCED (Email bounced back)', 'red');
  log('❌ failed → BOUNCED (Email delivery failed)', 'red');
  log('❌ dropped → BOUNCED (Email dropped by provider)', 'red');
  log('❌ reject → BOUNCED (Email rejected by provider)', 'red');
  log('❌ spam → BOUNCED (Email marked as spam)', 'red');
  
  logHeader('Monitoring Active');
  log('📡 Waiting for Routee callbacks...', 'yellow');
  log('💡 Send test emails to trigger callbacks', 'cyan');
  log('🛑 Press Ctrl+C to stop monitoring', 'red');
  
  // Monitor ngrok dashboard for incoming requests
  let lastRequestId = null;
  
  const monitorInterval = setInterval(async () => {
    try {
      const response = await fetch('http://localhost:4040/api/requests/http');
      const data = await response.json();
      
      if (data.requests && data.requests.length > 0) {
        const webhookRequests = data.requests.filter(req => 
          req.request.uri.includes('/webhooks/routee')
        );
        
        for (const request of webhookRequests) {
          if (request.id !== lastRequestId) {
            lastRequestId = request.id;
            
            try {
              const payload = JSON.parse(request.request.body);
              if (payload.trackingId && payload.status) {
                logCallback(
                  payload.trackingId,
                  payload.status.name,
                  payload.status.dateTime
                );
              }
            } catch (error) {
              log(`📡 Webhook received: ${request.request.uri}`, 'cyan');
            }
          }
        }
      }
    } catch (error) {
      // Silently handle errors to avoid spam
    }
  }, 2000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    clearInterval(monitorInterval);
    log('\n🛑 Monitoring stopped', 'yellow');
    process.exit(0);
  });
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  log('❌ This script requires Node.js 18+ or a fetch polyfill', 'red');
  process.exit(1);
}

monitorCallbacks();
