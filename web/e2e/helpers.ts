import type { Page } from "@playwright/test";

type Form = Record<string, string>;
type SeatsRequest = { items: { slug: string; quantity: number }[] };

// 1×1-PNG für Bilder vom (Fantasie-)Sanity-CDN der Testdaten
const pixel = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

/**
 * Fängt alles ab, was die Seite nach aussen schickt: Formulare (Web3Forms), Platzabzug (/api/seats)
 * und Bilder. Die Tests prüfen dann, was tatsächlich an Bettina gegangen wäre.
 */
export async function mockServices(page: Page, { formsFail = false } = {}) {
  const forms: Form[] = [];
  const seats: SeatsRequest[] = [];
  // Alles, was nicht zur Testseite gehört, wird blockiert (z. B. YouTube, Statistik), damit nichts nach aussen geht
  await page.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
  await page.route("https://api.web3forms.com/**", async (route) => {
    // Preise enthalten ein geschütztes Leerzeichen («CHF 9.00») – für die Vergleiche normalisieren
    forms.push(JSON.parse(route.request().postData()!.replace(/ /g, " ")));
    await route.fulfill({ json: formsFail ? { success: false, message: "Testfehler" } : { success: true } });
  });
  await page.route("**/api/seats", async (route) => {
    seats.push(route.request().postDataJSON());
    await route.fulfill({ json: { ok: true } });
  });
  await page.route("https://cdn.sanity.io/**", (route) => route.fulfill({ body: pixel, contentType: "image/png" }));
  return { forms, seats };
}

export const cartCount = (page: Page) => page.getByRole("link", { name: /^Warenkorb \(\d+\)$/ }).first();

export async function addProduct(page: Page, slug: string, { quantity, recipient, greeting }: { quantity?: number; recipient?: string; greeting?: string } = {}) {
  await page.goto(`/shop/${slug}`);
  const form = page.locator("form#auswahl");
  if (quantity) await form.getByRole("combobox").selectOption(String(quantity));
  if (recipient) await form.getByLabel(/Für wen/).fill(recipient);
  if (greeting) await form.getByLabel(/Grusstext/).fill(greeting);
  await form.getByRole("button", { name: "In den Warenkorb" }).click();
  await page.getByText("✓ Hinzugefügt").waitFor();
}

export async function fillCustomer(page: Page) {
  await page.getByLabel("Name", { exact: true }).fill("Test Kunde");
  await page.getByLabel("E-Mail", { exact: true }).fill("kunde@example.ch");
}
