# Database Template Engine Components

This directory contains modular components of the database template engine.

## Purpose
Split the `DatabaseTemplateEngine` class (972 lines) into focused, testable modules.

## Planned Structure

```
database-engine/
├── template-loader.ts      # Load templates from database
├── variable-merger.ts      # Merge variables with template structure
├── structure-converter.ts  # Convert old formats to new
├── template-renderer.ts    # Render MJML/Handlebars
├── helpers.ts             # Handlebars helper functions
├── types.ts               # Shared interfaces
└── index.ts               # Main DatabaseTemplateEngine class
```

## Status
⏳ **Planned** - To be implemented in Phase 2

## Migration Plan
See: `/REFACTORING_RECOMMENDATIONS.md` - Priority 2, Item #7

