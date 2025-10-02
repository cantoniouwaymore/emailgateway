# API Reference

The Email Gateway API provides a RESTful interface for sending transactional emails, managing templates, and monitoring delivery status.

## Base URL

```
https://your-domain.com/api/v1
```

## Authentication

All API requests require authentication using a JWT token:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## Rate Limiting

- **Rate Limit**: 200 requests per minute
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Endpoints

### Send Email

Send a transactional email using a template.

```http
POST /api/v1/emails
```

**Request Body:**
```json
{
  "to": [
    {
      "email": "user@example.com",
      "name": "John Doe"
    }
  ],
  "subject": "Welcome to our service!",
  "template": {
    "key": "welcome-email",
    "locale": "en"
  },
  "variables": {
    "user_name": "John",
    "company_name": "Acme Corp"
  }
}
```

**Response:**
```json
{
  "messageId": "msg_123456789",
  "status": "queued",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Get Message Status

Check the delivery status of an email.

```http
GET /api/v1/messages/{messageId}
```

**Response:**
```json
{
  "messageId": "msg_123456789",
  "status": "delivered",
  "deliveredAt": "2024-01-01T00:01:00Z",
  "provider": "routee"
}
```

### List Templates

Get all available email templates.

```http
GET /api/v1/templates
```

**Response:**
```json
{
  "templates": [
    {
      "key": "welcome-email",
      "name": "Welcome Email",
      "locales": ["en", "es", "fr"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `429` - Rate Limited
- `500` - Internal Server Error

**Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "traceId": "trace_123456789"
  }
}
```

## Webhooks

Configure webhooks to receive real-time notifications about email events.

**Webhook Events:**
- `email.sent` - Email queued for sending
- `email.delivered` - Email successfully delivered
- `email.failed` - Email delivery failed
- `email.bounced` - Email bounced

**Webhook Payload:**
```json
{
  "event": "email.delivered",
  "messageId": "msg_123456789",
  "timestamp": "2024-01-01T00:01:00Z",
  "data": {
    "recipient": "user@example.com",
    "provider": "routee"
  }
}
```

## SDKs

Official SDKs are available for:

- [JavaScript/Node.js](https://github.com/cantoniouwaymore/emailgateway-sdk-js)
- [Python](https://github.com/cantoniouwaymore/emailgateway-sdk-python)
- [PHP](https://github.com/cantoniouwaymore/emailgateway-sdk-php)

## Postman Collection

Download our [Postman collection](/Email-Gateway-API.postman_collection.json) to test the API endpoints.
