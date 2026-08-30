"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { registerGuest } from "@/domains/auth/api";
import { PAGE_ROUTES } from "@/domains/auth/constants";
import { ApiError } from "@/global/api/client";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ title: string; detail?: string } | null>(
    null
  );
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
      await registerGuest({ name, email, phone, password });
      router.push(PAGE_ROUTES.login);
    } catch (err) {
      setError({
        title: err instanceof ApiError ? err.title : "Registration failed",
        detail: err instanceof ApiError ? err.detail : undefined,
      });
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

      <h1 className="text-center font-display text-3xl text-brand-navy">
        Create an Account
      </h1>
      <p className="mt-2 text-center text-sm text-gray-500">
        Register to manage your bookings, preferences and more.
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
            htmlFor="reg-name"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Full Name
          </label>
          <input
            id="reg-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-gold"
          />
        </div>
        <div>
          <label
            htmlFor="reg-email"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-gold"
          />
        </div>
        <div>
          <label
            htmlFor="reg-phone"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Phone
          </label>
          <input
            id="reg-phone"
            type="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-gold"
          />
        </div>
        <div>
          <label
            htmlFor="reg-password"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-gold"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-brand-gold px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-goldLight disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already registered?{" "}
        <Link
          href={PAGE_ROUTES.login}
          className="font-semibold text-brand-gold no-underline hover:underline"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}