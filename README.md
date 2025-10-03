# 📧 Email Gateway Monorepo

> A production-ready, stateless HTTP → Email dispatcher with templating, queueing, provider adapters, idempotency, and delivery tracking for the Waymore platform.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## 🏗️ Monorepo Architecture

This monorepo contains multiple services working together to provide a complete email gateway solution:

### 📦 **Packages**

| Package | Description | Port | Purpose |
|---------|-------------|------|---------|
| **`@emailgateway/api-server`** | Main HTTP API server | 3000 | REST API, webhooks (admin UI served separately) |
| **`@emailgateway/email-worker`** | Background job processor | 3001 | Email sending, queue processing |
| **`@emailgateway/cleanup-worker`** | Database maintenance | - | Data cleanup, scheduled tasks |
| **`@emailgateway/admin-ui`** | React admin interface (dev) | 5173 | Template editor, monitoring dashboard (dev mode) |
| **`@emailgateway/admin-server`** | Admin UI server | 5175 | Serves built React admin UI |
| **`@emailgateway/docs`** | VitePress documentation | 5174 | API docs, guides, architecture |
| **`@emailgateway/shared-types`** | TypeScript definitions | - | Shared types across all packages |

### 🎯 **Service Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                    MONOREPO SERVICES                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎨 FRONTEND SERVICES                                       │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────┐ │
│  │   Admin UI      │    │  Admin Server   │    │  Docs    │ │
│  │   (React Dev)   │    │  (Production)    │    │  Site    │ │
│  │   Port: 5173    │    │   Port: 5175     │    │ Port:5174│ │
│  └─────────────────┘    └─────────────────┘    └──────────┘ │
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
./scripts/install-services.sh

# 3. Setup and start
./scripts/setup-local.sh

# Option A: Start all services together (recommended)
npm run dev:all

# Option B: Start services separately
cd packages/api-server && npm run dev      # Terminal 1 (API on port 3000)
cd packages/email-worker && npm run dev    # Terminal 2 (Worker on port 3001)
cd packages/admin-ui && npm run dev        # Terminal 3 (Admin UI dev on port 5173)
cd packages/admin-server && npm run dev    # Terminal 4 (Admin server on port 5175)
cd docs-site && npm run dev                # Terminal 5 (Docs on port 5174)
```

### 🐳 Docker Setup (Alternative)

```bash
# Start all services with Docker (API + Worker + Database + Redis)
docker-compose up -d

# Run migrations
cd packages/api-server && npm run migrate

# Start the application (both API and Worker)
npm run start:all
```

## 📁 Project Structure

```
emailgateway/
├── packages/
│   ├── api-server/           # Backend API service
│   │   ├── src/
│   │   │   ├── api/          # API layer (controllers, routes, schemas)
│   │   │   ├── db/           # Database layer
│   │   │   ├── providers/    # Email providers
│   │   │   ├── queue/        # Queue system
│   │   │   ├── templates/    # Email templates
│   │   │   ├── types/        # TypeScript types
│   │   │   ├── utils/        # Utilities
│   │   │   └── index.ts      # Entry point
│   │   ├── prisma/           # Database schema
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── email-worker/         # Background worker service
│   │   ├── src/
│   │   │   ├── worker.ts     # Worker implementation
│   │   │   └── producer.ts   # Job producer
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   │
│   ├── cleanup-worker/       # Cleanup service
│   │   ├── src/
│   │   │   ├── worker-cleanup.ts
│   │   │   ├── cleanup.ts
│   │   │   └── scheduler.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── admin-ui/            # Frontend service (dev)
│   │   ├── src/
│   │   │   ├── components/   # React components
│   │   │   ├── pages/        # Page components
│   │   │   ├── lib/          # Utilities
│   │   │   └── types/        # Frontend types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   ├── admin-server/        # Admin UI server (prod)
│   │   ├── src/
│   │   │   └── index.ts      # Admin server implementation
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared-types/        # Shared package
│       ├── *.ts             # Type definitions
│       ├── package.json
│       └── tsconfig.json
│
├── scripts/                 # Build and deployment scripts
│   ├── start-dev.sh
│   ├── start-production.sh
│   └── install-services.sh
│
├── infrastructure/          # Infrastructure configs
│   └── docker-compose.yml
│
├── docs-site/              # VitePress documentation
│   ├── src/                # VitePress source files
│   ├── public/             # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── package.json            # Root workspace config
├── tsconfig.json           # Root TypeScript config
├── .gitignore              # Root gitignore
└── README.md               # This file
```

## 🎛️ Service Management

### Development Commands

```bash
# Start all services
npm run dev:all

