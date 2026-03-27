"use client";

import type { UIMessage } from "ai";
import { Streamdown } from "streamdown";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import { ListingResultsCarousel } from "@/components/search/listing-results-carousel";
import { parseSearchListingsToolOutput } from "@/lib/rentfit/search-listings-from-messages";
import { Sparkles } from "lucide-react";

type ToolLikePart = {
  type: string;
  state?: string;
  output?: unknown;
  toolName?: string;
  errorText?: string;
};

function renderSearchListingsToolPart(part: ToolLikePart, partKey: string) {
  if (part.type === "tool-search_listings" || part.type === "dynamic-tool") {
    if (part.type === "dynamic-tool" && part.toolName !== "search_listings") {
      return null;
    }
  } else {
    return null;
  }

  const hasOutput =
    part.state === "output-available" ||
    (part.output !== undefined &&
      part.output !== null &&
      part.state !== "input-streaming" &&
      part.state !== "input-available");

  if (hasOutput) {
    const data = parseSearchListingsToolOutput(part.output);
    if (data) {
      return (
        <div key={partKey} className="not-prose w-full max-w-full py-2">
          <ListingResultsCarousel
            listings={data.listings}
            applied={data.applied}
            note={data.note}
          />
        </div>
      );
    }
  }

  if (part.state === "output-error" && part.errorText) {
    return (
      <p key={partKey} className="text-destructive text-xs">
        Listings search failed: {part.errorText}
      </p>
    );
  }

  if (
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    part.state === "approval-requested"
  ) {
    return (
      <p key={partKey} className="text-muted-foreground text-xs">
        Searching listings…
      </p>
    );
  }

  return null;
}

function renderPart(
  part: UIMessage["parts"][number],
  index: number,
  partKeyPrefix: string,
) {
  const pk = `${partKeyPrefix}-${index}`;
  if (part.type === "text" && "text" in part) {
    return (
      <Streamdown
        key={pk}
        className="prose prose-sm dark:prose-invert max-w-none"
      >
        {part.text}
      </Streamdown>
    );
  }

  const asTool = part as ToolLikePart;
  const searchUi = renderSearchListingsToolPart(asTool, pk);
  if (searchUi) return searchUi;

  if (part.type.startsWith("tool-")) {
    return (
      <p
        key={pk}
        className="text-muted-foreground font-mono text-xs"
      >{`[${part.type}]`}</p>
    );
  }
  return null;
}

export function RentfitChatMessages({ messages }: { messages: UIMessage[] }) {
  if (messages.length === 0) {
    return (
      <ConversationEmptyState
        icon={<Sparkles className="size-8" />}
        title="Start the conversation"
        description="Ask about neighborhoods, budget, or listing details."
      />
    );
  }

  return (
    <Conversation className="min-h-0 flex-1">
      <ConversationContent>
        {messages.map((m, mi) => {
          const raw = typeof m.id === "string" ? m.id.trim() : "";
          const messageKey = raw.length > 0 ? raw : `local-${mi}`;
          return (
            <Message key={`msg-${mi}-${messageKey}`} from={m.role}>
              <MessageContent>
                {m.parts?.map((part, i) =>
                  renderPart(part, i, `p-${mi}-${messageKey}`),
                )}
              </MessageContent>
            </Message>
          );
        })}
      </ConversationContent>
    </Conversation>
  );
}
