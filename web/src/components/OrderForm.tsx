"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { clearCart, pruneCart, setQuantity, useCart, usePrunedCount } from "@/lib/cart";
import { formatDate, formatPrice } from "@/lib/format";
import { inputClass, sendForm, web3formsKey } from "@/lib/web3forms";
import { ConfirmationCopy } from "./ConfirmationCopy";

export type OrderProduct = {
  slug: string;
  name: string;
  price: number;
  kind: string;
  date?: string | null;
  /** Freie Plätze; null = nicht gezählt */
  seats?: number | null;
};
type Status = "idle" | "sending" | "success" | "error";
type Payment = "invoice" | "twint";
type Placed = { orderNo: string; total: number; payment: Payment; email: string; summary: string; hasCourses: boolean };

// Kurze, gut lesbare Nummer, damit Bettina Zahlungen (TWINT, Rechnung) zuordnen kann
function newOrderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear() % 100}`.padStart(2, "0") + `${d.getMonth() + 1}`.padStart(2, "0") + `${d.getDate()}`.padStart(2, "0");
  return `VR-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function OrderForm({ products, twintQrUrl }: { products: OrderProduct[]; twintQrUrl?: string | null }) {
  const cart = useCart();
  const [status, setStatus] = useState<Status>("idle");
  const [payment, setPayment] = useState<Payment>("invoice");
  const [placed, setPlaced] = useState<Placed | null>(null);
  const removed = usePrunedCount();

  // Angebote, die es nicht mehr gibt (gelöscht, ausgeblendet, ausgebucht, vorbei), aus dem Browser-Speicher entfernen
  useEffect(() => pruneCart(products.map((p) => p.slug)), [products]);

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const lines = cart.flatMap((item) => {
    const product = bySlug.get(item.slug);
    return product ? [{ ...item, product }] : [];
  });
  // Mehr Plätze im Warenkorb als frei (z. B. inzwischen andere Buchungen)? Dann nicht absenden lassen
  const booked = new Map<string, number>();
  for (const l of lines) booked.set(l.slug, (booked.get(l.slug) ?? 0) + l.quantity);
  const overbooked = lines.filter((l) => typeof l.product.seats === "number" && booked.get(l.slug)! > l.product.seats);
  const total = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const hasCourses = lines.some((l) => l.product.kind === "course");
  const paymentMethod: Payment = twintQrUrl ? payment : "invoice";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (overbooked.length) return;
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const orderNo = newOrderNumber();
    const order = lines
      .map((l) => {
        const details = [
          l.product.kind === "event" && l.product.date && `Termin: ${formatDate(l.product.date)}`,
          l.recipient && `Für: ${l.recipient}`,
          l.greeting && `Grusstext: «${l.greeting}»`,
        ]
          .filter(Boolean)
          .map((d) => `\n    → ${d}`)
          .join("");
        return `${l.quantity} × ${l.product.name} à ${formatPrice(l.product.price)}${details}`;
      })
      .join("\n");
    const phone = String(form.get("phone") ?? "").trim();
    const address = String(form.get("address") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const nextSteps = [
      paymentMethod === "twint"
        ? `Bezahlung per TWINT: ${formatPrice(total)} an Veganrocks, wenn möglich mit der Bestellnummer als Mitteilung.`
        : "Du erhältst in den nächsten Tagen eine Rechnung per E-Mail.",
      lines.some((l) => l.product.kind === "voucher") && "Den Gutschein schicke ich dir nach dem Zahlungseingang per E-Mail.",
      hasCourses && "Für den Kochkurs melde ich mich bei dir, um Datum, Gruppengrösse und Menü abzustimmen.",
    ]
      .filter(Boolean)
      .join(" ");
    // Kopie für die Kundin/den Kunden (Anzeige, Mail an sich selbst, Ausdruck)
    const summary = [
      `Bestellnummer: ${orderNo}`,
      `Datum: ${new Date().toLocaleDateString("de-CH")}`,
      "",
      order,
      "",
      `Total: ${formatPrice(total)}`,
      `Zahlung: ${paymentMethod === "twint" ? "TWINT" : "Rechnung per E-Mail"}`,
      "",
      `Name: ${form.get("name")}`,
      `E-Mail: ${form.get("email")}`,
      phone ? `Telefon: ${phone}` : null,
      address ? `Adresse:\n${address}` : null,
      message ? `Nachricht: ${message}` : null,
      "",
      nextSteps,
    ]
      .filter((line) => line !== null)
      .join("\n");

    try {
      await sendForm({
        subject: `Neue Bestellung ${orderNo} von ${form.get("name")}`,
        botcheck: form.get("botcheck"),
        Bestellnummer: orderNo,
        Zahlungsart:
          paymentMethod === "twint" ? "TWINT – bezahlt direkt nach der Bestellung per QR-Code (Zahlungseingang prüfen)" : "Rechnung per E-Mail",
        Name: form.get("name"),
        email: form.get("email"),
        Telefon: phone || "–",
        Adresse: address || "–",
        Bestellung: order,
        Total: formatPrice(total),
        Nachricht: message || "–",
      });
      setPlaced({ orderNo, total, payment: paymentMethod, email: String(form.get("email")), summary, hasCourses });
      // Freie Plätze herunterzählen (Cloudflare-Worker); scheitert das, ist die Bestellung trotzdem verschickt
      const counted = lines.filter((l) => typeof l.product.seats === "number");
      if (counted.length) {
        fetch("/api/seats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: counted.map((l) => ({ slug: l.slug, quantity: l.quantity })) }),
          keepalive: true,
        }).catch(() => {});
      }
      clearCart();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" && placed) {
    return (
      <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl font-extrabold">Vielen Dank für deine Bestellung!</h2>
          <p className="text-muted">
            Bestellnummer <strong className="text-ink">{placed.orderNo}</strong>
          </p>
        </div>
        {placed.payment === "twint" && twintQrUrl ? (
          <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
            <div className="relative mx-auto aspect-square w-52">
              <Image src={twintQrUrl} alt="TWINT-QR-Code von Veganrocks" fill sizes="208px" loading="eager" className="object-contain" />
            </div>
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-muted">
              <li>TWINT-App öffnen und den QR-Code scannen.</li>
              <li>
                Betrag eingeben: <strong className="text-lg text-ink">{formatPrice(placed.total)}</strong>
              </li>
              <li>
                Falls möglich die Bestellnummer <strong className="text-ink">{placed.orderNo}</strong> als Mitteilung angeben.
              </li>
              <li>Zahlung bestätigen – fertig!</li>
            </ol>
          </div>
        ) : (
          <p className="text-muted">Du erhältst in den nächsten Tagen eine Rechnung per E-Mail.</p>
        )}
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-2xl font-bold">Deine Bestellung</h3>
          <ConfirmationCopy email={placed.email} subject={`Meine Bestellung ${placed.orderNo} bei Veganrocks`} summary={placed.summary} />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        {removed > 0 && <RemovedNotice count={removed} />}
        <p className="text-lg text-muted">Dein Warenkorb ist noch leer.</p>
        <Link href="/shop" className="btn-primary">
          Zum Shop
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {!web3formsKey && (
        <p className="rounded-xl bg-yellow-100 p-3 text-sm text-yellow-900">
          NEXT_PUBLIC_WEB3FORMS_KEY fehlt – das Formular kann noch nicht versendet werden.
        </p>
      )}

      <section className="flex flex-col gap-3">
        <ul className="flex flex-col gap-3">
          {lines.map((l) => {
            const max = typeof l.product.seats === "number" ? l.product.seats : 99;
            return (
              <li key={l.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold">{l.product.name}</p>
                  <p className="text-sm text-muted">
                    {[
                      formatPrice(l.product.price),
                      l.product.kind === "event" && l.product.date && formatDate(l.product.date),
                      l.recipient && `für ${l.recipient}`,
                      l.greeting && `«${l.greeting}»`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {overbooked.includes(l) && (
                    <p className="text-sm font-semibold text-accent">
                      Es {l.product.seats === 1 ? "ist nur noch 1 Platz" : `sind nur noch ${l.product.seats} Plätze`} frei – bitte die Anzahl anpassen.
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(l.id, l.quantity - 1)}
                    className="size-9 rounded-full border border-line hover:border-accent"
                    aria-label={`${l.product.name}: eins weniger`}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold" aria-label="Anzahl">
                    {l.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(l.id, l.quantity + 1)}
                    disabled={booked.get(l.slug)! >= max}
                    className="size-9 rounded-full border border-line hover:border-accent disabled:opacity-40"
                    aria-label={`${l.product.name}: eins mehr`}
                  >
                    +
                  </button>
                  <button type="button" onClick={() => setQuantity(l.id, 0)} className="ml-3 text-sm text-muted hover:text-accent">
                    Entfernen
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        {removed > 0 && <RemovedNotice count={removed} />}
        <p className="ml-auto flex items-baseline gap-4 text-lg">
          <span className="text-muted">Total</span>
          <span className="font-display text-3xl font-extrabold">{formatPrice(total)}</span>
        </p>
        <Link href="/shop" className="self-start text-sm font-semibold text-accent hover:text-accent-dark">
          ← Weiter einkaufen
        </Link>
      </section>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-3 font-display text-2xl font-bold">Deine Angaben</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Name
            <input name="name" required autoComplete="name" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            E-Mail
            <input name="email" type="email" required autoComplete="email" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Telefon <span className="font-normal text-muted">(optional)</span>
            <input name="phone" type="tel" autoComplete="tel" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Adresse für die Rechnung <span className="font-normal text-muted">(optional)</span>
            <textarea name="address" rows={2} autoComplete="street-address" placeholder={"Strasse Nr.\nPLZ Ort"} className={inputClass} />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Nachricht <span className="font-normal text-muted">(optional{hasCourses ? " – z. B. Wunschdatum, Anzahl Personen, Menüwünsche" : ""})</span>
          <textarea name="message" rows={3} className={inputClass} />
        </label>
        {/* Spam-Schutz: für Menschen unsichtbar, Bots füllen es aus */}
        <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
      </fieldset>

      {twintQrUrl && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-3 font-display text-2xl font-bold">Bezahlung</legend>
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" checked={paymentMethod === "invoice"} onChange={() => setPayment("invoice")} className="size-4 accent-accent" />
            Rechnung per E-Mail
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" checked={paymentMethod === "twint"} onChange={() => setPayment("twint")} className="size-4 accent-accent" />
            TWINT – direkt nach der Bestellung bezahlen
          </label>
        </fieldset>
      )}

      {status === "error" && (
        <p className="text-sm font-semibold text-accent">
          Die Bestellung konnte nicht gesendet werden. Bitte versuche es nochmals oder schreib mir eine E-Mail.
        </p>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === "sending" || !web3formsKey || overbooked.length > 0}
          className="btn-primary self-start disabled:opacity-50"
        >
          {status === "sending" ? "Wird gesendet …" : "Verbindlich bestellen"}
        </button>
        <p className="text-xs text-muted">
          {paymentMethod === "twint"
            ? "Nach dem Absenden zeige ich dir den TWINT-QR-Code und den Betrag."
            : "Du bezahlst bequem per Rechnung, die du nach der Bestellung per E-Mail erhältst."}{" "}
          Es gilt die{" "}
          <Link href="/datenschutz" className="underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

function RemovedNotice({ count }: { count: number }) {
  return (
    <p className="rounded-xl bg-blush p-3 text-sm text-muted">
      {count === 1 ? "Ein Angebot ist" : `${count} Angebote sind`} nicht mehr buchbar und {count === 1 ? "wurde" : "wurden"} aus deinem
      Warenkorb entfernt.
    </p>
  );
}
