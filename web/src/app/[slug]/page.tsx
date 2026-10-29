import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand, Facts, ImageRow, PageHero, SectionHeading, Testimonials } from "@/components/Blocks";
import { RichText } from "@/components/RichText";
import { YouTube } from "@/components/YouTube";
import { getPages, getSettings, imageUrl, youtubeId } from "@/lib/sanity";

// Inhaltsseiten aus dem Studio (Kochkurse, Team-Events, Einkaufstipps, …) – beim Build als statische Seiten erzeugt
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPages()).map((page) => ({ slug: page.slug }));
}

async function findPage(slug: string) {
  return (await getPages()).find((p) => p.slug === decodeURIComponent(slug));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const page = await findPage((await params).slug);
  if (!page) return {};
  return { title: page.title, description: page.teaser ?? page.intro ?? undefined, alternates: { canonical: `/${page.slug}` } };
}

export default async function ContentPage({ params }: PageProps<"/[slug]">) {
  const [page, settings] = await Promise.all([findPage((await params).slug), getSettings()]);
  if (!page) notFound();
  const videos = (page.videos ?? []).flatMap((v) => {
    const id = youtubeId(v.url);
    return id ? [{ ...v, id, thumb: imageUrl(v.thumbnail, { width: 1280, height: 720 }) }] : [];
  });

  return (
    <>
      <PageHero image={page.heroImage} eyebrow={page.eyebrow} title={page.title} intro={page.intro} />

      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 py-14 sm:px-6 sm:py-20">
        {page.facts && page.facts.length > 0 && (
          <div className="relative z-10 -mt-24 sm:-mt-28">
            <Facts facts={page.facts} />
          </div>
        )}

        <RichText value={page.body} className="max-w-3xl text-lg leading-relaxed text-muted" />

        {page.cards && page.cards.length > 0 && (
          <section className="flex flex-col gap-8">
            {page.cardsTitle && <SectionHeading title={page.cardsTitle} />}
            <ul className="grid gap-5 md:grid-cols-3">
              {page.cards.map((card, i) => (
                <li key={card._key} className="flex flex-col gap-3 rounded-3xl border border-line bg-white p-7">
                  <span className="font-display text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-2xl font-bold">{card.title}</h3>
                  {card.text && <p className="text-muted">{card.text}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <ImageRow images={page.images} />

        {videos.length > 0 && (
          <section className="flex flex-col gap-8">
            <SectionHeading title="Videos" />
            <div className="grid gap-5 md:grid-cols-2">
              {videos.map((v) => (
                <YouTube key={v._key} id={v.id} title={v.title} thumbnail={v.thumb} />
              ))}
            </div>
          </section>
        )}
      </div>

      {page.showTestimonials && <Testimonials items={settings.testimonials} />}

      <CtaBand settings={settings} title={page.cta?.title} text={page.cta?.text} href={page.cta?.link} label={page.cta?.buttonLabel} />
    </>
  );
}
