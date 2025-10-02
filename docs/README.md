# 📚 Waymore Transactional Emails Service Documentation

Welcome to the Waymore Transactional Emails Service documentation! This guide provides comprehensive information about the **monorepo** email microservice architecture, API usage, and integration guides.

## 🏗️ Monorepo Architecture

The service is organized as a monorepo with the following structure:

```
emailgateway/
├── packages/
│   ├── api-server/           # Main HTTP API service (Port: 3000)
│   ├── email-worker/         # Background email processing (Port: 3001)
│   ├── cleanup-worker/       # Database maintenance service
│   ├── admin-ui/             # React frontend (Port: 5173)
│   └── shared-types/         # Shared TypeScript types
├── scripts/                  # Build and deployment scripts
├── docs/                     # Documentation
└── infrastructure/           # Docker and deployment configs
```

## 📖 Documentation Structure

### 🏗️ Core Documentation

| Document | Description | Audience |
|----------|-------------|----------|
| **[API Reference](./API.md)** | Complete API documentation with examples, endpoints, and request/response schemas | Developers, Integrators |
| **[Architecture Guide](./ARCHITECTURE.md)** | System design, components, data flow, and architectural decisions | Developers, DevOps |
| **[Developer Guide](./DEVELOPER.md)** | Development setup, coding standards, testing, and contribution guidelines | Developers |
| **[Deployment Guide](./DEPLOYMENT.md)** | Production deployment, environment configuration, and monitoring | DevOps, SRE |

### 🔧 Integration Guides

| Document | Description | Audience |
|----------|-------------|----------|
| **[Routee Integration](./ROUTEE_INTEGRATION.md)** | Routee email provider setup and callback handling | Developers, Integrators |
| **[Transactional Template Guide](./TRANSACTIONAL_TEMPLATE_GUIDE.md)** | Template system, MJML usage, and responsive email design | Developers, Designers |
| **[Locale System Guide](./LOCALE_SYSTEM.md)** | Multi-language support, base template functionality, and fallback strategies | Developers, Integrators |

### 📦 Package Documentation

| Document | Description | Audience |
|----------|-------------|----------|
| **[Single-Email Package](../Single-Email%20package%20notifications/README.md)** | Enhanced notification templates with Routee integration | Developers, Product Teams |

## 🚀 Quick Navigation

### For Developers
- **Getting Started**: [Developer Guide](./DEVELOPER.md#quick-start)
- **API Usage**: [API Reference](./API.md#endpoints)
- **Template Development**: [Transactional Template Guide](./TRANSACTIONAL_TEMPLATE_GUIDE.md)

### For DevOps
- **Deployment**: [Deployment Guide](./DEPLOYMENT.md)
- **Architecture**: [Architecture Guide](./ARCHITECTURE.md)
- **Monitoring**: [Developer Guide](./DEVELOPER.md#monitoring)

### For Integrators
- **API Integration**: [API Reference](./API.md)
- **Routee Setup**: [Routee Integration](./ROUTEE_INTEGRATION.md)
- **Template Usage**: [Transactional Template Guide](./TRANSACTIONAL_TEMPLATE_GUIDE.md)

## 🎯 Key Features

### 📧 Email Processing
- **Multi-Provider Support**: Routee, SendGrid, SES
- **Template System**: MJML-based responsive templates
- **Multi-Language Support**: 40+ locales with intelligent base template fallback
- **Queue Processing**: Reliable background job processing
- **Status Tracking**: Real-time delivery tracking

### 🔧 Technical Features
- **RESTful API**: Standardized HTTP endpoints
- **Idempotency**: Exactly-once processing
- **Authentication**: JWT-based security
- **Monitoring**: Prometheus metrics and structured logging

### 📊 Observability
- **Health Checks**: System status monitoring
- **Metrics**: Performance and usage metrics
- **Logging**: Structured logging with trace IDs
- **Admin Dashboard**: Real-time monitoring interface

## 🔍 Common Use Cases

### 1. Sending Transactional Emails
```bash
curl -X POST /api/v1/emails \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": [{"email": "user@example.com", "name": "User"}],
    "from": {"email": "no-reply@company.com", "name": "Company"},
    "subject": "Welcome!",
    "template": {"key": "welcome", "locale": "en"},
    "variables": {"user_name": "John"}
  }'
```

### 2. Template Development
```mjml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>{{email_title}}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

## 🛠️ Development Workflow

### 1. Local Setup
```bash
# Clone repository
git clone <repository-url>
cd emailgateway

# Install dependencies
npm install

# Setup environment
cp env.example .env
# Edit .env with your configuration

# Start services
npm run dev:api
npm run dev:worker
```

### 2. Testing
```bash
# Run tests
npm test

# Test API endpoints
npm run test:api

# Test templates
npm run test:templates
```

### 3. Deployment
```bash
# Build for production
npm run build

# Deploy with Docker
docker-compose up -d

# Or deploy to cloud platform
npm run deploy
```

## 📞 Support

### Getting Help
- **Documentation**: Check the relevant guide above
- **Issues**: Create a [GitHub issue](https://github.com/cantoniouwaymore/emailgateway/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/cantoniouwaymore/emailgateway/discussions)
- **Support Email**: cantoniou@waymore.io

### Contributing
- **Code**: Follow the [Developer Guide](./DEVELOPER.md#contributing)
- **Documentation**: Update relevant guides
- **Testing**: Add tests for new features

---

**Last Updated**: September 2025  
**Version**: 1.0.0  
**Maintainer**: Waymore Platform Team