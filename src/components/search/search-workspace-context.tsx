"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ChatSearchListing } from "@/lib/rentfit/search-listings-from-messages";

type SearchWorkspaceValue = {
  toolListings: ChatSearchListing[];
  setToolListings: (listings: ChatSearchListing[]) => void;
};

const SearchWorkspaceContext = createContext<SearchWorkspaceValue | null>(null);

export function SearchWorkspaceProvider({ children }: { children: ReactNode }) {
  const [toolListings, setToolListings] = useState<ChatSearchListing[]>([]);
  const value = useMemo(
    () => ({ toolListings, setToolListings }),
    [toolListings],
  );
  return (
    <SearchWorkspaceContext.Provider value={value}>
      {children}
    </SearchWorkspaceContext.Provider>
  );
}

export function useSearchWorkspace(): SearchWorkspaceValue {
  const ctx = useContext(SearchWorkspaceContext);
  if (!ctx) {
    throw new Error(
      "useSearchWorkspace must be used within SearchWorkspaceProvider",
    );
  }
  return ctx;
}
