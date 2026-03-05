# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-03-06

### Added

- MCP Registry publishing: `server.json`, `mcpName` in package.json
- Quick Start section with zero-install `npx` setup in README
- `.gitignore` entries for MCP Registry auth tokens (`.mcpregistry_github_token`, `.mcpregistry_registry_token`)

### Changed

- Package name scoped to `@ahmaddioxide/mcp-image-resolver`
- All client config examples updated to use `npx -y @ahmaddioxide/mcp-image-resolver`
- Repository URLs updated to `ahmaddioxide/image-resolver-mcp`

## [0.2.0] - 2026-03-06

### Added

- Unsplash provider adapter (verified working with Pexels)
- `extract_image_query` — transform free-form text into search query (compromise.js)
- `get_best_image` — return single best image
- `search_images_batch` — run multiple searches in parallel
- `resolve_image_attribution` — generate provider-compliant attribution text
- `search_images` params: `limit`, `page`, `orientation` (landscape, portrait, square)
- Multi-provider aggregation (Pexels + Unsplash when both keys are set)

## [0.1.0] - 2026-03-05

### Added

- MCP server with `search_images` tool
- Pexels provider adapter for royalty-free image search
- STDIO transport for Cursor and other MCP hosts
- Unified response schema: url, source, width, height, photographer, tags
- OSS essentials: LICENSE (MIT), README, CONTRIBUTING, .gitignore, .editorconfig
