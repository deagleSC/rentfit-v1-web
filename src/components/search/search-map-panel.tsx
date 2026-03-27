"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MapLibreGL from "maplibre-gl";
import type { MapRef } from "@/components/ui/map";
import {
  Map,
  MapClusterLayer,
  MapControls,
  MapMarker,
  MapPopup,
  MarkerContent,
  MarkerTooltip,
  useMap,
} from "@/components/ui/map";
import { fetchMapListings, type MapListing } from "@/lib/services/map-listings";
import {
  DEFAULT_MAP_CITY_SLUG,
  mapCenterForCitySlug,
} from "@/lib/rentfit/city-map-centers";
import { formatListingPriceInr } from "@/lib/rentfit/search-listings-from-messages";
import { useSearchWorkspace } from "@/components/search/search-workspace-context";
import { useAuthStore } from "@/store";
import { cn } from "@/lib/utils";

function bboxFromMap(map: MapRef): string {
  const b = map.getBounds();
  return `${b.getWest()},${b.getSouth()},${b.getEast()},${b.getNorth()}`;
}

type ClusterHover = {
  lng: number;
  lat: number;
  title: string;
  price: number;
  type: string;
};

function MapListingsLayer({
  listings,
  onMapLoaded,
  excludeIds,
  onUnclusteredPointHover,
}: {
  listings: MapListing[];
  onMapLoaded: (map: MapRef) => void;
  excludeIds: Set<string>;
  onUnclusteredPointHover: (detail: ClusterHover | null) => void;
}) {
  const { map, isLoaded } = useMap();
  const loadedOnce = useRef(false);

  useEffect(() => {
    if (!map || !isLoaded || loadedOnce.current) return;
    loadedOnce.current = true;
    onMapLoaded(map);
  }, [map, isLoaded, onMapLoaded]);

  const geojson = useMemo<
    GeoJSON.FeatureCollection<
      GeoJSON.Point,
      { id: string; title: string; price: number; type: string }
    >
  >(() => {
    const filtered = excludeIds.size
      ? listings.filter((l) => !excludeIds.has(l.id))
      : listings;
    return {
      type: "FeatureCollection",
      features: filtered.map((l) => ({
        type: "Feature",
        properties: {
          id: l.id,
          title: l.title,
          price: l.price,
          type: l.type,
        },
        geometry: {
          type: "Point",
          coordinates: l.location.coordinates,
        },
      })),
    };
  }, [listings, excludeIds]);

  const handleUnclusteredHover = useCallback(
    (
      detail: {
        feature: GeoJSON.Feature<
          GeoJSON.Point,
          { id?: string; title?: string; price?: number; type?: string }
        >;
        coordinates: [number, number];
      } | null,
    ) => {
      if (!detail) {
        onUnclusteredPointHover(null);
        return;
      }
      const p = detail.feature.properties ?? {};
      onUnclusteredPointHover({
        lng: detail.coordinates[0],
        lat: detail.coordinates[1],
        title: typeof p.title === "string" ? p.title : "Listing",
        price: typeof p.price === "number" ? p.price : 0,
        type: typeof p.type === "string" ? p.type : "",
      });
    },
    [onUnclusteredPointHover],
  );

  if (!isLoaded) return null;

  return (
    <MapClusterLayer
      data={geojson}
      /* MapLibre requires literal colors in paint — CSS variables are invalid */
      pointColor="#2563eb"
      clusterColors={["#22c55e", "#eab308", "#f97316"]}
      onUnclusteredPointHover={handleUnclusteredHover}
    />
  );
}

type SearchMapPanelProps = {
  className?: string;
};

