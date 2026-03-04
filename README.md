# MCP Image Resolver Server

An MCP (Model Context Protocol) server that provides context-aware royalty-free image search for AI hosts like Cursor, Claude, and VS Code.

## Features

- **search_images** — Search for royalty-free images by natural language query
- **Pexels integration** — Uses Pexels API (free tier)
- **Unified response** — Structured results with url, source, dimensions, photographer, tags

## Requirements

- Node.js 18+
- Pexels API key (free at [pexels.com/api](https://www.pexels.com/api/))

## Installation

```bash
git clone https://github.com/yourusername/image-mcp.git
cd image-mcp
npm install
npm run build
```

## Configuration

Create a `.env` file (or set environment variables):

```
PEXELS_API_KEY=your-pexels-api-key
```

Copy from `.env.example`:

```bash
cp .env.example .env
```

## Cursor Setup

Add to `.cursor/mcp.json` in your project (or global Cursor config):

```json
{
  "mcpServers": {
    "image-resolver": {
      "command": "node",
      "args": ["/absolute/path/to/image-mcp/build/index.js"],
      "env": {
        "PEXELS_API_KEY": "your-pexels-api-key"
      }
    }
  }
}
```

For development with tsx (no build step):

```json
{
  "mcpServers": {
    "image-resolver": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/image-mcp/src/index.ts"],
      "env": {
        "PEXELS_API_KEY": "your-pexels-api-key"
      }
    }
  }
}
```

Restart Cursor after config changes.

## Usage

From Cursor or another MCP host, invoke the `search_images` tool with a query:

```
query: "sunset mosque"
```

## Attribution

Images are sourced from [Pexels](https://www.pexels.com/). Per Pexels API terms:

- Provide a prominent link to Pexels (e.g. "Photos provided by Pexels")
- Credit photographers when displaying images: "Photo by [Photographer Name] on Pexels"
- Response metadata includes `photographer` and `source` for compliance

## License

MIT — see [LICENSE](LICENSE).
