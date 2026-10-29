import { createClient } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { defineQuery } from "groq";
import type { PAGES_QUERY_RESULT, PRODUCTS_QUERY_RESULT, RichText, SETTINGS_QUERY_RESULT } from "../sanity.types";
import { e2ePages, e2eProducts, e2eSettings } from "./e2e-fixtures";
import { placeholderPages, placeholderProducts, placeholderSettings } from "./placeholder";

// E2E=1: feste Testdaten für die automatischen Tests (npm run test:e2e), unabhängig von Bettinas Inhalten
const e2e = process.env.E2E === "1";
const projectId = e2e ? undefined : process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Ohne Project-ID (lokal, bevor Sanity eingerichtet ist) zeigt die Seite die Inhalte der alten Website
const client = projectId ? createClient({ projectId, dataset, apiVersion: "2026-09-01", useCdn: false }) : null;

// In den Tests zeigen Bild-URLs auf ein Fantasie-Projekt; die Tests beantworten diese Anfragen selbst
const builder = projectId || e2e ? createImageUrlBuilder({ projectId: projectId ?? "e2etest", dataset }) : null;

export type SanityImage = SanityImageSource & { alt?: string | null };

/** Text aus dem Studio-Editor (Blöcke) – oder reiner Text (Platzhalter, Standard-Datenschutztext) */
export type RichTextValue = string | RichText;

// Die Abfragen sind mit defineQuery markiert: `npm run typegen` im Ordner studio/ erzeugt daraus
// src/sanity.types.ts – die Typen unten passen dadurch immer zu Schema und Abfrage.
const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  ...,
  // Kacheln: Adresse der verlinkten Seite statt der Referenz
  "offers": offers[defined(page)]{ _key, title, text, image, "slug": page->slug.current }
}`);

const PAGES_QUERY = defineQuery(`*[_type == "page" && defined(slug.current)] | order(sortOrder asc, title asc) {
  _id, title, "slug": slug.current, eyebrow, intro, heroImage, facts, body, cardsTitle, cards,
  "images": images[defined(asset)], videos, "showTestimonials": coalesce(showTestimonials, false), cta,
  "menu": coalesce(menu, "angebot"), menuTitle, teaser
}`);

const PRODUCTS_QUERY = defineQuery(`*[_type == "product" && defined(slug.current) && (kind != "event" || date >= $today)]
  | order(sortOrder asc, name asc) {
  _id, name, "slug": slug.current, "kind": coalesce(kind, "voucher"), price, priceNote, description, details,
  // Leere Bildplätze (Bild hinzugefügt, aber keine Datei gewählt) weglassen
  "images": images[defined(asset)],
  date, time, location, seats,
  "giftFields": coalesce(kind == "voucher" && coalesce(giftFields, true), false),
  "soldOut": coalesce(defined(seats) && seats <= 0, false),
  "available": coalesce(available, true)
}`);

type SettingsDocument = Omit<NonNullable<SETTINGS_QUERY_RESULT>, "_id" | "_type" | "_createdAt" | "_updatedAt" | "_rev">;
type RichTextKeys = {
  [K in keyof SettingsDocument]-?: NonNullable<SettingsDocument[K]> extends RichText ? K : never;
}[keyof SettingsDocument];

/**
 * Website-Einstellungen ohne die Systemfelder des Dokuments. Lange Texte dürfen zusätzlich reiner Text sein,
 * damit Platzhalter und Testdaten sie ohne Editor-Blöcke liefern können.
 */
export type SiteSettings = Partial<Omit<SettingsDocument, RichTextKeys>> & { [K in RichTextKeys]?: RichTextValue };

type PageDocument = PAGES_QUERY_RESULT[number];
export type Page = Omit<PageDocument, "body"> & { body: RichTextValue | null };
type ProductDocument = PRODUCTS_QUERY_RESULT[number];
export type Product = Omit<ProductDocument, "details"> & { details: RichTextValue | null };

export async function getSettings(): Promise<SiteSettings> {
  if (e2e) return e2eSettings;
  if (!client) return placeholderSettings;
  return (await client.fetch(SETTINGS_QUERY)) ?? {};
}

export async function getPages(): Promise<Page[]> {
  if (e2e) return e2ePages;
  if (!client) return placeholderPages;
  return client.fetch(PAGES_QUERY);
}

/** Termine zuerst (nach Datum), danach Gutscheine und Kochkurse in der Reihenfolge aus dem Studio */
export async function getProducts(): Promise<Product[]> {
  const today = new Date().toISOString().slice(0, 10);
  const products: Product[] = e2e ? e2eProducts : !client ? placeholderProducts : await client.fetch(PRODUCTS_QUERY, { today });
  const events = products.filter((p) => p.kind === "event").sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
  return [...events, ...products.filter((p) => p.kind !== "event")];
}

/** Bild-URL; mit `crop` schneidet Sanity auf dieses Seitenverhältnis zu – nach dem Bildausschnitt (Hotspot) im Studio */
export function imageUrl(image?: SanityImage | null, crop?: { width: number; height: number }): string | null {
  if (!image || typeof image !== "object" || !("asset" in image) || !image.asset) return null;
  // Lokale Vorschau: Bilder der alten Website aus public/preview (siehe placeholder.ts)
  const ref = (image.asset as { _ref?: string })._ref;
  if (ref?.startsWith("image-local-")) return `/preview/${ref.slice("image-local-".length)}`;
  if (!builder) return null;
  const img = builder.image(image);
  return (crop ? img.width(crop.width).height(crop.height).fit("crop") : img).url();
}

/** YouTube-ID aus einem Link (youtu.be/…, youtube.com/watch?v=…, …/embed/…, …/shorts/…) */
export function youtubeId(url?: string | null): string | null {
  const match = url?.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

export { formatPrice } from "./format";
