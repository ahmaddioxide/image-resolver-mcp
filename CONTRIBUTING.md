# Contributing to MCP Image Resolver

Thank you for your interest in contributing.

## Development Setup

1. Fork and clone the repo
2. `npm install`
3. Copy `.env.example` to `.env` and add your Pexels API key
4. `npm run build`
5. Add the server to Cursor `.cursor/mcp.json` and restart

## Making Changes

1. Create a branch from `main`
2. Make your changes with clear commits (use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `chore:`)
3. Run `npm run build` to ensure the project compiles
4. Test in Cursor or another MCP host

## Submitting

1. Open a Pull Request against `main`
2. Describe your change and why it's useful
3. Update CHANGELOG.md if applicable

## Code Style

- TypeScript, strict mode
- 2-space indent
- Trailing newlines, no trailing whitespace
- Use `console.error` for logs (stdout is reserved for JSON-RPC)
