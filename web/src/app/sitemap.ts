import type { MetadataRoute } from "next";
import { getPages, getProducts, getSettings } from "@/lib/sanity";

// Statischer Export: wird beim Build als out/sitemap.xml erzeugt
export const dynamic = "force-static";

const base = "https://veganrocks.ch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, products, settings] = await Promise.all([getPages(), getProducts(), getSettings()]);
  const fixed = ["", "/shop", "/galerie", "/ueber-mich", "/kontakt", "/impressum", "/datenschutz", ...(settings.agbText ? ["/agb"] : [])];
  return [
    ...fixed.map((path) => ({ url: `${base}${path}` })),
    ...pages.map((p) => ({ url: `${base}/${p.slug}` })),
    ...products.map((p) => ({ url: `${base}/shop/${p.slug}` })),
  ];
}
