"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { ExecutiveOverview } from "@/domains/executive/components/ExecutiveOverview";

export default function ExecutivePage() {
  return (
    <RoleGuard allowedRoles={["executive"]}>
      <PageHeader
        title="Executive Summary"
        description="High-level performance across the property."
      />
      <ExecutiveOverview />
    </RoleGuard>
  );
}
