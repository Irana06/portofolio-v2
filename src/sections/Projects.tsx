import { ArrowUpRight } from "lucide-react";
import { projects } from "../data/portfolio";
import type { ProjectStatus } from "../data/types";
import { Method, Reveal, SectionHeader } from "../components/ui";

const STATUS: Record<ProjectStatus, { code: string; text: string; className: string }> = {
  live: { code: "200", text: "LIVE", className: "text-accent border-accent/30 bg-accent/10" },
  "in-progress": { code: "202", text: "IN PROGRESS", className: "text-warn border-warn/30 bg-warn/10" },
  archived: { code: "410", text: "ARCHIVED", className: "text-muted border-line bg-raised" },
};

export default function Projects() {
  return (
    <section id="projects" className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeader
          index="03"
          method="GET"
          path="/projects"
          title="Selected projects"
          description="Systems I've designed and built — the data model, the business logic, and the API that ties them together."
        />

        <div className="space-y-6">
          {projects.map((p, i) => {
            const s = STATUS[p.status];
            return (
              <Reveal key={p.slug}>
                <article className="panel group grid overflow-hidden transition-colors hover:border-faint/60 lg:grid-cols-[1.5fr_1fr]">
                  <div className="flex flex-col p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <Method>GET</Method>
                      <span className="font-mono text-xs text-muted">/projects/{p.slug}</span>
                      <span className={`ml-auto rounded border px-2 py-0.5 font-mono text-[10px] tracking-wider ${s.className}`}>
                        {s.code} {s.text}
                      </span>
                    </div>

                    <div className="mt-6 flex items-baseline gap-3">
                      <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="text-2xl font-semibold tracking-tight text-ink">{p.name}</h3>
                      <span className="font-mono text-xs text-faint">{p.year}</span>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.summary}</p>

                    <ul className="mt-5 space-y-2">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex gap-3 text-sm leading-relaxed text-ink/85">
                          <span className="mt-[2px] font-mono text-accent">→</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    {p.metrics && p.metrics.length > 0 && (
                      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                        {p.metrics.map((m) => (
                          <div key={m.label}>
                            <dt className="label">{m.label}</dt>
                            <dd className="mt-1 font-mono text-lg text-ink">{m.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
                      {p.stack.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                      {p.links && p.links.length > 0 && (
                        <span className="ml-auto flex gap-4">
                          {p.links.map((l) => (
                            <a
                              key={l.href}
                              href={l.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-xs text-accent hover:underline"
                            >
                              {l.label} <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>

                  {p.image ? (
                    <div className="relative hidden border-l border-line bg-raised lg:block">
                      <img
                        src={p.image}
                        alt={`${p.name} screenshot`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover object-top opacity-70 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-surface/60 to-transparent" />
                    </div>
                  ) : (
                    <div className="hidden border-l border-line bg-raised/40 lg:block" />
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
