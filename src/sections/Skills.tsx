import { useLayoutEffect, useRef, useState } from "react";
import { deployment, experience, profile, projects, skills } from "../data/portfolio";
import { formatYm } from "../lib/format";
import { gsap } from "../lib/gsap";
import ArchDiagram from "../components/ArchDiagram";
import Section from "../components/Section";

const norm = (s: string) => s.toLowerCase().replace(/\.js$/, "").trim();

/** Where a skill shows up in the real data: project stacks and job stacks. */
function usage(skill: string) {
  // "Payment gateway (Midtrans)" should also match a stack entry that just says "Midtrans".
  const alias = skill.match(/\(([^)]+)\)$/)?.[1];
  const keys = [norm(skill), ...(alias ? [norm(alias)] : [])];
  const uses = (stack: string[]) => stack.some((s) => keys.includes(norm(s)));
  return {
    projects: projects.filter((p) => uses(p.stack)),
    jobs: experience.filter((e) => uses(e.stack)),
  };
}

export default function Skills() {
  const [selected, setSelected] = useState(skills.find((g) => g.items.includes("Laravel")) ? "Laravel" : skills[0].items[0]);
  const panel = useRef<HTMLDivElement>(null);
  const used = usage(selected);

  // Fade the usage list in when the selection changes, so the change is noticed.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        panel.current!.querySelectorAll("[data-use]"),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" },
      );
    });
    return () => mm.revert();
  }, [selected]);

  return (
    <Section id="skills" number={3} title="Skills and deployment" spacing="py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_26rem] xl:gap-20">
        <div>
          <p className="prose-measure text-muted">Pick a skill to see where I've used it.</p>
          <div className="mt-6 space-y-6">
            {skills.map((g) => (
              <div key={g.label}>
                <p className="font-sans text-sm font-medium">{g.label}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelected(item)}
                      aria-pressed={selected === item}
                      className={`min-h-[44px] rounded-sm border px-3 font-mono text-[13px] transition-colors ${
                        selected === item
                          ? "border-accent bg-accent text-on-accent"
                          : "border-rule text-ink hover:border-edge"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {profile.learning.length > 0 && (
            <p className="mt-8 text-muted">Currently learning: {profile.learning.join(", ")}.</p>
          )}
        </div>

        <div ref={panel} aria-live="polite" className="self-start rounded-md border border-rule bg-raised p-5 lg:sticky lg:top-24">
          <p className="font-mono text-[12px] text-muted">where it's used</p>
          <p className="mt-1 font-mono text-lg text-accent">{selected}</p>

          {used.projects.length === 0 && used.jobs.length === 0 ? (
            <p data-use className="mt-4 text-[15px] text-muted">
              Not tied to a listed project or job yet. It's in my toolkit from day-to-day work and study.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {used.projects.map((p) => (
                <li key={p.slug} data-use>
                  <a href="#projects" className="font-medium">
                    {p.name}
                  </a>
                  <span className="block font-mono text-[12px] text-muted">project · {p.year}</span>
                </li>
              ))}
              {used.jobs.map((e) => (
                <li key={`${e.company}-${e.start}`} data-use>
                  <a href="#experience" className="font-medium">
                    {e.role}, {e.company}
                  </a>
                  <span className="block font-mono text-[12px] text-muted">
                    job · {formatYm(e.start)} to {formatYm(e.end)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-14 grid gap-8 border-t border-rule pt-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_26rem] xl:gap-20">
        <div>
          <p className="font-mono text-[13px] text-muted">deployment · {deployment.status}</p>
          <h3 className="mt-1 text-xl font-medium">{deployment.title}</h3>
          <p className="prose-measure mt-3">{deployment.summary}</p>
        </div>
        <figure>
          <ArchDiagram diagram={deployment.diagram} name={deployment.title} />
        </figure>
      </div>
    </Section>
  );
}
