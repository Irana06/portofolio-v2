import { projects } from "../data/portfolio";
import Section from "../components/Section";

const STATUS_LABEL = { "in-progress": "In progress", finished: "Finished" } as const;

export default function Projects() {
  if (projects.length === 0) return null;

  return (
    <Section id="projects" number={1} title="Projects" spacing="py-16 md:py-24">
      <div className="divide-y divide-rule">
        {projects.map((p) => (
          <article key={p.slug} className="grid gap-6 py-10 first:pt-0 last:pb-0 lg:grid-cols-[1fr_17rem] lg:gap-10">
            <div>
              <h3 className="text-[1.6rem] font-medium leading-snug">{p.name}</h3>
              <p className="meta mt-1">
                {p.year} · {STATUS_LABEL[p.status]}
              </p>
              <p className="mt-4">{p.summary}</p>

              <p className="mt-5 font-sans text-sm font-medium">What I built</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-muted">
                {p.work.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>

              <p className="meta mt-5">Built with {p.stack.join(", ")}</p>

              {p.links && p.links.length > 0 && (
                <p className="mt-3 flex flex-wrap gap-x-5 font-sans text-sm">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  ))}
                </p>
              )}
            </div>

            {p.image && (
              <figure>
                <img
                  src={p.image}
                  alt={`Screenshot of ${p.name}`}
                  loading="lazy"
                  className="w-full rounded-sm border border-rule"
                />
                <figcaption className="meta mt-2">{p.name}, screenshot</figcaption>
              </figure>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
