import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { StandardAuditPanel } from "@/domains/oversight/components/StandardAuditPanel";

export default function AuditLogPage() {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <PageHeader
        title="Standard audit log"
        description="Operational activity across departments — always free of super admin entries [FR-019, T-ADM-02]."
      />
      <StandardAuditPanel />
    </RoleGuard>
  );
}