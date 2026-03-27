"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type RentfitChatComposerProps = {
  onSend: (text: string) => void | Promise<void>;
  disabled?: boolean;
  placeholder?: string;
};

export function RentfitChatComposer({
  onSend,
  disabled,
  placeholder = "Ask about rentals…",
}: RentfitChatComposerProps) {
  const [input, setInput] = useState("");

  return (
    <form
      className="flex shrink-0 flex-col gap-2 p-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const t = input.trim();
        if (!t || disabled) return;
        setInput("");
        await onSend(t);
      }}
    >
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="min-h-[72px] resize-none"
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
      />
      <Button
        type="submit"
        disabled={disabled || !input.trim()}
        className="self-end"
      >
        Send
      </Button>
    </form>
  );
}
