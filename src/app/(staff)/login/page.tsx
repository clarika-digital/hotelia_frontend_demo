import type { Metadata } from "next";
import { StaffLoginForm } from "@/domains/auth/components/StaffLoginForm";

export const metadata: Metadata = { title: "Staff Sign In" };

export default function StaffLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-surface-muted px-5 py-16">
      <StaffLoginForm />
    </div>
  );
}
