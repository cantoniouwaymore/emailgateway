# Email Gateway API Reference

## Overview

The Email Gateway API provides a standardized interface for sending emails through the Waymore platform. All endpoints require JWT authentication and follow RESTful conventions.

**Base URL**: `https://api.waymore.io/email-gateway`  
**Version**: `v1`  
**Authentication**: Bearer JWT Token

## Authentication

### JWT Token Requirements

All API requests must include a valid JWT token in the Authorization header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Token Structure

```json
{
  "sub": "client-identifier",
  "iss": "email-gateway",
  "aud": "waymore-platform",
  "scope": ["emails:send", "emails:read"],
  "exp": 1640995200,
  "iat": 1640991600
}
```

### Required Scopes

- `emails:send` - Required for sending emails
- `emails:read` - Required for reading message status

## Endpoints

### Send Email

Send an email using a template with dynamic variables.

```http
POST /api/v1/emails
```

#### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer JWT token |
| `Content-Type` | Yes | `application/json` |
| `Idempotency-Key` | Yes | Unique key for deduplication |

#### Request Body

```json
{
  "messageId": "msg_custom_123",
  "to": [
    {
      "email": "user@example.com",
      "name": "John Doe"
    }
  ],
  "cc": [
    {
      "email": "manager@example.com",
      "name": "Jane Manager"
    }
  ],
  "bcc": [
    {
      "email": "audit@example.com"
    }
  ],
  "from": {
    "email": "no-reply@waymore.io",
    "name": "Waymore Platform"
  },
  "replyTo": {
    "email": "support@waymore.io",
    "name": "Waymore Support"
  },
  "subject": "Welcome to Waymore!",
  "template": {
    "key": "notifications/universal",
    "locale": "en",
    "version": "v2"
  },
  "variables": {
    "email_title": "Welcome to Waymore!",
    "user_name": "John",
    "facts": [
      {
        "label": "Account Type",
        "value": "Premium"
      },
      {
        "label": "Created",
        "value": "2024-01-01"
      }
    ],
    "cta_primary": {
      "label": "Get Started",
      "url": "https://app.waymore.io/dashboard"
    },
    "cta_secondary": {
      "label": "Learn More",
      "url": "https://docs.waymore.io"
    }
  },
  "attachments": [
    {
      "filename": "welcome.pdf",
      "contentBase64": "base64-encoded-content",
      "contentType": "application/pdf"
    }
  ],
  "metadata": {
    "tenantId": "wm_12345",
    "eventId": "evt_67890",
    "campaignId": "cmp_abc123"
  },
  "webhookUrl": "https://api.waymore.io/webhooks/email-events"
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `messageId` | string | No | Custom message ID (auto-generated if not provided) |
| `to` | array | Yes | Recipients (max 50) |
| `cc` | array | No | CC recipients (max 10) |
| `bcc` | array | No | BCC recipients (max 10) |
| `from` | object | Yes | Sender information |
| `replyTo` | object | No | Reply-to address |
| `subject` | string | Yes | Email subject line |
| `template` | object | Yes | Template configuration |
| `variables` | object | No | Template variables |
| `attachments` | array | No | File attachments (max 5MB total) |
| `metadata` | object | No | Custom metadata |
| `webhookUrl` | string | No | Webhook URL for events |

#### Template Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | Yes | Template identifier |
| `locale` | string | Yes | Language/locale (e.g., "en", "el") |
| `version` | string | No | Template version |

#### Recipient Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email address |
| `name` | string | No | Display name |

#### Attachment Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `filename` | string | Yes | File name |
| `contentBase64` | string | Yes | Base64-encoded file content |
| `contentType` | string | Yes | MIME type |

#### Success Response (202)

```json
{
  "messageId": "msg_abc123def456",
  "status": "queued"
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address: invalid-email",
    "traceId": "trace_12345"
  }
}
```

##### 401 Unauthorized
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing authentication token",
    "traceId": "trace_12345"
  }
}
```

##### 409 Conflict (Idempotency)
```json
{
  "error": {
    "code": "IDEMPOTENCY_CONFLICT",
    "message": "Different payload for same idempotency key",
    "traceId": "trace_12345"
  }
}
```

##### 429 Rate Limited
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded, retry in 60 seconds",
    "traceId": "trace_12345"
  }
}
```

### Get Message Status

Retrieve the status and details of a previously sent email.

```http
GET /api/v1/messages/{messageId}
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `messageId` | string | Yes | Message identifier |

#### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer JWT token |

#### Success Response (200)

