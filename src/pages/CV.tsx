import { useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { certificates, education, experience, languages, profile, projects, socials, stack } from "../data/portfolio";
import { formatYm } from "../lib/format";

function Heading({ children }: { children: string }) {
  return (
    <h2 className="mb-4 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
      {children}
      <span className="h-px flex-1 bg-neutral-200" />
    </h2>
  );
}

export default function CV() {
  useEffect(() => {
    const prev = document.title;
    document.title = `${profile.name} — CV`;
    return () => {
      document.title = prev;
    };
  }, []);

  const links = socials.filter((s) => s.icon === "github" || s.icon === "linkedin");

  return (
    <div className="min-h-screen bg-neutral-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-[52rem] items-center justify-between px-4 print:hidden">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs text-neutral-600 hover:text-neutral-900">
          <ArrowLeft className="h-4 w-4" /> back to portfolio
        </Link>
        <div className="flex gap-2">
          <a
            href={profile.cvFile}
            download="Yusuf-Novandra-CV.pdf"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-1.5 font-mono text-xs text-neutral-700 hover:bg-neutral-50"
          >
            <Download className="h-3.5 w-3.5" /> pdf
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-3 py-1.5 font-mono text-xs text-white hover:bg-neutral-700"
          >
            <Printer className="h-3.5 w-3.5" /> print
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-[52rem] bg-white px-8 py-10 text-neutral-800 shadow-sm ring-1 ring-neutral-200 sm:px-12 print:max-w-none print:px-0 print:py-0 print:shadow-none print:ring-0">
        <header className="flex flex-col-reverse gap-6 border-b border-neutral-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">{profile.fullName}</h1>
            <p className="mt-1 font-mono text-sm text-emerald-700">{profile.role}</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-neutral-600">
              <li>{profile.email}</li>
              <li>{profile.phone}</li>
              <li>{profile.location}</li>
              <li>{profile.domain}</li>
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:underline">
                    {l.href.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <img src={profile.photoCv} alt={profile.name} className="h-24 w-24 rounded-lg object-cover ring-1 ring-neutral-200" />
        </header>

        <section className="mt-8">
          <Heading>Summary</Heading>
          <div className="space-y-3 text-[14px] leading-relaxed text-neutral-700">
            {profile.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <Heading>Skills</Heading>
          <dl className="grid gap-x-8 gap-y-2 text-[13px] sm:grid-cols-2">
            {stack.map((g) => (
              <div key={g.key} className="flex gap-3">
                <dt className="w-36 shrink-0 font-medium text-neutral-900">{g.label}</dt>
                <dd className="text-neutral-600">{g.items.map((i) => i.name).join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-8 break-inside-avoid">
          <Heading>Experience</Heading>
          <div className="space-y-6">
            {experience.map((e) => (
              <div key={`${e.company}-${e.start}`} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="font-semibold text-neutral-900">{e.role}</span>
                    <span className="text-neutral-500"> — {e.company}, {e.location}</span>
                  </div>
                  <span className="font-mono text-xs text-neutral-500">
                    {formatYm(e.start)} – {formatYm(e.end)}
                  </span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[13.5px] leading-relaxed text-neutral-700 marker:text-neutral-400">
                  {e.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <Heading>Projects</Heading>
          <div className="space-y-5">
            {projects.map((p) => (
              <div key={p.slug} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold text-neutral-900">{p.name}</span>
                  <span className="font-mono text-xs text-neutral-500">{p.stack.join(" · ")}</span>
                </div>
                <p className="mt-1 text-[13.5px] text-neutral-700">{p.summary}</p>
                <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[13px] text-neutral-600 marker:text-neutral-400">
                  {p.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <section className="break-inside-avoid">
            <Heading>Education</Heading>
            <div className="space-y-3 text-[13px]">
              {education.map((ed) => (
                <div key={ed.school}>
                  <div className="font-medium text-neutral-900">{ed.degree}</div>
                  <div className="text-neutral-600">
                    {ed.school} · <span className="font-mono text-xs">{ed.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="break-inside-avoid">
            <Heading>Languages</Heading>
            <div className="space-y-1 text-[13px]">
              {languages.map((l) => (
                <div key={l.name} className="flex justify-between">
                  <span className="font-medium text-neutral-900">{l.name}</span>
                  <span className="text-neutral-600">{l.level}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 break-inside-avoid">
          <Heading>Certifications</Heading>
          <ul className="space-y-2 text-[13px]">
            {certificates.map((c) => (
              <li key={c.name} className="flex flex-wrap justify-between gap-2">
                <span>
                  <span className="text-neutral-900">{c.name}</span>
                  <span className="text-neutral-500"> — {c.issuer}</span>
                </span>
                <span className="font-mono text-xs text-neutral-500">{formatYm(c.date)}</span>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
