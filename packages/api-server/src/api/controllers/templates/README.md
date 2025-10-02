# Template Controllers

This directory contains specialized controllers for template management operations.

## Purpose
Split the large `TemplateController` (1,499 lines) into focused, single-responsibility controllers.

## Planned Structure

```
templates/
├── crud.controller.ts          # Template CRUD operations
├── locale.controller.ts        # Locale management
├── preview.controller.ts       # Template preview & rendering
├── metadata.controller.ts      # Variables, validation, docs
└── index.ts                    # Main TemplateController that delegates to sub-controllers
```

## Status
⏳ **Planned** - To be implemented in Phase 2

## Migration Plan
See: `/REFACTORING_RECOMMENDATIONS.md` - Priority 1, Item #2

