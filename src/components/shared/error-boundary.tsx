"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PageErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function PageError({ error, reset }: PageErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 mx-auto mb-4 w-fit rounded-full p-3">
            <AlertTriangle className="text-destructive size-8" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription>
            Please try again or return home if the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && (
            <div className="bg-muted rounded-md p-3">
              <p className="text-muted-foreground font-mono text-xs break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-muted-foreground mt-1 font-mono text-xs">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="mr-2 size-4" />
              Try again
            </Button>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
            >
              <Home className="mr-2 size-4" />
              Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function NotFoundError() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-muted-foreground mb-2 text-6xl font-bold">
            404
          </CardTitle>
          <CardTitle className="text-xl">Page not found</CardTitle>
          <CardDescription>
            The page you&apos;re looking for does not exist or was moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className={cn(buttonVariants(), "inline-flex w-full")}>
            <Home className="mr-2 size-4" />
            Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
