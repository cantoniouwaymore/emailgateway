# Waymore Transactional Emails Service API Reference

## Overview

The Waymore Transactional Emails Service API provides a standardized interface for sending emails through the Waymore platform. All endpoints require JWT authentication and follow RESTful conventions.

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

- `emails:send` - Required for sending emails and validating templates
- `emails:read` - Required for reading message status

## Endpoints

### Send Email

Send an email using a database-driven template with dynamic variables. Templates are stored in the database and referenced by their unique key.

**How it works:**
1. You provide only the template key (e.g., "transactional") and variables
2. The system loads the full template structure from the database
3. Variables are merged into the template to create the final email
4. No need to provide the complete template structure in your request

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
  },
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

#### Template Variables

The transactional template uses an object-based structure for organized and customizable emails.

##### Object-Based Structure

**Structured System**: The template supports organized objects for each section, making it easier to customize your emails.

| Section Object | Type | Required | Description |
|----------------|------|----------|-------------|
| `header` | object | No | Header section with logo and tagline |
| `hero` | object | No | Hero image/icon section |
| `title` | object | No | Email title section |
| `body` | object | No | Body text with paragraphs |
| `snapshot` | object | No | Facts/summary table section |
| `visual` | object | No | Progress bars, countdown, or badges |
| `actions` | object | No | Primary and secondary CTA buttons |
| `support` | object | No | Support links and FAQ |
| `footer` | object | No | Footer with logo, social links, and legal |
| `theme` | object | No | Complete theme customization |

**Note**: All sections are optional. The template provides sensible defaults when sections are missing.

##### Object-Based Section Details

**Header Section (`header`)**
```json
{
  "header": {
    "logo_url": "https://example.com/logo.png",
    "logo_alt": "Company Logo",
    "logo_width": "180px",
    "tagline": "Your company tagline",
    "show": true,
    "padding": "40px 20px 20px 20px"
  }
}
```

**Hero Section (`hero`)**
```json
{
  "hero": {
    "type": "image", // "none" | "image" | "icon"
    "image_url": "https://example.com/hero.png",
    "image_alt": "Hero Image",
    "image_width": "400px", // Use fixed pixel widths (600px, 400px, 300px, 200px, 150px)
    "icon": "🚀",
    "icon_size": "48px",
    "show": true,
    "padding": "20px 0px 30px 0px"
  }
}
```

> **⚠️ Image Sizing Note**: Email clients (Gmail, Outlook, Apple Mail) do not reliably support percentage-based widths (`100%`, `50%`). Always use fixed pixel widths for consistent rendering across all email clients.

**Title Section (`title`)**
```json
{
  "title": {
    "text": "Welcome to Our Platform!",
    "size": "28px",
    "weight": "700",
    "color": "#1f2937",
    "align": "center",
    "line_height": "36px",
    "show": true,
    "padding": "40px 0px 20px 0px"
  }
}
```

**Body Section (`body`)**
```json
{
  "body": {
    "paragraphs": [
      "First paragraph with {{variables}}...",
      "Second paragraph...",
      "Third paragraph..."
    ],
    "font_size": "16px",
    "line_height": "26px",
    "color": "#374151",
    "show": true,
    "padding": "0px 0px 30px 0px"
  }
}
```

**Snapshot Section (`snapshot`)**
```json
{
  "snapshot": {
    "title": "Account Summary",
    "facts": [
      { "label": "Plan", "value": "Pro Monthly" },
      { "label": "Amount", "value": "$29.99" }
    ],
    "style": "table", // "table" | "cards" | "list"
    "show": true,
    "padding": "0px 0px 30px 0px"
  }
}
```

**Visual Section (`visual`)**
```json
{
  "visual": {
    "type": "progress", // "none" | "progress" | "countdown" | "badge"
    "progress_bars": [
      {
        "label": "Usage",
        "current": 80,
        "max": 100,
        "unit": "%",
        "color": "#ef4444",
        "description": "80% of limit reached"
      }
    ],
    "countdown": {
      "message": "Offer expires in",
      "target_date": "2024-12-31T23:59:59Z",
      "show_days": true,
      "show_hours": true
    },
    "show": true,
    "padding": "0px 0px 30px 0px"
  }
}
```

