import type { Metadata } from "next";
import { RichText } from "@/components/RichText";
import { privacyDefault } from "@/lib/privacy-default";
import { getSettings } from "@/lib/sanity";

export const metadata: Metadata = { title: "Datenschutz", alternates: { canonical: "/datenschutz" } };

export default async function PrivacyPage() {
  const settings = await getSettings();
  const hasText = Array.isArray(settings.privacyText) ? settings.privacyText.length > 0 : Boolean(settings.privacyText);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-8 font-display text-4xl font-extrabold sm:text-5xl">Datenschutzerklärung</h1>
      <div className="flex flex-col gap-6 text-muted">
        {/* Immer aktuell aus den Kontaktangaben im Studio */}
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl font-bold text-ink">Verantwortlich</h2>
          <p className="whitespace-pre-line">
            {[settings.company || settings.siteName, settings.ownerName, settings.address, settings.email].filter(Boolean).join("\n")}
          </p>
        </div>
        <RichText value={hasText ? settings.privacyText : privacyDefault} />
      </div>
    </section>
  );
}
