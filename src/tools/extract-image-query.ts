/**
 * extract_image_query tool - transforms free-form text into an image search query.
 */
import nlp from "compromise";

export interface ExtractQueryResult {
  query: string;
}

export function extractImageQuery(context: string): ExtractQueryResult {
  const doc = nlp(context);
  const nouns = doc.nouns().out("array") as string[];
  const terms = nouns.length > 0 ? nouns : context.split(/\s+/).slice(0, 5);
  const query = terms.filter((w) => w.length > 1).join(" ").trim();
  return { query: query || context.slice(0, 100) };
}
