import { profile, skills } from "../data/portfolio";
import Section from "../components/Section";

export default function Skills() {
  return (
    <Section id="skills" number={3} title="Skills and tools" spacing="py-12 md:py-16">
      <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {skills.map((g) => (
          <div key={g.label}>
            <dt className="font-sans text-sm font-medium">{g.label}</dt>
            <dd className="mt-1">{g.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
      {profile.learning.length > 0 && (
        <p className="mt-8 text-muted">Currently learning: {profile.learning.join(", ")}.</p>
      )}
    </Section>
  );
}
