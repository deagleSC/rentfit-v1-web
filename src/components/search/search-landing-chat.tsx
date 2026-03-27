"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RentfitLogo } from "@/components/brand/rentfit-logo";
import {
  createChatSession,
  pendingFirstMessageKey,
} from "@/lib/services/chats";
import { RentfitChatComposer } from "@/components/search/rentfit-chat-composer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * Creates a session via `POST /api/chats`, stores the first prompt, then navigates
 * immediately to `/search/[chatId]` where the stream runs (map + chat).
 */
export function SearchLandingChat() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(text: string) {
    setError(null);
    setBusy(true);
    try {
      const chatId = await createChatSession();
      sessionStorage.setItem(pendingFirstMessageKey(chatId), text);
      router.push(`/search/${chatId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="space-y-2 text-center">
        <div className=" mx-auto flex size-16 items-center justify-center rounded-2xl p-2">
          <RentfitLogo size={48} className="rounded-lg" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Ask RentFit</h1>
        <p className="text-muted-foreground mx-auto max-w-md text-sm text-pretty">
          Describe what you&apos;re looking for. You&apos;ll land on the map and
          chat view right away—the assistant replies there.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Couldn&apos;t start search</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border-border rounded-xl border bg-card p-1 shadow-sm">
        <RentfitChatComposer onSend={handleSend} disabled={busy} />
      </div>
    </div>
  );
}
