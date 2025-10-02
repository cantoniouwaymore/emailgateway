# Email Gateway - Modern Admin UI

This is the modern React + TypeScript admin interface for the Email Gateway, built with:

- **React 18+** - Modern component architecture
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast build tool
- **shadcn/ui** - Beautiful, accessible components
- **Tailwind CSS** - Utility-first styling
- **React Query** - Server state management
- **React Router** - Client-side routing

## Why This Approach?

This replaces 3,845+ lines of embedded JavaScript strings with:
- ✅ Proper TypeScript components
- ✅ Type-safe development
- ✅ Reusable shadcn/ui components
- ✅ Hot module replacement (instant updates)
- ✅ Better debugging and testing
- ✅ Modern developer experience

## Development

```bash
# Install dependencies
npm install

# Run development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

```
src/
├── components/
│   └── ui/              # shadcn/ui components (auto-generated)
├── pages/
│   ├── Dashboard.tsx    # Main dashboard
│   └── TemplateEditor.tsx # Template editor
├── lib/
│   ├── api.ts          # API client
│   └── utils.ts        # Utilities
├── types/
│   └── index.ts        # TypeScript types
├── App.tsx             # Main app with routing
└── main.tsx            # Entry point
```

## Integration

The React app runs on port 5173 in development and proxies API requests to the Fastify backend on port 3000.

In production, the built React app is served by Fastify at `/admin/react`.

## Migrating from Old HTML Generators

**Old Approach (Don't do this):**
- Embedded JavaScript in TypeScript strings
- No type safety
- Hard to debug
- Poor developer experience

**New Approach (This!):**
- Proper React components
- Full TypeScript support
- Modern tooling
- Great developer experience

## Status

- ✅ Foundation set up
- ✅ shadcn/ui configured
- ✅ Dashboard page created
- ✅ Template Editor started
- ⏳ Full migration in progress

See `/PHASE3_PLAN.md` for complete migration roadmap.
