import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy px-5 py-16">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/ghana/banner-entrance.jpg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-brand-navy/75" aria-hidden />

      <div className="relative z-10 flex w-full flex-col items-center">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center no-underline"
        >
          <img
            src="/images/logo-hotelia.svg"
            alt="Hotelia"
            className="h-12 w-auto"
          />
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}