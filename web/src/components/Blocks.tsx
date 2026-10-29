import Link from "next/link";
import type { ReactNode } from "react";
import type { SanityImage as SanityImageType, SiteSettings } from "@/lib/sanity";
import { SanityImage } from "./SanityImage";

type Fact = { _key: string; value: string; label?: string | null };

/** Grosses Titelbild mit dunklem Verlauf, Überzeile, Titel und Einleitung */
export function PageHero({
  image,
  eyebrow,
  title,
  intro,
  children,
}: {
  image?: SanityImageType | null;
  eyebrow?: string | null;
  title: string;
  intro?: string | null;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-plum text-white">
      {image && (
        <div className="absolute inset-0 -z-10">
          <SanityImage image={image} alt="" decorative sizes="100vw" priority crop={{ width: 2000, height: 900 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-plum via-plum/80 to-plum/20" aria-hidden />
        </div>
      )}
      <div className="mx-auto flex min-h-[22rem] max-w-7xl flex-col justify-end gap-4 px-4 pb-24 pt-24 sm:px-6 sm:pb-28 md:min-h-[30rem]">
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sun">{eyebrow}</p>}
        <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">{title}</h1>
        {intro && <p className="max-w-2xl text-lg text-white/85 sm:text-xl">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

/** Leiste mit grossen Werten, z. B. «5–25 / Teilnehmende» */
export function Facts({ facts, tone = "light" }: { facts?: Fact[] | null; tone?: "light" | "dark" }) {
  if (!facts?.length) return null;
  return (
    <dl
      className={`grid gap-px overflow-hidden rounded-3xl ${tone === "dark" ? "bg-white/15" : "bg-line"} ${
        facts.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : facts.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
      }`}
    >
      {facts.map((fact) => (
        <div key={fact._key} className={`flex flex-col gap-1 p-5 sm:p-6 ${tone === "dark" ? "bg-plum-light/60" : "bg-white"}`}>
          <dt className="sr-only">{fact.label}</dt>
          <dd className={`font-display text-3xl font-extrabold sm:text-4xl ${tone === "dark" ? "text-white" : "text-accent"}`}>
            {fact.value}
          </dd>
          {fact.label && <dd className={tone === "dark" ? "text-white/75" : "text-muted"}>{fact.label}</dd>}
        </div>
      ))}
    </dl>
  );
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string | null; title: string; children?: ReactNode }) {
  return (
    <div className="flex max-w-3xl flex-col gap-3">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-5xl">{title}</h2>
      {children && <div className="text-lg text-muted">{children}</div>}
    </div>
  );
}

/** Farbiger Aufruf am Ende einer Seite */
export function CtaBand({
  title,
  text,
  href = "/kontakt",
  label = "Jetzt anfragen",
  settings,
}: {
  title?: string | null;
  text?: string | null;
  href?: string | null;
  label?: string | null;
  settings: SiteSettings;
}) {
  const whatsapp = settings.whatsapp ? `https://wa.me/${settings.whatsapp}` : null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-accent px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10" aria-hidden />
        <div className="absolute -bottom-24 right-24 size-48 rounded-full bg-plum/30" aria-hidden />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className="font-display text-3xl font-extrabold sm:text-5xl">{title || settings.ctaTitle || "Let’s rock your kitchen!"}</h2>
            {(text || settings.ctaText) && <p className="text-lg text-white/90">{text || settings.ctaText}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={href || "/kontakt"} className="btn-light">
              {label || "Jetzt anfragen"}
            </Link>
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noreferrer" className="btn border-2 border-white/70 text-white hover:bg-white/10">
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type Testimonial = { _key: string; quote: string; name: string; context?: string | null };

export function Testimonials({ items }: { items?: Testimonial[] | null }) {
  if (!items?.length) return null;
  return (
    <section className="bg-blush">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading eyebrow="Das sagen Gäste" title="Ein Erlebnis für alle Sinne" />
        <ul className="grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <li key={t._key} className="flex flex-col gap-5 rounded-3xl bg-white p-7 shadow-sm">
              <svg viewBox="0 0 32 24" className="h-6 w-8 text-accent" aria-hidden>
                <path
                  fill="currentColor"
                  d="M0 24V14C0 6.3 4.2 1.6 12.5 0l1.2 3.2C9.2 4.6 7 7.3 6.8 11H13v13H0zm19 0V14c0-7.7 4.2-12.4 12.5-14l1.2 3.2C28.2 4.6 26 7.3 25.8 11H32v13H19z"
                />
              </svg>
              <blockquote className="flex-1 text-lg leading-relaxed">{t.quote}</blockquote>
              <p className="font-semibold">
                {t.name}
                {t.context && <span className="font-normal text-muted"> · {t.context}</span>}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Bildreihe (2–3 Bilder) */
export function ImageRow({ images }: { images?: (SanityImageType & { _key: string })[] | null }) {
  if (!images?.length) return null;
  return (
    <div className={`grid gap-4 ${images.length >= 3 ? "sm:grid-cols-3" : images.length === 2 ? "sm:grid-cols-2" : ""}`}>
      {images.map((image) => (
        <div key={image._key} className={`relative overflow-hidden rounded-3xl bg-line ${images.length === 1 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
          <SanityImage image={image} alt="" sizes="(min-width: 640px) 33vw, 100vw" crop={{ width: 1200, height: 900 }} />
        </div>
      ))}
    </div>
  );
}
