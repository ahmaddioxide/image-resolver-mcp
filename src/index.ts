import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchImages } from "./tools/search-images.js";
import { extractImageQuery } from "./tools/extract-image-query.js";
import { getBestImage } from "./tools/get-best-image.js";
import { searchImagesBatch } from "./tools/search-images-batch.js";
import { resolveImageAttribution } from "./tools/resolve-image-attribution.js";

const server = new McpServer({
  name: "mcp-image-resolver",
  version: "0.2.0",
});

const orientationSchema = z
  .enum(["landscape", "portrait", "square"])
  .optional()
  .describe("Filter by aspect ratio");

server.registerTool(
  "search_images",
  {
    title: "Search Images",
    description:
      "Search for royalty-free images from Pexels and Unsplash. Supports limit, page, and orientation filters.",
    inputSchema: {
      query: z
        .string()
        .min(1)
        .describe("Search text (e.g. sunset mosque, zen yoga UI)"),
      limit: z.number().min(1).max(30).optional().describe("Max results (default: 10)"),
      page: z.number().min(1).optional().describe("Page for pagination (default: 1)"),
      orientation: orientationSchema,
    },
  },
  async ({ query, limit, page, orientation }) => {
    const result = await searchImages(query, { limit, page, orientation });
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
);

server.registerTool(
  "extract_image_query",
  {
    title: "Extract Image Query",
    description:
      "Transform free-form text (e.g. UI copy, context) into an optimized image search query using noun extraction.",
    inputSchema: {
      context: z
        .string()
        .min(1)
        .describe("Free-form text to extract search terms from"),
    },
  },
  async ({ context }) => {
    const result = extractImageQuery(context);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
);

server.registerTool(
  "get_best_image",
  {
    title: "Get Best Image",
    description: "Return a single best image for a query.",
    inputSchema: {
      query: z.string().min(1).describe("Search text"),
      orientation: orientationSchema,
    },
  },
  async ({ query, orientation }) => {
    const result = await getBestImage(query, { orientation });
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
);

server.registerTool(
  "search_images_batch",
  {
    title: "Search Images Batch",
    description: "Run multiple image searches in parallel. Returns results keyed by query.",
    inputSchema: {
      queries: z
        .array(z.string().min(1))
        .min(1)
        .max(10)
        .describe("List of search queries"),
      limit: z.number().min(1).max(10).optional().describe("Max results per query (default: 5)"),
    },
  },
  async ({ queries, limit }) => {
    const result = await searchImagesBatch(queries, { limit });
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
);

server.registerTool(
  "resolve_image_attribution",
  {
    title: "Resolve Image Attribution",
    description:
      "Generate provider-compliant attribution text for an image (e.g. Photo by X on Pexels).",
    inputSchema: {
      photographer: z.string().min(1).describe("Photographer name"),
      source: z.string().min(1).describe("Source (Pexels, Unsplash, etc.)"),
      url: z.string().url().optional().describe("Image URL (optional)"),
    },
  },
  async ({ photographer, source, url }) => {
    const result = resolveImageAttribution({ photographer, source, url });
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Image Resolver Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
