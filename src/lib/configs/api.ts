export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** Paths match `rentfit-v1-be` `createApp()` mounts. */
export const API_ROUTES = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
  LISTINGS: {
    CREATE: "/api/listings",
    BY_ID: (id: string) => `/api/listings/${id}`,
  },
  MAP: {
    LISTINGS: "/api/map/listings",
  },
  SERVICE_AREAS: {
    LIST: "/api/service-areas",
  },
  CHAT: "/api/chat",
  /** Collection or `GET /api/chats/:id` */
  CHATS: "/api/chats",
  HEALTH: "/health",
} as const;
