import { DefaultChatTransport, type UIMessage } from "ai";
import { clearClientSession } from "@/lib/auth/clear-client-session";
import { API_BASE_URL, API_ROUTES } from "@/lib/configs/api";

const CHAT_URL = `${API_BASE_URL}${API_ROUTES.CHAT}`;

type GetServerChatId = () => string | undefined;

/**
 * Streams UI messages to rentfit-v1-be `POST /api/chat`.
 * - First request omits `chatId`; later requests use URL param or `X-Chat-Id` from the prior response.
 * - `onXChatId` runs when the response includes `X-Chat-Id` (new or existing session).
 */
export function createRentfitChatTransport(
  getServerChatId?: GetServerChatId,
  onXChatId?: (id: string) => void,
) {
  const headerChatIdRef = { current: null as string | null };

  return new DefaultChatTransport<UIMessage>({
    api: CHAT_URL,
    credentials: "include",
    fetch: async (input, init) => {
      const res = await fetch(input, {
        ...init,
        credentials: "include",
      });
      if (res.status === 401) {
        clearClientSession();
      }
      const xh = res.headers.get("X-Chat-Id");
      if (xh) {
        headerChatIdRef.current = xh;
        onXChatId?.(xh);
      }
      return res;
    },
    prepareSendMessagesRequest: ({ messages, body }) => {
      const fromProp = getServerChatId?.();
      const id =
        (fromProp && fromProp.length > 0 ? fromProp : null) ??
        headerChatIdRef.current ??
        undefined;
      const extra =
        body && typeof body === "object" && !Array.isArray(body)
          ? (body as Record<string, unknown>)
          : {};
      return {
        body: {
          ...extra,
          messages,
          ...(id ? { chatId: id } : {}),
        },
      };
    },
  });
}
