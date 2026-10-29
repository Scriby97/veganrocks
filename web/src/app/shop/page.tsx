import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/Blocks";
import { ProductCard } from "@/components/ProductCard";
import { RichText } from "@/components/RichText";
import { getProducts, getSettings } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Shop & Gutscheine",
  description: "Gutscheine für vegane Kochkurse verschenken, Kochkurse und Termine buchen – Veganrocks.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()]);
  const visible = products.filter((p) => p.available);
  const groups = [
    { title: "Termine", items: visible.filter((p) => p.kind === "event") },
    { title: "Gutscheine", items: visible.filter((p) => p.kind === "voucher") },
    { title: "Kochkurse buchen", items: visible.filter((p) => p.kind === "course") },
  ].filter((g) => g.items.length > 0);

  return (
    <>
      <PageHero
        image={settings.gallery?.[0]}
        eyebrow="Shop"
        title="Kochkurse & Gutscheine"
        intro={settings.shopIntro ?? "Verschenke ein Erlebnis oder buche deinen nächsten Kochkurs."}
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-14 sm:px-6 sm:py-20">
        {groups.map((group) => (
          <section key={group.title} className="flex flex-col gap-6" aria-labelledby={`gruppe-${group.title}`}>
            <h2 id={`gruppe-${group.title}`} className="font-display text-3xl font-extrabold sm:text-4xl">
              {group.title}
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((product) => (
                <li key={product._id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </section>
        ))}
        {groups.length === 0 && <p className="text-lg text-muted">Im Moment gibt es keine Angebote im Shop. Schreib mir einfach!</p>}
        {settings.orderInfo && (
          <section className="rounded-3xl bg-blush p-6 sm:p-10">
            <RichText value={settings.orderInfo} className="max-w-3xl text-lg text-muted" />
          </section>
        )}
      </div>
      <CtaBand settings={settings} title="Etwas Individuelles?" text="Du hast eine eigene Idee für einen Kochkurs oder einen persönlichen Gutschein? Ich gestalte ihn gerne für dich." label="Kontakt aufnehmen" />
    </>
  );
}
