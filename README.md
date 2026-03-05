# MCP Image Resolver Server

An MCP (Model Context Protocol) server that provides royalty-free image search for AI hosts like Cursor, Claude Desktop, VS Code, Windsurf, and more. Ask your AI assistant to find images by natural language—it uses the `search_images` tool and returns structured results from Pexels and Unsplash.

## Features

- **search_images** — Search for royalty-free images (supports limit, page, orientation)
- **extract_image_query** — Transform free-form text into an image search query
- **get_best_image** — Return a single best image for a query
- **search_images_batch** — Run multiple searches in parallel
- **resolve_image_attribution** — Generate provider-compliant attribution text
- **Pexels & Unsplash** — Multi-provider support (free tier for both)
- **Unified response** — Structured results with url, source, dimensions, photographer, tags
- **Works everywhere** — Any MCP client that supports stdio servers

## Requirements

- Node.js 18+
- At least one API key: Pexels ([pexels.com/api](https://www.pexels.com/api/)) and/or Unsplash ([unsplash.com/oauth/applications](https://unsplash.com/oauth/applications))

## Quick Start (No Installation Required)

No cloning or building needed. Just add this config to your MCP client and it runs via `npx` automatically:

```json
{
  "mcpServers": {
    "image-resolver": {
      "command": "npx",
      "args": ["-y", "@ahmaddioxide/mcp-image-resolver"],
      "env": {
        "PEXELS_API_KEY": "your-pexels-api-key",
        "UNSPLASH_ACCESS_KEY": "your-unsplash-access-key"
      }
    }
  }
}
```

At least one API key is required. Both are free — get them here:
- Pexels: [pexels.com/api](https://www.pexels.com/api/)
- Unsplash: [unsplash.com/oauth/applications](https://unsplash.com/oauth/applications)

## Architecture (High-Level)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MCP Client (Cursor, Claude, VS Code, etc.)        │
│                                     │                                       │
│                            stdio (stdin/stdout)                             │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MCP Image Resolver Server                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  index.ts          MCP server entry, registers tools, stdio transport│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  tools/search-images.ts   Tool handler: search_images(query)         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌──────────────────────┐  ┌──────────────────────┐                        │
│  │  providers/pexels.ts  │  │ providers/unsplash.ts │                        │
│  │  Pexels API adapter   │  │ Unsplash API adapter  │──▶ ImageResult schema  │
│  └──────────────────────┘  └──────────────────────┘                        │
│               │                        │                                    │
│               └────────────────────────┴────▶ utils/normalize.ts            │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    ▼                                   ▼
┌──────────────────────────────┐    ┌──────────────────────────────────────────┐
│  Pexels API                  │    │  Unsplash API                             │
│  api.pexels.com              │    │  api.unsplash.com                         │
└──────────────────────────────┘    └──────────────────────────────────────────┘
```

**Flow:** MCP client → stdio → `index.ts` (registers tools) → `search-images.ts` → Pexels and Unsplash providers (when keys are set). Results are merged (Pexels first, then Unsplash) and normalized to the unified `ImageResult` schema.

## Client Setup

### Cursor

Add to `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "image-resolver": {
      "command": "npx",
      "args": ["-y", "@ahmaddioxide/mcp-image-resolver"],
      "env": {
        "PEXELS_API_KEY": "your-pexels-api-key",
        "UNSPLASH_ACCESS_KEY": "your-unsplash-access-key"
      }
    }
  }
}
```

Restart Cursor after config changes.

### Claude Desktop

Add to your Claude config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

Via Settings: **Developer → Edit Config**

```json
{
  "mcpServers": {
    "image-resolver": {
      "command": "npx",
      "args": ["-y", "@ahmaddioxide/mcp-image-resolver"],
      "env": {
        "PEXELS_API_KEY": "your-pexels-api-key",
        "UNSPLASH_ACCESS_KEY": "your-unsplash-access-key"
      }
    }
  }
}
```

Restart Claude Desktop completely after saving.

### VS Code

Add to `.vscode/mcp.json` (workspace) or your user profile `mcp.json`:

```json
{
  "servers": {
    "image-resolver": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@ahmaddioxide/mcp-image-resolver"],
      "env": {
        "PEXELS_API_KEY": "your-pexels-api-key",
        "UNSPLASH_ACCESS_KEY": "your-unsplash-access-key"
      }
    }
  }
}
```

> **Note:** VS Code uses `servers` (not `mcpServers`) and requires `"type": "stdio"`.

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "image-resolver": {
      "command": "npx",
      "args": ["-y", "@ahmaddioxide/mcp-image-resolver"],
      "env": {
        "PEXELS_API_KEY": "your-pexels-api-key",
        "UNSPLASH_ACCESS_KEY": "your-unsplash-access-key"
      }
    }
  }
}
```

Refresh the MCP config after changes.

### Other MCP Clients

Any client that supports stdio MCP servers (Amp, Continue.dev, Amazon Q, etc.) can use this server:

- **Command**: `npx`
- **Args**: `["-y", "@ahmaddioxide/mcp-image-resolver"]`
- **Env**: `{ "PEXELS_API_KEY": "your-key", "UNSPLASH_ACCESS_KEY": "your-key" }` (at least one required)

## Usage

Once configured, ask your AI assistant to find images in natural language. It will call the `search_images` tool automatically.

**Example prompts:**

- "Find royalty-free images of a sunset mosque"
- "Search for zen yoga images suitable for a wellness app"
- "Get some minimalist office workspace photos"
- "Find images for a cooking blog header"

The tool returns image URLs and metadata. Use the links to view or download images.

## Tool Schema

| Tool                          | Params                                   | Description                              |
|-------------------------------|------------------------------------------|------------------------------------------|
| **search_images**             | query, limit?, page?, orientation?       | Search images from Pexels and Unsplash   |
| **extract_image_query**       | context                                  | Extract search terms from free-form text |
| **get_best_image**            | query, orientation?                      | Return a single best image               |
| **search_images_batch**       | queries, limit?                          | Run multiple searches in parallel        |
| **resolve_image_attribution** | photographer, source, url?               | Generate attribution text                |

**Response:** JSON with `results` array of `{ url, source, width, height, photographer, tags }`. Each result includes `source` (`"Pexels"` or `"Unsplash"`) for attribution.

**Note:** When both providers are configured, results are merged with Pexels first, then Unsplash. Use `limit: 20` or higher to see results from both providers in a single search.

## Testing

Example prompts to verify the tools:

- *"Search for mountain landscape with limit 20 and show me which results came from Pexels vs Unsplash."*
- *"Use extract_image_query on: I need a hero image for a meditation app with mountains."*
- *"Use search_images_batch for 'sunset mosque', 'pakistani flag', and 'zen yoga'."*
- *"Get a single best image for coffee shop and generate attribution for it."*

## Development

To contribute or run locally, clone the repo and build from source:

```bash
git clone https://github.com/ahmaddioxide/image-resolver-mcp.git
cd image-resolver-mcp
npm install
cp .env.example .env
# Add PEXELS_API_KEY and/or UNSPLASH_ACCESS_KEY to .env
npm run build
```

Or run in development mode without building, using `tsx`:

```json
{
  "mcpServers": {
    "image-resolver": {
      "command": "npx",
      "args": ["tsx", "/path/to/image-resolver-mcp/src/index.ts"],
      "env": {
        "PEXELS_API_KEY": "your-pexels-api-key",
        "UNSPLASH_ACCESS_KEY": "your-unsplash-access-key"
      }
    }
  }
}
```

## Attribution

Images are sourced from [Pexels](https://www.pexels.com/) and [Unsplash](https://unsplash.com/). Per their API terms:

- Provide prominent links to Pexels and Unsplash
- Credit photographers: "Photo by [Name] on Pexels" / "Photo by [Name] on Unsplash"
- Response metadata includes `photographer` and `source`; use `resolve_image_attribution` for compliant text

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community standards. See [SECURITY.md](SECURITY.md) for vulnerability reporting.

## License

MIT — see [LICENSE](LICENSE).