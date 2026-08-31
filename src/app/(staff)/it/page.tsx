"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { ItOverview } from "@/domains/itplatform/components/ItOverview";

export default function ItPage() {
  return (
    <RoleGuard allowedRoles={["it_manager"]}>
      <PageHeader
        title="Platform Health"
        description="Live identity, sessions, devices and system status under IT management."
      />
      <ItOverview />
    </RoleGuard>
  );
}