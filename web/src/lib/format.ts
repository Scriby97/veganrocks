// Ohne Abhängigkeiten, damit Browser-Komponenten nicht den Sanity-Client mitladen
export function formatPrice(price: number) {
  return new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF" }).format(price);
}

const dateFormat = new Intl.DateTimeFormat("de-CH", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const shortFormat = new Intl.DateTimeFormat("de-CH", { day: "numeric", month: "short" });

/** «Sonntag, 8. November 2026» */
export function formatDate(date: string) {
  return dateFormat.format(new Date(`${date}T12:00:00`));
}

/** Für das Datums-Etikett auf Karten: { day: "8.", month: "Nov." } */
export function dateBadge(date: string) {
  const parts = shortFormat.formatToParts(new Date(`${date}T12:00:00`));
  return {
    day: `${parts.find((p) => p.type === "day")?.value}.`,
    month: parts.find((p) => p.type === "month")?.value ?? "",
  };
}
