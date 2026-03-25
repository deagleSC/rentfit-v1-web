"use client";

import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { AuthLayout } from "@/components/layout/auth-layout";

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
