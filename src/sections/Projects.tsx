import { projects } from "../data/portfolio";
import ArchDiagram from "../components/ArchDiagram";
import ParallaxImage from "../components/ParallaxImage";
import Section from "../components/Section";

const STATUS_LABEL = { "in-progress": "in progress", finished: "finished" } as const;

export default function Projects() {
  if (projects.length === 0) return null;

  return (
    <Section id="projects" number={1} title="Projects" spacing="py-16 md:py-24">
      <div className="divide-y divide-rule">
        {projects.map((p) => (
          <article key={p.slug} className="grid gap-8 py-12 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_26rem] xl:gap-20">
            <div>
              <p className="font-mono text-[13px] text-muted">
                {p.year} · {STATUS_LABEL[p.status]}
              </p>
              <h3 className="mt-1 text-[1.7rem] font-medium leading-snug">{p.name}</h3>
              <p className="prose-measure mt-4">{p.summary}</p>

              <p className="mt-6 font-sans text-sm font-medium">What I built</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-muted">
                {p.work.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>

              <p className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-sm border border-rule px-2 py-0.5 font-mono text-[12px] text-muted">
                    {s}
                  </span>
                ))}
              </p>

              {p.links && p.links.length > 0 && (
                <p className="mt-4 flex flex-wrap gap-x-5 font-sans text-sm">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center">
                      {l.label}
                    </a>
                  ))}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {p.diagram && (
                <figure>
                  <ArchDiagram diagram={p.diagram} name={p.name} />
                  <figcaption className="mt-2 font-mono text-[12px] text-muted">how a request moves through it</figcaption>
                </figure>
              )}
              {p.image && (
                <figure>
                  <ParallaxImage src={p.image} alt={`Screenshot of ${p.name}`} />
                  <figcaption className="mt-2 font-mono text-[12px] text-muted">screenshot</figcaption>
                </figure>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
