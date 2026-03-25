import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SearchAiPrompt } from "@/components/search/search-ai-prompt";

export default function SearchPage() {
  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100dvh-6rem)] flex-col items-center justify-center px-4 py-8">
        <SearchAiPrompt />
      </div>
    </DashboardLayout>
  );
}
