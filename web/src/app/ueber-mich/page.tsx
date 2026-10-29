import type { Metadata } from "next";
import { CtaBand, ImageRow } from "@/components/Blocks";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { getSettings } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Über mich",
  description: "Bettina Pfiffner, Gründerin von Veganrocks: Gesundheits- und Ernährungsberaterin, Raw Vegan Chef und Köchin mit Herz für Tiere und Umwelt.",
  alternates: { canonical: "/ueber-mich" },
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="mx-auto grid max-w-7xl items-start gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-line">
          <SanityImage image={settings.aboutImage} alt="Bettina Pfiffner" sizes="(min-width: 1024px) 50vw, 100vw" priority crop={{ width: 1200, height: 1500 }} />
        </div>
        <div className="flex flex-col gap-6 lg:pt-8">
          <p className="eyebrow">Über mich</p>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">{settings.aboutTitle ?? "Über mich"}</h1>
          {settings.aboutLead && <p className="font-display text-2xl font-semibold text-accent">{settings.aboutLead}</p>}
          <RichText value={settings.aboutText} className="text-lg leading-relaxed text-muted" />
          {settings.qualifications && settings.qualifications.length > 0 && (
            <div className="flex flex-col gap-3 rounded-3xl bg-blush p-6">
              <h2 className="font-display text-xl font-bold">Ausbildung & Erfahrung</h2>
              <ul className="flex flex-col gap-2 text-muted">
                {settings.qualifications.map((q) => (
                  <li key={q} className="flex gap-3">
                    <span className="mt-2.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ImageRow images={settings.aboutImages} />
      </div>
      <CtaBand settings={settings} />
    </>
  );
}
