"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatListingPriceInr,
  type ChatSearchListing,
  type ChatSearchListingsApplied,
} from "@/lib/rentfit/search-listings-from-messages";

type ListingResultsCarouselProps = {
  listings: ChatSearchListing[];
  applied?: ChatSearchListingsApplied;
  note?: string;
};

function ListingCard({ listing }: { listing: ChatSearchListing }) {
  const place = [listing.locality, listing.city].filter(Boolean).join(", ");
  return (
    <Card className="border-border h-full border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-base leading-snug font-semibold">
          {listing.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground space-y-1 text-sm">
        <p className="text-foreground text-lg font-semibold tabular-nums">
          {formatListingPriceInr(listing.price)}
          <span className="text-muted-foreground ml-1 text-xs font-normal">
            / mo
          </span>
        </p>
        <p>
          <span className="text-foreground font-medium">{listing.type}</span>
          {place ? <> · {place}</> : null}
        </p>
      </CardContent>
    </Card>
  );
}

export function ListingResultsCarousel({
  listings,
  applied,
  note,
}: ListingResultsCarouselProps) {
  if (listings.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <p className="text-foreground text-sm font-medium">
          {listings.length} listing{listings.length === 1 ? "" : "s"}
          {applied ? (
            <span className="text-muted-foreground font-normal">
              {" "}
              · {applied.areaLabel}
            </span>
          ) : null}
        </p>
      </div>
      {note ? (
        <p className="text-muted-foreground text-xs leading-relaxed">{note}</p>
      ) : null}
      <Carousel opts={{ align: "start", loop: false }} className="w-full px-1">
        <CarouselContent className="-ml-2 md:-ml-3">
          {listings.map((listing) => (
            <CarouselItem
              key={listing.id}
              className="basis-full pl-2 md:basis-[85%] md:pl-3 lg:basis-[70%]"
            >
              <ListingCard listing={listing} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="border-border bg-background/95 top-1/2 -left-1 z-10 size-8 -translate-y-1/2 shadow-sm md:left-0"
          variant="outline"
        />
        <CarouselNext
          className="border-border bg-background/95 top-1/2 -right-1 z-10 size-8 -translate-y-1/2 shadow-sm md:right-0"
          variant="outline"
        />
      </Carousel>
    </div>
  );
}
