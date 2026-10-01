import { deployment, profile, skills } from "../data/portfolio";
import ArchDiagram from "../components/ArchDiagram";
import Section from "../components/Section";

export default function Skills() {
  return (
    <Section id="skills" number={3} title="Skills and deployment" spacing="py-12 md:py-16">
      <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {skills.map((g) => (
          <div key={g.label}>
            <dt className="font-sans text-sm font-medium">{g.label}</dt>
            <dd className="mt-1 font-mono text-[14px] leading-relaxed">{g.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
      {profile.learning.length > 0 && (
        <p className="mt-8 text-muted">Currently learning: {profile.learning.join(", ")}.</p>
      )}

      <div className="mt-12 grid gap-8 border-t border-rule pt-10 lg:grid-cols-[1fr_20rem] lg:gap-12">
        <div>
          <p className="font-mono text-[13px] text-muted">deployment · {deployment.status}</p>
          <h3 className="mt-1 text-xl font-medium">{deployment.title}</h3>
          <p className="mt-3">{deployment.summary}</p>
        </div>
        <figure>
          <ArchDiagram diagram={deployment.diagram} name={deployment.title} />
          <figcaption className="mt-2 font-mono text-[12px] text-muted">how a request reaches the home server</figcaption>
        </figure>
      </div>
    </Section>
  );
}
