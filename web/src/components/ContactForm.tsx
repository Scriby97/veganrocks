"use client";

import { useState, type FormEvent } from "react";
import { inputClass, sendForm, web3formsKey } from "@/lib/web3forms";

type Status = "idle" | "sending" | "success" | "error";

const occasions = ["Privater Kochkurs", "Team-Event / Firmenanlass", "Polterabend / Geburtstag", "Gastro-Coaching", "Social Cooking", "Gutschein", "Etwas anderes"];

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    try {
      await sendForm({
        subject: `Anfrage ${form.get("occasion")} von ${form.get("name")}`,
        botcheck: form.get("botcheck"),
        Name: form.get("name"),
        email: form.get("email"),
        Telefon: form.get("phone") || "–",
        Anlass: form.get("occasion"),
        Wunschdatum: form.get("date") || "–",
        Personen: form.get("people") || "–",
        Nachricht: form.get("message"),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col gap-2 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="font-display text-3xl font-extrabold">Danke für deine Anfrage!</h2>
        <p className="text-muted">Ich melde mich so bald wie möglich bei dir. Let’s rock the kitchen!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      {!web3formsKey && (
        <p className="rounded-xl bg-yellow-100 p-3 text-sm text-yellow-900">
          NEXT_PUBLIC_WEB3FORMS_KEY fehlt – das Formular kann noch nicht versendet werden.
        </p>
      )}
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
          Anlass
          <select name="occasion" className={inputClass} defaultValue={occasions[0]}>
            {occasions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Wunschdatum <span className="font-normal text-muted">(optional)</span>
          <input name="date" placeholder="z. B. Samstag, 14. März oder «im Frühling»" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Anzahl Personen <span className="font-normal text-muted">(optional)</span>
          <input name="people" inputMode="numeric" placeholder="z. B. 8" className={inputClass} />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Nachricht
        <textarea name="message" required rows={5} placeholder="Erzähl mir von deinem Anlass, Ort und Wünschen …" className={inputClass} />
      </label>
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      {status === "error" && (
        <p className="text-sm font-semibold text-accent">
          Die Nachricht konnte nicht gesendet werden. Bitte versuche es nochmals oder schreib mir direkt eine E-Mail.
        </p>
      )}
      <button type="submit" disabled={status === "sending" || !web3formsKey} className="btn-primary self-start disabled:opacity-50">
        {status === "sending" ? "Wird gesendet …" : "Anfrage senden"}
      </button>
    </form>
  );
}
