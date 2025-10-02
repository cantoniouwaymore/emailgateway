# Admin Routes

This directory contains admin-related route handlers, split by feature.

## Purpose
Organize admin routes into focused modules instead of one large file (1,191 → 219 lines).

## Planned Structure

```
admin/
├── dashboard.routes.ts         # Main dashboard routes
├── template-editor.routes.ts   # Template editor routes
├── static-assets.routes.ts     # Static file serving
├── documentation.routes.ts     # Documentation/markdown viewer routes
└── index.ts                    # Main admin routes entry point
```

## Status
⏳ **Planned** - To be implemented in Phase 2

## Migration Plan
See: `/REFACTORING_RECOMMENDATIONS.md` - Priority 2, Item #5

