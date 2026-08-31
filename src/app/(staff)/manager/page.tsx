"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { ManagerOverview } from "@/domains/operations/components/ManagerOverview";

export default function ManagerPage() {
  return (
    <RoleGuard allowedRoles={["manager"]}>
      <PageHeader
        title="Operational Oversight"
        description="A single live view across teams, reservations and escalations."
      />
      <ManagerOverview />
    </RoleGuard>
  );
}