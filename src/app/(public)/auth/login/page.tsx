import type { Metadata } from "next";
import { GuestLoginForm } from "@/domains/auth/components/GuestLoginForm";

export const metadata: Metadata = { title: "Guest Sign In" };

export default function GuestLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-surface-muted px-5 py-16">
      <GuestLoginForm />
    </div>
  );
}
