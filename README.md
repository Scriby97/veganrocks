# Veganrocks

Neue Website für Veganrocks (Bettina Pfiffner, vegane Kochkurse & Events, Othmarsingen AG) – Nachfolgerin der
Wix-Seite veganrocks.com. Gleiche Infrastruktur wie evi’s universum und Pirouettentraum: statisch gebaut mit Next.js,
Inhalte in Sanity, Bestellungen und Anfragen per Formular (Web3Forms), gehostet als Cloudflare Worker.

- `web/` – die Website (Next.js, statischer Export nach `web/out`)
- `studio/` – Sanity Studio, in dem Bettina Texte, Bilder, Seiten und Shop-Angebote pflegt
- `material/` – Bilder der alten Seite (nicht im Repo): `bilder/` Originale von Wix, `web/` die ausgewählten
  Bilder in Web-Grösse mit sprechenden Namen (Quelle für den Seed und die lokale Vorschau)

## Inhalte

- **Website-Einstellungen:** Startseite (Titelbild, Eckdaten, Angebots-Kacheln, Vorstellung), Kundenstimmen,
  Videos, Galerie, Über mich, Shop-Texte, TWINT-QR-Code, Kontakt, Datenschutz, AGB, Wartungsmodus.
- **Seiten:** Kochkurse, Team-Events, Social Cooking, Gastro-Coaching (Menü «Angebot»), Rezepte & Videos,
  Einkaufstipps, Wildkräuter (Menü «Tipps & Rezepte»), Partner werden (nur Fusszeile). Neue Seiten erscheinen
  automatisch im Menü.
- **Shop-Angebote:** Gutscheine (mit «Für wen» und Grusstext), Kochkurse (Datum nach Absprache) und Termine mit
  Datum und Platzzahl. Termine verschwinden nach ihrem Datum beim nächsten Build; die Plätze zählt der Worker
  nach jeder Buchung herunter (`/api/seats`).

Bestellt wird ohne Online-Zahlung: Die Bestellung geht per Web3Forms als Mail an Bettina, bezahlt wird per
Rechnung oder TWINT (QR-Code nach dem Absenden, sobald im Studio hinterlegt).

## Lokal starten

```bash
cd web && npm install && npm run dev      # http://localhost:3000
cd studio && npm install && npm run dev   # http://localhost:3333
```

Ohne `web/.env.local` zeigt die Website die Texte der alten Seite (`web/src/lib/placeholder.ts`) mit den Bildern
aus `web/public/preview` (nicht im Repo; Kopie von `material/web`).

## Einrichtung (einmalig)

1. **Sanity-Projekt** anlegen (Konto von Bettina, Nicolas als Administrator einladen), Project ID eintragen in
   `studio/sanity.config.ts`, `studio/sanity.cli.ts`, `web/wrangler.jsonc` (`SANITY_PROJECT_ID`) und
   `web/.env.local` (`NEXT_PUBLIC_SANITY_PROJECT_ID`). CORS-Origin `https://veganrocks.ch` erlauben.
2. **Startinhalt übertragen:** `cd studio && npx sanity exec scripts/seed.ts --with-user-token`
   (alle Texte und Bilder der alten Seite; Wartungsmodus an, Passwort «rock»). Überschreibt nichts.
3. **Studio veröffentlichen:** `cd studio && npm run deploy` → https://veganrocks.sanity.studio
4. **Web3Forms:** Formular für kitchen@veganrocks.ch anlegen, Access Key → `NEXT_PUBLIC_WEB3FORMS_KEY`
   (Build-Variable in Cloudflare, lokal `web/.env.local`). Web3Forms nimmt Anfragen nur von der hinterlegten
   Website an.
5. **Cloudflare:** Worker aus dem GitHub-Repo bauen lassen (Root `web`, Build `npm run build`, Deploy
   `npx wrangler deploy`), Build-Variablen `NEXT_PUBLIC_*` setzen, Secret `SANITY_WRITE_TOKEN` (Sanity-Token mit
   Schreibrecht, nur für die Platzzahl) und optional `NTFY_TOPIC`. Deploy-Hook als Sanity-Webhook eintragen,
   damit jede Änderung im Studio die Seite neu baut. Web Analytics einschalten, Token in `web/src/app/layout.tsx`.
6. **Domain:** veganrocks.ch (Registrar Swizzonic) und veganrocks.com (Registrar 1API) zeigen heute auf Wix.
   Nameserver auf Cloudflare umstellen, Custom Domain `veganrocks.ch` am Worker, `www` und veganrocks.com per
   Redirect Rule auf https://veganrocks.ch. Alte Wix-Adressen leitet `web/worker/index.ts` weiter.
   Wix erst kündigen, wenn die neue Seite läuft.

## Neues Feld in Sanity

1. Feld im Schema ergänzen (`studio/schemaTypes/…`) und in der Abfrage in `web/src/lib/sanity.ts` aufnehmen
2. `cd studio && npm run typegen` – schreibt `studio/schema.json` und `web/src/sanity.types.ts` neu
3. TypeScript zeigt, wo das Feld fehlt; danach Studio deployen

## Tests

```bash
cd web && npm run test:e2e
```

Playwright klickt Shop, Gutschein mit Grusstext, Termin mit Platzzahl, Bestellung (Rechnung und TWINT),
Kontaktanfrage, Menü, Videos und Barrierefreiheit (WCAG 2.1 AA) durch, in Desktop- und Handy-Ansicht, mit festen
Testdaten (`web/src/lib/e2e-fixtures.ts`). Formulare und `/api/seats` werden abgefangen. Läuft auf GitHub bei
jedem Push (`.github/workflows/tests.yml`).