# Start individual services
cd packages/api-server && npm run dev      # API Server (port 3000)
cd packages/email-worker && npm run dev    # Email Worker (port 3001)
cd packages/admin-ui && npm run dev        # Admin UI (port 5173)
cd docs-site && npm run dev                # Docs Site (port 5174)
cd packages/cleanup-worker && npm run dev  # Cleanup Worker (scheduled)
```

### Production Commands

```bash
# Start all services
npm run start:all

# Start individual services
cd packages/api-server && npm run start:api    # API Server (port 3000)
cd packages/email-worker && npm run start      # Email Worker (port 3001)
cd packages/admin-server && npm start          # Admin Server (port 5175)
cd packages/cleanup-worker && npm run start    # Cleanup Worker (scheduled)
```

### Build Commands

```bash
# Build all packages
npm run build:all

# Build individual packages
cd packages/api-server && npm run build
cd packages/email-worker && npm run build
cd packages/admin-ui && npm run build
cd packages/admin-server && npm run build
cd docs-site && npm run build
```

## 🔧 Development

### Adding New Packages

1. Create new package directory: `packages/new-package/`
2. Add `package.json` with proper workspace configuration
3. Update root `package.json` workspaces array
4. Add to startup scripts if needed

### Shared Dependencies

- Use `@emailgateway/shared-types` for shared TypeScript types
- Import from workspace packages: `import { Type } from '@emailgateway/shared-types'`
- Keep package-specific dependencies in individual `package.json` files

### Type Safety

All packages use the shared types package to ensure consistency:
- Backend types use `Date` objects for timestamps
- Frontend types use `string` for serialized dates
- API contracts are maintained across all services

## 📊 Monitoring

### Service Health

- **API Server**: http://localhost:3000/healthz
- **Email Worker**: http://localhost:3001/healthz
- **Admin UI (Dev)**: http://localhost:5173
- **Admin Server**: http://localhost:5175/health
- **Docs Site**: http://localhost:5174
- **Metrics**: http://localhost:3000/metrics

### Logs

Each service has its own logging:
- API Server: Structured JSON logs
- Email Worker: Queue processing logs
- Admin UI: Browser console logs

## 🚀 Deployment

### Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Services

Each package can be deployed independently:
- API Server: Main HTTP service
- Email Worker: Background processing
- Admin UI: Static frontend (builds to static files)
- Docs Site: Static documentation (builds to static files)
- Cleanup Worker: Scheduled maintenance

## 📚 Documentation

- **[API Reference](http://localhost:5174/api/complete)** - Complete API documentation
- **[Architecture](http://localhost:5174/guides/architecture)** - System design and patterns
- **[Developer Guide](http://localhost:5174/guides/developer)** - Development documentation
- **[Deployment Guide](http://localhost:5174/guides/deployment)** - Production deployment

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
- Maintain **type safety** across all packages

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Visit the [VitePress docs site](http://localhost:5174) (run `npm run dev:docs`)
- **Issues**: Create a [GitHub issue](https://github.com/cantoniouwaymore/emailgateway/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/cantoniouwaymore/emailgateway/discussions)
- **Support Email**: cantoniou@waymore.io

---

<div align="center">

**Built with ❤️ by the Waymore Platform Team**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/cantoniouwaymore/emailgateway)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/company/waymore)

</div>