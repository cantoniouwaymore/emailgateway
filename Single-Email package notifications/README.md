# 📧 Single-Email Package Notifications

> Enhanced email notification templates using the transactional template system with advanced features.

## 🎯 Overview

This package contains 11 comprehensive email notification templates that showcase the full capabilities of the enhanced transactional template system. Each template demonstrates different use cases and features.

## ✨ Enhanced Features Used

### 🎨 Visual Features
- **Dynamic Images**: Custom images with fallback to Waymore logo
- **Multi-Button Layout**: Side-by-side primary and secondary buttons
- **Social Media Integration**: Twitter, LinkedIn, GitHub, Facebook, Instagram links
- **Custom Themes**: Color-coded themes based on notification type
- **Facts Tables**: Structured data display for key information

### 🌍 Content Features
- **Multi-Language Support**: English, Spanish, French, German, Italian, Portuguese
- **Rich HTML Content**: Formatted content with emojis and styling
- **Dynamic Headings**: Contextual email titles
- **Personalization**: User-specific content and data

## 📁 Template Files

| File | Notification Type | Theme Color | Features |
|------|------------------|-------------|----------|
| `test-transactional-enhanced-downgrade-confirmation.json` | Plan Downgrade | Red | Multi-button, Facts table, Warning theme |
| `test-transactional-enhanced-payment-failure-attempt-1.json` | Payment Failure (1st) | Yellow | Multi-button, Facts table, Warning theme |
| `test-transactional-enhanced-payment-failure-final.json` | Payment Failure (Final) | Red | Multi-button, Facts table, Urgent theme |
| `test-transactional-enhanced-payment-success.json` | Payment Success | Green | Multi-button, Facts table, Success theme |
| `test-transactional-enhanced-renewal-1-day.json` | Renewal Reminder (1 day) | Yellow | Multi-button, Facts table, Warning theme |
| `test-transactional-enhanced-renewal-7.json` | Renewal Reminder (7 days) | Blue | Multi-button, Facts table, Info theme |
| `test-transactional-enhanced-renewal-confirmation.json` | Renewal Confirmation | Green | Multi-button, Facts table, Success theme |
| `test-transactional-enhanced-upgrade-confirmation.json` | Plan Upgrade | Green | Multi-button, Facts table, Success theme |
| `test-transactional-enhanced-usage-80.json` | Usage Warning (80%) | Yellow | Multi-button, Facts table, Warning theme |
| `test-transactional-enhanced-usage-100.json` | Usage Limit Reached | Red | Multi-button, Facts table, Urgent theme |
| `test-transactional-enhanced-welcome.json` | Welcome | Blue | Multi-button, Facts table, All social links |

## 🛠️ Utility Scripts

| File | Purpose | Description |
|------|---------|-------------|
| `test-enhanced-features.js` | Test Runner | Sends all templates and displays results |
| `monitor-callbacks.js` | Callback Monitor | Real-time webhook callback monitoring |
| `CHANGELOG.md` | Version History | Track changes and updates |
| `TEST_RESULTS.md` | Test Results | Summary of test execution results |

## 🎨 Theme Variations

### Success Theme (Green)
- **Primary Button**: `#28a745` (Green)
- **Background**: `#d4edda` (Light Green)
- **Use Cases**: Payment success, renewal confirmation, upgrade confirmation

### Warning Theme (Yellow)
- **Primary Button**: `#ffc107` (Yellow)
- **Background**: `#fff3cd` (Light Yellow)
- **Use Cases**: Payment failure (1st attempt), renewal reminders, usage warnings

### Urgent Theme (Red)
- **Primary Button**: `#dc3545` (Red)
- **Background**: `#f8d7da` (Light Red)
- **Use Cases**: Payment failure (final), usage limit reached, service suspension

### Info Theme (Blue)
- **Primary Button**: `#007bff` (Blue)
- **Background**: `#f8f9fa` (Light Gray)
- **Use Cases**: Welcome, renewal reminders, general notifications

## 🚀 Usage Examples

### Prerequisites

Before sending emails, ensure your Waymore Transactional Emails Service is configured with Routee:

1. **Set up Routee credentials** in your `.env` file:
   ```bash
   ROUTEE_CLIENT_ID="your-routee-client-id"
   ROUTEE_CLIENT_SECRET="your-routee-client-secret"
   ROUTEE_BASE_URL="https://connect.routee.net"
   ```

2. **Configure webhook URL** for callbacks (development):
   ```bash
   # For local development with ngrok
   WEBHOOK_BASE_URL="https://your-ngrok-url.ngrok.io"
   ```

3. **Start your Waymore Transactional Emails Service**:
   ```bash
   # Terminal 1 - API Server
   npm run dev:api
   
   # Terminal 2 - Worker Process
   npm run dev:worker
   ```

### Send a Welcome Email
```bash
curl -X POST http://localhost:3000/api/v1/emails \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: welcome-$(date +%s)" \
  -d @test-transactional-enhanced-welcome.json
```

### Send a Payment Success Email
```bash
curl -X POST http://localhost:3000/api/v1/emails \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: payment-success-$(date +%s)" \
  -d @test-transactional-enhanced-payment-success.json
```

### Send All Notifications
```bash
# Get JWT token first
TOKEN=$(curl -s http://localhost:3000/test-token | jq -r '.token')

# Send all notifications
for file in test-transactional-enhanced-*.json; do
  echo "Sending $file..."
  curl -X POST http://localhost:3000/api/v1/emails \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -H "Idempotency-Key: $(basename $file .json)-$(date +%s)" \
    -d @$file
  echo ""
done
```

