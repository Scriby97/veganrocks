import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SanityImage } from "@/components/SanityImage";
import { getSettings } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kochkurs, Team-Event oder Coaching anfragen – Veganrocks, Bettina Pfiffner, Othmarsingen AG.",
  alternates: { canonical: "/kontakt" },
};

export default async function ContactPage() {
  const settings = await getSettings();
  const whatsapp = settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : null;

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <div className="flex flex-col gap-6">
        <p className="eyebrow">Kontakt</p>
        <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">Lass uns gemeinsam kochen!</h1>
        <p className="text-lg text-muted">
          Erzähl mir von deinem Anlass – ich melde mich mit einem Vorschlag. Wenn es eilt, ruf mich an oder schick mir ein WhatsApp.
        </p>
        <ul className="flex flex-col gap-3 text-lg">
          {settings.email && (
            <li>
              <a href={`mailto:${settings.email}`} className="font-semibold text-accent hover:text-accent-dark">
                {settings.email}
              </a>
            </li>
          )}
          {settings.phone && (
            <li>
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="font-semibold text-accent hover:text-accent-dark">
                {settings.phone}
              </a>
            </li>
          )}
          {whatsapp && (
            <li>
              <a href={whatsapp} target="_blank" rel="noreferrer" className="font-semibold text-accent hover:text-accent-dark">
                WhatsApp schreiben
              </a>
            </li>
          )}
        </ul>
        {settings.address && <p className="whitespace-pre-line text-muted">{settings.address}</p>}
        <div className="relative hidden aspect-[4/3] overflow-hidden rounded-3xl bg-line lg:block">
          <SanityImage image={settings.aboutImages?.[1] ?? settings.introImage} alt="Bettina beim Kochen" sizes="35vw" crop={{ width: 1000, height: 750 }} />
        </div>
      </div>
      <ContactForm />
    </section>
  );
}