```json
{
  "messageId": "msg_abc123def456",
  "status": "sent",
  "attempts": 1,
  "lastError": null,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:05Z",
  "metadata": {
    "provider": "routee",
    "providerMessageId": "routee_12345",
    "deliveredAt": "2024-01-01T10:00:03Z"
  }
}
```

#### Message Status Values

| Status | Description |
|--------|-------------|
| `queued` | Email queued for processing |
| `sent` | Email sent to provider |
| `delivered` | Email delivered to recipient |
| `bounced` | Email bounced back |
| `failed` | Email failed to send |
| `suppressed` | Email suppressed (unsubscribed, etc.) |

#### Error Responses

##### 404 Not Found
```json
{
  "error": {
    "code": "MESSAGE_NOT_FOUND",
    "message": "Message not found",
    "traceId": "trace_12345"
  }
}
```

## Health Check Endpoints

### Liveness Probe

Check if the service is running.

```http
GET /healthz
```

**Response (200)**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T10:00:00Z",
  "uptime": 3600
}
```

### Readiness Probe

Check if the service is ready to serve traffic.

```http
GET /readyz
```

**Response (200)**:
```json
{
  "status": "ready",
  "timestamp": "2024-01-01T10:00:00Z",
  "uptime": 3600,
  "checks": {
    "database": "ok",
    "redis": "ok",
    "providers": "ok"
  }
}
```

**Response (503)**:
```json
{
  "status": "not ready",
  "timestamp": "2024-01-01T10:00:00Z",
  "uptime": 3600,
  "checks": {
    "database": "error",
    "redis": "ok",
    "providers": "ok"
  },
  "error": "Database connection failed"
}
```

### Detailed Health Check

Get comprehensive health information.

```http
GET /health
```

**Response (200)**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T10:00:00Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": {
      "status": "ok",
      "responseTime": "5ms"
    },
    "redis": {
      "status": "ok",
      "responseTime": "2ms"
    },
    "providers": {
      "status": "ok",
      "available": ["routee", "ses"],
      "active": "routee"
    }
  },
  "metrics": {
    "emailsQueued": 42,
    "emailsSent": 15847,
    "emailsFailed": 3,
    "queueDepth": 12
  }
}
```

### Metrics Endpoint

Prometheus-compatible metrics for monitoring.

```http
GET /metrics
```

**Response**: Prometheus metrics format
```
# HELP emails_accepted_total Total number of emails accepted
# TYPE emails_accepted_total counter
emails_accepted_total 15847

# HELP emails_sent_total Total number of emails sent
# TYPE emails_sent_total counter
emails_sent_total 15844

# HELP emails_failed_total Total number of emails failed
# TYPE emails_failed_total counter
emails_failed_total 3

# HELP provider_latency_ms Provider response latency in milliseconds
# TYPE provider_latency_ms histogram
provider_latency_ms_bucket{provider="routee",le="100"} 1200
provider_latency_ms_bucket{provider="routee",le="500"} 15840
provider_latency_ms_bucket{provider="routee",le="1000"} 15847
provider_latency_ms_bucket{provider="routee",le="+Inf"} 15847

# HELP queue_depth Current queue depth
# TYPE queue_depth gauge
queue_depth 12
```

## Error Handling

### Error Response Format

