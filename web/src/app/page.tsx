import Link from "next/link";
import { CtaBand, Facts, SectionHeading, Testimonials } from "@/components/Blocks";
import { ProductCard } from "@/components/ProductCard";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { YouTube } from "@/components/YouTube";
import { getProducts, getSettings, youtubeId } from "@/lib/sanity";

export default async function HomePage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()]);
  // Startseite: nächste Termine, sonst die ersten Gutscheine/Kochkurse – höchstens drei Karten
  const featured = products.filter((p) => p.available).slice(0, 3);
  const videos = (settings.videos ?? []).flatMap((v) => {
    const id = youtubeId(v.url);
    return id ? [{ ...v, id }] : [];
  });

  return (
    <>
      <section className="relative isolate overflow-hidden bg-plum text-white">
        <div className="absolute inset-0 -z-10">
          <SanityImage image={settings.heroImage} alt="" decorative sizes="100vw" priority crop={{ width: 2400, height: 1350 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-plum via-plum/70 to-plum/30" aria-hidden />
        </div>
        <div className="mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-7xl flex-col justify-end gap-10 px-4 pb-10 pt-28 sm:px-6 sm:pb-14">
          <div className="flex max-w-3xl flex-col gap-5">
            {settings.heroEyebrow && (
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sun">{settings.heroEyebrow}</p>
            )}
            <h1 className="font-display text-5xl font-extrabold leading-[1.02] sm:text-7xl">{settings.heroTitle ?? settings.siteName}</h1>
            {settings.heroText && <p className="max-w-2xl text-lg text-white/85 sm:text-xl">{settings.heroText}</p>}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/kontakt" className="btn-primary">
                Kochkurs anfragen
              </Link>
              <Link href="/shop" className="btn-light">
                Gutschein verschenken
              </Link>
            </div>
          </div>
          <Facts facts={settings.heroFacts} tone="dark" />
        </div>
      </section>

      {settings.offers && settings.offers.length > 0 && (
        <section className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-24">
          <SectionHeading eyebrow="Angebot" title={settings.offersTitle || "Für jeden Anlass"} />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {settings.offers.map((offer) => (
              <li key={offer._key}>
                <Link
                  href={`/${offer.slug}`}
                  className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-3xl bg-plum p-6 text-white"
                >
                  <SanityImage image={offer.image} alt="" decorative sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" crop={{ width: 900, height: 1200 }} />
                  <span className="absolute inset-0 bg-gradient-to-t from-plum via-plum/45 to-transparent transition group-hover:via-plum/60" aria-hidden />
                  <span className="relative flex flex-col gap-2">
                    <span className="font-display text-2xl font-extrabold">{offer.title}</span>
                    {offer.text && <span className="text-white/85">{offer.text}</span>}
                    <span className="mt-1 font-semibold text-sun">Mehr erfahren →</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {featured.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="Shop" title="Termine & Gutscheine">
                Ein Kochkurs ist das perfekte Geschenk – Datum, Ort und Menü sind frei wählbar.
              </SectionHeading>
              <Link href="/shop" className="btn-outline shrink-0">
                Zum Shop
              </Link>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <li key={product._id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {settings.introTitle && (
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-line">
            <SanityImage image={settings.introImage} alt="Bettina Pfiffner" sizes="(min-width: 1024px) 50vw, 100vw" crop={{ width: 1200, height: 1500 }} />
            <span className="absolute bottom-5 left-5 rounded-full bg-accent px-4 py-2 font-display font-bold text-white shadow-lg">
              über 10 Jahre Erfahrung
            </span>
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Veganrocks" title={settings.introTitle} />
            <RichText value={settings.introText} className="text-lg text-muted" />
            <div className="flex flex-wrap gap-3">
              <Link href="/ueber-mich" className="btn-outline">
                Über Bettina
              </Link>
              <Link href="/galerie" className="btn font-semibold text-accent hover:text-accent-dark">
                Fotos ansehen →
              </Link>
            </div>
          </div>
        </section>
      )}

      <Testimonials items={settings.testimonials} />

      {videos.length > 0 && (
        <section className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-24">
          <SectionHeading eyebrow="Videos" title="Kochen, grillieren, geniessen">
            Für Rezeptideen und Inspiration:{" "}
            {settings.instagram ? (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="font-semibold text-accent underline">
                @veganrocks.ch auf Instagram
              </a>
            ) : (
              "folge Veganrocks auf Instagram"
            )}
            .
          </SectionHeading>
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <YouTube id={videos[0].id} title={videos[0].title} large />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {videos.slice(1, 3).map((v) => (
                <YouTube key={v._key} id={v.id} title={v.title} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand settings={settings} />
    </>
  );
}
