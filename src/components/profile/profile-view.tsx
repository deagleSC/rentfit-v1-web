"use client";

import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { RentfitLogo } from "@/components/brand/rentfit-logo";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { authServices } from "@/store/zustand/services/auth-services";
import { authActions, useAuthStore } from "@/store";
import type { ServiceCitySlug } from "@/types/auth.types";

/** Base UI select items use non-empty string values. */
const CITY_NONE = "__none__" as const;

const CITY_OPTIONS: {
  value: typeof CITY_NONE | ServiceCitySlug;
  label: string;
}[] = [
  { value: CITY_NONE, label: "No preference" },
  { value: "bangalore", label: "Bangalore" },
  { value: "mumbai", label: "Mumbai" },
  { value: "kolkata", label: "Kolkata" },
];

/** Maps item values to trigger labels (Base UI `Select.Value` uses this instead of raw values). */
const CITY_SELECT_ITEMS: Record<string, ReactNode> = Object.fromEntries(
  CITY_OPTIONS.map((o) => [o.value, o.label]),
);

function draftCityToSelectValue(
  draft: string,
): typeof CITY_NONE | ServiceCitySlug {
  return draft === "" ? CITY_NONE : (draft as ServiceCitySlug);
}

function selectValueToDraft(value: string | null): string {
  if (value === null || value === CITY_NONE) return "";
  return value;
}

function formatJoined(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
      new Date(iso),
    );
  } catch {
    return "—";
  }
}

export function ProfileView() {
  const user = useAuthStore((s) => s.user);
  const [draftCity, setDraftCity] = useState<string>("");
  const [hydrating, setHydrating] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setHydrating(true);
    authServices
      .getMe()
      .then((u) => {
        if (!cancelled) {
          useAuthStore.getState().setUser(u);
        }
      })
      .catch(() => {
        /* session invalid — AuthProvider will redirect */
      })
      .finally(() => {
        if (!cancelled) setHydrating(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const c = user?.preferences?.defaultCity;
    const slugs: ServiceCitySlug[] = ["bangalore", "mumbai", "kolkata"];
    setDraftCity(c && slugs.includes(c) ? c : "");
  }, [user?.preferences?.defaultCity, user?.id]);

  const currentCity = user?.preferences?.defaultCity ?? "";
  const dirty = draftCity !== currentCity;

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      await authActions.patchMe({
        defaultCity: draftCity === "" ? null : draftCity,
      });
      toast.success("Preferences saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  if (hydrating && !user) {
    return (
      <DashboardLayout>
        <div className="text-muted-foreground flex flex-1 items-center justify-center gap-2 py-24">
          <Spinner className="size-6" />
          <span className="text-sm">Loading profile…</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex w-full flex-col gap-6">
        <div className="flex items-start gap-3">
          <RentfitLogo size={40} className="mt-0.5 rounded-lg" />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Account details from your RentFit session.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Email and role (read-only).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Email
              </p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <Separator />
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Role
              </p>
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Member since
              </p>
              <p className="text-sm">{formatJoined(user.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search preferences</CardTitle>
            <CardDescription>
              Default city for rental search. You can still ask about other
              areas in chat.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="default-city">Preferred city</Label>
              <Select
                id="default-city"
                items={CITY_SELECT_ITEMS}
                value={draftCityToSelectValue(draftCity)}
                onValueChange={(v) => setDraftCity(selectValueToDraft(v))}
                disabled={saving}
              >
                <SelectTrigger className="w-full max-w-xs" size="default">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="border-border justify-end border-t">
            <Button
              type="button"
              className="gap-2"
              onClick={() => void handleSavePreferences()}
              disabled={!dirty || saving}
            >
              {saving ? (
                <>
                  <Spinner className="size-4" />
                  Saving…
                </>
              ) : (
                "Save preferences"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}
