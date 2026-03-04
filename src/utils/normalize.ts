/**
 * Maps Pexels API photo object to unified ImageResult schema.
 */
import type { ImageResult } from "../providers/types.js";

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url?: string;
  photographer_id?: number;
  src: {
    original?: string;
    large2x?: string;
    large?: string;
    medium?: string;
    small?: string;
  };
  alt?: string;
}

export function pexelsToImageResult(photo: PexelsPhoto): ImageResult {
  const imageUrl = photo.src?.original ?? photo.src?.large2x ?? photo.src?.large ?? photo.url;
  const tags = photo.alt
    ? photo.alt
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 2)
    : [];

  return {
    url: imageUrl,
    source: "Pexels",
    width: photo.width,
    height: photo.height,
    photographer: photo.photographer,
    tags,
  };
}
