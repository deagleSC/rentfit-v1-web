"use client";

import Link from "next/link";
import { RentfitLogo } from "@/components/brand/rentfit-logo";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface SidebarBrandingProps {
  name: string;
}

export function SidebarBranding({ name }: SidebarBrandingProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/search">
            <div className="flex items-center gap-2">
              <RentfitLogo size={32} className="size-8 rounded-lg" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  Preview
                </span>
              </div>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
