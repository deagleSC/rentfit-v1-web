import { useAuthStore } from "../stores/auth-store";
import { authServices } from "../services/auth-services";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth.schema";
import type { User } from "@/types/auth.types";

export const authActions = {
  register: async (data: RegisterInput): Promise<User> => {
    const { setLoading, setError, setUser } = useAuthStore.getState();
    setLoading(true);
    setError(null);
    try {
      const user = await authServices.register(data);
      setUser(user);
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign up failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  },

  login: async (data: LoginInput): Promise<User> => {
    const { setLoading, setError, setUser } = useAuthStore.getState();
    setLoading(true);
    setError(null);
    try {
      const user = await authServices.login(data);
      setUser(user);
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  },

  logout: async (): Promise<void> => {
    const { clearAuth } = useAuthStore.getState();
    try {
      await authServices.logout();
    } finally {
      clearAuth();
    }
  },

  getMe: async (): Promise<User> => {
    const { setLoading, setError, setUser } = useAuthStore.getState();
    setLoading(true);
    setError(null);
    try {
      const user = await authServices.getMe();
      setUser(user);
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unauthorized";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  },
};
