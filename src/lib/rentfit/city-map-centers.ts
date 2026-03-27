import type { ServiceCitySlug } from "@/types/auth.types";

/** [lng, lat] for MapLibre initial view. */
export const CITY_MAP_CENTER: Record<ServiceCitySlug, [number, number]> = {
  bangalore: [77.5946, 12.9716],
  mumbai: [72.8777, 19.076],
  kolkata: [88.3639, 22.5726],
};

export const DEFAULT_MAP_CITY_SLUG: ServiceCitySlug = "bangalore";

export function mapCenterForCitySlug(
  slug: string | undefined | null,
): [number, number] {
  if (slug === "bangalore" || slug === "mumbai" || slug === "kolkata") {
    return CITY_MAP_CENTER[slug];
  }
  return CITY_MAP_CENTER[DEFAULT_MAP_CITY_SLUG];
}
