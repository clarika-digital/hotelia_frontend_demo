"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { login } from "@/domains/auth/api";
import { PAGE_ROUTES, ROLE_LANDING } from "@/domains/auth/constants";
import { ApiError, client } from "@/global/api/client";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ title: string; detail?: string } | null>(
    null
  );
  const [geofenceBlocked, setGeofenceBlocked] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(PAGE_ROUTES.guestLanding);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await login({ username, password });
      if (user.userType === "staff" && user.role) {
        router.push(ROLE_LANDING[user.role] ?? PAGE_ROUTES.guestLanding);
      } else {
        router.push(PAGE_ROUTES.guestLanding);
      }
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

  return (
    <div className="w-full rounded bg-white p-10 shadow-lg">
      <button
        type="button"
        onClick={handleBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 no-underline transition-colors hover:text-brand-gold"
      >
        <span aria-hidden>&larr;</span> Back
      </button>

      {geofenceBlocked ? (
        <div className="text-center">
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
      ) : (
        <>
          <h1 className="text-center font-display text-3xl text-brand-navy">
            Sign In
          </h1>
          <p className="mt-2 text-center text-sm text-gray-500">
            Welcome back &mdash; sign in to continue to your account.
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
                htmlFor="username"
                className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                placeholder="Email / PIN"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-gold"
                autoComplete="username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Password
              </label>
              <input
                id="password"
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
              <strong className="text-brand-navy">Demo accounts</strong> —
              staff: frontdesk@hotelia.test or PIN <code>1234</code> &middot;
              password <code>staff123</code>. Guest: guest@hotelia.test &middot;
              password <code>guest123</code>. housekeeping@hotelia.test shows
              the geofence-blocked state.
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            New here?{" "}
            <Link
              href={PAGE_ROUTES.register}
              className="font-semibold text-brand-gold no-underline hover:underline"
            >
              Create an account
            </Link>
          </p>
        </>
      )}
    </div>
  );
}