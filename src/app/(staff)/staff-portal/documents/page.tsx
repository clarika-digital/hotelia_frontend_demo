"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { PORTAL_DOCUMENTS } from "@/data/staff-portal";

export default function PortalDocumentsPage() {
  return (
    <RoleGuard>
      <PageHeader
        title="Documents"
        description="Employment and identification documents on file."
      />

      <Panel title="Document library" description="Latest copies stored with HR.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="py-2 pr-4 font-semibold">Name</th>
                <th className="py-2 pr-4 font-semibold">Category</th>
                <th className="py-2 pr-4 font-semibold">Added</th>
                <th className="py-2 pr-4 font-semibold">Size</th>
                <th className="py-2 font-semibold">Format</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PORTAL_DOCUMENTS.map((d) => (
                <tr key={d.name}>
                  <td className="py-3 pr-4 font-medium text-brand-navy">{d.name}</td>
                  <td className="py-3 pr-4 text-gray-600">{d.category}</td>
                  <td className="py-3 pr-4 text-gray-500">{d.added}</td>
                  <td className="py-3 pr-4 text-gray-500">{d.size}</td>
                  <td className="py-3">
                    <StatusBadge tone="neutral">PDF</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <p className="mt-6 text-xs text-gray-400">
        Preview and download hooks ship with real document storage on the backend.
      </p>
    </RoleGuard>
  );
}