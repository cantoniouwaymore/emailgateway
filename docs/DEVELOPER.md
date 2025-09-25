# Email Gateway - Developer Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Development Setup](#development-setup)
4. [API Reference](#api-reference)
5. [Database Schema](#database-schema)
6. [Template System](#template-system)
7. [Queue System](#queue-system)
8. [Provider System](#provider-system)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Contributing](#contributing)

## Architecture Overview

The Email Gateway is a stateless microservice that provides a standardized interface for sending emails across the Waymore platform. It follows a clean architecture pattern with clear separation of concerns.

### Core Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Layer     │    │   Queue Layer   │    │  Provider Layer │
│   (Fastify)     │───▶│   (BullMQ)      │───▶│   (Routee/SES)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Template Layer │    │   Data Layer    │    │  Observability  │
│ (MJML/Handlebars│    │  (PostgreSQL)   │    │ (Metrics/Logs)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Features
- **Idempotency**: Exactly-once intake with `Idempotency-Key` header
- **Template Engine**: MJML + Handlebars with localization support
- **Queue Processing**: Reliable background job processing with BullMQ
- **Provider Abstraction**: Pluggable email providers (Routee, SES, SendGrid)
- **Observability**: Structured logging, metrics, and health checks
- **Security**: JWT authentication, rate limiting, input validation

## Project Structure

```
src/
├── api/                    # API layer
│   ├── controllers/       # Business logic controllers
│   │   ├── email.ts      # Email sending logic
│   │   └── health.ts     # Health check endpoints
│   ├── routes/           # Route definitions
│   │   ├── email.ts      # Email API routes
│   │   └── health.ts     # Health check routes
│   └── schemas/          # Request/response schemas
│       └── email.ts      # Zod validation schemas
├── db/                    # Database layer
│   └── client.ts         # Prisma client configuration
├── providers/             # Email provider implementations
│   ├── types.ts          # Provider interfaces
│   ├── routee.ts         # Routee provider implementation
│   └── manager.ts        # Provider management
├── queue/                 # Queue system
│   ├── producer.ts       # Job producer
│   └── worker.ts         # Background worker
├── templates/             # Template system
│   ├── engine.ts         # Template rendering engine
│   └── notifications/    # Template files
│       ├── universal-en.mjml
│       └── universal-en.txt
├── utils/                 # Utility functions
│   ├── auth.ts          # JWT authentication
│   ├── idempotency.ts   # Idempotency handling
│   ├── logger.ts        # Structured logging
│   └── metrics.ts       # Prometheus metrics
└── index.ts              # Application entrypoint
```

## Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- npm or yarn

### Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd emailgateway
   npm install
   ```

2. **Install services (macOS with Homebrew):**
   ```bash
   ./install-services.sh
   ```

3. **Setup environment:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations:**
   ```bash
   npm run migrate
   ```

5. **Start development servers:**
   ```bash
   # Terminal 1 - API Server
   npm run dev
   
   # Terminal 2 - Worker
   npm run worker
   ```

6. **Test the API:**
   ```bash
   node test-api.js
   ```

### Manual Service Installation

If you prefer to install services manually:

```bash
# PostgreSQL
brew install postgresql@15
brew services start postgresql@15
createdb emailgateway

# Redis
brew install redis
brew services start redis

# Or using Docker
docker run --name emailgateway-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=emailgateway -p 5432:5432 -d postgres:15
docker run --name emailgateway-redis -p 6379:6379 -d redis:7-alpine
```

## API Reference

### Authentication
All API endpoints require JWT authentication:
```bash
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints

#### Send Email
```http
POST /api/v1/emails
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
Idempotency-Key: <UNIQUE_KEY>

{
  "to": [{"email": "user@example.com", "name": "User"}],
  "from": {"email": "no-reply@waymore.io", "name": "Waymore"},
  "subject": "Welcome!",
  "template": {
    "key": "notifications/universal",
    "locale": "en"
  },
  "variables": {
    "email_title": "Welcome to Waymore!",
    "facts": [
      {"label": "Account", "value": "Premium"}
    ]
  },
  "metadata": {
    "tenantId": "wm_123",
    "eventId": "evt_789"
  }
}
```

**Response:**
```json
{
  "messageId": "msg_abc123",
  "status": "queued"
}
```

#### Get Message Status
```http
GET /api/v1/messages/{messageId}
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "messageId": "msg_abc123",
  "status": "sent",
  "attempts": 1,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:05Z"
}
```

#### Health Checks
```http
GET /healthz     # Liveness probe
GET /readyz      # Readiness probe
GET /health      # Detailed health check
GET /metrics     # Prometheus metrics
```

### Error Responses

All error responses follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "traceId": "unique-trace-id"
  }
}
```

Common error codes:
- `VALIDATION_ERROR`: Request validation failed
- `UNAUTHORIZED`: Invalid or missing authentication
- `IDEMPOTENCY_CONFLICT`: Different payload for same idempotency key
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Database Schema

### Tables

#### `messages`
Stores email message information and status tracking.

```sql
CREATE TABLE messages (
  message_id VARCHAR PRIMARY KEY,
  tenant_id VARCHAR,
  to_json JSONB NOT NULL,
  subject VARCHAR NOT NULL,
  template_key VARCHAR NOT NULL,
  locale VARCHAR,
  variables_json JSONB NOT NULL,
  provider VARCHAR,
  status MessageStatus DEFAULT 'QUEUED',
  attempts INTEGER DEFAULT 0,
  last_error TEXT,
  webhook_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `idempotency_keys`
Ensures exactly-once processing of requests.

```sql
CREATE TABLE idempotency_keys (
  idempotency_key VARCHAR PRIMARY KEY,
  payload_hash VARCHAR NOT NULL,
  message_id VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);
```

#### `provider_events`
Stores webhook events from email providers.

```sql
CREATE TABLE provider_events (
  id VARCHAR PRIMARY KEY,
  message_id VARCHAR NOT NULL,
  provider VARCHAR NOT NULL,
  event_type VARCHAR NOT NULL,
  raw_json JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Enums

```sql
CREATE TYPE MessageStatus AS ENUM (
  'QUEUED',
  'SENT', 
  'DELIVERED',
  'BOUNCED',
  'FAILED',
  'SUPPRESSED'
);
```

## Template System

The template system uses MJML for responsive email design and Handlebars for dynamic content.

### Template Structure

Templates are organized by category and locale:
```
src/templates/
├── notifications/
│   ├── universal-en.mjml
│   ├── universal-en.txt
│   └── universal-el.mjml
└── marketing/
    ├── newsletter-en.mjml
    └── newsletter-el.mjml
```

### Template Naming Convention
- `{category}-{locale}.mjml` - Main HTML template
- `{category}-{locale}.txt` - Plain text version (optional)
- `{category}-{locale}.subject` - Subject template (optional)

### MJML Template Example

```mjml
<mjml>
  <mj-head>
    <mj-title>{{email_title}}</mj-title>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>{{email_title}}</mj-text>
        {{#if facts}}
        <mj-table>
          {{#each facts}}
          <tr>
            <td>{{label}}</td>
            <td>{{value}}</td>
          </tr>
          {{/each}}
        </mj-table>
        {{/if}}
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

### Handlebars Helpers

Available helpers:
- `{{#if condition}}` - Conditional rendering
- `{{#each items}}` - Loop through arrays
- `{{eq a b}}` - Equality check
- `{{gt a b}}` - Greater than check
- `{{formatDate date format}}` - Date formatting

### Template Variables

Common variable structure:
```json
{
  "email_title": "Welcome to Waymore!",
  "user_name": "John Doe",
  "facts": [
    {"label": "Account Type", "value": "Premium"},
    {"label": "Created", "value": "2024-01-01"}
  ],
  "cta_primary": {
    "label": "Get Started",
    "url": "https://app.waymore.io"
  }
}
```

## Queue System

The queue system uses BullMQ with Redis for reliable background processing.

### Job Data Structure

```typescript
interface EmailJobData {
  messageId: string;
  templateKey: string;
  locale?: string;
  version?: string;
  variables: Record<string, unknown>;
  to: Array<{email: string; name?: string}>;
  cc?: Array<{email: string; name?: string}>;
  bcc?: Array<{email: string; name?: string}>;
  from: {email: string; name?: string};
  replyTo?: {email: string; name?: string};
  subject: string;
  attachments?: Array<{
    filename: string;
    contentBase64: string;
    contentType: string;
  }>;
  webhookUrl?: string;
  tenantId?: string;
  attempts: number;
}
```

### Queue Configuration

```typescript
// Producer options
const queueOptions = {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  }
};

// Worker options
const workerOptions = {
  connection: redis,
  concurrency: 5,
};
```

### Job Lifecycle

1. **Queued** - Job added to queue
2. **Active** - Worker processing job
3. **Completed** - Job processed successfully
4. **Failed** - Job failed after all retries

### Monitoring

Queue metrics available at `/metrics`:
- `queue_depth` - Current queue depth
- `emails_sent_total` - Total emails sent
- `emails_failed_total` - Total emails failed
- `provider_latency_ms` - Provider response latency

## Provider System

The provider system allows pluggable email providers with a common interface.

### Provider Interface

```typescript
interface EmailProvider {
  name: string;
  send(request: SendProviderRequest): Promise<SendProviderResult>;
  parseWebhook(payload: unknown, headers: Record<string, string>): WebhookEvent[];
  health(): Promise<HealthStatus>;
}
```

### Adding a New Provider

1. **Create provider implementation:**
   ```typescript
   // src/providers/newprovider.ts
   export class NewProviderEmailProvider implements EmailProvider {
     public readonly name = 'newprovider';
     
     async send(request: SendProviderRequest): Promise<SendProviderResult> {
       // Implementation
     }
     
     parseWebhook(payload: unknown, headers: Record<string, string>): WebhookEvent[] {
       // Implementation
     }
     
     async health(): Promise<HealthStatus> {
       // Implementation
     }
   }
   ```

2. **Register in provider manager:**
   ```typescript
   // src/providers/manager.ts
   if (this.enabledProviders.includes('newprovider')) {
     const newProvider = new NewProviderEmailProvider();
     this.providers.set('newprovider', newProvider);
   }
   ```

3. **Add environment configuration:**
   ```bash
   PROVIDERS_ENABLED="routee,newprovider"
   NEWPROVIDER_API_KEY="your-api-key"
   ```

### Provider Configuration

Environment variables:
- `PROVIDERS_ENABLED` - Comma-separated list of enabled providers
- `{PROVIDER}_API_KEY` - API key for each provider
- `{PROVIDER}_BASE_URL` - Base URL for each provider (optional)

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "email controller"
```

### Test Structure

```
tests/
├── unit/              # Unit tests
│   ├── controllers/   # Controller tests
│   ├── providers/     # Provider tests
│   └── utils/         # Utility tests
├── integration/       # Integration tests
│   ├── api/          # API endpoint tests
│   └── queue/        # Queue system tests
└── fixtures/         # Test data and mocks
```

### Writing Tests

```typescript
// tests/unit/controllers/email.test.ts
import { describe, it, expect } from 'vitest';
import { EmailController } from '../../../src/api/controllers/email';

describe('EmailController', () => {
  it('should send email successfully', async () => {
    const controller = new EmailController();
    const result = await controller.sendEmail(mockRequest, mockReply);
    expect(result.status).toBe('queued');
  });
});
```

### Test Utilities

```typescript
// tests/utils/test-helpers.ts
export const createMockRequest = (data: any) => ({
  body: data,
  headers: {
    authorization: 'Bearer test-token',
    'idempotency-key': 'test-key'
  }
});

export const createMockReply = () => ({
  code: jest.fn().mockReturnThis(),
  send: jest.fn()
});
```

## Deployment

### Docker Deployment

1. **Build image:**
   ```bash
   docker build -t email-gateway .
   ```

2. **Run with docker-compose:**
   ```bash
   docker-compose up -d
   ```

3. **Or run manually:**
   ```bash
   docker run -d \
     --name email-gateway \
     -p 3000:3000 \
     -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
     -e REDIS_URL="redis://host:6379" \
     email-gateway
   ```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: email-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: email-gateway
  template:
    metadata:
      labels:
        app: email-gateway
    spec:
      containers:
      - name: email-gateway
        image: email-gateway:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: email-gateway-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: email-gateway-secrets
              key: redis-url
        livenessProbe:
          httpGet:
            path: /healthz
            port: 3000
        readinessProbe:
          httpGet:
            path: /readyz
            port: 3000
```

### Environment Variables

Production environment variables:
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/emailgateway"

# Redis
REDIS_URL="redis://host:6379"

# JWT
JWT_SECRET="your-secure-secret"
JWT_ISSUER="email-gateway"
JWT_AUDIENCE="waymore-platform"

# Providers
PROVIDERS_ENABLED="routee,ses"
ROUTEE_API_KEY="your-routee-key"
SES_ACCESS_KEY="your-ses-key"

# Rate Limiting
RATE_GLOBAL_RPS=1000
RATE_TENANT_DEFAULT_RPS=100

# Monitoring
LOG_LEVEL="info"
NODE_ENV="production"
```

## Contributing

### Development Workflow

1. **Create feature branch:**
   ```bash
   git checkout -b feature/new-provider
   ```

2. **Make changes and test:**
   ```bash
   npm run dev
   npm test
   ```

3. **Commit with conventional commits:**
   ```bash
   git commit -m "feat: add SendGrid email provider"
   ```

4. **Push and create PR:**
   ```bash
   git push origin feature/new-provider
   ```

### Code Standards

- **TypeScript**: Strict typing, no `any` types
- **ESLint**: Follow configured rules
- **Prettier**: Consistent code formatting
- **Tests**: Minimum 80% coverage
- **Documentation**: Update docs for new features

### Pull Request Process

1. **Fork repository**
2. **Create feature branch**
3. **Write tests for new functionality**
4. **Update documentation**
5. **Ensure all tests pass**
6. **Create pull request with description**

### Commit Message Format

```
type(scope): description

feat(providers): add SendGrid email provider
fix(queue): resolve job retry logic
docs(api): update authentication examples
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running and accessible.

#### Redis Connection Errors
```bash
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution**: Ensure Redis is running and accessible.

#### Template Not Found
```bash
Template file not found: notifications/universal-en.mjml
```
**Solution**: Check template file exists and path is correct.

#### JWT Validation Errors
```bash
Error: Invalid JWT token
```
**Solution**: Verify JWT secret and token format.

### Debugging

#### Enable Debug Logging
```bash
LOG_LEVEL=debug npm run dev
```

#### Database Query Logging
```bash
# Add to .env
DATABASE_LOGGING=true
```

#### Queue Monitoring
```bash
# Check queue status
redis-cli
> LLEN bull:email-send:waiting
> LLEN bull:email-send:active
```

### Performance Optimization

#### Database Indexes
```sql
CREATE INDEX idx_messages_tenant_id ON messages(tenant_id);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

#### Redis Optimization
```bash
# Configure Redis for performance
maxmemory 512mb
maxmemory-policy allkeys-lru
```

#### Worker Scaling
```bash
# Increase worker concurrency
WORKER_CONCURRENCY=10 npm run worker
```

## Support

For questions and support:
- **Documentation**: Check this file and README.md
- **Issues**: Create GitHub issue with reproduction steps
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the platform team

---

**Last Updated**: September 2024
**Version**: 1.0.0
