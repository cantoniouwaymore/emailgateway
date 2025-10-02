# Routee Integration

This guide covers the integration with Routee, our primary email service provider.

## Overview

Routee is a powerful email service provider that offers high deliverability rates and comprehensive email management features. This guide explains how to integrate and configure Routee with the Internal Waymore Email Notification System.

## Setup

### 1. Create Routee Account

1. Visit [Routee.net](https://routee.net)
2. Sign up for an account
3. Complete account verification
4. Navigate to the API section

### 2. Get API Credentials

1. Go to **Settings** → **API Keys**
2. Create a new API key
3. Note down your **Client ID** and **Client Secret**

### 3. Configure Environment

Add your Routee credentials to your `.env` file:

```env
# Routee Configuration
ROUTEE_CLIENT_ID=your_client_id_here
ROUTEE_CLIENT_SECRET=your_client_secret_here
ROUTEE_SANDBOX_MODE=false
ROUTEE_WEBHOOK_URL=https://your-domain.com/webhooks/routee
```

## Authentication

Routee uses OAuth 2.0 for authentication. The system automatically handles token refresh:

```javascript
// Authentication is handled automatically
const emailService = new EmailService();
await emailService.send({
  to: 'user@example.com',
  subject: 'Test Email',
  template: 'welcome'
});
```

## Sending Emails

### Basic Email

```javascript
const response = await fetch('/api/v1/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    to: [{ email: 'user@example.com', name: 'John Doe' }],
    subject: 'Welcome!',
    template: { key: 'welcome', locale: 'en' },
    variables: {
      user_name: 'John',
      company_name: 'Acme Corp'
    }
  })
});
```

### Advanced Features

#### Custom Headers

```javascript
{
  "to": [{ "email": "user@example.com", "name": "John Doe" }],
  "subject": "Welcome!",
  "template": { "key": "welcome", "locale": "en" },
  "headers": {
    "X-Custom-Header": "value",
    "X-Priority": "1"
  }
}
```

#### Attachments

```javascript
{
  "to": [{ "email": "user@example.com", "name": "John Doe" }],
  "subject": "Document Attached",
  "template": { "key": "document", "locale": "en" },
  "attachments": [
    {
      "filename": "document.pdf",
      "content": "base64_encoded_content",
      "type": "application/pdf"
    }
  ]
}
```

## Webhooks

Routee sends webhooks for various email events:

### Webhook Events

- `email.sent` - Email queued for sending
- `email.delivered` - Email successfully delivered
- `email.failed` - Email delivery failed
- `email.bounced` - Email bounced
- `email.complained` - Spam complaint received

### Webhook Configuration

1. **Set Webhook URL** in Routee dashboard
2. **Configure Events** you want to receive
3. **Set up Endpoint** in your application

### Webhook Payload

```json
{
  "event": "email.delivered",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "message_id": "msg_123456789",
    "recipient": "user@example.com",
    "provider": "routee",
    "delivery_time": "2024-01-01T00:01:00Z"
  }
}
```

## Templates

### Template Management

Templates are managed through the admin UI or API:

```javascript
// Create template
const template = await fetch('/api/v1/templates', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    key: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to {{company_name}}!',
    html: '<h1>Welcome {{user_name}}!</h1>',
    text: 'Welcome {{user_name}}!'
  })
});
```

### Template Variables

Use Handlebars syntax for dynamic content:

```handlebars
<h1>Welcome {{user_name}}!</h1>
<p>Thank you for joining {{company_name}}.</p>
<p>Your account is now active and ready to use.</p>
```

## Monitoring

### Delivery Status

Check email delivery status:

```javascript
const status = await fetch(`/api/v1/messages/${messageId}`, {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});
```

### Analytics

Routee provides detailed analytics:

- **Delivery Rates** - Percentage of successfully delivered emails
- **Open Rates** - Email open tracking
- **Click Rates** - Link click tracking
- **Bounce Rates** - Bounced email tracking

## Best Practices

### Deliverability

1. **Authentication** - Use SPF, DKIM, and DMARC
2. **Reputation** - Maintain good sender reputation
3. **Content** - Avoid spam trigger words
4. **Lists** - Keep clean, engaged email lists

### Performance

1. **Rate Limiting** - Respect Routee's rate limits
2. **Batching** - Send emails in batches when possible
3. **Retry Logic** - Implement proper retry mechanisms
4. **Monitoring** - Monitor delivery rates and errors

### Security

1. **API Keys** - Keep credentials secure
2. **Webhooks** - Verify webhook signatures
3. **Data** - Encrypt sensitive data
4. **Access** - Limit API access

## Troubleshooting

### Common Issues

**Authentication Failed**
- Check Client ID and Secret
- Verify account status
- Check API permissions

**Delivery Failures**
- Check recipient email validity
- Verify sender domain
- Check content for spam triggers

**Webhook Issues**
- Verify webhook URL accessibility
- Check webhook signature validation
- Monitor webhook delivery logs

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 401 | Unauthorized | Check API credentials |
| 403 | Forbidden | Check API permissions |
| 429 | Rate Limited | Implement backoff strategy |
| 500 | Server Error | Contact Routee support |

## Support

For Routee-specific issues:

- 📖 [Routee Documentation](https://docs.routee.net)
- 🔧 [API Reference](/api/)
- 💬 [GitHub Issues](https://github.com/cantoniouwaymore/emailgateway/issues)
- 📧 [Support](mailto:cantoni@waymore.io)
