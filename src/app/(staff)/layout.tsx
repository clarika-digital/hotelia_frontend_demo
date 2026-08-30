"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { DashboardShell } from "@/global/components/layout/dashboard/DashboardShell";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard>
      <DashboardShell>{children}</DashboardShell>
    </RoleGuard>
  );
}