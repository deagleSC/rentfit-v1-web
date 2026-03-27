import { AxiosError } from "axios";
import { api } from "@/lib/utils/api-client";
import type { ApiErrorBody, ApiSuccessBody } from "@/types/api.types";

const CHATS_BASE = "/api/chats";

/** Stash first message before `router.push` to `/search/[id]`; consumed by session page. */
export function pendingFirstMessageKey(chatId: string): string {
  return `rentfit_pending_first_message:${chatId}`;
}

/** Prevents double `sendMessage` under React Strict Mode for bootstrap. */
export function bootstrapSendGateKey(chatId: string): string {
  return `rentfit_bootstrap_sent:${chatId}`;
}

export async function createChatSession(): Promise<string> {
  const { data } = await api.post<ApiSuccessBody<{ chat: { id: string } }>>(
    CHATS_BASE,
    {},
  );
  if (!data.success) {
    const err = data as unknown as ApiErrorBody;
    throw new Error(err.error?.message ?? "Failed to create chat");
  }
  return data.data.chat.id;
}

export type RentfitChatDetail = {
  id: string;
  title: string;
  createdAt: string;
  userId?: string;
  lastCitySlug?: string;
  lastFilters?: unknown;
  lastListingIds?: string[];
  messages: unknown[];
};

export async function fetchChatById(
  chatId: string,
): Promise<RentfitChatDetail> {
  try {
    const { data } = await api.get<ApiSuccessBody<{ chat: RentfitChatDetail }>>(
      `${CHATS_BASE}/${chatId}`,
    );
    if (!data.success) {
      const err = data as unknown as ApiErrorBody;
      throw new Error(err.error?.message ?? "Failed to load chat");
    }
    return data.data.chat;
  } catch (e) {
    if (e instanceof AxiosError) {
      const body = e.response?.data as ApiErrorBody | undefined;
      if (body?.error?.message) {
        throw new Error(body.error.message);
      }
    }
    throw e;
  }
}
