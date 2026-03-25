import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Account details come from{" "}
            <code className="text-xs">GET /api/auth/me</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Extend this page when the API exposes profile updates.
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
