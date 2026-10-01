import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "../lib/gsap";

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
  const head = useRef<HTMLElement>(null);

  // The section number and title slide up once as the section arrives.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(head.current!.children, {
        yPercent: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: head.current, start: "top 85%", once: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`border-t border-rule ${spacing}`}>
      <div className="page grid gap-6 md:grid-cols-[11rem_1fr] md:gap-12 xl:grid-cols-[15rem_1fr] xl:gap-20">
        <header ref={head} className="self-start overflow-hidden md:sticky md:top-24">
          <p className="font-mono text-[13px] text-accent">§ {number}</p>
          <h2 id={`${id}-title`} className="mt-1 text-2xl font-medium leading-tight md:text-[1.7rem]">
            {title}
          </h2>
        </header>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
