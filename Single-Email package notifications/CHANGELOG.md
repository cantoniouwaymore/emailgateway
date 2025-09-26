# 📧 Single-Email Package Notifications - Changelog

## Version 1.1.0 - Routee Callback Integration

### ✨ New Features

#### 🔗 Routee Callback Support
- **Enhanced Webhook Integration**: Full Routee callback support with status and event tracking
- **Real-time Monitoring**: Live webhook callback monitoring with `monitor-callbacks.js`
- **Comprehensive Callback Types**: Status callbacks (delivery) + Event callbacks (opens/clicks)

#### 📡 Webhook Configuration
- **Status Callbacks**: Track email delivery (sent, delivered, bounced, etc.)
- **Event Callbacks**: Track user engagement (opens, clicks)
- **Strategy**: OnChange - callbacks sent whenever status changes
- **Development Setup**: ngrok integration for local webhook testing

#### 🛠️ New Utility Scripts
- **`monitor-callbacks.js`**: Real-time webhook callback monitoring
- **Enhanced `test-enhanced-features.js`**: Added Routee callback information

### 📚 Documentation Updates

#### 📖 README.md Enhancements
- **Prerequisites Section**: Routee credentials and webhook setup
- **Routee Callback Monitoring**: Complete webhook setup guide
- **Development Setup**: ngrok configuration and monitoring
- **Callback Event Types**: Complete status mapping table
- **Troubleshooting**: Added Routee-specific debugging steps

#### 🔧 Usage Examples
- **Prerequisites**: Routee credentials and webhook URL setup
- **Test Script**: Enhanced with callback monitoring information
- **Monitoring Script**: Real-time webhook callback monitoring
- **Utility Scripts**: Complete script documentation

### 🎯 Callback Event Types

| Status Name | Description | Internal Status |
|-------------|-------------|-----------------|
| `send` | Email sent to provider | `SENT` |
| `delivered` | Email successfully delivered | `DELIVERED` |
| `opened` | Email opened by recipient | `DELIVERED` |
| `bounce` | Email bounced back | `BOUNCED` |
| `failed` | Email delivery failed | `BOUNCED` |
| `dropped` | Email dropped by provider | `BOUNCED` |
| `reject` | Email rejected by provider | `BOUNCED` |
| `spam` | Email marked as spam | `BOUNCED` |

### 🚀 Quick Start

#### 1. Prerequisites
```bash
# Set up Routee credentials
ROUTEE_CLIENT_ID="your-routee-client-id"
ROUTEE_CLIENT_SECRET="your-routee-client-secret"

# Configure webhook URL (development)
WEBHOOK_BASE_URL="https://your-ngrok-url.ngrok.io"
```

#### 2. Start Services
```bash
# Terminal 1 - API Server
npm run dev:api

# Terminal 2 - Worker Process  
npm run dev:worker

# Terminal 3 - ngrok Tunnel
ngrok http 3000
```

#### 3. Test and Monitor
```bash
# Send test emails
node test-enhanced-features.js

# Monitor callbacks
node monitor-callbacks.js
```

### 🔧 Technical Details

#### Routee Callback Configuration
```typescript
{
  "callback": {
    "statusCallback": {
      "strategy": "OnChange",
      "url": "https://your-domain.com/webhooks/routee"
    },
    "eventCallback": {
      "onClick": "https://your-domain.com/webhooks/routee",
      "onOpen": "https://your-domain.com/webhooks/routee"
    }
  }
}
```

#### Webhook Payload Format
```typescript
interface RouteeWebhookPayload {
  trackingId: string;
  status: {
    id: number;
    name: string;
    dateTime: number;
    final: boolean;
    delivered: boolean;
  };
}
```

### 🐛 Bug Fixes
- **Template Key**: Corrected to use "universal" template key
- **Webhook Security**: Disabled signature validation for Routee compatibility
- **Callback Processing**: Updated to handle single callback events (not arrays)
- **Status Mapping**: Fixed status name to internal status mapping

### 📈 Performance Improvements
- **Callback Processing**: Optimized webhook payload parsing
- **Status Updates**: Real-time status tracking with timestamps
- **Monitoring**: Efficient webhook callback monitoring with ngrok dashboard integration

### 🔒 Security Updates
- **Webhook Security**: Routee webhooks don't support signature validation by default
- **Environment Variables**: Secure credential management
- **HTTPS Only**: All webhook communications use HTTPS

---

**Last Updated**: September 2025  
**Package Version**: Single-Email v1.1.0  
**Routee Integration**: ✅ Complete  
**Webhook Support**: ✅ Complete  
**Monitoring Tools**: ✅ Complete
