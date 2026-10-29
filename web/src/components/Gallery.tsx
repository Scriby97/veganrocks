"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";

export type GalleryPhoto = { thumb: string; full: string; alt: string; caption?: string | null };

// Raster mit Vorschaubildern; ein Klick öffnet das Bild gross (mit Blättern per Pfeiltasten)
export function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = active === null ? null : photos[active];

  function open(i: number) {
    setActive(i);
    dialog.current?.showModal();
  }

  function step(delta: number) {
    setActive((i) => (i === null ? i : (i + delta + photos.length) % photos.length));
  }

  function handleKey(event: KeyboardEvent) {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, i) => (
          <li key={photo.full}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-line"
              aria-label={`${photo.alt} gross anzeigen`}
            >
              <Image
                src={photo.thumb}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </button>
            {photo.caption && <p className="mt-1 text-sm text-muted">{photo.caption}</p>}
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onKeyDown={handleKey}
        onClose={() => setActive(null)}
        // Klick auf den abgedunkelten Hintergrund schliesst
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        aria-label="Bild gross"
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-plum/95"
      >
        {/* Grosses Bild erst beim Öffnen laden */}
        {current && (
          <figure className="flex flex-col items-center gap-2">
            <div className="relative h-[82vh] w-[92vw] max-w-5xl">
              <Image src={current.full} alt={current.alt} fill sizes="92vw" loading="eager" className="object-contain" />
            </div>
            {current.caption && <figcaption className="text-white">{current.caption}</figcaption>}
          </figure>
        )}
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          className="fixed right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/90 text-2xl text-ink hover:bg-white"
          aria-label="Schliessen"
        >
          ×
        </button>
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              className="fixed left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-ink hover:bg-white"
              aria-label="Vorheriges Bild"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="fixed right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-ink hover:bg-white"
              aria-label="Nächstes Bild"
            >
              ›
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
