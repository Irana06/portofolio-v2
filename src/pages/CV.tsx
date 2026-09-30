import { useEffect } from "react";
import { Link } from "react-router";
import { certificates, contactLinks, education, experience, languages, profile, projects, skills } from "../data/portfolio";
import { formatYm } from "../lib/format";

function Heading({ children }: { children: string }) {
  return <h2 className="mb-3 border-b border-neutral-300 pb-1 font-sans text-sm font-medium text-neutral-700">{children}</h2>;
}

export default function CV() {
  useEffect(() => {
    const prev = document.title;
    document.title = `${profile.name}, CV`;
    return () => {
      document.title = prev;
    };
  }, []);

  const profileLinks = contactLinks.filter((l) => l.label === "GitHub" || l.label === "LinkedIn");

  return (
    <div className="min-h-screen bg-neutral-100 py-8 font-serif text-neutral-900 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-[50rem] flex-wrap items-center justify-between gap-3 px-4 font-sans text-sm print:hidden">
        <Link to="/" className="inline-flex min-h-[44px] items-center text-neutral-700">
          Back to the portfolio
        </Link>
        <div className="flex gap-2">
          <a
            href={profile.cvFile}
            download="Yusuf-Novandra-CV.pdf"
            className="inline-flex min-h-[44px] items-center rounded-sm border border-neutral-500 bg-white px-4 text-neutral-900 no-underline"
          >
            Download PDF
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[44px] rounded-sm bg-neutral-900 px-4 text-white hover:bg-neutral-700"
          >
            Print
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-[50rem] bg-white px-7 py-10 shadow-sm ring-1 ring-neutral-200 sm:px-12 print:max-w-none print:px-0 print:py-0 print:shadow-none print:ring-0">
        <header className="flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-medium">{profile.fullName}</h1>
            <p className="mt-1 text-lg text-neutral-700">
              {profile.role}, {profile.location}
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-sans text-[13px] text-neutral-700">
              <li>{profile.email}</li>
              <li>{profile.phone}</li>
              <li>{profile.website}</li>
              {profileLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.href.replace(/^https?:\/\/(www\.)?/, "")}</a>
                </li>
              ))}
            </ul>
          </div>
          <img src={profile.photoCv} alt={profile.name} className="h-24 w-24 rounded-sm object-cover" />
        </header>

        <section className="mt-8">
          <Heading>Summary</Heading>
          <p className="text-[15px] leading-relaxed">{profile.intro}</p>
        </section>

        <section className="mt-7">
          <Heading>Experience</Heading>
          <div className="space-y-5">
            {experience.map((e) => (
              <div key={`${e.company}-${e.start}`} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="font-medium">
                    {e.role}, {e.company}
                  </p>
                  <p className="font-sans text-xs text-neutral-600">
                    {formatYm(e.start)} to {formatYm(e.end)}
                  </p>
                </div>
                <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[14.5px] leading-relaxed">
                  {e.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <Heading>Projects</Heading>
          <div className="space-y-5">
            {projects.map((p) => (
              <div key={p.slug} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="font-medium">{p.name}</p>
                  <p className="font-sans text-xs text-neutral-600">{p.stack.join(", ")}</p>
                </div>
                <p className="mt-1 text-[14.5px]">{p.summary}</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[14px]">
                  {p.work.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7 break-inside-avoid">
          <Heading>Skills</Heading>
          <dl className="grid gap-x-8 gap-y-1.5 text-[14px] sm:grid-cols-2">
            {skills.map((g) => (
              <div key={g.label}>
                <dt className="inline font-medium">{g.label}: </dt>
                <dd className="inline">{g.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-7 grid gap-7 sm:grid-cols-2">
          <section className="break-inside-avoid">
            <Heading>Education</Heading>
            <ul className="space-y-2 text-[14px]">
              {education.map((ed) => (
                <li key={ed.school}>
                  <p className="font-medium">{ed.degree}</p>
                  <p className="text-neutral-700">
                    {ed.school}, {ed.period}
                  </p>
                </li>
              ))}
            </ul>
          </section>
          <section className="break-inside-avoid">
            <Heading>Languages</Heading>
            <ul className="space-y-1 text-[14px]">
              {languages.map((l) => (
                <li key={l.name}>
                  <span className="font-medium">{l.name}</span>: {l.level}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-7 break-inside-avoid">
          <Heading>Certificates</Heading>
          <ul className="space-y-1.5 text-[14px]">
            {certificates.map((c) => (
              <li key={c.name}>
                {c.name}. <span className="text-neutral-700">{c.issuer}, {formatYm(c.date)}.</span>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
