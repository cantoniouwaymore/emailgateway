---
toc: false
prev: '/guides/deployment'
next: '/guides/templates'
---

# Waymore Transactional Emails Service - Developer Documentation

## Architecture Overview

The Waymore Transactional Emails Service is a **monorepo** containing multiple microservices that provide a standardized interface for sending emails across the Waymore platform. It follows a clean architecture pattern with clear separation of concerns and proper service isolation.

### Monorepo Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    MONOREPO SERVICES                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎨 FRONTEND SERVICES                                       │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Admin UI      │    │  Shared Types   │                │
│  │   (React)       │    │  (TypeScript)   │                │
│  │   Port: 5173    │    │  (No Port)      │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│           └───────────────────────┼────────────────────────┘
│                                   │
│  📡 BACKEND SERVICES                                      │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────┐│
│  │   API Server    │    │  Email Worker   │    │ Cleanup  ││
│  │   (Fastify)     │    │  (BullMQ)       │    │ Worker   ││
│  │   Port: 3000    │    │  Port: 3001     │    │ (Cron)   ││
│  └─────────────────┘    └─────────────────┘    └──────────┘│
│           │                       │                        │
│           └───────────────────────┼────────────────────────┘
│                                   │
│  🗄️ INFRASTRUCTURE SERVICES                               │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   PostgreSQL    │    │     Redis       │                │
│  │   Port: 5432    │    │   Port: 6379    │                │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Features
- **Idempotency**: Exactly-once intake with `Idempotency-Key` header
- **Enhanced Universal Template**: Advanced MJML template with multi-button support, social media integration, custom themes, multi-language support, and dynamic images
- **Queue Processing**: Reliable background job processing with BullMQ
- **Provider Abstraction**: Pluggable email providers (Routee, SES, SendGrid)
- **Observability**: Structured logging, metrics, and health checks
- **Security**: JWT authentication, rate limiting, input validation

## Project Structure

```
emailgateway/
├── packages/               # Monorepo packages
│   ├── api-server/        # Main HTTP API service
│   │   ├── src/
│   │   │   ├── api/       # API layer
│   │   │   │   ├── controllers/  # Business logic controllers
│   │   │   │   │   ├── email.ts      # Email sending logic
│   │   │   │   │   ├── health.ts     # Health check endpoints
│   │   │   │   │   ├── admin.ts      # Admin dashboard logic
│   │   │   │   │   └── templates/    # Template management
│   │   │   │   ├── routes/       # API routes
│   │   │   │   │   ├── email.ts      # Email API routes
│   │   │   │   │   ├── health.ts     # Health check routes
│   │   │   │   │   ├── admin.ts      # Admin dashboard routes
│   │   │   │   │   └── templates.ts  # Template management routes
│   │   │   │   └── schemas/      # Request/response schemas
│   │   │   ├── db/        # Database layer
│   │   │   ├── providers/ # Email providers
│   │   │   ├── queue/     # Queue system
│   │   │   ├── templates/ # Email templates
│   │   │   ├── types/     # TypeScript types
│   │   │   └── utils/     # Utilities
│   │   ├── prisma/        # Database schema
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── email-worker/      # Background worker service
│   │   ├── src/
│   │   │   ├── worker.ts  # Worker implementation
│   │   │   └── producer.ts # Job producer
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── cleanup-worker/    # Cleanup service
│   │   ├── src/
│   │   │   ├── worker-cleanup.ts
│   │   │   ├── cleanup.ts
│   │   │   └── scheduler.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── admin-ui/          # React frontend
│   │   ├── src/
│   │   │   ├── components/ # React components
│   │   │   ├── pages/      # Page components
│   │   │   ├── lib/        # Utilities
│   │   │   └── types/      # Frontend types
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── shared-types/      # Shared TypeScript types
│       ├── *.ts           # Type definitions
│       ├── package.json
│       └── tsconfig.json
│
├── scripts/               # Build and deployment scripts
├── docs/                  # Documentation
├── infrastructure/        # Docker and deployment configs
├── package.json           # Root workspace config
└── tsconfig.json          # Root TypeScript config

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
   cd packages/api-server && npm run migrate
   ```

5. **Start all services (recommended):**
   ```bash
   npm run dev:all
   ```

