/**
 * Pexels API adapter for royalty-free image search.
 * API: https://www.pexels.com/api/documentation/
 */
import type { ImageResult } from "./types.js";
import { pexelsToImageResult, type PexelsPhoto } from "../utils/normalize.js";

const PEXELS_API_BASE = "https://api.pexels.com/v1";

export interface PexelsSearchResponse {
  total_results?: number;
  page?: number;
  per_page?: number;
  next_page?: string;
  photos?: PexelsPhoto[];
}

export async function searchPexels(
  apiKey: string,
  query: string,
  limit = 10,
): Promise<ImageResult[]> {
  const url = new URL(`${PEXELS_API_BASE}/search`);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(Math.min(limit, 80)));

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: apiKey,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    if (response.status === 401) {
      throw new Error("Invalid Pexels API key. Get one at https://www.pexels.com/api/");
    }
    if (response.status === 429) {
      throw new Error("Pexels rate limit exceeded. Try again later.");
    }
    throw new Error(`Pexels API error ${response.status}: ${body || response.statusText}`);
  }

  const data = (await response.json()) as PexelsSearchResponse;
  const photos = data.photos ?? [];

  return photos.map(pexelsToImageResult);
}
