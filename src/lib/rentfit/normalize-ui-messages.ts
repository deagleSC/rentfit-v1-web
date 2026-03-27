import type { UIMessage } from "ai";

/** Restore persisted `uiMessages` from Mongo into `UIMessage[]`. */
export function normalizeUiMessages(raw: unknown): UIMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((m, i) => {
    const o = m as Record<string, unknown>;
    const rawId = typeof o.id === "string" ? o.id.trim() : "";
    const id = rawId.length > 0 ? rawId : `m-${i}`;
    const role = o.role === "user" || o.role === "assistant" ? o.role : "user";
    const parts = Array.isArray(o.parts) ? o.parts : [];
    return { id, role, parts } as UIMessage;
  });
}
