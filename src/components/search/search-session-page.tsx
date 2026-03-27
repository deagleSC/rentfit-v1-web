"use client";

import { useEffect, useState } from "react";
import type { UIMessage } from "ai";
import { useIsBelowLg } from "@/hooks/use-is-below-lg";
import { fetchChatById, pendingFirstMessageKey } from "@/lib/services/chats";
import { normalizeUiMessages } from "@/lib/rentfit/normalize-ui-messages";
import { SearchMapPanel } from "@/components/search/search-map-panel";
import { SearchSessionChat } from "@/components/search/search-session-chat";
import { SearchWorkspaceProvider } from "@/components/search/search-workspace-context";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SearchSessionPageProps = {
  chatId: string;
};

export function SearchSessionPage({ chatId }: SearchSessionPageProps) {
  const isBelowLg = useIsBelowLg();
  const [messagesPanelOpen, setMessagesPanelOpen] = useState(false);
  const [initial, setInitial] = useState<UIMessage[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [bootstrapMessage, setBootstrapMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isBelowLg) setMessagesPanelOpen(false);
  }, [isBelowLg]);

  useEffect(() => {
    let cancelled = false;
    setInitial(null);
    setLoadError(null);
    setBootstrapMessage(null);
    fetchChatById(chatId)
      .then((c) => {
        if (cancelled) return;
        setInitial(normalizeUiMessages(c.messages));
        if (typeof sessionStorage !== "undefined") {
          const key = pendingFirstMessageKey(chatId);
          const pending = sessionStorage.getItem(key);
          if (pending) {
            sessionStorage.removeItem(key);
            setBootstrapMessage(pending);
          }
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Could not load chat");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [chatId]);

  if (loadError) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Chat unavailable</CardTitle>
          <CardDescription>{loadError}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/search" className={cn(buttonVariants())}>
            Start a new search
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (initial === null) {
    return (
      <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2 py-24">
        <Spinner className="size-8" />
        <p className="text-sm">Loading conversation…</p>
      </div>
    );
  }

  return (
    <SearchWorkspaceProvider>
      <div
        className={cn(
          "flex min-h-[calc(100dvh-9rem)] flex-1 gap-3 lg:flex-row lg:items-stretch lg:gap-4",
          isBelowLg && "min-h-0 flex-col",
        )}
      >
        <SearchMapPanel
          className={cn(
            "ease-out lg:flex-1",
            "transition-[min-height,max-height,flex-grow] duration-300",
            "shrink-0 lg:h-auto lg:max-h-none lg:min-h-0 lg:w-1/2",
            !isBelowLg && "h-[260px]",
            isBelowLg &&
              !messagesPanelOpen &&
              "max-h-none min-h-[min(52vh,440px)] flex-1",
            isBelowLg &&
              messagesPanelOpen &&
              "max-h-[min(34vh,300px)] min-h-[200px] flex-none",
          )}
        />
        <div
          className={cn(
            "flex min-h-0 flex-col",
            "lg:min-h-[min(60vh,520px)] lg:w-1/2 lg:flex-1",
            isBelowLg && messagesPanelOpen && "min-h-0 flex-1 basis-0",
            isBelowLg && !messagesPanelOpen && "shrink-0",
          )}
        >
          <SearchSessionChat
            chatId={chatId}
            initialMessages={initial}
            bootstrapMessage={bootstrapMessage}
            narrowStacked={isBelowLg}
            messagesPanelOpen={messagesPanelOpen}
            onMessagesPanelOpenChange={setMessagesPanelOpen}
          />
        </div>
      </div>
    </SearchWorkspaceProvider>
  );
}
