// Bilder kommen vom Sanity-CDN, das Grösse und Format selbst anpasst
export default function sanityImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;
  const url = new URL(src);
  const w = Number(url.searchParams.get("w"));
  const h = Number(url.searchParams.get("h"));
  // Zugeschnittene Bilder (imageUrl mit crop): Seitenverhältnis und Bildausschnitt aus dem Studio behalten
  if (url.searchParams.get("fit") === "crop" && w && h) {
    url.searchParams.set("h", String(Math.round((width * h) / w)));
  } else {
    url.searchParams.set("fit", "max");
  }
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality || 80));
  url.searchParams.set("auto", "format");
  return url.toString();
}
