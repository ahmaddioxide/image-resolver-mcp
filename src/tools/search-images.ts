/**
 * search_images tool handler.
 * Uses Pexels provider for royalty-free image search.
 */
import type { SearchImagesResult } from "../providers/types.js";
import { searchPexels } from "../providers/pexels.js";

export type { SearchImagesResult } from "../providers/types.js";

const DEFAULT_LIMIT = 10;

export async function searchImages(query: string): Promise<SearchImagesResult> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey || apiKey === "your-pexels-api-key") {
    return {
      results: [],
      error:
        "PEXELS_API_KEY is not set. Get a free key at https://www.pexels.com/api/ and add it to your environment.",
    };
  }

  try {
    const images = await searchPexels(apiKey, query, DEFAULT_LIMIT);
    return { results: images };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      results: [],
      error: message,
    };
  }
}
