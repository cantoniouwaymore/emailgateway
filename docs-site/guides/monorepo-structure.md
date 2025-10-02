# Monorepo Structure

This guide explains the project structure and development workflow of the Internal Waymore Email Notification System monorepo.

## Overview

The Internal Waymore Email Notification System is organized as a monorepo containing multiple packages that work together to provide a complete email service solution.

## Project Structure

```
emailgateway/
├── packages/
│   ├── api-server/          # Main API server
│   ├── admin-ui/            # React admin interface
│   ├── email-worker/        # Email processing worker
│   ├── cleanup-worker/      # Data cleanup worker
│   └── shared-types/        # Shared TypeScript types
├── docs-site/               # VitePress documentation
├── docs/                    # Original documentation files
├── scripts/                 # Build and deployment scripts
├── docker-compose.yml       # Docker development setup
├── package.json             # Root package configuration
└── README.md               # Project overview
```

## Package Details

### API Server (`packages/api-server/`)

The main HTTP API server built with Fastify:

```
api-server/
├── src/
│   ├── api/                 # API routes and controllers
│   ├── db/                  # Database client and models
│   ├── providers/           # Email provider integrations
│   ├── queue/               # Queue management
│   ├── templates/           # Email templates
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── prisma/                  # Database schema and migrations
├── dist/                    # Compiled JavaScript
└── package.json
```

**Key Features:**
- RESTful API endpoints
- Authentication and authorization
- Template management
- Webhook handling
- Health monitoring

### Admin UI (`packages/admin-ui/`)

Modern React-based admin interface:

```
admin-ui/
├── src/
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── lib/                 # Utility libraries
│   ├── types/               # TypeScript types
│   └── hooks/               # Custom React hooks
├── public/                  # Static assets
├── dist/                    # Built application
└── package.json
```

**Key Features:**
- Template editor
- Message monitoring
- System health dashboard
- Real-time updates

### Email Worker (`packages/email-worker/`)

Background worker for processing emails:

```
email-worker/
├── src/
│   ├── producer.ts          # Queue producer
│   └── worker.ts            # Email processing worker
├── dist/                    # Compiled JavaScript
└── package.json
```

**Key Features:**
- Queue processing
- Email delivery
- Retry logic
- Error handling

### Cleanup Worker (`packages/cleanup-worker/`)

Scheduled cleanup tasks:

```
cleanup-worker/
├── src/
│   ├── cleanup.ts           # Cleanup logic
│   ├── scheduler.ts         # Task scheduling
│   └── worker-cleanup.ts    # Worker implementation
├── dist/                    # Compiled JavaScript
└── package.json
```

**Key Features:**
- Data retention
- Log cleanup
- Queue maintenance
- Scheduled tasks

### Shared Types (`packages/shared-types/`)

Common TypeScript type definitions:

```
shared-types/
├── admin.types.ts           # Admin UI types
├── api.types.ts             # API types
├── email.types.ts           # Email types
├── frontend.types.ts        # Frontend types
├── template.types.ts        # Template types
└── index.ts                 # Main export
```

## Development Workflow

### Prerequisites

- Node.js 20+
- npm or yarn
- Docker (for local development)
- PostgreSQL
- Redis

### Getting Started

1. **Clone Repository**:
```bash
git clone https://github.com/cantoniouwaymore/emailgateway.git
cd emailgateway
```

2. **Install Dependencies**:
```bash
npm install
```

3. **Set Up Environment**:
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Start Development Servers**:
```bash
npm run dev:all
```

### Available Scripts

#### Root Level Scripts

```bash
# Development
npm run dev:all              # Start all services
npm run dev:api              # Start API server only
npm run dev:ui               # Start admin UI only
npm run dev:worker           # Start email worker only

# Building
npm run build:all            # Build all packages
npm run build:api            # Build API server
npm run build:ui             # Build admin UI

# Testing
npm run test:all             # Run all tests
npm run test:api             # Run API tests
npm run test:ui              # Run UI tests

# Linting
npm run lint:all             # Lint all packages
npm run lint:api             # Lint API server
npm run lint:ui              # Lint admin UI

# Database
npm run migrate              # Run database migrations
npm run migrate:reset        # Reset database
npm run generate             # Generate Prisma client
```

