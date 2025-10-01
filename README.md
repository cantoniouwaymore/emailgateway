# 📧 Waymore Transactional Emails Service

> A production-ready, stateless HTTP → Email dispatcher with templating, queueing, provider adapters, idempotency, and delivery tracking for the Waymore platform.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## ✨ Features

### 🚀 Core Capabilities
- **RESTful API**: Standardized POST /v1/emails endpoint with full validation.
- **Database-Driven Templates**: Complete template management system with CRUD operations, localization, and variable validation.
- **Template Management API**: Full REST API for creating, updating, and managing email templates.
- **Multi-Language Support**: Native locale management with database storage for international templates.
- **Variable Validation**: JSON Schema-based validation for template variables with real-time error reporting.
- **Enhanced Transactional Template**: Advanced MJML template with multi-button support, social media integration, custom themes, and dynamic images.
- **Queue System**: BullMQ (Redis) for reliable background job processing.
- **Provider Abstraction**: Pluggable email providers (Routee, SES, SendGrid).
- **Idempotency**: Exactly-once intake with Idempotency-Key header.
- **Observability**: Structured logging, Prometheus metrics, health checks.
- **Security**: JWT authentication, rate limiting, input validation.
- **Admin Dashboard**: Real-time web interface for monitoring email delivery and template management.
- **Webhook Integration**: Real-time status updates from email providers.
- **Postman Collection**: Ready-to-use API collection for team integration.

### 🏗️ Architecture
- **Stateless Design**: Horizontally scalable microservice
- **Clean Architecture**: Separation of concerns with clear boundaries
- **Event-Driven**: Asynchronous processing with reliable queues
- **Provider Agnostic**: Easy to add new email providers
- **Template-Driven**: Dynamic content with responsive email design

## 📧 Template Management System

The Waymore Transactional Emails Service now features a comprehensive database-driven template management system that provides complete control over email templates.

### 🎯 Key Features

- **Database Storage**: All templates are stored in PostgreSQL with full versioning and metadata
- **CRUD Operations**: Complete Create, Read, Update, Delete operations via REST API
- **Multi-Language Support**: Native locale management with database storage
- **Variable Validation**: JSON Schema-based validation for template variables
- **Admin Interface**: Web-based template management with real-time editing
- **Template Documentation**: Auto-generated documentation and examples
- **Migration Tools**: Automated migration from file-based to database templates

### 🗄️ Database Schema

```sql
-- Template table for storing template definitions
CREATE TABLE "Template" (
  "id" TEXT PRIMARY KEY,
  "key" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT NOT NULL,
  "isActive" BOOLEAN DEFAULT true,
  "variableSchema" JSONB NOT NULL,
  "jsonStructure" JSONB NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TemplateLocale table for storing locale-specific content
CREATE TABLE "TemplateLocale" (
  "id" TEXT PRIMARY KEY,
  "templateId" TEXT NOT NULL REFERENCES "Template"("id") ON DELETE CASCADE,
  "locale" TEXT NOT NULL,
  "jsonStructure" JSONB NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("templateId", "locale")
);
```

### 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/templates` | List all templates with filtering |
| `GET` | `/api/v1/templates/{key}` | Get specific template |
| `POST` | `/api/v1/templates` | Create new template |
| `PUT` | `/api/v1/templates/{key}` | Update template |
| `DELETE` | `/api/v1/templates/{key}` | Delete template |
| `POST` | `/api/v1/templates/{key}/locales` | Add locale |
| `PUT` | `/api/v1/templates/{key}/locales/{locale}` | Update locale |
| `DELETE` | `/api/v1/templates/{key}/locales/{locale}` | Delete locale |
| `POST` | `/api/v1/templates/{key}/validate` | Validate variables |
| `GET` | `/api/v1/templates/{key}/variables` | Get variable schema |
| `GET` | `/api/v1/templates/{key}/docs` | Get template documentation |

### 🌐 Admin Interface

Access the template management interface at `/admin` and click on the **"Template Management"** tab to:

- **View Templates**: Browse all templates with search and filtering
- **Create Templates**: Add new templates with JSON editor
- **Edit Templates**: Modify existing templates with real-time validation
- **Manage Locales**: Add and edit locale-specific content
- **Validate Variables**: Test template variables against schemas
- **View Documentation**: Access auto-generated template docs

### 📖 Migration Guide

For detailed migration instructions from file-based to database-driven templates, see our comprehensive [Template Migration Guide](./docs/TEMPLATE_MIGRATION_GUIDE.md).

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 20+ | JavaScript runtime |
| **Language** | TypeScript | Type-safe development |
| **Framework** | Fastify | High-performance HTTP server |
| **Database** | PostgreSQL + Prisma | Data persistence and ORM |
| **Queue** | BullMQ + Redis | Background job processing |
| **Templates** | MJML + Handlebars | Responsive email design |
| **Container** | Docker | Containerization |
| **Monitoring** | Prometheus + Pino | Metrics and logging |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ 
- **PostgreSQL** 15+ (or Docker)
- **Redis** 7+ (or Docker)
- **Docker & Docker Compose** (optional)

