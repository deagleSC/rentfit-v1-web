import type { UIMessage } from "ai";

/** Matches `SearchListingsResult` from rentfit-v1-be `searchListingsForChat`. */
export type ChatSearchListing = {
  id: string;
  title: string;
  price: number;
  type: string;
  locality?: string;
  city?: string;
  lng: number;
  lat: number;
};

export type ChatSearchListingsApplied = {
  citySlug: string;
  areaLabel: string;
  priceMin?: number;
  priceMax?: number;
  type?: string;
  amenities?: string[];
};

export type SearchListingsToolOutput = {
  listings: ChatSearchListing[];
  applied: ChatSearchListingsApplied;
  note?: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function parseSearchListingsToolOutput(
  output: unknown,
): SearchListingsToolOutput | null {
  if (!isRecord(output)) return null;
  const listingsRaw = output.listings;
  if (!Array.isArray(listingsRaw) || listingsRaw.length === 0) return null;
  const listings: ChatSearchListing[] = [];
  for (const row of listingsRaw) {
    if (!isRecord(row)) continue;
    const id = typeof row.id === "string" ? row.id : null;
    const title = typeof row.title === "string" ? row.title : null;
    const price = typeof row.price === "number" ? row.price : null;
    const type = typeof row.type === "string" ? row.type : null;
    const lng = typeof row.lng === "number" ? row.lng : null;
    const lat = typeof row.lat === "number" ? row.lat : null;
    if (
      id == null ||
      title == null ||
      price == null ||
      type == null ||
      lng == null ||
      lat == null
    )
      continue;
    listings.push({
      id,
      title,
      price,
      type,
      locality: typeof row.locality === "string" ? row.locality : undefined,
      city: typeof row.city === "string" ? row.city : undefined,
      lng,
      lat,
    });
  }
  if (listings.length === 0) return null;
  const appliedRaw = output.applied;
  if (!isRecord(appliedRaw)) return null;
  const citySlug =
    typeof appliedRaw.citySlug === "string" ? appliedRaw.citySlug : null;
  const areaLabel =
    typeof appliedRaw.areaLabel === "string" ? appliedRaw.areaLabel : null;
  if (citySlug == null || areaLabel == null) return null;
  const applied: ChatSearchListingsApplied = {
    citySlug,
    areaLabel,
    priceMin:
      typeof appliedRaw.priceMin === "number" ? appliedRaw.priceMin : undefined,
    priceMax:
      typeof appliedRaw.priceMax === "number" ? appliedRaw.priceMax : undefined,
    type: typeof appliedRaw.type === "string" ? appliedRaw.type : undefined,
    amenities: Array.isArray(appliedRaw.amenities)
      ? appliedRaw.amenities.filter((a): a is string => typeof a === "string")
      : undefined,
  };
  const note = typeof output.note === "string" ? output.note : undefined;
  return { listings, applied, note };
}

type ToolPartLike = {
  type: string;
  state?: string;
  output?: unknown;
  toolName?: string;
};

function outputFromToolPart(
  part: ToolPartLike,
): SearchListingsToolOutput | null {
  if (part.output === undefined || part.output === null) return null;
  if (
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    part.state === "approval-requested"
  ) {
    return null;
  }
  return parseSearchListingsToolOutput(part.output);
}

/** Latest successful `search_listings` tool output in the thread (for map sync). */
export function getLatestSearchListingsFromMessages(
  messages: UIMessage[],
): SearchListingsToolOutput | null {
  for (let mi = messages.length - 1; mi >= 0; mi--) {
    const m = messages[mi];
    if (m.role !== "assistant" || !m.parts?.length) continue;
    for (let pi = m.parts.length - 1; pi >= 0; pi--) {
      const part = m.parts[pi] as ToolPartLike;
      if (part.type === "tool-search_listings") {
        const parsed = outputFromToolPart(part);
        if (parsed) return parsed;
      }
      if (part.type === "dynamic-tool" && part.toolName === "search_listings") {
        const parsed = outputFromToolPart(part);
        if (parsed) return parsed;
      }
    }
  }
  return null;
}

export function formatListingPriceInr(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}
