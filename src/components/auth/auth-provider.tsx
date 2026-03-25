"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authServices } from "@/store/zustand/services/auth-services";
import { useAuthStore } from "@/store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, setUser, clearAuth, setError } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  const protectedPrefixes = ["/search", "/profile"];
  const authRoutes = ["/login", "/signup"];

  const isProtectedRoute = (path: string | null | undefined): boolean => {
    if (!path) return false;
    return protectedPrefixes.some(
      (p) => path === p || path.startsWith(`${p}/`),
    );
  };

  useEffect(() => {
    const init = async () => {
      try {
        const user = await authServices.getMe();
        setUser(user);
        setError(null);
      } catch {
        clearAuth();
        setError(null);
      } finally {
        setIsInitialized(true);
      }
    };

    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- session bootstrap once on mount
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    if (pathname === "/" || pathname === "") {
      router.replace(isAuthenticated ? "/search" : "/login");
      return;
    }

    const isProtected = isProtectedRoute(pathname);
    const onAuthRoute = authRoutes.includes(pathname || "");

    if (isProtected && !isAuthenticated) {
      router.replace("/login");
    } else if (onAuthRoute && isAuthenticated) {
      router.replace("/search");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- route guard reacts to path + auth
  }, [pathname, isAuthenticated, isInitialized, router]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-b-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
