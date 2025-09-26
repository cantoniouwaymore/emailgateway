# 📧 Routee Email Provider Integration

## 🎯 Overview

The Waymore Transactional Emails Service provides comprehensive integration with Routee's email service, including real-time webhook callbacks for delivery tracking and user engagement analytics.

## 🔧 Configuration

### Environment Variables

```bash
# Routee OAuth Credentials
ROUTEE_CLIENT_ID="your-routee-client-id"
ROUTEE_CLIENT_SECRET="your-routee-client-secret"
ROUTEE_BASE_URL="https://connect.routee.net"

# Webhook Configuration
WEBHOOK_BASE_URL="https://your-domain.com"

# Optional: Webhook Security
ROUTEE_WEBHOOK_SECRET="your-webhook-secret"
```

### Authentication

Routee uses OAuth 2.0 Client Credentials for authentication:

```typescript
// Automatic token management
const accessToken = await this.getAccessToken();
```

## 📡 Webhook Integration

### Callback Configuration

The Routee provider is configured with comprehensive callback support:

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

### Webhook Payload Format

Routee sends webhooks in the following format:

```json
[
  {
    "sender": "marketing@waymore.io",
    "subject": "Welcome to Waymore!",
    "recipient": "cantoniou@waymore.io",
    "message_id": "6ed1dedf-2dbf-4450-8a76-593ed7f5d0b6",
    "event": "delivered",
    "timestamp": 1758874735395,
    "link_url": "https://example.com" // Only for clicked events
  }
]
```

## 📊 Event Status Mapping

| Routee Event | Internal Status | Description | Priority |
|--------------|-----------------|-------------|----------|
| `queued` | `QUEUED` | Email queued for sending | Initial |
| `accepted` | `QUEUED` | Email accepted by provider | Initial |
| `sent` | `SENT` | Email sent to provider | Success |
| `delivered` | `DELIVERED` | Email successfully delivered | Success |
| `opened` | `DELIVERED` | Email opened by recipient | Success |
| `clicked` | `DELIVERED` | Link clicked in email | Success |
| `unsubscribed` | `DELIVERED` | User unsubscribed (user action) | Success |
| `bounced` | `BOUNCED` | Email bounced back | Failure |
| `undelivered` | `BOUNCED` | Email could not be delivered | Failure |
| `differed` | `BOUNCED` | Email delivery differed | Failure |

## 🔍 Event Examples

### 1. Clicked with Subscribed Link
```json
{
  "sender": "can@techtest.amdtelecom.net",
  "subject": "HEllo",
  "recipient": "cantoniou@waymore.io",
  "link_url": "https://message-view-web-app.waymore-dev.amd.ms/view/53182a0d-27a2-4430-bdef-f65fe057a151/62091008339af9439b595ffae2e988897c684f461a6ff92ba4da389b08a4921c",
  "message_id": "0fe3e4c7-43b8-4b66-8926-fb40c694686f",
  "event": "clicked",
  "timestamp": 1730275136642
}
```

### 2. Unsubscribed Event
```json
{
  "sender": "poikonomou@amdtelecom.net",
  "subject": "AMD telecom",
  "recipient": "ekontelis@amdtelecom.net",
  "message_id": "931d5dbe-77f0-4d69-b042-0ae39ebae315",
  "event": "unsubscribed",
  "timestamp": 1689061170545
}
```

### 3. Delivered Status
```json
{
  "sender": "poikonomou@amdtelecom.net",
  "subject": "AMD telecom",
  "recipient": "ekontelis@amdtelecom.net",
  "message_id": "931d5dbe-77f0-4d69-b042-0ae39ebae315",
  "event": "delivered",
  "timestamp": 1689060758806
}
```

## 🚀 Development Setup

### Prerequisites

1. **Routee Account**: Sign up at [routee.net](https://routee.net)
2. **OAuth Credentials**: Get client ID and secret from Routee dashboard
3. **ngrok**: For local webhook testing

### Local Development

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

### Testing

```bash
# Send test email
curl -X POST http://localhost:3000/api/v1/emails \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-$(date +%s)" \
  -d '{
    "to": [{"email": "test@example.com", "name": "Test User"}],
    "from": {"email": "no-reply@waymore.io", "name": "Waymore"},
    "subject": "Test Email",
    "template": {"key": "universal", "locale": "en"},
    "variables": {"email_title": "Test Email"}
  }'
```

## 📈 Monitoring

### Webhook Monitoring

- **ngrok Dashboard**: http://localhost:4040
- **Webhook URL**: `https://your-ngrok-url.ngrok.io/webhooks/routee`
- **Database Events**: Check `ProviderEvent` table for webhook events

### Status Tracking

```bash
# Check message status
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/messages/MESSAGE_ID
```

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify `ROUTEE_CLIENT_ID` and `ROUTEE_CLIENT_SECRET`
   - Check if credentials are active in Routee dashboard

2. **Webhook Not Receiving Callbacks**
   - Verify `WEBHOOK_BASE_URL` is set correctly
   - Check ngrok tunnel is active
   - Ensure webhook endpoint is accessible

3. **Status Not Updating**
   - Check webhook payload format
   - Verify message exists in database
   - Check webhook processing logs

### Debug Mode

```bash
LOG_LEVEL=debug npm run dev:api
```

## 📚 Related Documentation

- [API Reference](./API.md) - Complete API documentation
- [Developer Guide](./DEVELOPER.md) - Technical implementation details
- [Universal Template Guide](./UNIVERSAL_TEMPLATE_GUIDE.md) - Template system documentation

---

**Last Updated**: September 2025  
**Routee API Version**: v.2  
**Integration Status**: ✅ **COMPLETE**