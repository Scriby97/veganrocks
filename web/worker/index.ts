// Cloudflare Worker: liefert die statische Seite aus `out/` aus und
// - zählt nach einer Buchung die freien Plätze eines Termins in Sanity herunter (/api/seats).
//   Der Schreibschlüssel (SANITY_WRITE_TOKEN) ist ein Secret des Workers und gelangt nie in den Browser.
// - leitet Adressen der alten Wix-Seite auf die neuen Seiten um (Google-Treffer, alte Links).
// - meldet fehlgeschlagene Builds per ntfy (build-notify.ts).

import { buildNotification, sendToNtfy, type BuildEvent } from "./build-notify";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  SANITY_PROJECT_ID?: string;
  SANITY_WRITE_TOKEN?: string;
  NTFY_TOPIC?: string;
}

type QueueBatch = { messages: { body: unknown; ack(): void; retry(): void }[] };
type SeatsDoc = { _id: string; _rev: string; seats: number; slug: string };

const DATASET = "production";

// Alte Wix-Adressen → neue Seiten (Kleinbuchstaben, ohne Schrägstrich am Ende)
const OLD_PAGES: Record<string, string> = {
  "/home": "/kochkurse",
  "/individuellekochkurse": "/kochkurse",
  "/teamevent": "/team-events",
  "/firmenevents": "/team-events",
  "/food": "/galerie",
  "/videos": "/rezepte",
  "/wildkräuter": "/wildkraeuter",
  "/wildkr%c3%a4uter": "/wildkraeuter",
  "/info": "/ueber-mich",
  "/medien": "/ueber-mich",
  "/gutscheine": "/shop",
  "/product-page/gutschein-für-einen-koch-workshop-für-1-person": "/shop/gutschein-privatevent",
  "/product-page/kochkurs-home": "/shop/kochkurs-home",
  "/product-page/kochevent-für-4-5-personen": "/shop/kochevent-kochstudio",
  "/product-page/yoga": "/shop",
};

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/seats") return handleSeats(request, env, url);
    const path = decodeURIComponent(url.pathname).toLowerCase().replace(/\/+$/, "");
    const target = OLD_PAGES[path] ?? OLD_PAGES[url.pathname.toLowerCase().replace(/\/+$/, "")];
    if (target) return Response.redirect(new URL(target, url).toString(), 301);
    // Übrige Wix-Produktseiten → Shop
    if (path.startsWith("/product-page/")) return Response.redirect(new URL("/shop", url).toString(), 301);
    return env.ASSETS.fetch(request);
  },

  // Build-Ereignisse aus der Queue «veganrocks-builds»
  async queue(batch: QueueBatch, env: Env): Promise<void> {
    for (const message of batch.messages) {
      const notification = buildNotification(message.body as BuildEvent);
      if (!notification || !env.NTFY_TOPIC) {
        message.ack();
        continue;
      }
      try {
        await sendToNtfy(env.NTFY_TOPIC, notification);
        message.ack();
      } catch {
        message.retry();
      }
    }
  },
};

export default worker;

async function handleSeats(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);
  // Nur Aufrufe von der eigenen Seite (hält fremde Websites ab; kein Schutz gegen gezielte Skripte)
  const origin = request.headers.get("Origin");
  if (!origin || new URL(origin).host !== url.host) return json({ error: "forbidden" }, 403);
  if (!env.SANITY_WRITE_TOKEN || !env.SANITY_PROJECT_ID) return json({ error: "not configured" }, 503);
  const api = `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v2026-09-01`;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }
  const wanted = parseItems(body);
  if (wanted.size === 0) return json({ updated: [] });

  // Bei gleichzeitigen Buchungen schlägt die Revisionsprüfung fehl → neu lesen und nochmals versuchen
  for (let attempt = 0; attempt < 3; attempt++) {
    const docs = await countedDocs(api, [...wanted.keys()], env);
    if (docs.length === 0) return json({ updated: [] });
    const mutations = docs.map((d) => ({
      patch: { id: d._id, ifRevisionID: d._rev, set: { seats: Math.max(0, d.seats - wanted.get(d.slug)!) } },
    }));
    const res = await fetch(`${api}/data/mutate/${DATASET}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.SANITY_WRITE_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mutations }),
    });
    if (res.ok) return json({ updated: docs.map((d) => ({ slug: d.slug, seats: Math.max(0, d.seats - wanted.get(d.slug)!) })) });
    if (res.status !== 409) return json({ error: "sanity error", status: res.status }, 502);
  }
  return json({ error: "conflict" }, 409);
}

// Erlaubt nur gültige Kurznamen und Mengen 1–99; gleiche Angebote werden zusammengezählt
function parseItems(body: unknown): Map<string, number> {
  const wanted = new Map<string, number>();
  const items = (body as { items?: unknown })?.items;
  if (!Array.isArray(items)) return wanted;
  for (const item of items.slice(0, 50)) {
    const { slug, quantity } = (item ?? {}) as { slug?: unknown; quantity?: unknown };
    if (typeof slug !== "string" || !/^[a-z0-9-]{1,96}$/.test(slug)) continue;
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) continue;
    wanted.set(slug, Math.min(99, (wanted.get(slug) ?? 0) + quantity));
  }
  return wanted;
}

// Veröffentlichte Angebote und offene Entwürfe (sonst überschreibt Bettinas nächstes «Publish» die Platzzahl)
async function countedDocs(api: string, slugs: string[], env: Env): Promise<SeatsDoc[]> {
  const query = `*[_type == "product" && slug.current in $slugs && defined(seats)]{_id, _rev, seats, "slug": slug.current}`;
  const params = new URLSearchParams({ query, $slugs: JSON.stringify(slugs), perspective: "raw" });
  const res = await fetch(`${api}/data/query/${DATASET}?${params}`, { headers: { Authorization: `Bearer ${env.SANITY_WRITE_TOKEN}` } });
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
  return ((await res.json()) as { result: SeatsDoc[] }).result;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
