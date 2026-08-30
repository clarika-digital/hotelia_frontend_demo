import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy px-5 py-16">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="animate-kenburns absolute inset-0 will-change-transform"
          style={{ backgroundImage: "url(/images/ghana/banner-entrance.jpg)" }}
        />
      </div>
      <div className="absolute inset-0 bg-brand-navy/75" aria-hidden />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, transparent 45%, rgba(12, 16, 32, 0.6) 100%)",
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center">
        <Link
          href="/"
          className="animate-fade-up mb-8 flex items-center justify-center no-underline"
        >
          <img
            src="/images/logo-hotelia.svg"
            alt="Hotelia"
            className="h-12 w-auto"
          />
        </Link>
        <div
          className="animate-fade-up w-full max-w-md"
          style={{ animationDelay: "0.12s" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}