### ⚡ 30-Second Setup

```bash
# 1. Clone and install
git clone <repository>
cd emailgateway
npm install

# 2. Install services (macOS)
./install-services.sh

# 3. Setup and start
./setup-local.sh

# Option A: Start both services together (recommended)
npm run dev:all

# Option B: Start services separately
npm run dev:api    # Terminal 1 (API on port 3000)
npm run dev:worker # Terminal 2 (Worker on port 3001)

# 4. Test it works
node test-api.js
```

### 🐳 Docker Setup (Alternative)

```bash
# Start all services with Docker (API + Worker + Database + Redis)
docker-compose up -d

# Run migrations
npm run migrate

# Start the application (both API and Worker)
npm run dev:all
```

### 📋 Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install services:**
   ```bash
   # PostgreSQL
   brew install postgresql@15
   brew services start postgresql@15
   createdb emailgateway
   
   # Redis
   brew install redis
   brew services start redis
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

5. **Start the services:**
   ```bash
   # Terminal 1 - API Server
   npm run dev
   
   # Terminal 2 - Worker
   npm run worker
   ```

</details>

## 🎨 Transactional Template Features

The Waymore Transactional Emails Service now features a powerful transactional template with advanced capabilities:

### ✨ Template Capabilities

| Feature | Description | Example |
|---------|-------------|---------|
| **Multi-Button Support** | Side-by-side primary and secondary buttons with tight spacing | Login + Sign Up buttons |
| **Social Media Integration** | Built-in social media links (Twitter, LinkedIn, GitHub, Facebook, Instagram) | Company social profiles |
| **Custom Themes** | Complete theme customization including colors, fonts, and styling | Brand colors, custom fonts |
| **Multi-Language Support** | Dynamic content based on locale with fallback support | English, Spanish, French, German |
| **Dynamic Images** | Support for custom images with fallback to default logo | Product images, illustrations |
| **Facts Table** | Structured data display with key-value pairs | Account details, order info |
| **Dark Mode Ready** | Theme-driven styling for proper dark mode rendering | Automatic dark/light themes |

### 🎯 Template Variables

```json
{
  "workspace_name": "Your Company",
  "user_firstname": "John",
  "product_name": "Your Product",
  "support_email": "support@company.com",
  "email_title": "Welcome!",
  "custom_content": "Your HTML content here...",
  "image_url": "https://example.com/image.png",
  "image_alt": "Image description",
  "facts": [
    {"label": "Account Type", "value": "Premium"},
    {"label": "Created", "value": "2024-01-01"}
  ],
  "cta_primary": {"label": "Get Started", "url": "https://app.com"},
  "cta_secondary": {"label": "Learn More", "url": "https://docs.com"},
  "social_links": [
    {"platform": "twitter", "url": "https://twitter.com/company"},
    {"platform": "linkedin", "url": "https://linkedin.com/company/company"}
  ],
  "theme": {
    "font_family": "'Roboto', Arial, sans-serif",
    "text_color": "#2c3e50",
    "primary_button_color": "#007bff",
    "background_color": "#ffffff"
  },
  "content": {
    "en": "English content",
    "es": "Contenido en español",
    "fr": "Contenu français"
  }
}
```

## 📡 API Reference

### 🔗 Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/emails` | Send email |
| `GET` | `/api/v1/messages/:id` | Get message status |
| `GET` | `/healthz` | Liveness probe |
| `GET` | `/readyz` | Readiness probe |
| `GET` | `/health` | Detailed health check |
| `GET` | `/metrics` | Prometheus metrics |
| `GET` | `/test-token` | Generate test JWT (dev only) |
| `GET` | `/admin` | Admin dashboard (web interface) |
| `GET` | `/admin/api/data` | Admin dashboard API data |
| `POST` | `/webhooks/routee` | Routee webhook endpoint |

### 💡 Example Usage

#### 1. Get Test Token (Development)
```bash
curl http://localhost:3000/test-token
```

#### 2. Send Email
```bash
curl -X POST http://localhost:3000/api/v1/emails \
  -H "Authorization: Bearer YOUR_TOKEN" \
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
      "product_name": "Waymore Platform",
      "support_email": "support@waymore.io",
      "email_title": "Welcome to Waymore!",
      "custom_content": "Hello John,<br><br>Welcome to our platform!",
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
        "primary_button_color": "#28a745",
        "text_color": "#2c3e50"
      }
    },
    "metadata": {"tenantId": "wm_123", "eventId": "evt_789"}
  }'
```

