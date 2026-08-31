"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { AccountantOverview } from "@/domains/accounting/components/AccountantOverview";

export default function AccountantPage() {
  return (
    <RoleGuard allowedRoles={["accountant"]}>
      <PageHeader
        title="Payments Overview"
        description="Approvals, collections, receivables and today's reconciliation — live."
      />
      <AccountantOverview />
    </RoleGuard>
  );
}