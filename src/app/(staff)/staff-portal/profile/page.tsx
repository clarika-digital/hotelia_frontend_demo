"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { PORTAL_PROFILE } from "@/data/staff-portal";

export default function PortalProfilePage() {
  const p = PORTAL_PROFILE;
  return (
    <RoleGuard>
      <PageHeader
        title="My Profile"
        description="Personal and employment details on file with HR."
      />

      <Panel
        title="Personal details"
        action={<span className="text-xs font-semibold text-gray-400">ID {p.staffId}</span>}
      >
        <dl className="divide-y divide-gray-100 text-sm">
          <div className="flex items-center justify-between py-3">
            <dt className="text-gray-500">Full name</dt>
            <dd className="font-semibold text-brand-navy">{p.firstName} {p.lastName}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-gray-500">Phone</dt>
            <dd className="font-semibold text-brand-navy">{p.phone}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-gray-500">Email</dt>
            <dd className="font-semibold text-brand-navy">{p.email}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-gray-500">Address</dt>
            <dd className="font-semibold text-brand-navy">{p.address}</dd>
          </div>
        </dl>
      </Panel>

      <div className="mt-6">
        <Panel title="Emergency contact" description="Used if you're unreachable during a shift.">
          <dl className="divide-y divide-gray-100 text-sm">
            <div className="flex items-center justify-between py-3">
              <dt className="text-gray-500">Contact</dt>
              <dd className="font-semibold text-brand-navy">{p.emergencyContact.name}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-gray-500">Relationship</dt>
              <dd className="font-semibold text-brand-navy">{p.emergencyContact.relation}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-gray-500">Phone</dt>
              <dd className="font-semibold text-brand-navy">{p.emergencyContact.phone}</dd>
            </div>
          </dl>
        </Panel>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Editing personal details is queued — update requests route through HR for
        confirmation.
      </p>
    </RoleGuard>
  );
}