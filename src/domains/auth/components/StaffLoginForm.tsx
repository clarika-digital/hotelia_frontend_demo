"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { staffLogin } from "@/domains/auth/api";
import { PAGE_ROUTES, ROLE_LANDING } from "@/domains/auth/constants";
import { ApiError, client } from "@/global/api/client";

export function StaffLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<{ title: string; detail?: string } | null>(
    null
  );
  const [geofenceBlocked, setGeofenceBlocked] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await staffLogin({ email, password, pin });
      router.push(ROLE_LANDING[user.role ?? ""] ?? PAGE_ROUTES.guestLanding);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setGeofenceBlocked(
          err.detail ?? "On-premise access required for this account."
        );
      } else {
        setError({
          title: err instanceof ApiError ? err.title : "Sign in failed",
          detail: err instanceof ApiError ? err.detail : undefined,
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (geofenceBlocked) {
    return (
      <div className="w-full max-w-md rounded bg-white p-10 text-center shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/10">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#876a20"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h1 className="mt-5 font-display text-2xl text-brand-navy">
          On-Premise Access Required
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {geofenceBlocked}
        </p>
        <button
          type="button"
          onClick={() => setGeofenceBlocked(null)}
          className="mt-6 rounded bg-brand-gold px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-goldLight"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded bg-white p-10 shadow-lg">
      <h1 className="text-center font-display text-3xl text-brand-navy">
        Staff Sign In
      </h1>
      <p className="mt-2 text-center text-sm text-gray-500">
        Internal credentials only — sign in with your work email and PIN.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm"
        >
          <div className="font-semibold text-red-700">{error.title}</div>
          {error.detail && (
            <div className="mt-1 text-red-600">{error.detail}</div>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="staff-email"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Work Email
          </label>
          <input
            id="staff-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-gold"
            autoComplete="username"
          />
        </div>
        <div>
          <label
            htmlFor="staff-password"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Password
          </label>
          <input
            id="staff-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-gold"
            autoComplete="current-password"
          />
        </div>
        <div>
          <label
            htmlFor="staff-pin"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            PIN
          </label>
          <input
            id="staff-pin"
            type="password"
            required
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-3 text-sm tracking-[0.4em] text-brand-navy outline-none focus:border-brand-gold"
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-brand-gold px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-goldLight disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      {client.mock && (
        <div className="mt-6 rounded bg-surface-muted px-4 py-3 text-xs leading-relaxed text-gray-500">
          <strong className="text-brand-navy">Demo accounts</strong> —
          frontdesk@hotelia.test, accountant@hotelia.test, it@hotelia.test,
          superadmin@hotelia.test &middot; password <code>staff123</code>{" "}
          &middot; PIN <code>1234</code>. Use housekeeping@hotelia.test to see
          the geofence-blocked state.
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        Guest?{" "}
        <Link
          href={PAGE_ROUTES.guestLogin}
          className="font-semibold text-brand-gold no-underline hover:underline"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}