**Response:**
```json
{
  "messageId": "msg_abc123",
  "status": "queued"
}
```

#### 3. Check Message Status
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/messages/msg_abc123
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

#### 4. Access Admin Dashboard
```bash
# Open in browser
open http://localhost:3000/admin
```

#### 5. Test with Postman Collection
```bash
# Import the Postman collection
# File: Email-Gateway-API.postman_collection.json
# Follow: POSTMAN_SETUP.md
```

## 🏗️ Project Structure

```
emailgateway/
├── 📁 src/                    # Source code
│   ├── 📁 api/               # API layer
│   │   ├── 📁 controllers/   # Business logic
│   │   ├── 📁 routes/        # Route definitions
│   │   └── 📁 schemas/       # Validation schemas
│   ├── 📁 db/                # Database layer
│   ├── 📁 providers/         # Email providers
│   ├── 📁 queue/             # Queue system
│   ├── 📁 templates/         # Email templates
│   ├── 📁 utils/             # Utilities
│   └── 📄 index.ts           # Entry point
├── 📁 prisma/                # Database schema
├── 📁 docs/                  # Documentation
├── 📄 docker-compose.yml     # Local development
├── 📄 Dockerfile             # Production container
├── 📄 Email-Gateway-API.postman_collection.json  # Postman collection
├── 📄 POSTMAN_SETUP.md       # Postman setup guide
├── 📄 example-usage.js        # Usage examples
└── 📄 README.md              # This file
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret | `your-jwt-secret-key` |
| `JWT_ISSUER` | JWT issuer | `email-gateway` |
| `JWT_AUDIENCE` | JWT audience | `waymore-platform` |
| `PROVIDERS_ENABLED` | Enabled providers | `routee` |
| `RATE_GLOBAL_RPS` | Global rate limit | `200` |
| `LOG_LEVEL` | Logging level | `info` |
| `PORT` | Server port | `3000` |
| `WEBHOOK_BASE_URL` | Base URL for webhooks | `http://localhost:3000` |
| `ROUTEE_WEBHOOK_SECRET` | Webhook signature secret | (optional) |

### Provider Configuration

```bash
# Routee (OAuth 2.0)
ROUTEE_CLIENT_ID="your-routee-client-id"
ROUTEE_CLIENT_SECRET="your-routee-client-secret"
ROUTEE_BASE_URL="https://connect.routee.net"

# AWS SES
SES_ACCESS_KEY="your-ses-access-key"
SES_SECRET_KEY="your-ses-secret-key"
SES_REGION="us-east-1"

# SendGrid
SENDGRID_API_KEY="your-sendgrid-api-key"
```

## 🧪 Testing

### Automated Testing
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- --grep "email controller"
```

### Manual Testing
```bash
# Test the complete flow
node test-api.js

# Test individual endpoints
curl http://localhost:3000/healthz
curl http://localhost:3000/test-token
```

### Test Coverage
The test suite covers:
- ✅ API endpoints and validation
- ✅ Template rendering
- ✅ Queue processing
- ✅ Provider integration
- ✅ Database operations
- ✅ Authentication and authorization

## 📊 Observability

### Metrics (Prometheus)
- `emails_accepted_total` - Total emails accepted
- `emails_sent_total` - Total emails sent
- `emails_failed_total` - Total emails failed
- `provider_latency_ms` - Provider response latency
- `queue_depth` - Current queue depth
- `retry_count` - Total retries

### Logging
- **Structured JSON** logs with trace IDs
- **PII redaction** for security
- **Request correlation** across components
- **Error tracking** with stack traces

### Health Checks
- **Liveness**: `/healthz` - Is the service running?
- **Readiness**: `/readyz` - Is the service ready to serve traffic?
- **Health**: `/health` - Detailed health status

## 🎛️ Admin Dashboard

### Real-time Monitoring
Access the admin dashboard at `http://localhost:3000/admin` for:

- **System Health Cards** - Real-time system status
- **Queue Depth** - Current pending emails
- **Message Statistics** - Sent/Failed counts
- **Recent Messages Table** - All email activity with:
  - Message IDs and status badges
  - Recipients and subject lines
  - Provider information
  - Timestamps and creation dates
  - Click "View" for detailed message information

### Features
- **Auto-refresh** - Updates every 30 seconds
- **Message Details** - Complete email information
- **Provider Events** - Webhook events from email providers
- **Error Tracking** - Detailed error information
- **Responsive Design** - Works on desktop and mobile

## 🔗 Webhook Integration

### Real-time Status Updates
The Waymore Transactional Emails Service receives webhook events from email providers:

