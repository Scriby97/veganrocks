"use client";

import Image from "next/image";
import { useState } from "react";

// Video erst nach Klick laden: vorher keine Verbindung zu YouTube (Datenschutz, schnellere Seite).
// Das Vorschaubild kommt aus Sanity, nicht von YouTube; ohne Bild eine farbige Fläche mit dem Titel.
export function YouTube({ id, title, thumbnail, large = false }: { id: string; title: string; thumbnail?: string | null; large?: boolean }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-plum">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative isolate flex aspect-video w-full flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-plum via-plum-light to-accent p-5 text-left text-white sm:p-7"
    >
      {thumbnail && (
        <>
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes={large ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="-z-10 object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 -z-10 bg-gradient-to-t from-plum/90 via-plum/30 to-transparent" aria-hidden />
        </>
      )}
      <span
        className={`absolute flex items-center justify-center rounded-full bg-white text-accent shadow-lg transition group-hover:scale-110 ${
          large ? "left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2" : "left-5 top-5 size-12"
        }`}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className={large ? "ml-1 size-9" : "ml-0.5 size-6"}>
          <path fill="currentColor" d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span className={`relative font-display font-bold drop-shadow ${large ? "text-2xl sm:text-3xl" : "text-lg"}`}>{title}</span>
      <span className="relative text-sm text-white/80">Video abspielen · lädt YouTube</span>
    </button>
  );
}
