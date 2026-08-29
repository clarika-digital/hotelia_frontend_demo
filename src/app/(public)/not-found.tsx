import Link from "next/link";
import { Footer } from "@/global/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-28 text-center">
        <div className="font-display text-7xl text-brand-gold">404</div>
        <h1 className="mt-4 font-display text-3xl text-brand-navy">
          This Page Has Checked Out
        </h1>
        <p className="mt-4 max-w-xl text-gray-600 leading-relaxed">
          The page you&apos;re looking for has checked out of Hotelia Accra. We
          could not find it — but there&apos;s plenty more to explore.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded bg-brand-gold px-6 py-3 font-semibold text-white no-underline hover:bg-brand-goldLight"
          >
            Back to Home
          </Link>
          <Link
            href="/rooms-suites/"
            className="rounded bg-brand-goldBright px-6 py-3 font-semibold text-brand-navy no-underline hover:bg-white"
          >
            Explore Rooms
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/dining/" className="text-brand-gold hover:underline">Dining</Link>
          <Link href="/offers/" className="text-brand-gold hover:underline">Offers</Link>
          <Link href="/stories/" className="text-brand-gold hover:underline">Stories</Link>
          <Link href="/about/" className="text-brand-gold hover:underline">About</Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
