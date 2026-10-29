import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/RichText";
import { getSettings } from "@/lib/sanity";

export const metadata: Metadata = { title: "AGB", alternates: { canonical: "/agb" } };

// Seite gibt es nur, wenn im Studio AGB eingetragen sind (sonst 404, auch kein Link in der Fusszeile)
export default async function TermsPage() {
  const settings = await getSettings();
  if (!settings.agbText) notFound();

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-8 font-display text-4xl font-extrabold sm:text-5xl">Allgemeine Geschäftsbedingungen</h1>
      <RichText value={settings.agbText} className="text-muted" />
    </section>
  );
}
