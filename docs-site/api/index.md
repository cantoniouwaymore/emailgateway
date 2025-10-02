---
prev: false
next: '/quick-start'
---

# Waymore Transactional Emails Service API Reference

## Overview

The Waymore Transactional Emails Service API provides a standardized interface for sending emails through the Waymore platform. The service is part of a **monorepo** containing multiple microservices, with the API server handling all HTTP requests and the email worker processing background jobs.

**Base URL**: `https://api.waymore.io/email-gateway`  
**Version**: `v1`  
**Authentication**: Bearer JWT Token

## Monorepo Services

| Service | Port | Purpose | Endpoints |
|---------|------|---------|-----------|
| **API Server** | 3000 | HTTP API, admin dashboard, template management | `/api/v1/*`, `/admin/*` |
| **Email Worker** | 3001 | Background processing, email sending | Health check only |
| **Admin UI** | 5173 | React frontend, template editor, monitoring | Static files |
| **Cleanup Worker** | - | Database maintenance, scheduled cleanup | None |

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

- `emails:send` - Required for sending emails and validating templates
- `emails:read` - Required for reading message status

## Endpoints

### Send Email

#### POST /api/v1/emails

Send an email using a database-driven template with dynamic variables. Templates are stored in the database and referenced by their unique key.

**How it works:**
1. You provide only the template key (e.g., "transactional") and variables
2. The system loads the full template structure from the database
3. Variables are merged into the template to create the final email
4. No need to provide the complete template structure in your request

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
    "key": "transactional",
    "locale": "en"
  },
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "John",
    "dashboard_url": "https://app.waymore.io/dashboard"
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
  }
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `messageId` | string | No | Custom message ID (auto-generated if not provided) |
| `to` | array | Yes | Recipients (max 50) |
| `cc` | array | No | CC recipients (max 10) |
| `bcc` | array | No | BCC recipients (max 10) |
| `from` | object | No | Sender information (ignored; server uses environment defaults) |
| `replyTo` | object | No | Reply-to address |
| `subject` | string | Yes | Email subject line |
| `template` | object | Yes | Template configuration |
| `variables` | object | No | Template variables |
| `attachments` | array | No | File attachments (max 5MB total) |
| `metadata` | object | No | Custom metadata |

#### Template Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | Yes | Template identifier (currently only "transactional" supported) |
| `locale` | string | Yes | Language/locale (e.g., "en", "es", "fr") or `__base__` for base template |

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

### Validate Template Structure

#### POST /api/v1/templates/validate

Validate a template structure without specifying a template key (for general template validation).

#### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer JWT token |
| `Content-Type` | Yes | `application/json` |

#### Request Body

```json
{
  "template": {
    "key": "transactional",
    "locale": "en"
  },
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "John",
    "dashboard_url": "https://app.waymore.io/dashboard"
  }
}
```

#### Response

**Success (200 OK):**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    {
      "type": "missing_optional_variable",
      "field": "footer.copyright",
      "message": "Consider adding copyright text for better branding"
    }
  ],
  "template": {
    "key": "transactional",
    "name": "Transactional Email Template",
    "category": "transactional",
    "isActive": true
  }
}
```

**Validation Error (400 Bad Request):**
```json
{
  "valid": false,
  "errors": [
    {
      "type": "missing_required_variable",
      "field": "workspace_name",
      "message": "Required variable 'workspace_name' is missing"
    }
  ],
  "warnings": [],
  "template": {
    "key": "transactional",
    "name": "Transactional Email Template",
    "category": "transactional",
    "isActive": true
  }
}
```

### Validate Template for Email Sending

#### POST /api/v1/templates/{templateKey}/validate

Before sending an email, you can validate that the template exists and that your variables are correct.

#### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer JWT token |
| `Content-Type` | Yes | `application/json` |

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `templateKey` | string | Yes | Template key (e.g., "transactional") |

#### Request Body

```json
{
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "John",
    "dashboard_url": "https://app.waymore.io/dashboard"
  }
}
```

#### Response

**Success (200 OK):**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    {
      "type": "missing_optional_variable",
      "field": "footer.copyright",
      "message": "Consider adding copyright text for better branding"
    }
  ],
  "template": {
    "key": "transactional",
    "name": "Transactional Email Template",
    "category": "transactional",
    "isActive": true
  }
}
```