**Actions Section (`actions`)**
```json
{
  "actions": {
    "primary": {
      "label": "Get Started",
      "url": "https://app.example.com/dashboard",
      "style": "button", // "button" | "link"
      "color": "#3b82f6",
      "text_color": "#ffffff",
      "show": true
    },
    "secondary": {
      "label": "Learn More",
      "url": "https://docs.example.com",
      "style": "link",
      "color": "#6b7280",
      "text_color": "#ffffff",
      "show": false
    },
    "show": true,
    "padding": "0px 0px 40px 0px"
  }
}
```

**Support Section (`support`)**
```json
{
  "support": {
    "title": "Need help?",
    "links": [
      { "label": "FAQ", "url": "https://example.com/faq" },
      { "label": "Contact Support", "url": "https://example.com/support" }
    ],
    "show": true,
    "padding": "30px 0px 20px 0px"
  }
}
```

**Footer Section (`footer`)**
```json
{
  "footer": {
    "logo": {
      "url": "https://example.com/logo.png",
      "alt": "Company Logo",
      "width": "120px",
      "show": true
    },
    "tagline": "Empowering your business",
    "social_links": [
      { "platform": "twitter", "url": "https://twitter.com/company" },
      { "platform": "linkedin", "url": "https://linkedin.com/company/company" }
    ],
    "legal_links": [
      { "label": "Privacy Policy", "url": "https://example.com/privacy" },
      { "label": "Terms of Service", "url": "https://example.com/terms" }
    ],
    "copyright": "© 2024 Company. All rights reserved.",
    "show": true,
    "padding": "40px 20px 60px 20px"
  }
}
```

##### Section Properties

Each section object contains specific properties for customization:

**Header Properties**: `logo_url`, `logo_alt`, `tagline`  
**Hero Properties**: `type`, `icon`, `icon_size`, `image_url`, `image_alt`  
**Title Properties**: `text`, `size`, `weight`, `color`, `align`  
**Body Properties**: `paragraphs`, `font_size`, `line_height`  
**Snapshot Properties**: `title`, `facts`, `style`  
**Visual Properties**: `type`, `progress_bars`, `countdown`  
**Actions Properties**: `primary`, `secondary`  
**Support Properties**: `title`, `links`  
**Footer Properties**: `tagline`, `social_links`, `legal_links`, `copyright`  
**Theme Properties**: Complete visual customization options

#### Theme Object

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `font_family` | string | "Helvetica Neue, Helvetica, Arial, sans-serif" | Font family for all text |
| `font_size` | string | "16px" | Base font size |
| `text_color` | string | "#555555" | Main text color |
| `heading_color` | string | "#333333" | Heading text color |
| `background_color` | string | "#ffffff" | Section background color |
| `body_background` | string | "#f4f4f4" | Email body background color |
| `muted_text_color` | string | "#888888" | Footer and muted text color |
| `border_color` | string | "#e0e0e0" | Table and divider border color |
| `primary_button_color` | string | "#007bff" | Primary button background |
| `primary_button_text_color` | string | "#ffffff" | Primary button text color |
| `secondary_button_color` | string | "#6c757d" | Secondary button background |
| `secondary_button_text_color` | string | "#ffffff" | Secondary button text color |

#### Facts Array

Each fact object should contain:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | Fact label (left column) |
| `value` | string | Yes | Fact value (right column) |

#### Social Links Array

Each social link object should contain:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `platform` | string | Yes | Platform name (twitter, linkedin, github, facebook, instagram) |
| `url` | string | Yes | Link URL |

#### Multi-Language Support

The template supports multiple languages through the `template.locale` field:

```json
{
  "template": {
    "key": "transactional",
    "locale": "es"
  }
}
```

