import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { RichTextValue } from "@/lib/sanity";

const headingClass = "font-display text-2xl font-bold text-ink sm:text-3xl";

function TextLink({ href, children }: { href?: string; children: ReactNode }) {
  const className = "font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent";
  if (href?.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...(href?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}
    </a>
  );
}

const components: PortableTextComponents = {
  block: {
    // pre-line: Zeilenumbrüche innerhalb eines Absatzes bleiben sichtbar
    normal: ({ children }) => <p className="whitespace-pre-line">{children}</p>,
    h3: ({ children }) => <h3 className={`${headingClass} mt-4`}>{children}</h3>,
    h2: ({ children }) => <h2 className={`${headingClass} mt-6 sm:text-4xl`}>{children}</h2>,
  },
  list: {
    bullet: ({ children }) => <ul className="flex flex-col gap-2 pl-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <Bullet>{children}</Bullet>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ children, value }) => <TextLink href={value?.href}>{children}</TextLink>,
  },
};

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-2.5 size-2 shrink-0 rounded-full bg-accent" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

// Links im reinen Text: [Text](https://…)
function inline(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    return m ? (
      <TextLink key={i} href={m[2]}>
        {m[1]}
      </TextLink>
    ) : (
      part
    );
  });
}

// Zeigt Texte mit Formatierung aus dem Studio – oder reinen Text (Platzhalter): «## » Zwischentitel, «- » Aufzählung
export function RichText({ value, className = "" }: { value?: RichTextValue | null; className?: string }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  if (typeof value === "string") {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        {value.split(/\n{2,}/).map((paragraph, i) => {
          const lines = paragraph.split("\n");
          const heading = lines[0].startsWith("## ") ? lines.shift()!.slice(3) : null;
          const bullets = lines.filter((l) => l.startsWith("- "));
          const plain = lines.filter((l) => !l.startsWith("- "));
          return (
            <div key={i} className="flex flex-col gap-3">
              {heading && <h3 className={`${headingClass} ${i > 0 ? "mt-4" : ""}`}>{heading}</h3>}
              {plain.length > 0 && <p className="whitespace-pre-line">{inline(plain.join("\n"))}</p>}
              {bullets.length > 0 && (
                <ul className="flex flex-col gap-2 pl-1">
                  {bullets.map((b, j) => (
                    <Bullet key={j}>{inline(b.slice(2))}</Bullet>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
