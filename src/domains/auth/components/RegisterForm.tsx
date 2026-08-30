"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { registerGuest } from "@/domains/auth/api";
import { PAGE_ROUTES } from "@/domains/auth/constants";
import { DEFAULT_COUNTRY_ISO, getCountry } from "@/data/countries";
import { buildE164, isValidE164 } from "@/data/phones";
import { ApiError } from "@/global/api/client";
import { cn } from "@/lib/cn";
import { PasswordField } from "./PasswordField";
import { PhoneField } from "./PhoneField";

interface Strength {
  score: number;
  label: string;
}

function passwordStrength(value: string): Strength {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  const label =
    score === 0
      ? "Too weak"
      : score <= 2
        ? "Weak"
        : score === 3
          ? "Good"
          : "Strong";
  return { score, label };
}

const STRENGTH_COLORS = ["bg-red-400", "bg-amber-400", "bg-amber-400", "bg-emerald-500"];

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryIso, setCountryIso] = useState(DEFAULT_COUNTRY_ISO);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<{ title: string; detail?: string } | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shaking, setShaking] = useState(false);
  const redirectRef = useRef<string | null>(null);

  const strength = passwordStrength(password);
  const confirmMismatch = confirm.length > 0 && confirm !== password;
  const phoneE164 = buildE164(
    getCountry(countryIso)?.dialCode ?? "",
    phoneNumber
  );
  const phoneValid = phoneNumber.length === 0 || isValidE164(phoneE164);

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(PAGE_ROUTES.guestLanding);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setShaking(true);
      setError({ title: "Passwords do not match", detail: "Please re-enter your password." });
      return;
    }
    const dialCode = getCountry(countryIso)?.dialCode ?? "";
    const phoneE164 = buildE164(dialCode, phoneNumber);
    if (!isValidE164(phoneE164)) {
      setShaking(true);
      setError({
        title: "Invalid phone number",
        detail: "Enter the full number including your country code.",
      });
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await registerGuest({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phoneE164,
        password,
      });
      redirectRef.current = PAGE_ROUTES.login;
      setSuccess(true);
      window.setTimeout(() => router.replace(redirectRef.current!), 450);
    } catch (err) {
      setShaking(true);
      setError({
        title: err instanceof ApiError ? err.title : "Registration failed",
        detail: err instanceof ApiError ? err.detail : undefined,
      });
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

      <div className="text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold">
          Welcome to Hotelia
        </span>
        <h1 className="mt-2 font-display text-3xl text-brand-navy">
          Create an Account
        </h1>
        <div className="mx-auto mt-3 h-px w-10 bg-brand-gold/60" />
        <p className="mt-4 text-sm text-gray-500">
          Register to manage your bookings, preferences and more.
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
          Account created — redirecting to sign in&hellip;
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
            disabled={success}
            className="w-full rounded border border-gray-300 bg-white px-4 py-3 text-sm text-brand-navy outline-none transition-colors focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
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
            disabled={success}
            className="w-full rounded border border-gray-300 bg-white px-4 py-3 text-sm text-brand-navy outline-none transition-colors focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
        <PhoneField
          id="reg-phone"
          label="Phone"
          countryIso={countryIso}
          nationalNumber={phoneNumber}
          onCountryChange={setCountryIso}
          onNationalChange={setPhoneNumber}
          required
          disabled={success}
          error={
            phoneNumber.length > 0 && !phoneValid
              ? "Enter a valid phone number — at least 8 digits after the country code."
              : null
          }
        />

        <PasswordField
          id="reg-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
          minLength={8}
        />

        {password.length > 0 && (
          <div className="-mt-2">
            <div className="flex gap-1.5" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i < strength.score
                      ? STRENGTH_COLORS[Math.min(strength.score, 3)]
                      : "bg-gray-200"
                  )}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500" aria-live="polite">
              Password strength: {strength.label}
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor="reg-confirm"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Confirm Password
          </label>
          <input
            id="reg-confirm"
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={success}
            className="w-full rounded border border-gray-300 bg-white px-4 py-3 text-sm text-brand-navy outline-none transition-colors focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {confirmMismatch && (
            <p className="mt-1.5 text-xs text-red-600">
              Passwords do not match.
            </p>
          )}
        </div>

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
              Creating account&hellip;
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already registered?{" "}
        <Link
          href={PAGE_ROUTES.login}
          className="font-semibold text-brand-gold no-underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}