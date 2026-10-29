import Image from "next/image";
import Link from "next/link";
import type { NavLink } from "@/lib/nav";
import { imageUrl, type SiteSettings } from "@/lib/sanity";

export function Footer({ settings, offerLinks, moreLinks }: { settings: SiteSettings; offerLinks: NavLink[]; moreLinks: NavLink[] }) {
  const logoSrc = imageUrl(settings.logo);
  const socials = [
    settings.instagram && { href: settings.instagram, label: "Instagram" },
    settings.facebook && { href: settings.facebook, label: "Facebook" },
    settings.whatsapp && { href: `https://wa.me/${settings.whatsapp}`, label: "WhatsApp" },
  ].filter(Boolean) as NavLink[];
  const legal: NavLink[] = [
    { href: "/impressum", label: "Impressum" },
    { href: "/datenschutz", label: "Datenschutz" },
    ...(settings.agbText ? [{ href: "/agb", label: "AGB" }] : []),
  ];

  return (
    <footer className="bg-plum text-white/80 print:hidden">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          {logoSrc && (
            <div className="w-fit rounded-2xl bg-white px-4 py-3">
              <Image src={logoSrc} alt={settings.siteName ?? "Veganrocks"} width={160} height={65} className="h-12 w-auto" />
            </div>
          )}
          <p className="font-display text-2xl font-bold text-white">Let’s rock the kitchen.</p>
          <p className="text-sm">Vegane Kochkurse, Events und Coachings in Othmarsingen, im Aargau und in der ganzen Schweiz.</p>
        </div>

        <FooterList title="Angebot" links={[...offerLinks, { href: "/shop", label: "Gutscheine verschenken" }]} />
        <FooterList title="Mehr" links={[{ href: "/ueber-mich", label: "Über mich" }, { href: "/galerie", label: "Galerie" }, ...moreLinks]} />

        <div className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-bold text-white">Kontakt</h2>
          {settings.ownerName && <p>{settings.ownerName}</p>}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="hover:text-white">
              {settings.email}
            </a>
          )}
          {settings.phone && (
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-white">
              {settings.phone}
            </a>
          )}
          {socials.length > 0 && (
            <ul className="mt-1 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-full border border-white/25 px-3 py-1.5 text-sm hover:border-white hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {settings.newsletterUrl && (
            <a href={settings.newsletterUrl} target="_blank" rel="noreferrer" className="mt-2 font-semibold text-sun hover:text-white">
              Newsletter mit Rezepten & neuen Kochkursen →
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {settings.siteName ?? "Veganrocks"}</p>
          <nav aria-label="Rechtliches" className="flex gap-5">
            {legal.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-display text-lg font-bold text-white">{title}</h2>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
