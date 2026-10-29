import { expect, test } from "@playwright/test";
import { addProduct, cartCount, fillCustomer, mockServices } from "./helpers";

test("Shop zeigt Termine, Gutscheine und Kochkurse in Gruppen", async ({ page }) => {
  await mockServices(page);
  await page.goto("/shop");
  await expect(page.getByRole("heading", { name: "Termine", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Gutscheine", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Kochkurse buchen" })).toBeVisible();
  await expect(page.getByText("Ausgebucht", { exact: true })).toBeVisible();
});

test("Gutschein mit Grusstext: Mail an Bettina, Bestätigung, leerer Warenkorb", async ({ page }) => {
  const { forms, seats } = await mockServices(page);
  await addProduct(page, "test-gutschein", { quantity: 2, recipient: "Lena & Marco", greeting: "Alles Gute!" });
  await expect(cartCount(page)).toHaveAccessibleName("Warenkorb (2)");
  await page.goto("/warenkorb");
  await expect(page.getByText("CHF 300.00")).toBeVisible();
  await fillCustomer(page);
  await page.getByLabel(/Nachricht/).fill("Bitte bis Weihnachten");
  await page.getByRole("button", { name: "Verbindlich bestellen" }).click();
  await expect(page.getByRole("heading", { name: /Vielen Dank für deine Bestellung/ })).toBeVisible();

  expect(forms).toHaveLength(1);
  const mail = forms[0];
  expect(mail.subject).toMatch(/^Neue Bestellung VR-\d{6}-\d{4} von Test Kunde$/);
  expect(mail.email).toBe("kunde@example.ch");
  expect(mail.Zahlungsart).toBe("Rechnung per E-Mail");
  expect(mail.Bestellung).toContain("2 × Testgutschein à CHF 150.00");
  expect(mail.Bestellung).toContain("Für: Lena & Marco");
  expect(mail.Bestellung).toContain("Grusstext: «Alles Gute!»");
  expect(mail.Total).toBe("CHF 300.00");
  expect(mail.Nachricht).toBe("Bitte bis Weihnachten");
  // Gutscheine haben keine Platzzahl
  expect(seats).toHaveLength(0);
  await expect(page.getByText(`Bestellnummer: ${mail.Bestellnummer}`)).toBeVisible();
  await expect(cartCount(page)).toHaveAccessibleName("Warenkorb (0)");
});

test("Termin: nicht mehr Plätze als frei, Platzabzug nach der Buchung", async ({ page }) => {
  const { forms, seats } = await mockServices(page);
  await page.goto("/shop/test-termin");
  // 3 freie Plätze → höchstens 3 wählbar
  await expect(page.locator("form#auswahl").getByRole("option")).toHaveCount(3);
  await addProduct(page, "test-termin", { quantity: 2 });
  await page.goto("/warenkorb");
  // Im Warenkorb bis 3 erhöhbar, danach gesperrt
  await page.getByRole("button", { name: "Testtermin: eins mehr" }).click();
  await expect(page.getByRole("button", { name: "Testtermin: eins mehr" })).toBeDisabled();
  await fillCustomer(page);
  await page.getByLabel(/TWINT – direkt/).check();
  await page.getByRole("button", { name: "Verbindlich bestellen" }).click();
  await expect(page.getByRole("img", { name: /TWINT-QR-Code/ })).toBeVisible();
  await expect(page.locator("ol")).toContainText("CHF 570.00");
  expect(forms[0].Zahlungsart).toMatch(/^TWINT/);
  expect(forms[0].Bestellung).toContain("Termin: ");
  await expect.poll(() => seats.length).toBe(1);
  expect(seats[0].items).toEqual([{ slug: "test-termin", quantity: 3 }]);
});

test("Ausgebuchter Termin lässt sich nicht in den Warenkorb legen", async ({ page }) => {
  await mockServices(page);
  await page.goto("/shop/test-ausgebucht");
  await expect(page.getByRole("link", { name: "Auf die Warteliste" })).toBeVisible();
  await expect(page.getByRole("button", { name: "In den Warenkorb" })).toHaveCount(0);
});

test("Fehler beim Senden: Meldung, Warenkorb bleibt", async ({ page }) => {
  const { seats } = await mockServices(page, { formsFail: true });
  await addProduct(page, "test-kochkurs");
  await page.goto("/warenkorb");
  await fillCustomer(page);
  await page.getByRole("button", { name: "Verbindlich bestellen" }).click();
  await expect(page.getByText("Die Bestellung konnte nicht gesendet werden")).toBeVisible();
  await expect(cartCount(page)).toHaveAccessibleName("Warenkorb (1)");
  expect(seats).toHaveLength(0);
});
