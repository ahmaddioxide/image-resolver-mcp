/**
 * resolve_image_attribution tool - generates provider-compliant attribution text.
 */
import type { ImageResult } from "../providers/types.js";

export interface ResolveAttributionResult {
  attribution: string;
}

export function resolveImageAttribution(
  input: ImageResult | { photographer: string; source: string; url?: string },
): ResolveAttributionResult {
  const { photographer, source } = input;

  const sourceLower = source.toLowerCase();
  if (sourceLower === "pexels") {
    return {
      attribution: `Photo by ${photographer} on Pexels`,
    };
  }
  if (sourceLower === "unsplash") {
    return {
      attribution: `Photo by ${photographer} on Unsplash`,
    };
  }

  return {
    attribution: `Photo by ${photographer} on ${source}`,
  };
}
