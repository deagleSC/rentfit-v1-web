"use client";

import { useCallback } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";

const SUGGESTIONS = [
  "2-bedroom apartments under $2000 near downtown",
  "Pet-friendly rentals with parking",
  "Houses for rent with a yard",
];

function SearchPromptInner() {
  const { textInput } = usePromptInputController();

  const handleSubmit = useCallback(async (message: { text: string }) => {
    const text = message.text.trim();
    if (!text) {
      toast.message("Add a question to search rentals");
      return;
    }
    toast.message("Assistant wiring comes next", {
      description: text.length > 100 ? `${text.slice(0, 100)}…` : text,
    });
  }, []);

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-8">
      <div className="space-y-2 text-center">
        <div className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl">
          <Sparkles className="size-7" aria-hidden />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Ask RentFit</h1>
        <p className="text-muted-foreground mx-auto max-w-md text-sm text-pretty">
          Describe what you&apos;re looking for. We&apos;ll match listings and
          answer in plain language.
        </p>
      </div>

      <div className="w-full space-y-4">
        <PromptInput
          className="rounded-xl shadow-sm"
          onSubmit={(msg) => handleSubmit({ text: msg.text })}
        >
          <PromptInputTextarea
            className="min-h-28"
            placeholder="e.g. Quiet 1BR near transit, budget $1800, cat OK…"
          />
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit variant="default" />
          </PromptInputFooter>
        </PromptInput>

        <div className="space-y-2">
          <p className="text-muted-foreground text-center text-xs font-medium tracking-wider uppercase">
            Try asking
          </p>
          <Suggestions className="pb-1">
            {SUGGESTIONS.map((s) => (
              <Suggestion
                key={s}
                suggestion={s}
                onClick={(q) => textInput.setInput(q)}
              />
            ))}
          </Suggestions>
        </div>
      </div>
    </div>
  );
}

export function SearchAiPrompt() {
  return (
    <PromptInputProvider>
      <SearchPromptInner />
    </PromptInputProvider>
  );
}