All error responses follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "traceId": "unique-trace-identifier",
    "details": {
      "field": "Additional error details"
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `MESSAGE_NOT_FOUND` | 404 | Message not found |
| `IDEMPOTENCY_CONFLICT` | 409 | Idempotency key conflict |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `PROVIDER_UNAVAILABLE` | 503 | Email provider unavailable |
| `INTERNAL_ERROR` | 500 | Internal server error |

### Rate Limiting

The API implements rate limiting to prevent abuse:

- **Global Rate Limit**: 200 requests per minute per IP
- **Per-Tenant Rate Limit**: 100 requests per minute per tenant
- **Burst Allowance**: Up to 10 requests per second

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 200
X-RateLimit-Remaining: 150
X-RateLimit-Reset: 1640995200
```

## Idempotency

The API supports idempotent requests using the `Idempotency-Key` header:

- **Same key + same payload**: Returns existing result
- **Same key + different payload**: Returns 409 Conflict
- **Key expiration**: 24 hours from first use

### Example

```bash
# First request
curl -X POST /api/v1/emails \
  -H "Idempotency-Key: req_123" \
  -d '{"to": [{"email": "test@example.com"}], ...}'

# Duplicate request (same key + payload) - returns same result
curl -X POST /api/v1/emails \
  -H "Idempotency-Key: req_123" \
  -d '{"to": [{"email": "test@example.com"}], ...}'

# Different payload with same key - returns 409
curl -X POST /api/v1/emails \
  -H "Idempotency-Key: req_123" \
  -d '{"to": [{"email": "different@example.com"}], ...}'
```

## Webhooks

The service supports both sending webhook notifications to clients and receiving webhook events from email providers.

### Client Webhooks (Outgoing)

The service can send webhook notifications for email events to client-specified URLs.

#### Webhook Payload

```json
{
  "messageId": "msg_abc123def456",
  "status": "delivered",
  "eventType": "delivered",
  "timestamp": "2024-01-01T10:00:05Z",
  "provider": "routee",
  "trackingId": "routee_12345",
  "details": {
    "recipient": "user@example.com",
    "deliveryTime": "2024-01-01T10:00:05Z"
  }
}
```

#### Event Types

| Event | Description |
|-------|-------------|
| `delivered` | Email delivered to recipient |
| `bounce` | Email bounced back |
| `open` | Email was opened |
| `click` | Link was clicked |
| `spam` | Email marked as spam |

### Provider Webhooks (Incoming)

The service receives webhook events from email providers to update message status.

#### Routee Webhook Endpoint

```
POST /webhooks/routee
```

**Request Headers:**
```
Content-Type: application/json
X-Routee-Signature: sha256=abc123... (optional)
X-Routee-Timestamp: 1640995200000 (optional)
```

**Request Body:**
```json
{
  "events": [
    {
      "trackingId": "routee_tracking_123456",
      "eventType": "delivered",
      "timestamp": "2024-01-01T10:00:05Z",
      "details": {
        "recipient": "user@example.com",
        "deliveryTime": "2024-01-01T10:00:05Z"
      }
    }
  ]
}
```

**Response:**
```json
{
  "processed": 1,
  "failed": 0,
  "total": 1
}
```
| `email.bounced` | Email bounced back |
| `email.failed` | Email failed to send |

### Webhook Security

Webhooks are signed with HMAC-SHA256:

```http
X-Webhook-Signature: sha256=abc123def456...
```

## SDKs and Examples

### JavaScript/Node.js

```javascript
const EmailGateway = require('@waymore/email-gateway-sdk');

const client = new EmailGateway({
  baseUrl: 'https://api.waymore.io/email-gateway',
  token: 'your-jwt-token'
});

// Send email
const result = await client.sendEmail({
  to: [{ email: 'user@example.com', name: 'John Doe' }],
  from: { email: 'no-reply@waymore.io', name: 'Waymore' },
  subject: 'Welcome!',
  template: { key: 'notifications/universal', locale: 'en' },
  variables: {
    email_title: 'Welcome to Waymore!',
    user_name: 'John'
  }
});

// Check status
const status = await client.getMessageStatus(result.messageId);
```

### Python

```python
import requests

class EmailGateway:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def send_email(self, email_data, idempotency_key):
        headers = {**self.headers, 'Idempotency-Key': idempotency_key}
        response = requests.post(
            f'{self.base_url}/api/v1/emails',
            json=email_data,
            headers=headers
        )
        return response.json()
    
    def get_message_status(self, message_id):
        response = requests.get(
            f'{self.base_url}/api/v1/messages/{message_id}',
            headers=self.headers
        )
        return response.json()

# Usage
client = EmailGateway('https://api.waymore.io/email-gateway', 'your-jwt-token')
result = client.send_email(email_data, 'unique-key-123')
```

### cURL Examples

#### Send Email
```bash
curl -X POST https://api.waymore.io/email-gateway/api/v1/emails \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: unique-key-123" \
  -d '{
    "to": [{"email": "user@example.com", "name": "John Doe"}],
    "from": {"email": "no-reply@waymore.io", "name": "Waymore"},
    "subject": "Welcome to Waymore!",
    "template": {"key": "notifications/universal", "locale": "en"},
    "variables": {
      "email_title": "Welcome to Waymore!",
      "user_name": "John"
    }
  }'
```

#### Get Message Status
```bash
curl -H "Authorization: Bearer your-jwt-token" \
  https://api.waymore.io/email-gateway/api/v1/messages/msg_abc123
```

## Changelog

### v1.0.0 (2024-01-01)
- Initial release
- Email sending with template support
- Message status tracking
- Idempotency support
- Health checks and metrics
- JWT authentication
- Rate limiting

---

**Last Updated**: September 2024  
**API Version**: v1.0.0
