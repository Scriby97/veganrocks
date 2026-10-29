import type { Metadata } from "next";
import { CtaBand, SectionHeading } from "@/components/Blocks";
import { Gallery } from "@/components/Gallery";
import { getSettings, imageUrl } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Fotos und Impressionen aus den veganen Kochkursen, Team-Events und Coachings von Veganrocks.",
  alternates: { canonical: "/galerie" },
};

export default async function GalleryPage() {
  const settings = await getSettings();
  const photos = (settings.gallery ?? []).flatMap((image) => {
    const thumb = imageUrl(image, { width: 600, height: 600 });
    const full = imageUrl(image);
    return thumb && full ? [{ thumb, full, alt: image.alt || "Foto von einem Veganrocks-Kochevent" }] : [];
  });

  return (
    <>
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">Galerie</p>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">{settings.galleryTitle ?? "Galerie"}</h1>
          {settings.galleryIntro && <p className="max-w-2xl text-lg text-muted">{settings.galleryIntro}</p>}
        </div>
        {photos.length > 0 ? <Gallery photos={photos} /> : <SectionHeading title="Bald gibt es hier Fotos." />}
      </section>
      <CtaBand settings={settings} />
    </>
  );
}
