# API Services

This directory contains business logic services used by controllers.

## Purpose
Separate business logic from HTTP handling to improve testability and reusability.

## Planned Services

```
services/
├── template.service.ts         # Template business logic
├── email.service.ts            # Email sending logic
├── webhook.service.ts          # Webhook processing
├── admin-dashboard.service.ts  # Dashboard data preparation
└── validation.service.ts       # Template validation logic
```

## Best Practices
- Services should be framework-agnostic (no Fastify dependencies)
- Controllers should be thin, delegating to services
- Services contain business logic and data transformation
- Easy to unit test in isolation

## Status
⏳ **Planned** - To be implemented throughout refactoring phases

## Migration Plan
Extract service logic from controllers as they are refactored.

