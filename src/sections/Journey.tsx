import { useLayoutEffect, useRef, useState } from "react";
import { journey } from "../data/journey";
import { gsap } from "../lib/gsap";

/**
 * One request followed through the stack. On wide screens the section pins and
 * scrolling moves the request sideways through each layer, with a rail showing
 * which layer it is in. On phones, and with reduced motion, it is a plain list.
 */
export default function Journey() {
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const last = journey.length - 1;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;
      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin.current,
          start: "top top+=72", // below the sticky header
          pin: true,
          scrub: 0.8,
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(dot.current, { left: `${self.progress * 100}%` });
            setActive(Math.round(self.progress * last));
          },
        },
      });
    });
    return () => mm.revert();
  }, [last]);

  return (
    <section id="journey" aria-labelledby="journey-title" className="border-t border-rule">
      <div ref={pin} className="overflow-hidden py-16 md:py-24 lg:flex lg:min-h-[calc(100vh-72px)] lg:flex-col lg:justify-center lg:py-10">
        <div className="page grid gap-6 md:grid-cols-[11rem_1fr] md:gap-12 xl:grid-cols-[15rem_1fr] xl:gap-20">
          <header>
            <p className="font-mono text-[13px] text-accent">§ 2</p>
            <h2 id="journey-title" className="mt-1 text-2xl font-medium leading-tight md:text-[1.7rem]">
              Inside a request
            </h2>
          </header>
          <div>
            <p className="prose-measure text-lg">
              One tournament registration, from the form to the database and back, the way I build it in Laravel.
            </p>
            <p className="mt-2 font-mono text-[12px] text-muted">illustrative code, modelled on Badmintoon Portal</p>

            {/* Rail: which layer the request is in. Only meaningful while the section is pinned. */}
            <div className="relative mt-8 hidden lg:block" aria-hidden>
              <div className="h-px w-full bg-rule" />
              <span ref={dot} className="absolute -top-[5px] left-0 h-[11px] w-[11px] -translate-x-1/2 rounded-full bg-accent" />
              <ol className="mt-3 flex justify-between font-mono text-[11px]">
                {journey.map((s, i) => (
                  <li key={s.layer} className={`transition-colors ${i === active ? "text-accent" : "text-muted"}`}>
                    {s.layer}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <ol ref={track} className="page mt-10 flex flex-col gap-5 lg:mt-12 lg:w-max lg:flex-row lg:gap-6">
          {journey.map((s, i) => (
            <li
              key={s.layer}
              className={`flex flex-col rounded-md border bg-raised p-5 transition-colors duration-300 lg:w-[30rem] lg:p-6 ${
                i === active ? "lg:border-accent" : ""
              } border-rule`}
            >
              <p className="font-mono text-[12px] text-muted">
                <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> · {s.layer}
              </p>
              <h3 className="mt-2 text-xl font-medium">{s.title}</h3>
              <p className="mt-2 text-[15.5px] leading-relaxed text-muted">{s.body}</p>
              <pre className="mt-4 overflow-x-auto rounded-sm bg-term-bg p-4 font-mono text-[12.5px] leading-relaxed text-term-ink">
                <code>{s.code}</code>
              </pre>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
