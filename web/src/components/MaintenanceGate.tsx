"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { inputClass } from "@/lib/web3forms";

const storageKey = "veganrocks-preview";

function readStored() {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

// Wartungsmodus (im Studio unter «Wartung» ein- und ausschaltbar): Besucher sehen nur einen Hinweis,
// mit dem Passwort kommt man trotzdem auf die Website. Sichtschutz, kein echter Passwortschutz – die Seite
// ist statisch, Inhalte stehen im HTML. Das Overlay ist schon im ausgelieferten HTML, damit nichts aufblitzt.
export function MaintenanceGate({
  siteName,
  text,
  password,
  children,
}: {
  siteName: string;
  text: string;
  /** Ohne Passwort gibt es kein Eingabefeld (dann kommt niemand an der Wartungsseite vorbei) */
  password?: string;
  children: React.ReactNode;
}) {
  // Beim Build (Server) gibt es kein localStorage → dort immer gesperrt
  const stored = useSyncExternalStore(subscribe, readStored, () => null);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const unlocked = Boolean(password) && (justUnlocked || stored === password!.toLowerCase());

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = String(new FormData(event.currentTarget).get("password") ?? "");
    if (!password || input.trim().toLowerCase() !== password.toLowerCase()) {
      setError(true);
      return;
    }
    try {
      localStorage.setItem(storageKey, password.toLowerCase());
    } catch {}
    setJustUnlocked(true);
  }

  if (unlocked) return <>{children}</>;

  return (
    <>
      <div inert className="hidden">
        {children}
      </div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-plum px-4 text-white">
        <div className="flex max-w-md flex-col items-center gap-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sun">Kurz in Wartung</p>
          <h1 className="font-display text-6xl font-extrabold sm:text-7xl">{siteName}</h1>
          <p className="whitespace-pre-line text-xl text-white/80">{text}</p>
          {password && (
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
              <label htmlFor="preview-password" className="text-sm text-white/80">
                Passwort
              </label>
              <div className="flex gap-2">
                <input
                  id="preview-password"
                  name="password"
                  type="password"
                  autoComplete="off"
                  onChange={() => setError(false)}
                  className={`${inputClass} text-ink`}
                />
                <button type="submit" className="btn-light shrink-0 px-5 py-2">
                  Weiter
                </button>
              </div>
              {error && <p className="text-sm text-sun">Das Passwort stimmt leider nicht.</p>}
            </form>
          )}
        </div>
      </div>
    </>
  );
}
