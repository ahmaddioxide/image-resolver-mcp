# Contributing to MCP Image Resolver

Thank you for your interest in contributing. This document explains how to get set up, propose changes, and submit contributions.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Pexels API key (free at [pexels.com/api](https://www.pexels.com/api/))

### Setup

```bash
git clone https://github.com/yourusername/image-mcp.git
cd image-mcp
npm install
cp .env.example .env
# Add your PEXELS_API_KEY to .env
npm run build
```

### Running in Development

Use `tsx` to run the server without building:

```bash
npm run dev
```

Or via MCP config:

```json
{
  "mcpServers": {
    "image-resolver": {
      "command": "npx",
      "args": ["tsx", "/path/to/image-mcp/src/index.ts"],
      "env": { "PEXELS_API_KEY": "your-key" }
    }
  }
}
```

## How to Contribute

### Reporting Bugs

- Use the [Issues](https://github.com/yourusername/image-mcp/issues) tab.
- Include Node.js version, OS, and steps to reproduce.
- Describe expected vs actual behavior.

### Suggesting Features

- Open an issue with the `enhancement` label.
- Describe the use case and how it fits the project.

### Code Contributions

1. **Fork** the repository and create a branch: `git checkout -b feature/your-feature` or `fix/your-fix`.
2. **Make changes** following existing code style (TypeScript, ESM).
3. **Test** your changes: `npm run build` and verify the server works with your MCP client.
4. **Commit** with clear messages: `feat: add Unsplash provider`, `fix: handle rate limit response`.
5. **Push** to your fork and open a Pull Request.

### Pull Request Guidelines

- Keep PRs focused; one feature or fix per PR.
- Update the README or docs if you change behavior.
- Add an entry to `CHANGELOG.md` under `[Unreleased]` if applicable.
- Ensure `npm run build` passes.

## Project Structure

```
src/
├── index.ts              # MCP server entry, tool registration
├── tools/
│   └── search-images.ts  # search_images tool handler
├── providers/
│   ├── types.ts          # ImageResult, SearchOptions, Provider interface
│   └── pexels.ts         # Pexels API adapter
└── utils/
    └── normalize.ts      # Map provider responses to ImageResult
```

## Adding a New Image Provider

To add a provider (e.g. Unsplash, Pixabay):

1. Create `src/providers/your-provider.ts`.
2. Implement a function that returns `ImageResult[]` (see `providers/types.ts`).
3. Add a normalizer in `utils/normalize.ts` if the API response differs.
4. Update `tools/search-images.ts` to support provider selection (or add a new tool).
5. Document the new provider and any required API keys.

## Code Style

- Use TypeScript with strict mode.
- Use ESM (`import`/`export`).
- Prefer `async/await` over raw promises.
- Add JSDoc for public functions and types.

## Questions

Open an issue for questions or discussions.
