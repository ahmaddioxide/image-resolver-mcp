/**
 * Unsplash API adapter for royalty-free image search.
 * API: https://unsplash.com/documentation
 */
import type { ImageResult, SearchOptions } from "./types.js";
import { unsplashToImageResult, type UnsplashPhoto } from "../utils/normalize.js";

const UNSPLASH_API_BASE = "https://api.unsplash.com";

export interface UnsplashSearchResponse {
  total?: number;
  total_pages?: number;
  results?: UnsplashPhoto[];
}

/** Map square -> squarish for Unsplash API */
function mapOrientation(orientation?: string): string | undefined {
  if (!orientation) return undefined;
  return orientation === "square" ? "squarish" : orientation;
}

export async function searchUnsplash(
  accessKey: string,
  query: string,
  options: SearchOptions = {},
): Promise<ImageResult[]> {
  const limit = Math.min(options.limit ?? 10, 30);
  const page = options.page ?? 1;

  const url = new URL(`${UNSPLASH_API_BASE}/search/photos`);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(limit));
  url.searchParams.set("page", String(page));
  const orientation = mapOrientation(options.orientation);
  if (orientation) {
    url.searchParams.set("orientation", orientation);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    if (response.status === 401) {
      throw new Error(
        "Invalid Unsplash API key. Get one at https://unsplash.com/oauth/applications",
      );
    }
    if (response.status === 403) {
      throw new Error("Unsplash API access forbidden.");
    }
    if (response.status === 429) {
      throw new Error("Unsplash rate limit exceeded. Try again later.");
    }
    throw new Error(
      `Unsplash API error ${response.status}: ${body || response.statusText}`,
    );
  }

  const data = (await response.json()) as UnsplashSearchResponse;
  const results = data.results ?? [];

  return results.map(unsplashToImageResult);
}
