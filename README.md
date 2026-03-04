# MCP Image Resolver Server

An MCP (Model Context Protocol) server that provides royalty-free image search for AI hosts like Cursor, Claude Desktop, VS Code, Windsurf, and more. Ask your AI assistant to find images by natural language—it uses the `search_images` tool and returns structured results from Pexels.

## Features

- **search_images** — Search for royalty-free images by natural language query
- **Pexels integration** — Uses Pexels API (free tier)
- **Unified response** — Structured results with url, source, dimensions, photographer, tags
- **Works everywhere** — Any MCP client that supports stdio servers

## Requirements

- Node.js 18+
- Pexels API key (free at [pexels.com/api](https://www.pexels.com/api/))

## Quick Start

```bash
git clone https://github.com/yourusername/image-mcp.git
cd image-mcp
npm install
npm run build
```

Create a `.env` file or set `PEXELS_API_KEY` in your environment:

```bash
cp .env.example .env
# Edit .env and add your Pexels API key
```

## Client Setup

Configure the server in your MCP client. Replace `/path/to/image-mcp` with the actual path on your machine.

### Cursor

Add to `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "image-resolver": {
      "command": "node",
      "args": ["/path/to/image-mcp/build/index.js"],
      "env": {
        "PEXELS_API_KEY": "your-pexels-api-key"
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
      "command": "node",
      "args": ["/path/to/image-mcp/build/index.js"],
      "env": {
        "PEXELS_API_KEY": "your-pexels-api-key"
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
      "command": "node",
      "args": ["/path/to/image-mcp/build/index.js"],
      "env": {
        "PEXELS_API_KEY": "your-pexels-api-key"
      }
    }
  }
}
```

VS Code uses `servers` (not `mcpServers`) and requires `"type": "stdio"`.

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "image-resolver": {
      "command": "node",
      "args": ["/path/to/image-mcp/build/index.js"],
      "env": {
        "PEXELS_API_KEY": "your-pexels-api-key"
      }
    }
  }
}
```

Refresh the MCP config after changes.

### Other MCP Clients

Any client that supports stdio MCP servers (Amp, Continue.dev, AIQL TUUI, Amazon Q, etc.) can use this server. Use:

- **Command**: `node`
- **Args**: `["/path/to/image-mcp/build/index.js"]`
- **Env**: `{ "PEXELS_API_KEY": "your-key" }`

## Development Mode

Run without building, using `tsx`:

```json
{
  "mcpServers": {
    "image-resolver": {
      "command": "npx",
      "args": ["tsx", "/path/to/image-mcp/src/index.ts"],
      "env": {
        "PEXELS_API_KEY": "your-pexels-api-key"
      }
    }
  }
}
```

## Usage

Once configured, ask your AI assistant to find images in natural language. It will call the `search_images` tool automatically.

**Example prompts:**

- "Find royalty-free images of a sunset mosque"
- "Search for zen yoga images suitable for a wellness app"
- "Get some minimalist office workspace photos"
- "Find images for a cooking blog header"

The tool returns image URLs and metadata. Use the links to view or download images.

## Tool Schema

| Field        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| `query`     | string | Natural language search (e.g. "sunset mosque")   |

**Response:** JSON with `results` array of `{ url, source, width, height, photographer, tags }`.

## Attribution

Images are sourced from [Pexels](https://www.pexels.com/). Per Pexels API terms:

- Provide a prominent link to Pexels (e.g. "Photos provided by Pexels")
- Credit photographers when displaying images: "Photo by [Photographer Name] on Pexels"
- Response metadata includes `photographer` and `source` for compliance

## License

MIT — see [LICENSE](LICENSE).
