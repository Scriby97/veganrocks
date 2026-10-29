"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { isGroup, type NavItem } from "@/lib/nav";

// Aufklappbares Menü für schmale Bildschirme; die Desktop-Leiste steht im Header
export function MobileMenu({ nav }: { nav: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = nav.flatMap((item) => (isGroup(item) ? [{ heading: item.label }, ...item.links] : [item]));

  return (
    <div className="lg:hidden" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Menü schliessen" : "Menü öffnen"}
        className="flex size-11 items-center justify-center rounded-full text-ink hover:bg-blush"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="size-6" aria-hidden>
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Menü"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-line bg-cream shadow-lg"
        >
          <ul className="mx-auto flex max-w-7xl flex-col px-4 pb-6 pt-2 sm:px-6">
            {links.map((link) =>
              "heading" in link ? (
                <li key={link.heading} className="eyebrow mt-4 pb-1 text-xs">
                  {link.heading}
                </li>
              ) : (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className="block border-b border-line/60 py-3 text-lg font-medium aria-[current=page]:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ),
            )}
            <li className="mt-5">
              <Link href="/kontakt" onClick={() => setOpen(false)} className="btn-primary w-full">
                Kochkurs oder Event anfragen
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
