import type { Page } from "./sanity";

export type NavLink = { href: string; label: string };
export type NavGroup = { label: string; links: NavLink[] };
export type NavItem = NavLink | NavGroup;

export const isGroup = (item: NavItem): item is NavGroup => "links" in item;

// Menü aus den Seiten im Studio: «Angebot» und «Tipps & Rezepte» klappen auf, der Rest ist fest
export function buildNav(pages: Pick<Page, "slug" | "title" | "menuTitle" | "menu">[]): NavItem[] {
  const group = (menu: string) =>
    pages.filter((p) => p.menu === menu).map((p) => ({ href: `/${p.slug}`, label: p.menuTitle || p.title }));
  const items: NavItem[] = [];
  const angebot = group("angebot");
  if (angebot.length) items.push({ label: "Angebot", links: angebot });
  items.push({ href: "/shop", label: "Shop & Gutscheine" });
  const tipps = group("tipps");
  if (tipps.length) items.push({ label: "Tipps & Rezepte", links: [...tipps, { href: "/galerie", label: "Galerie" }] });
  else items.push({ href: "/galerie", label: "Galerie" });
  items.push({ href: "/ueber-mich", label: "Über mich" });
  return items;
}

export function footerPages(pages: Pick<Page, "slug" | "title" | "menuTitle" | "menu">[]): NavLink[] {
  return pages.filter((p) => p.menu === "footer").map((p) => ({ href: `/${p.slug}`, label: p.menuTitle || p.title }));
}
