import { useLayoutEffect, useRef } from "react";
import { education, experience } from "../data/portfolio";
import { formatYm } from "../lib/format";
import { gsap } from "../lib/gsap";
import Section from "../components/Section";

export default function Experience() {
  const list = useRef<HTMLOListElement>(null);

  // The accent line fills as the reader moves through the timeline, marking where they are in it.
  useLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el.querySelector("[data-progress]"),
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: true } },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <Section id="experience" number={3} title="Experience">
      <ol ref={list} className="relative space-y-12 border-l border-rule pl-7">
        <span data-progress aria-hidden className="absolute -left-px top-0 h-full w-px origin-top bg-accent" />
        {experience.map((e) => (
          <li key={`${e.company}-${e.start}`} className="relative">
            <span aria-hidden className="absolute -left-[33px] top-2 h-2.5 w-2.5 rounded-full border border-accent bg-paper" />
            <p className="font-mono text-[13px] text-muted">
              {formatYm(e.start)} to {formatYm(e.end)} · {e.type.toLowerCase()}
            </p>
            <h3 className="mt-1 text-xl font-medium">
              {e.role},{" "}
              {e.companyUrl ? (
                <a href={e.companyUrl} target="_blank" rel="noopener noreferrer">
                  {e.company}
                </a>
              ) : (
                e.company
              )}
            </h3>
            {e.location && <p className="font-sans text-sm text-muted">{e.location}</p>}
            {(e.note || e.links?.length) && (
              <p className="mt-2 font-sans text-sm text-muted">
                {e.note}
                {e.links?.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="ml-2 text-ink">
                    {l.label}
                  </a>
                ))}
              </p>
            )}
            {e.points.length > 0 && (
              <ul className="mt-4 list-disc space-y-1.5 pl-5 marker:text-muted">
                {e.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            )}
            {e.stack.length > 0 && (
              <p className="mt-4 flex flex-wrap gap-2">
                {e.stack.map((s) => (
                  <span key={s} className="rounded-sm border border-rule px-2 py-0.5 font-mono text-[12px] text-muted">
                    {s}
                  </span>
                ))}
              </p>
            )}
          </li>
        ))}
      </ol>

      <h3 className="mt-14 font-sans text-sm font-medium">Education</h3>
      <ul className="mt-3 space-y-3">
        {education.map((ed) => (
          <li key={ed.school}>
            <span>{ed.degree}</span>
            <span className="block font-sans text-sm text-muted">
              {ed.school} · {ed.period}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
