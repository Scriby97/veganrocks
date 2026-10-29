import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start gap-5 px-4 py-24 sm:px-6">
      <p className="eyebrow">404</p>
      <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Diese Seite gibt es nicht (mehr)</h1>
      <p className="text-lg text-muted">Vielleicht findest du, was du suchst, über das Menü oder auf der Startseite.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">
          Zur Startseite
        </Link>
        <Link href="/shop" className="btn-outline">
          Zum Shop
        </Link>
      </div>
    </section>
  );
}
