"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { login } from "@/domains/auth/api";
import { PAGE_ROUTES, ROLE_LANDING } from "@/domains/auth/constants";
import { ApiError } from "@/global/api/client";
import { cn } from "@/lib/cn";
import { PasswordField } from "./PasswordField";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ title: string; detail?: string } | null>(
    null
  );
  const [geofenceBlocked, setGeofenceBlocked] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shaking, setShaking] = useState(false);
  const redirectRef = useRef<string | null>(null);

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
      const dest =
        user.userType === "staff" && user.role
          ? ROLE_LANDING[user.role] ?? PAGE_ROUTES.guestLanding
          : PAGE_ROUTES.guestLanding;
      redirectRef.current = dest;
      setSuccess(true);
      window.setTimeout(() => router.replace(dest), 450);
    } catch (err) {
      setShaking(true);
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
    <div
      className={cn(
        "w-full rounded-2xl border border-white/50 bg-white/85 p-10 shadow-2xl shadow-brand-navy/30 backdrop-blur-xl",
        shaking && "animate-shake"
      )}
      onAnimationEnd={() => setShaking(false)}
    >
      <button
        type="button"
        onClick={handleBack}
        className="mb-6 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-gray-500 no-underline transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
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
          <div className="text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold">
              Welcome to Hotelia
            </span>
            <h1 className="mt-2 font-display text-3xl text-brand-navy">
              Sign In
            </h1>
            <div className="mx-auto mt-3 h-px w-10 bg-brand-gold/60" />
            <p className="mt-4 text-sm text-gray-500">
              Welcome back &mdash; sign in to continue to your account.
            </p>
          </div>

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

          {success && (
            <div
              role="status"
              className="mt-6 flex items-center gap-2 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Signed in — redirecting&hellip;
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
                disabled={success}
                className="w-full rounded border border-gray-300 bg-white px-4 py-3 text-sm text-brand-navy outline-none transition-colors focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
                autoComplete="username"
              />
            </div>

            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              required
            />

            <button
              type="submit"
              disabled={submitting || success}
              className="btn-sheen w-full rounded bg-brand-gold px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-goldLight disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Signing in&hellip;
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            New here?{" "}
            <Link
              href={PAGE_ROUTES.register}
              className="font-semibold text-brand-gold no-underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
            >
              Create an account
            </Link>
          </p>
        </>
      )}
    </div>
  );
}