import { RentfitLogo } from "@/components/brand/rentfit-logo";

export default function HomePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4">
      <RentfitLogo size={72} priority />
      <h1 className="text-2xl font-semibold tracking-tight">RentFit</h1>
    </div>
  );
}
