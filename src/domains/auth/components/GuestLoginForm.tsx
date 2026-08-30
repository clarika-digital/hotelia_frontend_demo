"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { guestLogin } from "@/domains/auth/api";
import { PAGE_ROUTES } from "@/domains/auth/constants";
import { ApiError, client } from "@/global/api/client";

export function GuestLoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ title: string; detail?: string } | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await guestLogin({ identifier, password });
      router.push(PAGE_ROUTES.guestLanding);
    } catch (err) {
      setError({
        title: err instanceof ApiError ? err.title : "Sign in failed",
        detail: err instanceof ApiError ? err.detail : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded bg-white p-10 shadow-lg">
      <h1 className="text-center font-display text-3xl text-brand-navy">
        Guest Sign In
      </h1>
      <p className="mt-2 text-center text-sm text-gray-500">
        Sign in with the email or phone number used for your booking.
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
            htmlFor="guest-identifier"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Email or Phone
          </label>
          <input
            id="guest-identifier"
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-gold"
            autoComplete="username"
          />
        </div>
        <div>
          <label
            htmlFor="guest-password"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Password
          </label>
          <input
            id="guest-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-gold"
            autoComplete="current-password"
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
          <strong className="text-brand-navy">Demo account</strong> —
          guest@hotelia.test (or +233201234567) &middot; password{" "}
          <code>guest123</code>.
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        Staff member?{" "}
        <Link
          href={PAGE_ROUTES.staffLogin}
          className="font-semibold text-brand-gold no-underline hover:underline"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}
