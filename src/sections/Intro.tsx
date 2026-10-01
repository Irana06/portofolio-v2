import { useLayoutEffect, useRef } from "react";
import { profile } from "../data/portfolio";
import { gsap } from "../lib/gsap";
import Terminal from "../components/Terminal";

export default function Intro() {
  const root = useRef<HTMLElement>(null);

  // Entrance: the name rises letter by letter, then the rest settles in. Runs once on load.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(q("[data-char]"), { yPercent: 110, duration: 0.9, stagger: 0.035 })
        .from(q("[data-rise]"), { opacity: 0, y: 18, duration: 0.7, stagger: 0.08 }, "-=0.55")
        .from(q("[data-terminal]"), { opacity: 0, y: 24, duration: 0.8 }, "-=0.6");
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="page grid gap-10 pb-16 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-16 lg:pb-28 lg:pt-16 xl:gap-x-24"
    >
      <div className="lg:col-start-1 lg:row-start-1">
        <div data-rise className="flex items-center gap-4">
          <img src={profile.portrait} alt={`Portrait of ${profile.name}`} className="h-14 w-14 rounded-sm object-cover" />
          <p className="font-mono text-[13px] text-muted">
            {profile.role.toLowerCase()}
            <br />
            {profile.location}
          </p>
        </div>

        <h1
          aria-label={profile.name}
          className="mt-7 text-[clamp(2.8rem,8vw,6.2rem)] font-medium leading-[0.98] tracking-[-0.015em]"
        >
          {profile.name.split(" ").map((word, w) => (
            <span key={word} aria-hidden className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
              {[...word].map((ch, i) => (
                <span key={`${w}-${i}`} data-char className="inline-block">
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p data-rise className="prose-measure mt-6 text-xl leading-relaxed lg:text-[1.35rem]">
          {profile.intro}
        </p>
      </div>

      <div data-terminal className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
        <Terminal />
      </div>

      <div className="lg:col-start-1 lg:row-start-2">
        <div data-rise className="prose-measure space-y-3 text-muted">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {profile.availability && (
          <p data-rise className="mt-5 font-medium">
            {profile.availability}
          </p>
        )}

        <div data-rise className="mt-8 flex flex-wrap gap-3">
          <a href={`mailto:${profile.email}`} className="btn-primary">
            Email me
          </a>
          <a href="/cv" className="btn-plain">
            Read the CV
          </a>
        </div>
      </div>
    </section>
  );
}
