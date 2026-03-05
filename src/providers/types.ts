/**
 * Unified image result schema per BRD.
 * All provider adapters map their responses to this shape.
 */
export interface ImageResult {
  url: string;
  source: string;
  width: number;
  height: number;
  photographer: string;
  tags: string[];
}

/**
 * Provider interface for image search adapters.
 * Implementations: Pexels, Pixabay, Unsplash (future).
 */
export interface Provider {
  search(query: string, options?: SearchOptions): Promise<ImageResult[]>;
}

export type Orientation = "landscape" | "portrait" | "square";

export interface SearchOptions {
  /** Max results to return (default: 10) */
  limit?: number;
  /** Page for pagination (default: 1) */
  page?: number;
  /** Filter by aspect ratio */
  orientation?: Orientation;
}

/** Response shape for search_images tool (BRD schema + optional error) */
export interface SearchImagesResult {
  results: ImageResult[];
  /** Present when search failed (e.g. missing API key) */
  error?: string;
}
