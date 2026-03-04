# 📄 Product Requirements Document (PRD)

## **Project Name:**

**MCP Image Resolver Server**

## **Version:**

1.0 – Draft

## **Author:**

Muhammad Ahmad Mahmood

## **Date:**

March 5, 2026

---

# 🧠 1. Executive Summary

The **MCP Image Resolver Server** is a microservice oriented around the **Model Context Protocol (MCP)**. It provides developers and AI tools with **context‑aware image search capabilities** driven by open, royalty‑free sources. The MCP Image Resolver Server standardizes image fetching for AI hosts such as Cursor, Claude, VS Code, or any client that supports MCP.

By implementing this, developers get:

✔ Relevant, production‑ready images
✔ Free and open image sourcing (Pexels, Pixabay, Unsplash)
✔ Standardized MCP tool integration
✔ Caching and ranking for performance
✔ Zero cost for users

---

# 🎯 2. Goal

Provide an **open, free, and reusable MCP server** that resolves natural language UI context into structured, relevant image responses across AI hosts.

---

# 🎯 3. Definitions & MCP Background

### **Model Context Protocol (MCP)**

A standardized JSON‑RPC interface that allows a *host* (AI client) to communicate with *server tools*.

Key aspects:

* **Services/Tools**: Functions exposed by MCP servers
* **Transport Standard**: JSON‑RPC via STDIO, HTTP, WebSocket
* **Discovery**: Allows hosts to list available tools
* **Execution**: Tools execute contextual functions

