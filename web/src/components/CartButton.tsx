"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

// Zählt nur Angebote, die es im Shop noch gibt (veraltete Einträge im Browser-Speicher nicht)
export function CartButton({ orderableSlugs }: { orderableSlugs: string[] }) {
  const count = useCart()
    .filter((item) => orderableSlugs.includes(item.slug))
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href="/warenkorb"
      className="relative flex size-11 items-center justify-center rounded-full text-ink hover:bg-blush hover:text-accent"
      aria-label={`Warenkorb (${count})`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="size-6" aria-hidden>
        <path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
