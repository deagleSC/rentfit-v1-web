"use client";

import Image from "next/image";
import logoSrc from "@/assets/logo.png";
import { cn } from "@/lib/utils";

type RentfitLogoProps = {
  className?: string;
  /** Edge length in pixels (square). */
  size?: number;
  priority?: boolean;
  alt?: string;
};

export function RentfitLogo({
  className,
  size = 32,
  priority = false,
  alt = "RentFit",
}: RentfitLogoProps) {
  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