(Reference: [https://modelcontextprotocol.io/docs/develop/build-server](https://modelcontextprotocol.io/docs/develop/build-server))

---

# 📦 4. Product Scope

## 4.1 In Scope

✔ MCP JSON‑RPC server implementation
✔ Keyword extraction from natural language
✔ Multiple image provider integration
✔ Results normalization
✔ Ranking engine
✔ Caching layer
✔ Secure and scalable deployment
✔ Open‑source delivery

## 4.2 Out of Scope (Phase 1)

❌ Custom image generation
❌ Paid provider dependencies
❌ Enterprise billing
❌ On‑device integration plugins

---

# 🔑 5. Core Features

## 🧩 Feature 1 — MCP JSON‑RPC Image Lookup Tool

### Purpose

Expose an MCP tool that accepts a query and returns relevant image results.

### Signature Example (JSON‑RPC)

```json
{
  "method": "search_images",
  "params": { "query": "sunset prayer UI" }
}
```

### Response Structure

```json
{
  "results": [
    {
      "url": "...",
      "source": "Pexels",
      "width": 1920,
      "height": 1080,
      "photographer": "John Doe",
      "tags": ["sunset","mosque"]
    }
  ]
}
```

---

## 🧠 Feature 2 — Context Keyword Extraction

### Purpose

Transform a free‑text context into an image search query.

### Implementation

Use lightweight NLP (stopword removal / noun extraction).
Example tools:

* compromise.js (JS)
* NLTK (Python)
* spaCy (Python)

---

## 🌐 Feature 3 — Multi‑Provider Adapter Layer

### Purpose

Integrate several royalty‑free providers:

✔ Pexels
✔ Pixabay
✔ Unsplash

Each adapter:

* Maps external API results to shared schema
* Adds provider metadata
* Handles errors per provider

---

## ⚙ Feature 4 — Ranking & Scoring

### Purpose

Choose best image based on:

| Criterion             | Weight |
| --------------------- | ------ |
| Keyword relevance     | 40%    |
| Orientation match     | 20%    |
| Resolution            | 15%    |
| Provider availability | 15%    |
| Popularity            | 10%    |

---

## 📦 Feature 5 — Caching

### Purpose

Reduce external API requests, enhance speed

### Cache Options

✔ In‑memory (small deployments)
✔ Redis (optional, for self‑hosters)
✔ Cloudflare KV (edge caching)

---

## 🔐 Feature 6 — Security & Abuse Protection

✔ Validate inputs
✔ Prevent injection attacks
✔ Rate limit per IP (optional)
✔ Secure API keys

---

# ⚙ 6. MCP Compliance Requirements

According to MCP standards:

### 6.1 Tool Deployment

Tool metadata must include:

✔ `id`
✔ `name`
✔ `description`
✔ `parameters`

Example MCP tool definition:

```json
{
  "id": "mcp.image_resolver",
  "name": "Image Resolver",
  "description": "Return royalty‑free images based on natural language context",
  "parameters": {
    "query": { "type": "string", "description": "Search text" }
  }
}
```

---

### 6.2 JSON‑RPC Transport

Supports:

✔ HTTP/JSON
✔ WebSockets
✔ STDIO

**HTTP/JSON** is the recommended default for remote MCP.

---

### 6.3 Discovery

MCP hosts must be able to list tools:

```json
{
  "method": "mcp_discovery.listTools",
  "params": {}
}
```

---

# 🧠 7. Implementation Hints

## 🧾 Language / Framework

**Recommended: Node.js + Fastify**

* Excellent for JSON APIs
* Easy MCP JSON‑RPC integration
* Easy serverless deployment

Alternative:

* Go (fast), Python (simple)

---

## 📡 Communication Layer

Use a JSON‑RPC library compatible with MCP:

* TypeScript: `@modelcontextprotocol/sdk`
* Python: `mcp` package
* Gon: JSON‑RPC frameworks

---

## 🌐 Provider Adapter Example (Pseudo)

```ts
interface Provider {
  search(query: string): Promise<Image[]>;
}
```

```ts
class PexelsAdapter implements Provider {
  async search(query) { /* call Pexels API */ }
}
```

---

## 🤖 Keyword Extraction Example (Node)

```js
import nlp from "compromise";

function extractQuery(text) {
  const doc = nlp(text);
  const nouns = doc.nouns().out("array");
  return nouns.join(" ");
}
```

---

## 🚀 Ranking Example

```js
function scoreImage(item, keywords) {
  /* compute relevance and orientation score */
}
```

---

# 🛠 8. Deployment Architecture

```plaintext
Client (Cursor/Claude/IDE)
        ↓
     MCP JSON‑RPC
        ↓
 Image Resolver Server
        ↓
   Cache → Provider Adapters → External Provider APIs
```

---

## 🏷 Hosting Options

| Platform           | Free Tier     | Notes                 |
| ------------------ | ------------- | --------------------- |
| Cloudflare Workers | ~100k req/day | Serverless JSON‑RPC   |
| Vercel             | Yes           | Serverless functions  |
| Fly.io             | Yes           | Persistent containers |

---

# ⚙ 9. API Design & Endpoints

Even though MCP uses JSON‑RPC, mapping to HTTP looks like:

```
POST /rpc
{
  "jsonrpc":"2.0",
  "id":1,
  "method":"search_images",
  "params":{"query":"zen yoga UI"}
}
```

Response:

```
{
  "jsonrpc":"2.0",
  "id":1,
  "result": {...}
}
```

---

# 📈 10. Success Metrics

| Metric             | Target       |
| ------------------ | ------------ |
| Image relevance    | ≥ 80%        |
| Cache hit rate     | ≥ 70%        |
| Average latency    | < 500ms      |
| Error rate         | < 1%         |
| Developer adoption | 100+ monthly |

---

# 🧠 11. Risks

| Risk                | Mitigation                   |
| ------------------- | ---------------------------- |
| Provider API limits | Use cache + multi providers  |
| Licensing disputes  | Only use free/open providers |
| Abuse               | Rate‑limiting + filtering    |
| Poor relevance      | Improving ranking logic      |

---

# 🧰 12. Future Enhancements

🚀 Self‑hosted image generation (Stable Diffusion)
🚀 User custom theming
🚀 UI preview micro front‑end
🚀 IDE plugin packages
🚀 Monetization options

---

# 📄 13. Quick MVP Roadmap

| Week | Goal                       |
| ---- | -------------------------- |
| 1    | MCP JSON‑RPC basic tool    |
| 2    | Provider adapters + search |
| 3    | Ranking + caching          |
| 4    | Deployment + docs          |
| 5    | Community launch           |

---

# 📌 14. Conclusion

Your MCP Image Resolver Server will:

✔ Conform to MCP standard
✔ Provide context‑aware royalty‑free images
✔ Be open and freely usable
✔ Integrate with popular AI hosts
✔ Support caching and ranking
✔ Be easy to host and scale

This PRD can be used to begin implementation and community collaboration.


