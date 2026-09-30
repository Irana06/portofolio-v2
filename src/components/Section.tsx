import type { ReactNode } from "react";

/**
 * A numbered section laid out like a technical document: the number and title
 * sit in a margin column on wide screens and stack above the content on phones.
 */
export default function Section({
  id,
  number,
  title,
  children,
  spacing = "py-14 md:py-20",
}: {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
  spacing?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`border-t border-rule ${spacing}`}>
      <div className="page grid gap-6 md:grid-cols-[10rem_1fr] md:gap-12">
        <header>
          <p className="meta">§ {number}</p>
          <h2 id={`${id}-title`} className="mt-1 text-2xl font-medium leading-tight md:text-[1.7rem]">
            {title}
          </h2>
        </header>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
