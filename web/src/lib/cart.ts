"use client";

import { useSyncExternalStore } from "react";

// Warenkorb im Browser (localStorage) – es gibt keinen Server, bestellt wird per Formular
export type CartItem = {
  id: string;
  slug: string;
  quantity: number;
  /** Gutschein: für wen */
  recipient?: string;
  /** Gutschein: Grusstext */
  greeting?: string;
};

// Gleiches Angebot mit gleichen Angaben → eine Zeile mit höherer Menge
function sameChoice(a: Omit<CartItem, "id" | "quantity">, b: Omit<CartItem, "id" | "quantity">) {
  return a.slug === b.slug && (a.recipient ?? "") === (b.recipient ?? "") && (a.greeting ?? "") === (b.greeting ?? "");
}

const storageKey = "veganrocks-cart";
const changeEvent = "veganrocks-cart-change";
const empty: CartItem[] = [];

let cachedRaw: string | null = null;
let cachedItems: CartItem[] = empty;

function read(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(storageKey);
  } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedItems = raw ? JSON.parse(raw) : empty;
    } catch {
      cachedItems = empty;
    }
  }
  return cachedItems;
}

function write(items: CartItem[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {}
  window.dispatchEvent(new Event(changeEvent));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

export function useCart() {
  return useSyncExternalStore(subscribe, read, () => empty);
}

export function addToCart(item: Omit<CartItem, "id" | "quantity">, quantity = 1) {
  const items = read();
  const same = items.find((i) => sameChoice(i, item));
  write(
    same
      ? items.map((i) => (i === same ? { ...i, quantity: Math.min(99, i.quantity + quantity) } : i))
      : [...items, { ...item, id: crypto.randomUUID(), quantity: Math.min(99, quantity) }],
  );
}

export function setQuantity(id: string, quantity: number) {
  write(
    quantity <= 0
      ? read().filter((i) => i.id !== id)
      : read().map((i) => (i.id === id ? { ...i, quantity: Math.min(99, quantity) } : i)),
  );
}

// Wie viele veraltete Einträge in dieser Sitzung entfernt wurden (für den Hinweis im Warenkorb)
let prunedCount = 0;

/** Entfernt Einträge, deren Angebot es nicht mehr gibt oder das nicht mehr buchbar ist */
export function pruneCart(orderableSlugs: string[]) {
  const valid = new Set(orderableSlugs);
  const items = read();
  const kept = items.filter((i) => valid.has(i.slug));
  if (kept.length === items.length) return;
  prunedCount += items.length - kept.length;
  write(kept);
}

export function usePrunedCount() {
  return useSyncExternalStore(subscribe, () => prunedCount, () => 0);
}

export function clearCart() {
  write(empty);
}
