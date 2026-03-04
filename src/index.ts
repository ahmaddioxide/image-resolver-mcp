import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchImages } from "./tools/search-images.js";

const server = new McpServer({
  name: "mcp-image-resolver",
  version: "0.1.0",
});

server.registerTool(
  "search_images",
  {
    title: "Image Resolver",
    description:
      "Search for royalty-free images based on a natural language query. Returns images from Pexels with url, source, dimensions, photographer, and tags.",
    inputSchema: {
      query: z
        .string()
        .min(1)
        .describe("Search text (e.g. sunset mosque, zen yoga UI)"),
    },
  },
  async ({ query }) => {
    const result = await searchImages(query);
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
