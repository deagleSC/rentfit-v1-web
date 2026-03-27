"use client";

import { useEffect, useMemo } from "react";
import type { UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { ChevronDown } from "lucide-react";
import { createRentfitChatTransport } from "@/lib/rentfit/chat-transport";
import { bootstrapSendGateKey } from "@/lib/services/chats";
import { getLatestSearchListingsFromMessages } from "@/lib/rentfit/search-listings-from-messages";
import { RentfitChatMessages } from "@/components/search/rentfit-chat-messages";
import { RentfitChatComposer } from "@/components/search/rentfit-chat-composer";
import { useSearchWorkspace } from "@/components/search/search-workspace-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Maximize, Minimize } from "lucide-react";

type SearchSessionChatProps = {
  chatId: string;
  initialMessages: UIMessage[];
  /** First prompt from `/search`; triggers one `sendMessage` after mount. */
  bootstrapMessage?: string | null;
  /** Mobile / tablet: collapsible message list; composer stays visible. */
  narrowStacked?: boolean;
  messagesPanelOpen?: boolean;
  onMessagesPanelOpenChange?: (open: boolean) => void;
};

export function SearchSessionChat({
  chatId,
  initialMessages,
  bootstrapMessage,
  narrowStacked = false,
  messagesPanelOpen = false,
  onMessagesPanelOpenChange,
}: SearchSessionChatProps) {
  const { setToolListings } = useSearchWorkspace();
  const transport = useMemo(
    () => createRentfitChatTransport(() => chatId),
    [chatId],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: chatId,
    messages: initialMessages,
    transport,
  });

  const latestSearch = useMemo(
    () => getLatestSearchListingsFromMessages(messages),
    [messages],
  );

  useEffect(() => {
    setToolListings(latestSearch?.listings ?? []);
  }, [latestSearch, setToolListings]);

  useEffect(() => {
    if (!bootstrapMessage?.trim()) return;
    const gate = bootstrapSendGateKey(chatId);
    if (typeof sessionStorage !== "undefined") {
      if (sessionStorage.getItem(gate)) return;
      sessionStorage.setItem(gate, "1");
    }
    void sendMessage({ text: bootstrapMessage.trim() });
  }, [bootstrapMessage, chatId, sendMessage]);

  const busy = status === "streaming" || status === "submitted";

  const composer = (
    <RentfitChatComposer
      onSend={(text) => sendMessage({ text })}
      disabled={busy}
      placeholder="Refine search, ask about a neighborhood…"
    />
  );

  if (narrowStacked) {
    return (
      <div className="border-border flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        {error && (
          <Alert variant="destructive" className="mx-3 mt-3 shrink-0">
            <AlertTitle>Chat error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <Collapsible
          open={messagesPanelOpen}
          onOpenChange={onMessagesPanelOpenChange}
          className={cn(
            "flex w-full min-w-0 flex-col overflow-hidden",
            messagesPanelOpen ? "min-h-0 flex-1" : "shrink-0",
          )}
        >
          <div className="border-border flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2">
            <p className="text-muted-foreground min-w-0 flex-1 text-xs leading-snug">
              Session · refine with the assistant or pan the map
            </p>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-muted-foreground shrink-0 gap-1.5 text-xs"
              >
                {messagesPanelOpen ? <Minimize /> : <Maximize />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="data-[state=closed]:hidden flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <RentfitChatMessages messages={messages} />
            </div>
          </CollapsibleContent>
          {composer}
        </Collapsible>
      </div>
    );
  }

  return (
    <div className="border-border flex max-h-[calc(100dvh-7rem)] min-h-0 flex-1 flex-col overflow-y-auto rounded-xl border bg-card shadow-sm">
      <div className="text-muted-foreground border-b px-3 py-2 text-xs">
        Session · refine with the assistant or pan the map
      </div>
      {error && (
        <Alert variant="destructive" className="m-2">
          <AlertTitle>Chat error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <RentfitChatMessages messages={messages} />
      {composer}
    </div>
  );
}