#### Package-Specific Scripts

Each package has its own scripts defined in its `package.json`:

```bash
# API Server
cd packages/api-server
npm run dev                  # Development server
npm run build                # Build for production
npm run start                # Start production server

# Admin UI
cd packages/admin-ui
npm run dev                  # Development server
npm run build                # Build for production
npm run preview              # Preview production build

# Email Worker
cd packages/email-worker
npm run dev                  # Development worker
npm run build                # Build for production
npm run start                # Start production worker
```

## Build Process

### Development Build

```bash
# Start all services in development mode
npm run dev:all
```

This starts:
- API server on port 3000
- Admin UI on port 5173
- Email worker
- Cleanup worker

### Production Build

```bash
# Build all packages
npm run build:all

# Start production services
npm run start:all
```

### Docker Build

```bash
# Build Docker images
docker-compose build

# Start with Docker
docker-compose up
```

## Package Dependencies

### Internal Dependencies

Packages can depend on each other using workspace references:

```json
{
  "dependencies": {
    "@emailgateway/shared-types": "workspace:*"
  }
}
```

### External Dependencies

Each package manages its own external dependencies:

```json
{
  "dependencies": {
    "fastify": "^4.24.3",
    "react": "^19.1.1",
    "typescript": "~5.8.3"
  }
}
```

## Configuration

### Environment Variables

Each package can have its own environment configuration:

```bash
# API Server
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."
JWT_SECRET="your-secret"

# Admin UI
VITE_API_URL="http://localhost:3000"
VITE_APP_NAME="Internal Waymore Email Notification System"

# Workers
WORKER_CONCURRENCY="5"
CLEANUP_SCHEDULE="0 2 * * *"
```

### TypeScript Configuration

Each package has its own `tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Testing

### Unit Tests

Each package has its own test suite:

```bash
# Run tests for specific package
cd packages/api-server
npm test

# Run all tests
npm run test:all
```

### Integration Tests

Integration tests verify package interactions:

```bash
# Run integration tests
npm run test:integration
```

### E2E Tests

End-to-end tests verify the complete system:

```bash
# Run E2E tests
npm run test:e2e
```

## Deployment

### Development Deployment

```bash
# Deploy to development environment
npm run deploy:dev
```

### Production Deployment

```bash
# Deploy to production
npm run deploy:prod
```

### Docker Deployment

```bash
# Build and deploy with Docker
docker-compose -f docker-compose.prod.yml up -d
```

## Best Practices

### Code Organization

1. **Separation of Concerns** - Each package has a specific purpose
2. **Shared Types** - Use shared-types package for common interfaces
3. **Consistent Structure** - Follow the same structure across packages
4. **Clear Dependencies** - Minimize inter-package dependencies

### Development

1. **Local Development** - Use `npm run dev:all` for full development
2. **Package Isolation** - Work on one package at a time when possible
3. **Type Safety** - Use TypeScript for all packages
4. **Testing** - Write tests for each package

### Maintenance

1. **Regular Updates** - Keep dependencies up to date
2. **Security** - Monitor for security vulnerabilities
3. **Performance** - Monitor package performance
4. **Documentation** - Keep documentation up to date

## Troubleshooting

### Common Issues

**Build Failures**
- Check TypeScript errors
- Verify dependencies
- Check environment variables

**Runtime Errors**
- Check logs for specific packages
- Verify service connectivity
- Check database connections

**Development Issues**
- Restart development servers
- Clear node_modules and reinstall
- Check port conflicts

### Debugging

Enable debug mode:

```bash
DEBUG=* npm run dev:all
```

Check service health:

```bash
curl http://localhost:3000/health
```

## Support

For monorepo-related issues:

- 📖 [Full Documentation](/)
- 🔧 [API Reference](/api/)
- 💬 [GitHub Issues](https://github.com/cantoniouwaymore/emailgateway/issues)
- 📧 [Support](mailto:cantoni@waymore.io)
