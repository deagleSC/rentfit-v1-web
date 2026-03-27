import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SearchSessionPage } from "@/components/search/search-session-page";

type PageProps = {
  params: Promise<{ chatId: string }>;
};

export default async function SearchChatPage({ params }: PageProps) {
  const { chatId } = await params;

  return (
    <DashboardLayout>
      <SearchSessionPage chatId={chatId} />
    </DashboardLayout>
  );
}