**Validation Error (400 Bad Request):**
```json
{
  "valid": false,
  "errors": [
    {
      "type": "missing_required_variable",
      "field": "workspace_name",
      "message": "Required variable 'workspace_name' is missing"
    },
    {
      "type": "invalid_variable_type",
      "field": "user_firstname",
      "message": "Expected string, got number",
      "received": 123
    }
  ],
  "warnings": [],
  "template": {
    "key": "transactional",
    "name": "Transactional Email Template",
    "category": "transactional",
    "isActive": true
  }
}
```

### Get Message Status

#### GET /api/v1/messages/{messageId}

Retrieve the status and details of a previously sent email.

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
  "status": "queued",
  "attempts": 0,
  "lastError": null,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:05Z"
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

#### GET /healthz

Check if the service is running.

**Response (200)**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T10:00:00Z",
  "uptime": 3600
}
```

### Readiness Probe

#### GET /readyz

Check if the service is ready to serve traffic.

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

#### GET /health

Get comprehensive health information.

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

#### GET /metrics

Prometheus-compatible metrics for monitoring.

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

## SDKs and Examples

### JavaScript/Node.js

```javascript
const EmailGateway = require('@waymore/email-gateway-sdk');

const client = new EmailGateway({
  baseUrl: 'https://api.waymore.io/email-gateway',
  token: 'your-jwt-token'
});

// Validate template before sending
const validation = await client.validateTemplate('transactional', {
  workspace_name: 'Waymore',
  user_firstname: 'John',
  dashboard_url: 'https://app.waymore.io/dashboard'
});

if (validation.valid) {
  // Send email with database template
  const result = await client.sendEmail({
    to: [{ email: 'user@example.com', name: 'John Doe' }],
    from: { email: 'no-reply@waymore.io', name: 'Waymore' },
    subject: 'Welcome to Waymore!',
    template: { key: 'transactional', locale: 'en' },
    variables: {
      workspace_name: 'Waymore',
      user_firstname: 'John',
      dashboard_url: 'https://app.waymore.io/dashboard'
    }
  });
} else {
  console.error('Template validation failed:', validation.errors);
}

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

#### Send Email with Database Template
```bash
curl -X POST https://api.waymore.io/email-gateway/api/v1/emails \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: unique-key-123" \
  -d '{
    "to": [{"email": "user@example.com", "name": "John Doe"}],
    "from": {"email": "no-reply@waymore.io", "name": "Waymore"},
    "subject": "Welcome to Waymore!",
    "template": {"key": "transactional", "locale": "en"},
    "variables": {
      "workspace_name": "Waymore",
      "user_firstname": "John",
      "dashboard_url": "https://app.waymore.io/dashboard"
    }
  }'
```

#### Validate Template Before Sending
```bash
curl -X POST https://api.waymore.io/email-gateway/api/v1/templates/transactional/validate \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "variables": {
      "workspace_name": "Waymore",
      "user_firstname": "John",
      "dashboard_url": "https://app.waymore.io/dashboard"
    }
  }'
```

#### Get Message Status
```bash
curl -H "Authorization: Bearer your-jwt-token" \
  https://api.waymore.io/email-gateway/api/v1/messages/msg_abc123
```

## Template Management

The Template Management API provides full CRUD operations for database-driven email templates, including localization support and variable validation.

### List Templates

#### GET /api/v1/templates

Retrieve all available templates with optional filtering.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by template category |
| `isActive` | boolean | Filter by active status |
| `search` | string | Search in name, key, or description |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "template_123",
      "key": "transactional",
      "name": "Transactional Email",
      "description": "Standard transactional email template",
      "category": "transactional",
      "isActive": true,
      "variableSchema": {
        "type": "object",
        "properties": {
          "workspace_name": {"type": "string"},
          "user_firstname": {"type": "string"}
        },
        "required": ["workspace_name", "user_firstname"]
      },
      "locales": ["en", "es"],
      "createdAt": "2025-09-29T10:00:00Z",
      "updatedAt": "2025-09-29T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Template

#### GET /api/v1/templates/{templateKey}

Retrieve a specific template by key.

#### Response

