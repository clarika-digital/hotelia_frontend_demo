import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { OverridesPanel } from "@/domains/oversight/components/OverridesPanel";

export default function OverridesPage() {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <PageHeader
        title="Permission overrides"
        description="Grant and time-box beyond-role permissions. Overrides are visible only inside this console [UC-11, FR-008, UAT 3.6, T-ADM-04]."
      />
      <OverridesPanel />
    </RoleGuard>
  );
}