import Image from "next/image";
import Link from "next/link";
import { isGroup, type NavItem } from "@/lib/nav";
import { imageUrl, type SanityImage } from "@/lib/sanity";
import { CartButton } from "./CartButton";
import { MobileMenu } from "./MobileMenu";

export function Header({
  siteName,
  logo,
  nav,
  orderableSlugs,
}: {
  siteName: string;
  logo?: SanityImage | null;
  nav: NavItem[];
  /** Angebote, die man bestellen kann – für die Zahl am Warenkorb-Symbol */
  orderableSlugs: string[];
}) {
  const logoSrc = imageUrl(logo);
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={`${siteName} – zur Startseite`}>
          {logoSrc ? (
            <Image src={logoSrc} alt="" width={200} height={117} className="h-14 w-auto sm:h-16" priority />
          ) : (
            <span className="font-display text-2xl font-extrabold uppercase text-accent">{siteName}</span>
          )}
        </Link>

        <nav aria-label="Hauptmenü" className="hidden items-center gap-x-1 lg:flex">
          {nav.map((item) =>
            isGroup(item) ? (
              // Aufklappmenü ohne JavaScript: öffnet bei Hover und bei Tastaturfokus
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-full px-3 py-2 font-medium text-ink hover:text-accent"
                  aria-haspopup="true"
                >
                  {item.label}
                  <svg viewBox="0 0 20 20" className="size-4 transition group-hover:rotate-180" aria-hidden>
                    <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                  </svg>
                </button>
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="min-w-60 rounded-2xl border border-line bg-white p-2 shadow-xl shadow-plum/10">
                    {item.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="block rounded-xl px-4 py-2.5 text-ink hover:bg-blush hover:text-accent">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 font-medium text-ink hover:text-accent">
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <CartButton orderableSlugs={orderableSlugs} />
          <Link href="/kontakt" className="btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex">
            Anfragen
          </Link>
          <MobileMenu nav={nav} />
        </div>
      </div>
    </header>
  );
}