- **Routee Webhook** - `/webhooks/routee`
- **Status Mapping** - Automatic status updates (delivered, bounced, failed)
- **Event Storage** - All webhook events are stored for analytics
- **Client Notifications** - Forward webhooks to configured internal URL

### Webhook Events
- `delivered` → Updates to `DELIVERED` status
- `bounce` → Updates to `BOUNCED` status
- `failed` → Updates to `BOUNCED` status
- `dropped` → Updates to `BOUNCED` status

## 📦 Team Integration

### Postman Collection
Ready-to-use API collection for your team:

- **Import**: `Email-Gateway-API.postman_collection.json`
- **Setup Guide**: `POSTMAN_SETUP.md`
- **Features**:
  - Auto-token management
  - Auto-message ID capture
  - Pre-configured headers
  - Error handling examples
  - Complete request examples

### Usage Examples
- **JavaScript**: `example-usage.js` - Programmatic usage examples
- **cURL**: Command-line examples in this README
- **Postman**: Complete collection with all endpoints

## 🔒 Security

### Authentication
- **JWT tokens** for all API access
- **Machine-to-machine** authentication
- **Scope-based** authorization (`emails:send`, `emails:read`)

### Data Protection
- **Idempotency keys** prevent duplicate requests
- **Rate limiting** prevents abuse
- **Input validation** with Zod schemas
- **PII redaction** in logs

### Transport Security
- **TLS 1.2+** for all communications
- **HSTS** headers for web endpoints
- **Content Security Policy** for templates

## 🚀 Deployment

### Development
```bash
# Option 1: Use the automated startup script (recommended)
./start-dev.sh

# Option 2: Manual startup (requires two terminals)
# Terminal 1 - API Server
npm run dev:api

# Terminal 2 - Worker Process  
PORT=3001 npm run dev:worker
```

**⚠️ IMPORTANT**: The Waymore Transactional Emails Service requires **BOTH processes** to function:
- **API Server** (port 3000): Handles HTTP requests and queues emails
- **Worker Process** (port 3001): Processes queued emails and sends them

### Production
```bash
npm run build      # Build TypeScript
npm start          # Run production server
```

### Docker
```bash
docker build -t email-gateway .
docker run -p 3000:3000 email-gateway
```

### Kubernetes
```bash
kubectl apply -f k8s/
```

### Production Build
```bash
# Build TypeScript to JavaScript
npm run build

# Start the API server
npm run start:api

# Start the worker (in another terminal)
npm run start:worker
```

### Build Process Details
The build process compiles TypeScript source files to the `dist/` directory:
- **Entry Points**: `index-api.js` (API server), `worker-simple.js` (Worker), `startup.js` (Production)
- **API Layer**: Controllers, routes, and schemas
- **Providers**: Email provider implementations
- **Queue System**: Worker and producer logic
- **Utilities**: Authentication, logging, metrics
- **Database**: Prisma client and database utilities

### Available Scripts
```bash
npm run dev          # Development server with hot reload
npm run dev:api      # Development API server only
npm run dev:worker   # Development worker only
npm run build        # Build TypeScript to JavaScript
npm run start:api    # Start production API server
npm run start:worker # Start production worker
npm run start:cleanup # Start production cleanup worker
npm run worker       # Run worker in development mode
npm run cleanup      # Run cleanup worker in development mode
npm run cleanup:once # Run one-time cleanup
npm run cleanup:dry-run # Run cleanup dry run (preview)
npm run migrate      # Run database migrations
npm run generate     # Generate Prisma client
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 📚 Documentation

### 📖 Core Documentation
- **[Developer Guide](docs/DEVELOPER.md)** - Comprehensive development documentation
- **[API Reference](docs/API.md)** - Complete API documentation
- **[Architecture](docs/ARCHITECTURE.md)** - System design and patterns
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions

### 🔧 Integration Guides
- **[Routee Integration](docs/ROUTEE_INTEGRATION.md)** - Routee email provider setup and webhook configuration
- **[Universal Template Guide](docs/UNIVERSAL_TEMPLATE_GUIDE.md)** - Template system documentation
- **[Database Cleanup](docs/CLEANUP.md)** - Automatic data cleanup system for maintaining performance

### 📦 Package Documentation
- **[Single-Email Package](Single-Email%20package%20notifications/README.md)** - Enhanced notification templates with Routee integration

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow **TypeScript** best practices
- Write **tests** for new functionality
- Update **documentation** for API changes
- Use **conventional commits** for commit messages

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs/](docs/) folder
- **Issues**: Create a [GitHub issue](https://github.com/cantoniouwaymore/emailgateway/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/cantoniouwaymore/emailgateway/discussions)
- **Support Email**: cantoniou@waymore.io

---

<div align="center">

**Built with ❤️ by the Waymore Platform Team**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/cantoniouwaymore/emailgateway)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/company/waymore)

</div>
