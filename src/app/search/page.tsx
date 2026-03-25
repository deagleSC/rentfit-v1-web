import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function SearchPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
          <p className="text-muted-foreground text-sm">
            Starting point for listings, map, and chat features backed by{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">
              rentfit-v1-be
            </code>
            .
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Listings</CardTitle>
              <CardDescription>
                <code className="text-xs">POST /api/listings</code> (owner) ·{" "}
                <code className="text-xs">GET /api/listings/:id</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Add list and detail flows using{" "}
              <code className="bg-muted rounded px-1">API_ROUTES.LISTINGS</code>{" "}
              in{" "}
              <code className="bg-muted rounded px-1">
                src/lib/configs/api.ts
              </code>
              .
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Map & areas</CardTitle>
              <CardDescription>
                <code className="text-xs">GET /api/map/listings</code> ·{" "}
                <code className="text-xs">GET /api/service-areas</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Bounding-box search and service areas are public endpoints; use{" "}
              <code className="bg-muted rounded px-1">withCredentials</code>{" "}
              when you need the session cookie on other routes.
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