**Supported locales:**
- **Standard locales**: `en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `ja`, `ko`, `zh`, `ar`, `hi`, `nl`, `sv`, `da`, `no`, `fi`, `pl`, `tr`, `cs`, `sk`, `hu`, `ro`, `bg`, `hr`, `sl`, `et`, `lv`, `lt`, `el`, `mt`, `cy`, `ga`, `is`, `fo`, `eu`
- **Special locale**: `__base__` - Uses the base template structure with variables (no locale-specific content)

**Fallback Strategy:**
- If a requested locale doesn't exist, the system falls back to the **base template structure** (not a specific locale)
- The base template contains the original variables and structure defined when the template was created
- This ensures consistent behavior and preserves variable placeholders when locale-specific content is unavailable

**Using the Base Template:**
```json
{
  "template": {
    "key": "transactional",
    "locale": "__base__"
  },
  "variables": {
    "user_name": "{{user.name}}",
    "company_name": "{{company.name}}"
  }
}
```

When using `__base__`, the email will contain the original variable placeholders (e.g., `{{user.name}}`) instead of resolved values. This is useful for testing, debugging, or when you want to preserve the template's variable structure.

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

#### Additional Error (400 Bad Request)

```json
{
  "error": {
    "code": "MISSING_IDEMPOTENCY_KEY",
    "message": "Idempotency-Key header is required",
    "traceId": "trace_12345"
  }
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

Validate a template structure without specifying a template key (for general template validation).

```http
POST /api/v1/templates/validate
```

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

Before sending an email, you can validate that the template exists and that your variables are correct.

```http
POST /api/v1/templates/{templateKey}/validate
```

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

Retrieve the status and details of a previously sent email.

```http
GET /api/v1/messages/{messageId}
```

### Validate Template

Validate email template structure and variables without sending an email.

```http
POST /api/v1/templates/validate
```

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
    "product_name": "Waymore Platform",
    "support_email": "support@waymore.io",
    "email_title": "Welcome to Waymore!",
    "custom_content": "Hello John,<br><br>Welcome to our platform!",
    "facts": [
      {"label": "Account Type", "value": "Premium"}
    ],
    "progress_bars": [
      {
        "label": "Storage Usage",
        "current": 75,
        "max": 100,
        "unit": "GB",
        "percentage": 75,
        "color": "#3b82f6",
        "description": "75% of your storage quota used"
      }
    ],
    "cta_primary": {
      "label": "Get Started",
      "url": "https://app.waymore.io/dashboard"
    },
    "footer_links": [
      {"label": "Privacy Policy", "url": "https://waymore.io/privacy"}
    ]
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
      "field": "footer_links",
      "message": "Consider adding footer links for better user experience",
      "suggestion": "Add privacy policy, terms of service, and unsubscribe links"
    }
  ],
  "suggestions": [
    "Review warnings for best practices and accessibility",
    "Add footer links for legal compliance and user experience"
  ]
}
```

**Validation Errors (200 OK):**
```json
{
  "valid": false,
  "errors": [
    {
      "type": "invalid_variable_format",
      "field": "support_email",
      "message": "support_email must be a valid email address",
      "suggestion": "Use a valid email format like 'support@example.com'"
    },
    {
      "type": "invalid_progress_bar",
      "field": "progress_bars[0].max",
      "message": "Progress bar missing required 'max' field",
      "suggestion": "Add max value for progress bar"
    },
    {
      "type": "redundant_information",
      "field": "facts and progress_bars",
      "message": "Information is duplicated between facts table and progress bars",
      "suggestion": "Remove duplicate information from facts table, keep progress bars for visual metrics"
    }
  ],
  "warnings": [],
  "suggestions": [
    "Fix all validation errors before using this template"
  ]
}
```

#### Validation Error Types

| Error Type | Description |
|------------|-------------|
| `invalid_variable_format` | Variable format is invalid (email, URL, etc.) |
| `invalid_variable_type` | Variable has incorrect data type |
| `redundant_information` | Information is duplicated between sections |
| `invalid_progress_bar` | Progress bar missing required fields |
| `invalid_cta` | Call-to-action button has invalid configuration |
| `invalid_social_link` | Social media link has invalid platform or URL |
| `invalid_footer_link` | Footer link has invalid URL |
| `invalid_countdown` | Countdown timer has invalid configuration |
| `invalid_theme` | Theme has invalid color values |
| `exceeds_limit` | Array exceeds maximum allowed items |
| `invalid_url` | URL format is invalid |
| `invalid_color` | Color format is invalid (must be hex) |
| `invalid_date` | Date format is invalid (must be ISO) |

#### Validation Warning Types

| Warning Type | Description |
|--------------|-------------|
| `missing_optional_variable` | Optional but recommended field is missing |
| `best_practice_violation` | Template doesn't follow best practices |
| `accessibility_concern` | Accessibility issue detected |
| `performance_concern` | Potential performance issue |

#### Use Cases

- **AI Template Generation**: Validate templates generated by AI systems
- **Template Development**: Check templates before deployment
- **Quality Assurance**: Ensure templates meet standards
- **Integration Testing**: Validate templates in CI/CD pipelines

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

#### Validate Template
```bash
curl -X POST https://api.waymore.io/email-gateway/api/v1/templates/validate \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "template": {
      "key": "transactional",
      "locale": "en"
    },
    "variables": {
      "workspace_name": "Waymore",
      "user_firstname": "John",
      "product_name": "Waymore Platform",
      "support_email": "support@waymore.io",
      "email_title": "Welcome to Waymore!",
      "custom_content": "Hello John,<br><br>Welcome to our platform!"
    }
  }'
