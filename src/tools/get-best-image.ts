/**
 * get_best_image tool - returns a single best image for a query.
 */
import type { ImageResult } from "../providers/types.js";
import { searchImages } from "./search-images.js";

export interface GetBestImageResult {
  image?: ImageResult;
  error?: string;
}

export async function getBestImage(
  query: string,
  options?: { orientation?: string },
): Promise<GetBestImageResult> {
  const result = await searchImages(query, {
    limit: 5,
    orientation: options?.orientation as
      | "landscape"
      | "portrait"
      | "square"
      | undefined,
  });

  if (result.error && result.results.length === 0) {
    return { error: result.error };
  }

  const image = result.results[0];
  if (!image) {
    return { error: "No images found for this query." };
  }

  return { image };
}