export function SearchMapPanel({ className }: SearchMapPanelProps) {
  const { toolListings } = useSearchWorkspace();
  const preferredCitySlug = useAuthStore(
    (s) => s.user?.preferences?.defaultCity,
  );
  const mapInitialCenter = mapCenterForCitySlug(preferredCitySlug);
  const mapInstanceKey = preferredCitySlug ?? DEFAULT_MAP_CITY_SLUG;
  const mapRef = useRef<MapRef | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [listings, setListings] = useState<MapListing[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [clusterHover, setClusterHover] = useState<ClusterHover | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const toolIdSet = useMemo(
    () => new Set(toolListings.map((l) => l.id)),
    [toolListings],
  );

  const toolBoundsKey = useMemo(
    () => toolListings.map((l) => l.id).join(","),
    [toolListings],
  );

  const runFetch = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const bbox = bboxFromMap(map);
    fetchMapListings(bbox)
      .then((res) => {
        setListings(res.listings);
        setMapError(null);
      })
      .catch((e: unknown) => {
        setMapError(e instanceof Error ? e.message : "Map data failed");
      });
  }, []);

  const scheduleFetch = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      runFetch();
    }, 450);
  }, [runFetch]);

  const handleMapLoaded = useCallback(
    (m: MapRef) => {
      mapRef.current = m;
      setMapReady(true);
      runFetch();
    },
    [runFetch],
  );

  const handleViewportChange = useCallback(() => {
    scheduleFetch();
  }, [scheduleFetch]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map || toolListings.length === 0) return;
    const b = new MapLibreGL.LngLatBounds();
    for (const l of toolListings) {
      b.extend([l.lng, l.lat]);
    }
    map.fitBounds(b, { padding: 56, maxZoom: 15, duration: 550 });
  }, [mapReady, toolBoundsKey, toolListings]);

  return (
    <div
      className={cn(
        "border-border bg-muted/20 relative min-h-[240px] flex-1 overflow-hidden rounded-xl border md:min-h-0",
        className,
      )}
    >
      <Map
        key={mapInstanceKey}
        ref={mapRef}
        className="absolute inset-0 h-full min-h-0 w-full"
        center={mapInitialCenter}
        zoom={11}
        onViewportChange={handleViewportChange}
      >
        <MapListingsLayer
          listings={listings}
          excludeIds={toolIdSet}
          onMapLoaded={handleMapLoaded}
          onUnclusteredPointHover={setClusterHover}
        />
        {toolListings.map((l) => (
          <MapMarker
            key={l.id}
            longitude={l.lng}
            latitude={l.lat}
            anchor="bottom"
          >
            <MarkerContent>
              <div className="h-3.5 w-3.5 rounded-full border-2 border-white bg-orange-600 shadow-lg ring-1 ring-black/10" />
            </MarkerContent>
            <MarkerTooltip className="max-w-[220px] space-y-0.5 text-left">
              <p className="text-background font-semibold leading-tight">
                {l.title}
              </p>
              <p className="tabular-nums">
                {formatListingPriceInr(l.price)}
                <span className="opacity-80">/mo</span>
                {l.type ? <> · {l.type}</> : null}
              </p>
              <p className="opacity-90">
                {[l.locality, l.city].filter(Boolean).join(", ")}
              </p>
            </MarkerTooltip>
          </MapMarker>
        ))}
        {clusterHover ? (
          <MapPopup
            longitude={clusterHover.lng}
            latitude={clusterHover.lat}
            closeOnClick={false}
            className="max-w-[220px] space-y-0.5 p-2 text-xs shadow-lg"
          >
            <p className="text-foreground font-semibold leading-tight">
              {clusterHover.title}
            </p>
            <p className="text-muted-foreground tabular-nums">
              {formatListingPriceInr(clusterHover.price)}
              <span>/mo</span>
              {clusterHover.type ? <> · {clusterHover.type}</> : null}
            </p>
          </MapPopup>
        ) : null}
        <MapControls showZoom position="bottom-right" />
      </Map>
      {mapError && (
        <p className="bg-background/80 text-destructive absolute bottom-2 left-2 z-20 rounded px-2 py-1 text-xs">
          {mapError}
        </p>
      )}
    </div>
  );
}
