import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SearchLandingChat } from "@/components/search/search-landing-chat";

export default function SearchPage() {
  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100dvh-6rem)] flex-col items-center justify-center px-4 py-8">
        <SearchLandingChat />
      </div>
    </DashboardLayout>
  );
}
