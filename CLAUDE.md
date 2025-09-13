# CLAUDE.md

How to work with this project:

## Commands
```bash
pnpm dev      # dev server → localhost:3000/editor
pnpm build    # production build
pnpm preview  # build + start
pnpm lint     # lint (+ lint:fix for prettier)
pnpm typecheck # TS validation
pnpm depset   # update @udecode deps
```

## Setup
Copy `.env.example` → `.env.local`, set:
- `OPENROUTER_API_KEY` (AI features)
- `UPLOADTHING_TOKEN` (media uploads)

## Architecture
**Next.js 15 + Plate.js rich-text editor**

### Core Flow
`/` → redirects → `/editor` → `PlateEditor` component

### Key Files
- `src/components/editor/plate-editor.tsx` - main editor
- `src/components/editor/editor-kit.tsx` - plugin config
- `src/components/editor/plugins/` - modular features

### Plugin Categories
- **AI**: copilot, commands
- **Content**: blocks, marks, media, tables
- **Collab**: comments, suggestions
- **UI**: toolbars, menus, DnD

### Tech Stack
- **Plate.js** (Slate.js based)
- **Radix UI** + **shadcn/ui** + **Tailwind**
- **AI SDK** (Vercel + OpenRouter)
- **UploadThing** (media)

### Structure
```
src/
├── components/editor/  # editor + plugins
├── components/ui/      # shadcn components
├── hooks/             # custom hooks
└── lib/               # utils
```

### Config
- **TS**: flexible dev (`strict: false`), null checks on
- **ESLint**: auto-remove unused imports
- **Paths**: `@/*` → `src/*`
- **MCP**: `.cursor/mcp.json` for Plate registry