6. **Or start services individually:**
   ```bash
   # API Server (Terminal 1) - Handles HTTP requests, queues emails
   cd packages/api-server && npm run dev
   
   # Email Worker (Terminal 2) - Processes queued emails, sends via providers
   cd packages/email-worker && npm run dev
   
   # Admin UI (Terminal 3) - React frontend for template management
   cd packages/admin-ui && npm run dev
   
   # Cleanup Worker (Terminal 4) - Database maintenance (optional)
   cd packages/cleanup-worker && npm run dev
   ```

   **⚠️ CRITICAL**: The following services must be running for full functionality:
   - **API Server** (port 3000): Receives HTTP requests and queues emails
   - **Email Worker** (port 3001): Processes queued emails and sends them
   - **Admin UI** (port 5173): Template editor and monitoring dashboard

6. **Test the API:**
   ```bash
   node test-api.js
   ```

### Webhook Development Setup

For local development with webhook callbacks, use ngrok to create a public webhook URL:

#### 1. Install ngrok

```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

#### 2. Configure ngrok

```bash
# Sign up for free account at https://dashboard.ngrok.com/signup
# Get your auth token from https://dashboard.ngrok.com/get-started/your-authtoken
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

#### 3. Start ngrok tunnel

```bash
# Start tunnel on port 3000
ngrok http 3000
```

#### 4. Update environment

```bash
# Copy the https URL from ngrok output
# Update your .env file
echo 'WEBHOOK_BASE_URL="https://your-ngrok-url.ngrok.io"' >> .env
```

#### 5. Monitor webhooks

- **ngrok Dashboard**: http://localhost:4040
- **Webhook URL**: `https://your-ngrok-url.ngrok.io/webhooks/routee`
- **Test webhook**: Use the ngrok dashboard to inspect incoming requests

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
    "key": "notifications/transactional",
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

The template system uses MJML for responsive email design and Handlebars for dynamic content. The system now features a single, powerful transactional template with advanced capabilities.

### Template Structure

The current template structure is simplified to focus on the enhanced transactional template:
```
src/templates/
├── transactional-en.mjml      # Enhanced transactional template (MJML)
├── transactional-en.txt       # Plain text version
└── engine.ts              # Template engine
```

### Transactional Template Features

The transactional template supports:

- **Multi-Button Support**: Side-by-side primary and secondary buttons
- **Social Media Integration**: Built-in social media links
- **Custom Themes**: Complete theme customization
- **Multi-Language Support**: Dynamic content based on locale with base template fallback
- **Dynamic Images**: Custom images with fallback to default logo
- **Base Template Support**: Special `__base__` locale for testing and debugging
- **Facts Table**: Structured data display
- **Dark Mode Ready**: Theme-driven styling

### Template Naming Convention
- `transactional-en.mjml` - Main HTML template
- `transactional-en.txt` - Plain text version
- `{category}-{locale}.subject` - Subject template (optional)

### Locale System

The system supports multiple locales with a smart fallback strategy:

**Supported Locales:**
- **Standard locales**: `en`, `es`, `fr`, `de`, `it`, `pt`, `ru`, `ja`, `ko`, `zh`, `ar`, `hi`, `nl`, `sv`, `da`, `no`, `fi`, `pl`, `tr`, `cs`, `sk`, `hu`, `ro`, `bg`, `hr`, `sl`, `et`, `lv`, `lt`, `el`, `mt`, `cy`, `ga`, `is`, `fo`, `eu`
- **Special locale**: `__base__` - Uses the base template structure with variables

**Fallback Strategy:**
- If a requested locale doesn't exist, the system falls back to the **base template structure** (not a specific locale like "en")
- This ensures consistent behavior and preserves variable placeholders when locale-specific content is unavailable
- The base template contains the original variables and structure defined when the template was created

**Example Usage:**
```json
{
  "template": {
    "key": "transactional",
    "locale": "__base__"
  },
  "variables": {
    "user_name": "&#123;&#123;user.name&#125;&#125;",
    "company_name": "&#123;&#123;company.name&#125;&#125;"
  }
}
```

### MJML Template Example

```html
<mjml>
  <mj-head>
    <mj-title>&#123;&#123;email_title&#125;&#125;</mj-title>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>&#123;&#123;email_title&#125;&#125;</mj-text>
        &#123;&#123;#if facts&#125;&#125;
        <mj-table>
          &#123;&#123;#each facts&#125;&#125;
          <tr>
            <td>&#123;&#123;label&#125;&#125;</td>
            <td>&#123;&#123;value&#125;&#125;</td>
          </tr>
          &#123;&#123;/each&#125;&#125;
        </mj-table>
        &#123;&#123;/if&#125;&#125;
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

### Handlebars Helpers

Available helpers:
- `&#123;&#123;#if condition&#125;&#125;` - Conditional rendering
- `&#123;&#123;#each items&#125;&#125;` - Loop through arrays
- `&#123;&#123;eq a b&#125;&#125;` - Equality check
- `&#123;&#123;gt a b&#125;&#125;` - Greater than check
- `&#123;&#123;formatDate date format&#125;&#125;` - Date formatting

