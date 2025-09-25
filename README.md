# 📧 Email Gateway Microservice

> A production-ready, stateless HTTP → Email dispatcher with templating, queueing, provider adapters, idempotency, and delivery tracking for the Waymore platform.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## ✨ Features

### 🚀 Core Capabilities
- **RESTful API**: Standardized POST /v1/emails endpoint with full validation
- **Template Engine**: MJML + Handlebars with localization support
- **Queue System**: BullMQ (Redis) for reliable background job processing
- **Provider Abstraction**: Pluggable email providers (Routee, SES, SendGrid)
- **Idempotency**: Exactly-once intake with Idempotency-Key header
- **Observability**: Structured logging, Prometheus metrics, health checks
- **Security**: JWT authentication, rate limiting, input validation

### 🏗️ Architecture
- **Stateless Design**: Horizontally scalable microservice
- **Clean Architecture**: Separation of concerns with clear boundaries
- **Event-Driven**: Asynchronous processing with reliable queues
- **Provider Agnostic**: Easy to add new email providers
- **Template-Driven**: Dynamic content with responsive email design

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
- **Docker & Docker Compose** (optional)
- **PostgreSQL** 15+
- **Redis** 7+

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
npm run dev    # Terminal 1
npm run worker # Terminal 2

# 4. Test it works
node test-api.js
```

### 🐳 Docker Setup (Alternative)

```bash
# Start all services with Docker
docker-compose up -d

# Run migrations
npm run migrate

# Start the application
npm run dev
npm run worker
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
    "template": {"key": "notifications/universal", "locale": "en"},
    "variables": {
      "email_title": "Welcome to Waymore!",
      "facts": [
        {"label": "Account Type", "value": "Premium"},
        {"label": "Created", "value": "2024-01-01"}
      ],
      "cta_primary": {
        "label": "Get Started",
        "url": "https://app.waymore.io"
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

### Provider Configuration

```bash
# Routee
ROUTEE_API_KEY="your-routee-api-key"
ROUTEE_BASE_URL="https://api.routee.net"

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
npm run dev        # API server
npm run worker     # Background worker
```

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

## 📚 Documentation

- **[Developer Guide](docs/DEVELOPER.md)** - Comprehensive development documentation
- **[API Reference](docs/API.md)** - Complete API documentation
- **[Architecture](docs/ARCHITECTURE.md)** - System design and patterns

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
- **Issues**: Create a [GitHub issue](https://github.com/your-org/emailgateway/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/your-org/emailgateway/discussions)

---

<div align="center">

**Built with ❤️ by the Waymore Platform Team**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-org/emailgateway)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/company/waymore)

</div>
