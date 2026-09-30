import { education, experience } from "../data/portfolio";
import { formatYm } from "../lib/format";
import Section from "../components/Section";

export default function Experience() {
  return (
    <Section id="experience" number={2} title="Experience">
      <ol className="space-y-10">
        {experience.map((e) => (
          <li key={`${e.company}-${e.start}`}>
            <p className="meta">
              {formatYm(e.start)} to {formatYm(e.end)} · {e.type}
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
            <p className="meta">{e.location}</p>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 marker:text-muted">
              {e.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
            <p className="meta mt-4">Worked with {e.stack.join(", ")}</p>
          </li>
        ))}
      </ol>

      <h3 className="mt-14 font-sans text-sm font-medium">Education</h3>
      <ul className="mt-3 space-y-3">
        {education.map((ed) => (
          <li key={ed.school}>
            <span>{ed.degree}</span>
            <span className="meta block">
              {ed.school} · {ed.period}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