### Template Variables

The transactional template supports comprehensive variable structure:

```json
{
  "workspace_name": "Waymore",
  "user_firstname": "John",
  "product_name": "Waymore Platform",
  "support_email": "support@waymore.io",
  "email_title": "Welcome to Waymore!",
  "custom_content": "Hello John,<br><br>Welcome to our platform!",
  "image_url": "https://example.com/logo.png",
  "image_alt": "Company Logo",
  "facts": [
    {"label": "Account Type", "value": "Premium"},
    {"label": "Created", "value": "2024-01-01"}
  ],
  "cta_primary": {
    "label": "Get Started",
    "url": "https://app.waymore.io"
  },
  "cta_secondary": {
    "label": "Learn More",
    "url": "https://docs.waymore.io"
  },
  "social_links": [
    {"platform": "twitter", "url": "https://twitter.com/waymore_io"},
    {"platform": "linkedin", "url": "https://linkedin.com/company/waymore"}
  ],
  "theme": {
    "font_family": "'Roboto', Arial, sans-serif",
    "text_color": "#2c3e50",
    "primary_button_color": "#007bff"
  },
  "content": {
    "en": "English content",
    "es": "Contenido en español",
    "fr": "Contenu français"
  }
}
```

### Variable Categories

- **Core Variables**: `workspace_name`, `user_firstname`, `product_name`, `support_email`, `email_title`, `custom_content`
- **Image Variables**: `image_url`, `image_alt`
- **Content Variables**: `facts`, `content` (multi-language)
- **CTA Variables**: `cta_primary`, `cta_secondary`
- **Social Variables**: `social_links`
- **Theme Variables**: `theme` (complete customization)

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
  webhookUrl?: string;        // Internal webhook endpoint (set via WEBHOOK_BASE_URL)
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

## Build Process

### Development Build
```bash
# Start development server with hot reload
npm run dev

# Start worker in development mode
npm run worker
```

### Production Build
```bash
# Build TypeScript to JavaScript
npm run build

# Start production API server
npm run start:api

# Start production worker (in another terminal)
npm run start:worker
```

### Build Output
The build process compiles TypeScript files to the `dist/` directory:
- `dist/index-api.js` - API server entry point
- `dist/index.js` - Main application entry point (with worker mode detection)
- `dist/worker-simple.js` - Standalone worker entry point
- `dist/startup.js` - Production startup script
- `dist/queue/worker.js` - Worker implementation (core logic)
- `dist/api/` - Compiled API controllers and routes
- `dist/providers/` - Compiled email providers
- `dist/db/` - Database client and utilities
- `dist/utils/` - Utility functions
- `dist/templates/` - Template engine
- `dist/types/` - Type definitions

### Build Verification
After building, verify the output:
```bash
# Check if build was successful
ls -la dist/

# Test production build
npm run start:api
# In another terminal:
npm run start:worker
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
ROUTEE_CLIENT_ID="your-routee-client-id"
ROUTEE_CLIENT_SECRET="your-routee-client-secret"
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
Template file not found: notifications/transactional-en.mjml
```
**Solution**: Check template file exists and path is correct.

#### JWT Validation Errors
```bash
Error: Invalid JWT token
```
**Solution**: Verify JWT secret and token format.

#### Port Conflict (Worker Won't Start)
```bash
Error: listen EADDRINUSE: address already in use 0.0.0.0:3000
```
**Solution**: The worker tries to use port 3000 (same as API server). Use a different port:
```bash
PORT=3001 npm run dev:worker
```

#### Emails Stuck in "QUEUED" Status
**Cause**: Worker process is not running or not processing jobs.
**Solution**: 
1. Ensure worker is running: `ps aux | grep worker`
2. Check worker logs for errors
3. Verify Redis connection: `redis-cli ping`
4. Restart worker if needed: `PORT=3001 npm run dev:worker`

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
- **Issues**: Create [GitHub issue](https://github.com/cantoniouwaymore/emailgateway/issues) with reproduction steps
- **Discussions**: Use [GitHub Discussions](https://github.com/cantoniouwaymore/emailgateway/discussions) for questions
- **Support Email**: cantoniou@waymore.io

---

**Last Updated**: September 2024
**Version**: 1.0.0
