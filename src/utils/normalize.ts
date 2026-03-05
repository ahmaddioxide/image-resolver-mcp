/**
 * Maps provider API responses to unified ImageResult schema.
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

/** Unsplash API photo structure */
export interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  description?: string | null;
  alt_description?: string | null;
  urls?: {
    raw?: string;
    full?: string;
    regular?: string;
    small?: string;
    thumb?: string;
  };
  user?: {
    name?: string;
    username?: string;
  };
  tags?: Array<{ title?: string }>;
}

export function unsplashToImageResult(photo: UnsplashPhoto): ImageResult {
  const imageUrl =
    photo.urls?.regular ?? photo.urls?.full ?? photo.urls?.raw ?? "";
  const photographer = photo.user?.name ?? photo.user?.username ?? "Unknown";
  const tags =
    photo.tags?.map((t) => (t.title ?? "").toLowerCase()).filter(Boolean) ??
    (photo.alt_description
      ? photo.alt_description
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 2)
      : []);

  return {
    url: imageUrl,
    source: "Unsplash",
    width: photo.width,
    height: photo.height,
    photographer,
    tags,
  };
}
