import Link from "next/link";
import { dateBadge, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/sanity";
import { SanityImage } from "./SanityImage";

export const kindLabel: Record<string, string> = { voucher: "Gutschein", course: "Kochkurs", event: "Termin" };

export function seatsNote(product: Pick<Product, "seats" | "soldOut">) {
  if (product.soldOut) return "Ausgebucht";
  if (typeof product.seats === "number" && product.seats <= 5) return product.seats === 1 ? "Nur noch 1 Platz" : `Nur noch ${product.seats} Plätze`;
  return null;
}

export function ProductCard({ product }: { product: Product }) {
  const badge = product.kind === "event" && product.date ? dateBadge(product.date) : null;
  const note = seatsNote(product);
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-plum/10"
    >
      <div className="relative aspect-[4/3] bg-blush">
        <SanityImage image={product.images?.[0]} alt="" decorative sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" crop={{ width: 900, height: 675 }} />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
          {kindLabel[product.kind] ?? product.kind}
        </span>
        {badge && (
          <span className="absolute right-4 top-4 flex flex-col items-center rounded-2xl bg-accent px-3 py-2 leading-none text-white shadow-lg">
            <span className="font-display text-2xl font-extrabold">{badge.day}</span>
            <span className="text-xs font-semibold uppercase">{badge.month}</span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-2xl font-bold leading-tight group-hover:text-accent">{product.name}</h3>
        {product.description && <p className="line-clamp-3 text-muted">{product.description}</p>}
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <p>
            <span className="font-display text-2xl font-extrabold">{formatPrice(product.price ?? 0)}</span>
            {product.priceNote && <span className="text-sm text-muted"> {product.priceNote}</span>}
          </p>
          {note && (
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${product.soldOut ? "bg-line text-muted" : "bg-sun/40 text-ink"}`}>
              {note}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
