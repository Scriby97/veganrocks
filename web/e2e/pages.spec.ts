import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { addProduct, mockServices } from "./helpers";

// Barrierefreiheit (WCAG 2.1 AA) der wichtigsten Seiten
const pages = ["/", "/testkurse", "/shop", "/shop/test-gutschein", "/shop/test-termin", "/galerie", "/ueber-mich", "/kontakt", "/datenschutz"];

for (const path of pages) {
  test(`Barrierefreiheit ${path}`, async ({ page }) => {
    await mockServices(page);
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
  });
}

test("Barrierefreiheit Warenkorb", async ({ page }) => {
  await mockServices(page);
  await addProduct(page, "test-gutschein", { recipient: "Test" });
  await page.goto("/warenkorb");
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(violations.map((v) => v.id)).toEqual([]);
});

test("Menü führt zu den Seiten aus dem Studio", async ({ page, isMobile }) => {
  await mockServices(page);
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Menü öffnen" }).click();
    await page.getByRole("navigation", { name: "Menü" }).getByRole("link", { name: "Testkurse" }).click();
  } else {
    await page.getByRole("navigation", { name: "Hauptmenü" }).getByRole("button", { name: "Angebot" }).hover();
    await page.getByRole("navigation", { name: "Hauptmenü" }).getByRole("link", { name: "Testkurse" }).click();
  }
  await expect(page.getByRole("heading", { level: 1, name: "Testkurse" })).toBeVisible();
  await expect(page.getByText("Toller Abend!")).toBeVisible(); // Kundenstimmen eingeschaltet
});

test("Video lädt YouTube erst nach dem Klick", async ({ page }) => {
  await mockServices(page);
  await page.goto("/");
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: /Testvideo/ }).click();
  await expect(page.locator("iframe")).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/ofx2UaHCnEw/);
});

test("Kontaktanfrage geht mit Anlass und Wunschdatum an Bettina", async ({ page }) => {
  const { forms } = await mockServices(page);
  await page.goto("/kontakt");
  await page.getByLabel("Name", { exact: true }).fill("Test Firma");
  await page.getByLabel("E-Mail", { exact: true }).fill("firma@example.ch");
  await page.getByLabel("Anlass").selectOption("Team-Event / Firmenanlass");
  await page.getByLabel(/Wunschdatum/).fill("12. Juni");
  await page.getByLabel(/Anzahl Personen/).fill("14");
  await page.getByLabel("Nachricht").fill("Wir möchten einen Kochevent.");
  await page.getByRole("button", { name: "Anfrage senden" }).click();
  await expect(page.getByRole("heading", { name: "Danke für deine Anfrage!" })).toBeVisible();
  expect(forms[0]).toMatchObject({
    subject: "Anfrage Team-Event / Firmenanlass von Test Firma",
    Anlass: "Team-Event / Firmenanlass",
    Wunschdatum: "12. Juni",
    Personen: "14",
  });
});
