import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { OversightLogPanel } from "@/domains/oversight/components/OversightLogPanel";

export default function OversightLogPage() {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <PageHeader
        title="Isolated super-admin audit trail"
        description="Every override, exemption and revocation with attribution — quarantined from the standard audit log [FR-020, T-ADM-01]."
      />
      <OversightLogPanel />
    </RoleGuard>
  );
}