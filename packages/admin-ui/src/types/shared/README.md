# @emailgateway/shared-types

Shared TypeScript types for the Email Gateway project, used by both frontend and backend to ensure type consistency.

## Overview

This package contains all shared TypeScript interfaces and types used across the Email Gateway application. It ensures that both the React admin UI and the Node.js backend use the same type definitions, preventing type mismatches and improving maintainability.

## Structure

- **`template.types.ts`** - Template management types (TemplateMetadata, TemplateLocale, etc.)
- **`admin.types.ts`** - Admin dashboard types (DashboardHealthCheck, SystemMetrics, etc.)
- **`api.types.ts`** - API communication types (ApiErrorResponse, ApiSuccessResponse, etc.)
- **`email.types.ts`** - Email sending and tracking types (SendEmailRequest, MessageStatus, etc.)
- **`frontend.types.ts`** - Frontend-specific types that extend backend types with serialized dates

## Key Features

### Type Consistency
- Single source of truth for all shared types
- Prevents type mismatches between frontend and backend
- Ensures API contracts are maintained

### Date Handling
- Backend types use `Date` objects for timestamps
- Frontend types use `string` for serialized dates (JSON transport)
- Automatic conversion handled by the frontend types

### Template Types
- `TemplateMetadata` - Core template information
- `TemplateLocale` - Locale-specific template content
- `TemplateWithLocales` - Template with all locales included
- `TemplateVariable` - Variable definitions and validation

### Admin Types
- `DashboardHealthCheck` - System health status
- `SystemMetrics` - Performance metrics
- `MessageStats` - Email statistics
- `PaginationParams` - Pagination support

## Usage

### In Backend (Node.js)
```typescript
import { TemplateMetadata, TemplateLocale, MessageStatus } from '@emailgateway/shared-types';
```

### In Frontend (React)
```typescript
import { Template, Message, HealthStatus } from '@emailgateway/shared-types';
```

## Type Differences

### Backend Types
- Use `Date` objects for timestamps
- Include database-specific fields (id, templateId)
- Use `Record<string, unknown>` for flexible object types

### Frontend Types
- Use `string` for timestamps (JSON serialized)
- Extend backend types with frontend-specific properties
- Use `Record<string, any>` for template variables

## Development

This package is part of the Email Gateway monorepo and is automatically linked via npm workspaces.

### Type Checking
```bash
cd shared-types
npm run type-check
```

### Adding New Types
1. Add the type to the appropriate file in this package
2. Export it from `index.ts`
3. Update both frontend and backend to use the new type
4. Ensure date handling is consistent (Date vs string)

## Migration Notes

This package consolidates previously duplicated types from:
- `admin-ui/src/types/index.ts`
- `src/types/template.types.ts`
- `src/types/admin.types.ts`
- `src/types/api.types.ts`
- `src/types/email.ts`

All existing code continues to work through re-exports, but new code should import directly from this package.
