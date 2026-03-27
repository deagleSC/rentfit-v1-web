import { api } from "@/lib/utils/api-client";
import type { ApiErrorBody, ApiSuccessBody } from "@/types/api.types";

export type MapListing = {
  id: string;
  title: string;
  price: number;
  type: string;
  location: { type: "Point"; coordinates: [number, number] };
  address?: { locality?: string; city?: string };
};

export type MapListingsResponse = {
  listings: MapListing[];
  count: number;
};

/** `bbox` = `minLng,minLat,maxLng,maxLat` per rentfit-v1-be. */
export async function fetchMapListings(
  bbox: string,
): Promise<MapListingsResponse> {
  const { data } = await api.get<ApiSuccessBody<MapListingsResponse>>(
    "/api/map/listings",
    { params: { bbox } },
  );
  if (!data.success) {
    const err = data as unknown as ApiErrorBody;
    throw new Error(err.error?.message ?? "Failed to load map listings");
  }
  return data.data;
}
