"use client";

import { useSessionStore } from "@/stores/session-store";
import { GuestGuard } from "@/global/auth/GuestGuard";
import { AccountNav } from "./AccountNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const claims = useSessionStore((s) => s.claims);
  const firstName = claims?.name.split(" ")[0] ?? "guest";

  return (
    <GuestGuard>
      <div className="mx-auto w-full max-w-[1180px] px-5 py-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold">
          Guest account
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-brand-navy">
          {firstName}&rsquo;s Hotelia
        </h1>
        <p className="mt-2 max-w-xl text-sm text-gray-500">
          Manage your stays, update your profile and request your data.
        </p>

        <div className="mt-6">
          <AccountNav />
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </GuestGuard>
  );
}