### Using the Test Script
```bash
# Run the enhanced features demo
node test-enhanced-features.js
```

This script will:
- ✅ Get JWT token automatically
- ✅ Send all 11 notification templates
- ✅ Check message status and delivery
- ✅ Display results with color-coded output

### Monitor Routee Callbacks
```bash
# Monitor webhook callbacks in real-time
node monitor-callbacks.js
```

This script will:
- ✅ Check Waymore Transactional Emails Service health
- ✅ Verify ngrok tunnel status
- ✅ Monitor webhook callbacks from Routee
- ✅ Display callback events with timestamps
- ✅ Show status updates (sent, delivered, opened, bounced, etc.)

## 🔧 Customization

### Update Recipient Information
Edit the `to` field in any JSON file:
```json
{
  "to": [
    {
      "email": "your-email@example.com",
      "name": "Your Name"
    }
  ]
}
```

### Customize Theme Colors
Modify the `theme` object:
```json
{
  "theme": {
    "primary_button_color": "#your-color",
    "background_color": "#your-background",
    "text_color": "#your-text-color"
  }
}
```

### Add Custom Content
Update the `custom_content` field:
```json
{
  "custom_content": "Your custom HTML content here..."
}
```

### Add Social Media Links
Modify the `social_links` array:
```json
{
  "social_links": [
    {"platform": "twitter", "url": "https://twitter.com/your-company"},
    {"platform": "linkedin", "url": "https://linkedin.com/company/your-company"}
  ]
}
```

## 🌍 Multi-Language Support

All templates include multi-language content in the `content` object:

```json
{
  "content": {
    "en": "English content",
    "es": "Contenido en español",
    "fr": "Contenu français",
    "de": "Deutscher Inhalt",
    "it": "Contenuto italiano",
    "pt": "Conteúdo português"
  }
}
```

To use a specific language, set the `locale` in the template:
```json
{
  "template": {
    "key": "transactional",
    "locale": "es"
  }
}
```

## 📊 Template Features Matrix

| Feature | Welcome | Payment Success | Payment Failure | Renewal | Usage Warning | Plan Change |
|---------|---------|----------------|-----------------|---------|---------------|-------------|
| **Dynamic Image** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Multi-Button** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Social Links** | ✅ (5) | ✅ (3) | ✅ (3) | ✅ (3) | ✅ (3) | ✅ (3) |
| **Facts Table** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Custom Theme** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Multi-Language** | ✅ (6) | ✅ (3) | ✅ (3) | ✅ (3) | ✅ (3) | ✅ (3) |

## 🎯 Best Practices

1. **Test Before Sending**: Always test templates with a test email first
2. **Customize Themes**: Use appropriate colors for different notification types
3. **Update Recipients**: Replace test email addresses with real recipients
4. **Validate JSON**: Ensure all JSON files are valid before sending
5. **Use Idempotency**: Always include unique Idempotency-Key headers
6. **Monitor Delivery**: Check email delivery status using the message status endpoint

## 📡 Routee Callback Monitoring

### Webhook Setup for Development

The Waymore Transactional Emails Service is configured with comprehensive Routee callback support:

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

### Callback Types

- **Status Callbacks**: Track email delivery (sent, delivered, bounced, etc.)
- **Event Callbacks**: Track user engagement (opens, clicks)

### Development Setup with ngrok

1. **Install ngrok**:
   ```bash
   brew install ngrok
   ```

2. **Configure ngrok**:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

3. **Start tunnel**:
   ```bash
   ngrok http 3000
   ```

4. **Update environment**:
   ```bash
   echo 'WEBHOOK_BASE_URL="https://your-ngrok-url.ngrok.io"' >> .env
   ```

5. **Monitor callbacks**:
   - **ngrok Dashboard**: http://localhost:4040
   - **Webhook URL**: `https://your-ngrok-url.ngrok.io/webhooks/routee`

### Callback Event Types

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

## 🔍 Troubleshooting

### Common Issues

1. **Template Not Found**: Ensure template key is "transactional"
2. **Images Not Loading**: Use PNG/JPG format, avoid SVG
3. **Buttons Not Side-by-Side**: Ensure both cta_primary and cta_secondary are provided
4. **Theme Not Applying**: Check theme object structure and color values
5. **Multi-Language Not Working**: Verify content object has matching locale keys
6. **No Callbacks Received**: Check webhook URL configuration and ngrok tunnel
7. **Routee Authentication Failed**: Verify ROUTEE_CLIENT_ID and ROUTEE_CLIENT_SECRET

### Debug Steps

1. Check API response for errors
2. Verify JWT token is valid
3. Test with minimal required variables first
4. Check server logs for detailed error messages
5. Validate JSON syntax
6. Monitor ngrok dashboard for incoming webhook requests
7. Check Routee provider health: `curl http://localhost:3000/health`

## 📚 Related Documentation

- [Universal Template Guide](../UNIVERSAL_TEMPLATE_GUIDE.md) - Complete template documentation
- [API Reference](../docs/API.md) - Complete API documentation
- [Developer Guide](../docs/DEVELOPER.md) - Technical implementation details

---

**Last Updated**: September 2025  
**Template Version**: Universal v1.1.0  
**Package Version**: Single-Email v1.0.0
