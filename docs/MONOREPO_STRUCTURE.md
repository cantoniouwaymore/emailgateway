# Monorepo Structure Guide

## Overview

The Waymore Transactional Emails Service is organized as a monorepo containing multiple microservices, each with specific responsibilities and clear boundaries. This structure enables better code organization, shared type safety, and simplified deployment.

## Package Organization

### 📦 Package Structure

```
emailgateway/
├── packages/
│   ├── api-server/           # Main HTTP API service
│   ├── email-worker/         # Background email processing
│   ├── cleanup-worker/       # Database maintenance service
│   ├── admin-ui/             # React frontend
│   └── shared-types/         # Shared TypeScript types
├── scripts/                  # Build and deployment scripts
├── docs/                     # Documentation
└── infrastructure/           # Docker and deployment configs
```

### 🔧 Service Responsibilities

| Package | Port | Purpose | Dependencies | Key Features |
|---------|------|---------|--------------|--------------|
| **api-server** | 3000 | HTTP API, admin dashboard, template management | PostgreSQL, Redis, Shared Types | REST API, JWT auth, template CRUD, admin endpoints |
| **email-worker** | 3001 | Background processing, email sending | Redis, Shared Types, API Server | Queue processing, email rendering, provider integration |
| **admin-ui** | 5173 | React frontend, template editor, monitoring | API Server, Shared Types | Template editor, dashboard, test email functionality |
| **cleanup-worker** | - | Database maintenance, scheduled cleanup | PostgreSQL, Shared Types | Data retention, performance optimization |
| **shared-types** | - | TypeScript definitions | None | Type safety, API contracts, frontend/backend consistency |

## 🏗️ Shared Types Architecture

### Type Organization

The `shared-types` package ensures type safety and consistency across all services:

```typescript
// packages/shared-types/index.ts
export * from './template.types';    // Template metadata, locales, variables
export * from './admin.types';       // Dashboard data, health checks
export * from './api.types';         // Request/response schemas, pagination
export * from './email.types';       // Message status, recipients, providers
export * from './frontend.types';    // Serialized versions for JSON transport
```

### Type Categories

#### Template Types (`template.types.ts`)
- `TemplateMetadata` - Core template structure
- `TemplateLocale` - Multi-language support
- `TemplateVariable` - Dynamic content variables
- `TemplateValidationResult` - Template validation

#### Email Types (`email.types.ts`)
- `MessageStatus` - Email delivery status
- `Recipient` - Email recipients
- `ProviderResult` - Provider response
- `SendEmailRequest` - Email sending payload

#### API Types (`api.types.ts`)
- `ApiErrorResponse` - Error response format
- `ApiSuccessResponse` - Success response format
- `PaginationParams` - Pagination parameters

#### Admin Types (`admin.types.ts`)
- `DashboardData` - Admin dashboard data
- `MessageStats` - Email statistics
- `SystemMetrics` - Performance metrics

#### Frontend Types (`frontend.types.ts`)
- `Template` - Frontend template interface
- `FrontendTemplateLocale` - Frontend locale structure
- Serialized date formats for JSON transport

## 🔄 Development Workflow

### Local Development

1. **Start All Services:**
   ```bash
   npm run dev:all
   ```

2. **Start Individual Services:**
   ```bash
   # API Server
   cd packages/api-server && npm run dev
   
   # Email Worker
   cd packages/email-worker && npm run dev
   
   # Admin UI
   cd packages/admin-ui && npm run dev
   
   # Cleanup Worker
   cd packages/cleanup-worker && npm run dev
   ```

### Build Process

1. **Build All Packages:**
   ```bash
   npm run build:all
   ```

2. **Build Individual Packages:**
   ```bash
   cd packages/api-server && npm run build
   cd packages/email-worker && npm run build
   cd packages/admin-ui && npm run build
   ```

### Type Safety

- **Shared Types**: All services import from `@emailgateway/shared-types`
- **Type Checking**: Run `npm run type-check:all` to verify all packages
- **Linting**: Run `npm run lint:all` to check code quality

## 📁 File Structure Details

### API Server (`packages/api-server/`)
```
packages/api-server/
├── src/
│   ├── api/                 # API layer
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # Route definitions
│   │   └── schemas/         # Request/response schemas
│   ├── db/                  # Database layer
│   ├── providers/           # Email providers
│   ├── queue/               # Queue system
│   ├── templates/           # Email templates
│   ├── types/               # TypeScript types (re-exports shared types)
│   └── utils/               # Utilities
├── prisma/                  # Database schema
├── package.json
└── tsconfig.json
```

### Email Worker (`packages/email-worker/`)
```
packages/email-worker/
├── src/
│   ├── worker.ts            # Worker implementation
│   └── producer.ts          # Job producer
├── package.json
└── tsconfig.json
```

### Admin UI (`packages/admin-ui/`)
```
packages/admin-ui/
├── src/
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── lib/                 # Utilities
│   └── types/               # Frontend types (re-exports shared types)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Cleanup Worker (`packages/cleanup-worker/`)
```
packages/cleanup-worker/
├── src/
│   ├── worker-cleanup.ts    # Cleanup worker
│   ├── cleanup.ts           # Cleanup logic
│   └── scheduler.ts         # Cleanup scheduler
├── package.json
└── tsconfig.json
```

### Shared Types (`packages/shared-types/`)
```
packages/shared-types/
├── template.types.ts        # Template-related types
├── admin.types.ts           # Admin-related types
├── api.types.ts             # API-related types
├── email.types.ts           # Email-related types
├── frontend.types.ts        # Frontend-specific types
├── index.ts                 # Main export file
├── package.json
└── tsconfig.json
```

## 🔗 Inter-Service Communication

### API Server → Email Worker
- **Method**: Redis Queue (BullMQ)
- **Purpose**: Queue email jobs for background processing
- **Data**: Email job payload with template and recipient data

### Admin UI → API Server
- **Method**: HTTP REST API
- **Purpose**: Template management, email sending, monitoring
- **Authentication**: JWT tokens

### All Services → Shared Types
- **Method**: TypeScript imports
- **Purpose**: Type safety and consistency
- **Implementation**: `import { Template } from '@emailgateway/shared-types'`

## 🚀 Deployment Considerations

### Containerization
Each package can be containerized independently:
- `api-server` → Docker container
- `email-worker` → Docker container
- `admin-ui` → Static files or container
- `cleanup-worker` → Cron job or container

### Scaling
- **API Server**: Horizontal scaling with load balancer
- **Email Worker**: Vertical scaling (more workers) or horizontal scaling
- **Admin UI**: Static file serving (CDN)
- **Cleanup Worker**: Single instance (cron-based)

### Monitoring
- Each service exposes health check endpoints
- Shared logging format across all services
- Centralized metrics collection

## 🛠️ Maintenance

### Adding New Types
1. Add types to `packages/shared-types/`
2. Export from `packages/shared-types/index.ts`
3. Update consuming services as needed

### Adding New Services
1. Create new package in `packages/`
2. Add to root `package.json` workspaces
3. Update documentation and deployment configs

### Updating Dependencies
1. Update individual `package.json` files
2. Run `npm install` from root
3. Test all services for compatibility

This monorepo structure provides a solid foundation for maintaining and scaling the email service while ensuring type safety and clear service boundaries.