```json
{
  "success": true,
  "data": {
    "id": "template_123",
    "key": "transactional",
    "name": "Transactional Email",
    "description": "Standard transactional email template",
    "category": "transactional",
    "isActive": true,
    "variableSchema": {
      "type": "object",
      "properties": {
        "workspace_name": {"type": "string"},
        "user_firstname": {"type": "string"}
      },
      "required": ["workspace_name", "user_firstname"]
    },
    "jsonStructure": {
      "mjml": {
        "tagName": "mjml",
        "children": [
          {
            "tagName": "mj-head",
            "children": [
              {
                "tagName": "mj-title",
                "content": "{{email_title}}"
              }
            ]
          }
        ]
      }
    },
    "locales": [
      {
        "locale": "en",
        "jsonStructure": {
          "mjml": {
            "tagName": "mjml",
            "children": [
              {
                "tagName": "mj-head",
                "children": [
                  {
                    "tagName": "mj-title",
                    "content": "{{email_title}}"
                  }
                ]
              }
            ]
          }
        },
        "createdAt": "2025-09-29T10:00:00Z",
        "updatedAt": "2025-09-29T10:00:00Z"
      }
    ],
    "createdAt": "2025-09-29T10:00:00Z",
    "updatedAt": "2025-09-29T10:00:00Z"
  }
}
```

## Admin Dashboard

### Web Interface

#### GET /admin

Access the admin dashboard for real-time monitoring.

**Response**: HTML dashboard interface

**Features**:
- Real-time email status monitoring
- System health indicators
- Message statistics and queue depth
- Detailed message information
- Provider event tracking
- Auto-refresh every 30 seconds

### Admin API Data

#### GET /admin/api/data

Get real-time data for the admin dashboard.

**Response**:
```json
{
  "health": {
    "status": "healthy",
    "timestamp": "2025-09-25T16:30:00Z",
    "uptime": 3600
  },
  "recentMessages": [
    {
      "messageId": "msg_abc123",
      "status": "sent",
      "attempts": 1,
      "createdAt": "2025-09-25T16:30:00Z",
      "updatedAt": "2025-09-25T16:30:05Z",
      "provider": "routee",
      "providerMessageId": "3160db7c-591d-4693-a407-675dad16b09a",
      "toJson": "[{\"email\":\"user@example.com\",\"name\":\"User Name\"}]",
      "subject": "Welcome to Waymore!"
    }
  ],
  "stats": [
    {
      "status": "SENT",
      "_count": {
        "status": 150
      }
    },
    {
      "status": "FAILED",
      "_count": {
        "status": 5
      }
    }
  ],
  "queueDepth": 0,
  "timestamp": "2025-09-25T16:30:00Z"
}
```

## Changelog

### v2.0.0 (2025-09-29)
- **Database-Driven Template System**: Complete migration from file-based to database-driven templates
- **Template Management API**: Full CRUD operations for templates with RESTful endpoints
- **Multi-Language Support**: Native locale management with database storage
- **Variable Validation**: JSON Schema-based variable validation for templates
- **Admin Interface**: Complete template management UI with search, filtering, and editing
- **Template Documentation**: Auto-generated documentation and examples for each template
- **Migration Tools**: Automated migration from file-based to database templates
- **Enhanced Security**: Improved template validation and error handling
- **Performance Optimization**: Database indexing and query optimization
- **Backward Compatibility**: Seamless transition with fallback to file-based templates

### v1.1.0 (2025-09-26)
- **Enhanced Universal Template**: Complete redesign with advanced features
- **Multi-Button Support**: Side-by-side primary and secondary buttons with tight spacing
- **Social Media Integration**: Built-in social media links (Twitter, LinkedIn, GitHub, Facebook, Instagram)
- **Custom Themes**: Complete theme customization including colors, fonts, and styling
- **Multi-Language Support**: Dynamic content based on locale with fallback support
- **Dynamic Images**: Support for custom images with fallback to default logo
- **Facts Table**: Structured data display with key-value pairs
- **Dark Mode Ready**: Theme-driven styling for proper dark mode rendering
- **Template Cleanup**: Removed legacy templates, keeping only the enhanced universal template
- **Improved Documentation**: Comprehensive API documentation with all new features

### v1.0.0 (2024-01-01)
- Initial release
- Email sending with template support
- Message status tracking
- Idempotency support
- Health checks and metrics
- JWT authentication
- Rate limiting

---

**Last Updated**: September 2025  
**API Version**: v2.0.0 (Object-Based Structure)
