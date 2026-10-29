"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { addToCart, useCart } from "@/lib/cart";
import { inputClass } from "@/lib/web3forms";

export function AddToCart({
  slug,
  kind,
  seats,
  soldOut,
  giftFields,
}: {
  slug: string;
  kind: string;
  /** Freie Plätze (nur bei Terminen mit Platzzahl) */
  seats?: number | null;
  soldOut: boolean;
  giftFields: boolean;
}) {
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const inCart = cart.filter((i) => i.slug === slug).reduce((sum, i) => sum + i.quantity, 0);
  // Nicht mehr Plätze anbieten als frei sind (abzüglich derer, die schon im Warenkorb liegen)
  const max = typeof seats === "number" ? Math.max(0, Math.min(10, seats - inCart)) : 10;
  const [quantity, setQuantity] = useState(1);

  if (soldOut) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl bg-blush p-5">
        <p className="font-display text-xl font-bold">Ausgebucht</p>
        <p className="text-muted">Dieser Termin ist leider voll. Melde dich trotzdem – vielleicht wird ein Platz frei oder es gibt einen Zusatztermin.</p>
        <Link href="/kontakt" className="btn-outline self-start">
          Auf die Warteliste
        </Link>
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const recipient = String(form.get("recipient") ?? "").trim();
    const greeting = String(form.get("greeting") ?? "").trim();
    addToCart({ slug, ...(recipient && { recipient }), ...(greeting && { greeting }) }, Math.min(quantity, max));
    setAdded(true);
    if (giftFields) event.currentTarget.reset();
    setQuantity(1);
  }

  const unit = kind === "event" ? "Plätze" : kind === "voucher" ? "Anzahl Gutscheine" : "Anzahl";

  return (
    <form id="auswahl" onSubmit={handleSubmit} className="flex flex-col gap-4">
      {max > 0 ? (
        <label className="flex items-center gap-3 text-sm font-medium">
          {unit}
          <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className={`${inputClass} w-24`}>
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <p className="text-sm text-muted">Alle freien Plätze liegen schon in deinem Warenkorb.</p>
      )}
      {giftFields && (
        <fieldset className="flex flex-col gap-3 rounded-2xl bg-blush/70 p-4">
          <legend className="sr-only">Angaben für den Gutschein</legend>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Für wen ist der Gutschein? <span className="font-normal text-muted">(optional)</span>
            <input name="recipient" maxLength={80} placeholder="z. B. Lena & Marco" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Grusstext auf dem Gutschein <span className="font-normal text-muted">(optional)</span>
            <textarea name="greeting" rows={2} maxLength={300} placeholder="z. B. Alles Gute zum Geburtstag!" className={inputClass} />
          </label>
        </fieldset>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={max === 0} className="btn-primary disabled:opacity-50">
          In den Warenkorb
        </button>
        {added && (
          <p className="flex items-center gap-3 text-sm" role="status">
            <span className="font-semibold text-leaf">✓ Hinzugefügt</span>
            <Link href="/warenkorb" className="font-semibold text-accent underline">
              Zum Warenkorb
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
