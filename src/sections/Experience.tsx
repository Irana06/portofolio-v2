import { ArrowUpRight } from "lucide-react";
import { education, experience } from "../data/portfolio";
import { duration, formatYm } from "../lib/format";
import { Reveal, SectionHeader, Window } from "../components/ui";

export default function Experience() {
  return (
    <section id="experience" className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeader
          index="04"
          method="TAIL"
          path="-f experience.log"
          title="Experience"
          description="Where I've worked and what I shipped there — most recent first."
        />

        <Reveal>
          <Window
            title="experience.log"
            meta={`${experience.length} entries`}
            bodyClassName="divide-y divide-line"
          >
            {experience.map((e) => {
              const active = e.end === null;
              return (
                <div key={`${e.company}-${e.start}`} className="grid gap-4 p-6 md:grid-cols-[13rem_1fr] md:gap-8 md:p-8">
                  <div className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded border px-1.5 py-px text-[10px] tracking-wider ${
                          active ? "border-accent/30 bg-accent/10 text-accent" : "border-line bg-raised text-muted"
                        }`}
                      >
                        {active ? "ACTIVE" : "DONE"}
                      </span>
                      <span className="text-faint">{duration(e.start, e.end)}</span>
                    </div>
                    <div className="mt-3 text-muted">
                      {formatYm(e.start)} <span className="text-faint">→</span> {formatYm(e.end)}
                    </div>
                    <div className="mt-1 text-faint">{e.type}</div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-ink">{e.role}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted">
                      {e.companyUrl ? (
                        <a
                          href={e.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-ink/90 hover:text-accent"
                        >
                          {e.company}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-ink/90">{e.company}</span>
                      )}
                      <span className="text-faint">·</span>
                      <span>{e.location}</span>
                    </div>

                    <ul className="mt-4 space-y-2 font-mono text-[13px] leading-relaxed">
                      {e.points.map((pt) => (
                        <li key={pt} className="flex gap-3">
                          <span className="shrink-0 text-accent/80">INFO</span>
                          <span className="text-ink/80">{pt}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {e.stack.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </Window>
        </Reveal>

        <Reveal className="mt-10">
          <div className="label mb-4">education</div>
          <div className="grid gap-4 md:grid-cols-2">
            {education.map((ed) => (
              <div key={ed.school} className="panel p-5">
                <div className="font-mono text-[11px] text-faint">{ed.period}</div>
                <div className="mt-2 font-medium text-ink">{ed.degree}</div>
                <div className="mt-1 text-sm text-muted">{ed.school}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
