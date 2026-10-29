"use client";

import { useState } from "react";

// Video erst nach Klick laden: vorher keine Verbindung zu YouTube (Datenschutz, schnellere Seite).
// Darum auch kein Vorschaubild von YouTube, sondern ein eigener Platzhalter mit dem Titel.
export function YouTube({ id, title, large = false }: { id: string; title: string; large?: boolean }) {
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
      className="group relative flex aspect-video w-full flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-plum via-plum-light to-accent p-5 text-left text-white sm:p-7"
    >
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
      <span className={`relative font-display font-bold ${large ? "text-2xl sm:text-3xl" : "text-lg"}`}>{title}</span>
      <span className="relative text-sm text-white/75">Video abspielen · lädt YouTube</span>
    </button>
  );
}
