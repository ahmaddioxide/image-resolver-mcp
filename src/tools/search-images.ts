/**
 * search_images tool handler.
 * Uses Pexels and Unsplash providers for royalty-free image search.
 */
import type {
  SearchImagesResult,
  SearchOptions,
  ImageResult,
} from "../providers/types.js";
import { searchPexels } from "../providers/pexels.js";
import { searchUnsplash } from "../providers/unsplash.js";

export type { SearchImagesResult } from "../providers/types.js";

const DEFAULT_LIMIT = 10;

function hasValidKey(key: string | undefined, placeholder: string): boolean {
  return !!(key && key !== placeholder);
}

export async function searchImages(
  query: string,
  options: SearchOptions = {},
): Promise<SearchImagesResult> {
  const pexelsKey = process.env.PEXELS_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (
    !hasValidKey(pexelsKey, "your-pexels-api-key") &&
    !hasValidKey(unsplashKey, "your-unsplash-access-key")
  ) {
    return {
      results: [],
      error:
        "No API keys configured. Set PEXELS_API_KEY and/or UNSPLASH_ACCESS_KEY. " +
        "Get keys at https://www.pexels.com/api/ and https://unsplash.com/oauth/applications",
    };
  }

  const limit = options.limit ?? DEFAULT_LIMIT;
  const opts: SearchOptions = { ...options, limit };

  const results: ImageResult[] = [];
  const errors: string[] = [];

  const promises: Promise<ImageResult[]>[] = [];

  if (hasValidKey(pexelsKey, "your-pexels-api-key")) {
    promises.push(
      searchPexels(pexelsKey!, query, opts).catch((err) => {
        errors.push(`Pexels: ${err instanceof Error ? err.message : String(err)}`);
        return [];
      }),
    );
  }

  if (hasValidKey(unsplashKey, "your-unsplash-access-key")) {
    promises.push(
      searchUnsplash(unsplashKey!, query, opts).catch((err) => {
        errors.push(
          `Unsplash: ${err instanceof Error ? err.message : String(err)}`,
        );
        return [];
      }),
    );
  }

  const providerResults = await Promise.all(promises);
  for (const arr of providerResults) {
    results.push(...arr);
  }

  return {
    results: results.slice(0, limit),
    error: errors.length > 0 ? errors.join("; ") : undefined,
  };
}
