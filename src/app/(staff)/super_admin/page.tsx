import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { AnalyticsOverview } from "@/domains/oversight/components/AnalyticsOverview";

export default function SuperAdminPage() {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <PageHeader
        title="Overview"
        description=" System, Management & Operations."
      />
      <AnalyticsOverview />
    </RoleGuard>
  );
}