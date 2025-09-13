# Playground Template

A Next.js 15 template with [Plate](https://platejs.org/) AI, plugins and components.

## Features

- Next.js 15 App Directory
- [Plate](https://platejs.org/) editor
- [shadcn/ui](https://ui.shadcn.com/)
- [MCP](https://platejs.org/docs/components/mcp)

## Requirements

- Node.js 20+
- pnpm 9+

## Development

Copy the example env file:

```bash
cp .env.example .env.local
```

Configure `.env.local`:

- `OPENROUTER_API_KEY` – OpenRouter API key ([get one here](https://openrouter.ai/keys))
- `UPLOADTHING_TOKEN` – UploadThing API key ([get one here](https://uploadthing.com/dashboard))

Start the development server:

```bash
pnpm dev
```

Visit http://localhost:3000/editor to see the editor in action.