```

## Template Management

The Template Management API provides full CRUD operations for database-driven email templates, including localization support and variable validation.

### List Templates

Retrieve all available templates with optional filtering.

```http
GET /api/v1/templates
```

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

Retrieve a specific template by key.

```http
GET /api/v1/templates/{templateKey}
```

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

### Create Template

Create a new email template.

```http
POST /api/v1/templates
```

#### Request Body

```json
{
  "key": "welcome-email",
  "name": "Welcome Email",
  "description": "Welcome new users to the platform",
  "category": "onboarding",
  "isActive": true,
  "variableSchema": {
    "type": "object",
    "properties": {
      "user_name": {"type": "string"},
      "company_name": {"type": "string"},
      "dashboard_url": {"type": "string"}
    },
    "required": ["user_name", "company_name", "dashboard_url"]
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
              "content": "Welcome to {{company_name}}!"
            }
          ]
        },
        {
          "tagName": "mj-body",
          "children": [
            {
              "tagName": "mj-section",
              "children": [
                {
                  "tagName": "mj-column",
                  "children": [
                    {
                      "tagName": "mj-text",
                      "content": "Hello {{user_name}}, welcome to {{company_name}}!"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "template_456",
    "key": "welcome-email",
    "name": "Welcome Email",
    "description": "Welcome new users to the platform",
    "category": "onboarding",
    "isActive": true,
    "variableSchema": {
      "type": "object",
      "properties": {
        "user_name": {"type": "string"},
        "company_name": {"type": "string"},
        "dashboard_url": {"type": "string"}
      },
      "required": ["user_name", "company_name", "dashboard_url"]
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
                "content": "Welcome to {{company_name}}!"
              }
            ]
          }
        ]
      }
    },
    "locales": [],
    "createdAt": "2025-09-29T10:00:00Z",
    "updatedAt": "2025-09-29T10:00:00Z"
  }
}
```

### Update Template

Update an existing template.

```http
PUT /api/v1/templates/{templateKey}
```

#### Request Body

Same as Create Template, but all fields are optional.

#### Response

```json
{
  "success": true,
  "data": {
    "id": "template_456",
    "key": "welcome-email",
    "name": "Welcome Email Updated",
    "description": "Updated welcome email template",
    "category": "onboarding",
    "isActive": true,
    "variableSchema": {
      "type": "object",
      "properties": {
        "user_name": {"type": "string"},
        "company_name": {"type": "string"},
        "dashboard_url": {"type": "string"}
      },
      "required": ["user_name", "company_name", "dashboard_url"]
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
                "content": "Welcome to {{company_name}}!"
              }
            ]
          }
        ]
      }
    },
    "locales": [],
    "createdAt": "2025-09-29T10:00:00Z",
    "updatedAt": "2025-09-29T10:05:00Z"
  }
}
```

### Delete Template

Delete a template and all its locales.

```http
DELETE /api/v1/templates/{templateKey}
```

#### Response

```http
204 No Content
```

### Add Locale

Add a locale-specific version of a template.

```http
POST /api/v1/templates/{templateKey}/locales
```

#### Request Body

```json
{
  "locale": "es",
  "jsonStructure": {
    "mjml": {
      "tagName": "mjml",
      "children": [
        {
          "tagName": "mj-head",
          "children": [
            {
              "tagName": "mj-title",
              "content": "¡Bienvenido a {{company_name}}!"
            }
          ]
        },
        {
          "tagName": "mj-body",
          "children": [
            {
              "tagName": "mj-section",
              "children": [
                {
                  "tagName": "mj-column",
                  "children": [
                    {
                      "tagName": "mj-text",
                      "content": "¡Hola {{user_name}}, bienvenido a {{company_name}}!"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "templateId": "template_456",
    "locale": "es",
    "jsonStructure": {
      "mjml": {
        "tagName": "mjml",
        "children": [
          {
            "tagName": "mj-head",
            "children": [
              {
                "tagName": "mj-title",
                "content": "¡Bienvenido a {{company_name}}!"
              }
            ]
          }
        ]
      }
    },
    "createdAt": "2025-09-29T10:00:00Z",
    "updatedAt": "2025-09-29T10:00:00Z"
  }
}
```

### Update Locale

Update a locale-specific version of a template.

```http
PUT /api/v1/templates/{templateKey}/locales/{locale}
```

#### Request Body

Same as Add Locale, but `locale` field is not required.

#### Response

```json
{
  "success": true,
  "data": {
    "templateId": "template_456",
    "locale": "es",
    "jsonStructure": {
      "mjml": {
        "tagName": "mjml",
        "children": [
          {
            "tagName": "mj-head",
            "children": [
              {
                "tagName": "mj-title",
                "content": "¡Bienvenido a {{company_name}}!"
              }
            ]
          }
        ]
      }
    },
    "createdAt": "2025-09-29T10:00:00Z",
    "updatedAt": "2025-09-29T10:05:00Z"
  }
}
```

### Delete Locale

Delete a locale-specific version of a template.

```http
DELETE /api/v1/templates/{templateKey}/locales/{locale}
```

#### Response

```http
204 No Content
```

### Validate Template Variables

Validate template variables against the template's schema.

```http
POST /api/v1/templates/{templateKey}/validate
```

#### Request Body

```json
{
  "variables": {
    "user_name": "John Doe",
    "company_name": "Waymore",
    "dashboard_url": "https://app.waymore.io/dashboard"
  }
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "valid": true,
    "errors": []
  }
}
```

### Get Template Variables

Get the variable schema for a template.

```http
GET /api/v1/templates/{templateKey}/variables
```

#### Response

```json
{
  "success": true,
  "data": {
    "variableSchema": {
      "type": "object",
      "properties": {
        "user_name": {
          "type": "string",
          "description": "User's full name"
        },
        "company_name": {
          "type": "string",
          "description": "Company name"
        },
        "dashboard_url": {
          "type": "string",
          "description": "URL to the dashboard",
          "format": "uri"
        }
      },
      "required": ["user_name", "company_name", "dashboard_url"]
    },
    "examples": {
      "user_name": "John Doe",
      "company_name": "Waymore",
      "dashboard_url": "https://app.waymore.io/dashboard"
    }
  }
}
```

### Get Template Documentation

Get comprehensive documentation for a template.

```http
GET /api/v1/templates/{templateKey}/docs
```

#### Response

```json
{
  "success": true,
  "data": {
    "template": {
      "key": "welcome-email",
      "name": "Welcome Email",
      "description": "Welcome new users to the platform",
      "category": "onboarding"
    },
    "variables": {
      "schema": {
        "type": "object",
        "properties": {
          "user_name": {
            "type": "string",
            "description": "User's full name"
          },
          "company_name": {
            "type": "string",
            "description": "Company name"
          },
          "dashboard_url": {
            "type": "string",
            "description": "URL to the dashboard",
            "format": "uri"
          }
        },
        "required": ["user_name", "company_name", "dashboard_url"]
      },
      "examples": {
        "user_name": "John Doe",
        "company_name": "Waymore",
        "dashboard_url": "https://app.waymore.io/dashboard"
      }
    },
    "locales": ["en", "es"],
    "usage": {
      "endpoint": "POST /api/v1/emails",
      "template": {
        "key": "welcome-email",
        "locale": "en"
      },
      "variables": {
        "user_name": "John Doe",
        "company_name": "Waymore",
        "dashboard_url": "https://app.waymore.io/dashboard"
      }
    }
  }
}
```

### Detect Variables in Template

Identify variables present in a template's JSON structure.

```http
GET /api/v1/templates/{templateKey}/detected-variables
```

#### Response

```json
{
  "success": true,
  "data": ["email_title", "user_name", "company_name"]
}
```

### Preview Template Rendering

Generate an HTML preview for a template with variables.

```http
GET /api/v1/templates/{templateKey}/preview
```

or generate from an ad-hoc structure:

```http
POST /api/v1/templates/preview
```

#### Request Body (for POST)

```json
{
  "jsonStructure": { /* MJML-like JSON */ },
  "variables": { /* variables object */ }
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "html": "<html>...</html>"
}
```

## Webhook Endpoints

### Routee Webhook

Handle webhook events from Routee email provider for delivery status updates.

```http
POST /webhooks/routee
```

#### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` |

#### Request Body

```json
{
  "event": "delivered",
  "messageId": "msg_abc123def456",
  "timestamp": "2024-01-01T10:00:00Z",
  "provider": "routee",
  "providerMessageId": "routee_12345",
  "recipient": "user@example.com",
  "status": "delivered",
  "metadata": {
    "tenantId": "tenant_123",
    "templateKey": "transactional"
  }
}
```

#### Response

**Success (200 OK):**
```json
{
  "status": "processed",
  "messageId": "msg_abc123def456",
  "timestamp": "2024-01-01T10:00:01Z"
}
```

**Error (400 Bad Request):**
```json
{
  "error": {
    "code": "INVALID_WEBHOOK_DATA",
    "message": "Invalid webhook payload format"
  }
}
```

## Cache Management

### Get Cache Statistics

Retrieve template cache statistics and performance metrics.

```http
GET /cache/stats
```

#### Response

**Success (200 OK):**
```json
{
  "enabled": true,
  "stats": {
    "size": 15,
    "keys": ["template:transactional:en", "template:welcome:en"]
  },
  "cleaned": 3,
  "timestamp": "2024-01-01T10:00:00Z"
}
```

**Cache Disabled (200 OK):**
```json
{
  "enabled": false,
  "message": "Template caching is disabled"
}
```

### Clear Template Cache

Clear all cached templates and force reload from database.

```http
POST /cache/clear
```

#### Response

**Success (200 OK):**
```json
{
  "enabled": true,
  "message": "Cache cleared successfully",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

**Cache Disabled (200 OK):**
```json
{
  "enabled": false,
  "message": "Template caching is disabled"
}
```

## Development Endpoints

### Generate Test Token

Generate a JWT token for testing API endpoints (development only).

```http
GET /test-token
```

#### Response

**Success (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1 hour",
  "scopes": ["emails:send", "emails:read"]
}
```

**Note:** This endpoint is only available in development mode.

## Admin Endpoints

### Admin Dashboard

Access the admin dashboard for real-time monitoring and template management.

```http
GET /admin
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number for pagination (default: 1) |
| `limit` | number | No | Items per page (default: 20) |
| `search` | string | No | Search term for filtering |
| `email` | string | No | Filter by recipient email |
| `searchPage` | number | No | Page number for search results |
| `searchLimit` | number | No | Items per page for search results |

#### Response

Returns HTML content for the admin dashboard interface.

### Message Details

Get detailed information about a specific message.

```http
GET /admin/messages/{messageId}
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `messageId` | string | Yes | Message identifier |

#### Response

Returns HTML content for the message details page.

### Admin API Data

Get real-time data for the admin dashboard.

```http
GET /admin/api/data
```

#### Response

**Success (200 OK):**
```json
{
  "messages": {
    "total": 1250,
    "sent": 1200,
    "failed": 50,
    "recent": [
      {
        "messageId": "msg_abc123",
        "status": "sent",
        "recipient": "user@example.com",
        "createdAt": "2024-01-01T10:00:00Z"
      }
    ]
  },
  "templates": {
    "total": 5,
    "active": 4,
    "inactive": 1
  },
  "providers": {
    "routee": {
      "status": "healthy",
      "lastCheck": "2024-01-01T10:00:00Z"
    }
  }
}
```

### Webhook Events

Get recent webhook events for monitoring.

```http
GET /admin/api/webhooks
```

#### Response

**Success (200 OK):**
```json
{
  "events": [
    {
      "id": "webhook_123",
      "provider": "routee",
      "event": "delivered",
      "messageId": "msg_abc123",
      "timestamp": "2024-01-01T10:00:00Z",
      "status": "processed"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

### Search by Recipient

Search for messages by recipient email address.

```http
GET /admin/search
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | Recipient email address |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20) |

#### Response

**Success (200 OK):**
```json
{
  "messages": [
    {
      "messageId": "msg_abc123",
      "status": "sent",
      "recipient": "user@example.com",
      "subject": "Welcome to Waymore!",
      "createdAt": "2024-01-01T10:00:00Z",
      "templateKey": "transactional"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 20
}
```

### Send Test Email

Send a test email from the admin interface (no authentication required).

```http
POST /admin/send-test-email
```

#### Request Body

```json
{
  "to": [
    {
      "email": "test@example.com",
      "name": "Test User"
    }
  ],
  "subject": "Test Email",
  "template": {
    "key": "transactional",
    "locale": "en"
  },
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "Test"
  }
}
```

#### Response

**Success (200 OK):**
```json
{
  "messageId": "test_1234567890_abcdef",
  "status": "queued",
  "message": "Test email queued successfully"
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Missing or invalid 'to' field"
}
```

### Documentation Viewer

View documentation files in the browser.

```http
GET /docs/{filename}
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filename` | string | Yes | Documentation filename (e.g., "API.md") |

#### Response

Returns HTML content with markdown viewer for the documentation file.

### Postman Collection Download

Download the Postman collection for API testing.

```http
GET /Email-Gateway-API.postman_collection.json
```

#### Response

Returns the Postman collection JSON file as a download.

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

## Admin Dashboard

### Web Interface

Access the admin dashboard for real-time monitoring:

```http
GET /admin
```

**Response**: HTML dashboard interface

**Features**:
- Real-time email status monitoring
- System health indicators
- Message statistics and queue depth
- Detailed message information
- Provider event tracking
- Auto-refresh every 30 seconds

### Admin API Data

Get real-time data for the admin dashboard:

```http
GET /admin/api/data
```

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



## Team Integration

### Postman Collection

Ready-to-use API collection for your team:

**[📥 Download Postman Collection](Email-Gateway-API.postman_collection.json)**

**Features**:
- Auto-token management
- Auto-message ID capture
- Pre-configured headers
- Error handling examples
- Complete request examples

**Setup**:
1. Download and import the Postman collection
2. Follow `POSTMAN_SETUP.md` guide
3. Start with "Get JWT Token" request
4. Use "Send Email - Transactional Template" to send emails

### Usage Examples

#### Welcome Email Example

```json
{
  "to": [{"email": "user@example.com", "name": "John Doe"}],
  "from": {"email": "no-reply@waymore.io", "name": "Waymore"},
  "subject": "Welcome to Waymore!",
  "template": {"key": "transactional", "locale": "en"},
  "variables": {
    "header": {
      "logo_url": "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      "logo_alt": "Waymore",
      "tagline": "Empowering your business"
    },
    "title": {
      "text": "Welcome to Waymore!",
      "size": "28px",
      "weight": "700",
      "color": "#1f2937",
      "align": "center"
    },
    "body": {
      "paragraphs": [
        "Hello John, welcome to Waymore Platform!",
        "Your account is ready to use. Here are some tips to get started:",
        "• Explore your dashboard\n• Set up your profile\n• Connect your first integration"
      ],
      "font_size": "16px",
      "line_height": "26px"
    },
    "actions": {
      "primary": {
        "label": "Get Started",
        "url": "https://app.waymore.io/dashboard",
        "style": "button",
        "color": "#3b82f6",
        "text_color": "#ffffff"
      }
    },
    "footer": {
      "tagline": "Empowering your business",
      "social_links": [
        { "platform": "twitter", "url": "https://twitter.com/waymore" },
        { "platform": "linkedin", "url": "https://linkedin.com/company/waymore" }
      ],
      "legal_links": [
        { "label": "Privacy Policy", "url": "https://waymore.io/privacy" },
        { "label": "Terms of Service", "url": "https://waymore.io/terms" }
      ],
      "copyright": "© 2024 Waymore Technologies Inc. All rights reserved."
    }
  }
}
```

#### Payment Success Email Example

```json
{
  "to": [{"email": "customer@example.com", "name": "Jane Customer"}],
  "from": {"email": "billing@waymore.io", "name": "Waymore Billing"},
  "subject": "Payment Successful - Receipt #INV-2024-001",
  "template": {"key": "transactional", "locale": "en"},
  "variables": {
    "header": {
      "logo_url": "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      "logo_alt": "Waymore",
      "tagline": "Empowering your business"
    },
    "hero": {
      "type": "icon",
      "icon": "✅",
      "icon_size": "48px"
    },
    "title": {
      "text": "Payment Successful - Receipt #INV-2024-001",
      "size": "28px",
      "weight": "700",
      "color": "#10b981",
      "align": "center"
    },
    "body": {
      "paragraphs": [
        "Hello Jane, your payment has been processed successfully!",
        "Thank you for your business and continued trust in Waymore Platform.",
        "Your receipt and transaction details are included below."
      ],
      "font_size": "16px",
      "line_height": "26px"
    },
    "snapshot": {
      "title": "Transaction Details",
      "facts": [
        { "label": "Transaction ID", "value": "TXN-12345" },
        { "label": "Amount", "value": "$29.99" },
        { "label": "Plan", "value": "Pro Monthly" },
        { "label": "Payment Method", "value": "**** 4242" },
        { "label": "Date", "value": "January 15, 2024" }
      ],
      "style": "table"
    },
    "actions": {
      "primary": {
        "label": "Download Receipt",
        "url": "https://app.waymore.io/receipts/TXN-12345",
        "style": "button",
        "color": "#10b981",
        "text_color": "#ffffff"
      },
      "secondary": {
        "label": "View Billing History",
        "url": "https://app.waymore.io/billing",
        "style": "link",
        "color": "#6b7280"
      }
    },
    "footer": {
      "tagline": "Empowering your business",
      "legal_links": [
        { "label": "Privacy Policy", "url": "https://waymore.io/privacy" },
        { "label": "Terms of Service", "url": "https://waymore.io/terms" }
      ],
      "copyright": "© 2024 Waymore Technologies Inc. All rights reserved."
    }
  }
}
```

#### Usage Alert Email Example

```json
{
  "to": [{"email": "admin@example.com", "name": "Admin User"}],
  "from": {"email": "alerts@waymore.io", "name": "Waymore Alerts"},
  "subject": "Usage Alert - 80% Limit Reached",
  "template": {"key": "transactional", "locale": "en"},
  "variables": {
    "header": {
      "logo_url": "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      "logo_alt": "Waymore",
      "tagline": "Empowering your business"
    },
    "hero": {
      "type": "icon",
      "icon": "⚠️",
      "icon_size": "48px"
    },
    "title": {
      "text": "Usage Alert - 80% Limit Reached",
      "size": "28px",
      "weight": "700",
      "color": "#f59e0b",
      "align": "center"
    },
    "body": {
      "paragraphs": [
        "Hello Admin, you've used 80% of your Pro plan.",
        "You're approaching your monthly limit. Consider upgrading to avoid any service interruption.",
        "Your current usage breakdown is shown below."
      ],
      "font_size": "16px",
      "line_height": "26px"
    },
    "visual": {
      "type": "progress",
      "progress_bars": [
        {
          "label": "API Requests",
          "current": 8000,
          "total": 10000,
          "percentage": 80,
          "unit": "requests",
          "color": "#f59e0b",
          "description": "Monthly usage"
        }
      ]
    },
    "snapshot": {
      "title": "Usage Summary",
      "facts": [
        { "label": "Current Usage", "value": "80%" },
        { "label": "Plan Limit", "value": "10,000 requests" },
        { "label": "Used", "value": "8,000 requests" },
        { "label": "Remaining", "value": "2,000 requests" }
      ],
      "style": "table"
    },
    "actions": {
      "primary": {
        "label": "Upgrade Plan",
        "url": "https://app.waymore.io/upgrade",
        "style": "button",
        "color": "#f59e0b",
        "text_color": "#ffffff"
      },
      "secondary": {
        "label": "View Usage Details",
        "url": "https://app.waymore.io/usage",
        "style": "link",
        "color": "#6b7280"
      }
    },
    "support": {
      "title": "Need help?",
      "links": [
        { "label": "Usage FAQ", "url": "https://waymore.io/usage-faq" },
        { "label": "Contact Support", "url": "https://waymore.io/support" }
      ]
    },
    "footer": {
      "tagline": "Empowering your business",
      "legal_links": [
        { "label": "Privacy Policy", "url": "https://waymore.io/privacy" },
        { "label": "Terms of Service", "url": "https://waymore.io/terms" }
      ],
      "copyright": "© 2024 Waymore Technologies Inc. All rights reserved."
    }
  }
}
```

#### JavaScript SDK Example

```javascript
// See example-usage.js for complete examples
const { sendEmail, checkMessageStatus } = require('./example-usage.js');

// Send email
const messageId = await sendEmail(jwtToken);

// Check status
const status = await checkMessageStatus(messageId, jwtToken);
```

#### Python Example

```python
# See example-usage.js for Python examples
import requests

def send_email(token, email_data):
    response = requests.post(
        'http://localhost:3000/api/v1/emails',
        headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
            'Idempotency-Key': f'python-{int(time.time())}'
        },
        json=email_data
    )
    return response.json()
```

---

**Last Updated**: September 2025  
**API Version**: v2.0.0 (Object-Based Structure)
