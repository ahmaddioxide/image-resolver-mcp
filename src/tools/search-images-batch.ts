/**
 * search_images_batch tool - run multiple queries in parallel.
 */
import type { ImageResult } from "../providers/types.js";
import { searchImages } from "./search-images.js";

export interface SearchImagesBatchResult {
  results: Record<string, ImageResult[]>;
  errors?: string[];
}

export async function searchImagesBatch(
  queries: string[],
  options?: { limit?: number },
): Promise<SearchImagesBatchResult> {
  const limit = options?.limit ?? 5;
  const uniqueQueries = [...new Set(queries)].slice(0, 10);
  const results: Record<string, ImageResult[]> = {};
  const errors: string[] = [];

  const settled = await Promise.allSettled(
    uniqueQueries.map((q) => searchImages(q, { limit })),
  );

  uniqueQueries.forEach((query, i) => {
    const s = settled[i];
    if (s.status === "fulfilled") {
      results[query] = s.value.results;
      if (s.value.error) errors.push(`${query}: ${s.value.error}`);
    } else {
      results[query] = [];
      errors.push(`${query}: ${s.reason}`);
    }
  });

  return {
    results,
    errors: errors.length > 0 ? errors : undefined,
  };
}
