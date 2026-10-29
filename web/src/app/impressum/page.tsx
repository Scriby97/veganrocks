import type { Metadata } from "next";
import { getSettings } from "@/lib/sanity";

export const metadata: Metadata = { title: "Impressum", alternates: { canonical: "/impressum" } };

export default async function ImprintPage() {
  const settings = await getSettings();

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-8 font-display text-4xl font-extrabold sm:text-5xl">Impressum</h1>
      <div className="flex flex-col gap-1 text-lg text-muted">
        <p className="font-semibold text-ink">{settings.company || settings.siteName}</p>
        {settings.ownerName && <p>Inhaberin: {settings.ownerName}</p>}
        {settings.address && <p className="whitespace-pre-line">{settings.address}</p>}
        {settings.email && (
          <p>
            E-Mail:{" "}
            <a href={`mailto:${settings.email}`} className="text-accent hover:text-accent-dark">
              {settings.email}
            </a>
          </p>
        )}
        {settings.phone && <p>Telefon: {settings.phone}</p>}
      </div>
    </section>
  );
}
