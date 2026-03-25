import axios from "axios";
import { API_BASE_URL } from "@/lib/configs/api";

/**
 * JSON API client. `rentfit-v1-be` uses an httpOnly session cookie; always send credentials.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
