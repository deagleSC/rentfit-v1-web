import { RentfitLogo } from "@/components/brand/rentfit-logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="from-primary/10 via-primary/5 to-background hidden w-1/2 items-center justify-center bg-gradient-to-br p-8 lg:flex">
        <div className="flex flex-col items-center gap-6">
          <div>
            <RentfitLogo size={96} priority />
          </div>
          <p className="text-muted-foreground max-w-sm text-center text-sm">
            Find and list rentals with a modern marketplace experience.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-4 sm:p-6 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md space-y-3 sm:space-y-4">
          <div className="mb-6">
            <div className="mb-4 flex justify-center lg:hidden">
              <RentfitLogo size={64} priority className="rounded-xl" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Welcome</h1>
            <p className="text-muted-foreground text-sm">
              Sign in or create an account to continue
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
