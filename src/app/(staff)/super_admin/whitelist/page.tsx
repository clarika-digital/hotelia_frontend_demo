import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { WhitelistPanel } from "@/domains/oversight/components/WhitelistPanel";

export default function WhitelistPage() {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <PageHeader
        title="Geofence whitelist"
        description="Exempt users and scoped-hour windows from on-premise geofencing [UC-12, FR-012]."
      />
      <WhitelistPanel />
    </RoleGuard>
  );
}