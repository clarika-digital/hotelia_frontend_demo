import Link from "next/link";
import {
  contactInfo,
  bottomLinks,
  poweredBy,
  siteConfig,
} from "@/data/site";

export function Footer() {
  const columns = [
    {
      title: "The Hotel",
      links: [
        { label: "Our Rooms", href: "/rooms-suites/" },
        { label: "Dining", href: "/dining/" },
        { label: "Offers", href: "/offers/" },
        { label: "Meetings & Events", href: "/meetings-events/" },
        { label: "About Us", href: "/about/" },
      ],
    },
    {
      title: "Discover",
      links: [
        { label: "Gallery", href: "/gallery/" },
        { label: "News & Life in Accra", href: "/stories/" },
        { label: "Hotelia Boutique", href: "/more/boutique/" },
        { label: "Sustainability", href: "/more/sustainability/" },
        { label: "Map & Directions", href: "/about/map-directions/" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: contactInfo.address, href: contactInfo.mapDirections },
        { label: contactInfo.email, href: `mailto:${contactInfo.email}` },
        { label: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/\s/g, "")}` },
      ],
    },
  ];

  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto max-w-6xl px-5 py-14 grid gap-10 md:grid-cols-3">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-brand-goldBright text-sm uppercase tracking-widest2 mb-4">
              {col.title}
            </h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-200 hover:text-white no-underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-300">
            {bottomLinks.map((l) => (
              <Link key={l.name} href={l.url} className="no-underline hover:text-white">
                {l.name}
                <span className="ml-3 text-gray-500">|</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-8 text-xs text-gray-300">
          &copy; {new Date().getFullYear()} {siteConfig.name} • International Hotel Management Ltd. All Rights Reserved.
          Powered by:{" "}
          <a
            href={poweredBy.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-goldBright hover:text-white no-underline"
          >
            {poweredBy.label}
          </a>
        </div>
      </div>
    </footer>
  );
}
