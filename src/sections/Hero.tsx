import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { experience, profile, projects, stack } from "../data/portfolio";
import { totalYears } from "../lib/format";
import { StatusDot, Window } from "../components/ui";

type Tok = { t: "key" | "str" | "num" | "bool" | "punct" | "sp"; v: string };
type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/** Ubah objek jadi baris-baris token untuk syntax highlighting */
function toLines(value: Json, indent = 0, key?: string, last = true): Tok[][] {
  const pad: Tok = { t: "sp", v: "  ".repeat(indent) };
  const head: Tok[] = key !== undefined ? [pad, { t: "key", v: `"${key}"` }, { t: "punct", v: ": " }] : [pad];
  const comma: Tok[] = last ? [] : [{ t: "punct", v: "," }];

  if (Array.isArray(value)) {
    const inline = value.every((v) => typeof v !== "object" || v === null);
    if (inline) {
      const items: Tok[] = [];
      value.forEach((v, i) => {
        items.push(...scalar(v));
        if (i < value.length - 1) items.push({ t: "punct", v: ", " });
      });
      return [[...head, { t: "punct", v: "[" }, ...items, { t: "punct", v: "]" }, ...comma]];
    }
    return [
      [...head, { t: "punct", v: "[" }],
      ...value.flatMap((v, i) => toLines(v, indent + 1, undefined, i === value.length - 1)),
      [pad, { t: "punct", v: "]" }, ...comma],
    ];
  }
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value);
    return [
      [...head, { t: "punct", v: "{" }],
      ...entries.flatMap(([k, v], i) => toLines(v, indent + 1, k, i === entries.length - 1)),
      [pad, { t: "punct", v: "}" }, ...comma],
    ];
  }
  return [[...head, ...scalar(value), ...comma]];
}

function scalar(v: Json): Tok[] {
  if (typeof v === "string") return [{ t: "str", v: `"${v}"` }];
  if (typeof v === "number") return [{ t: "num", v: String(v) }];
  return [{ t: "bool", v: String(v) }];
}

const TOK_CLASS: Record<Tok["t"], string> = {
  key: "tok-key",
  str: "tok-str",
  num: "tok-num",
  bool: "tok-bool",
  punct: "tok-punct",
  sp: "",
};

export default function Hero() {
  const command = `curl -s https://${profile.domain}/api/v1/me | jq`;

  const lines = useMemo(() => {
    const primary = stack.flatMap((g) => g.items).filter((i) => i.level === "daily").map((i) => i.name);
    const body: Json = {
      name: profile.name,
      role: profile.role,
      location: profile.location.split(" — ")[0],
      experience_years: totalYears(experience),
      primary_stack: primary.slice(0, 3),
      projects_shipped: projects.length,
      open_to_work: profile.available,
      contact: profile.email,
    };
    return toLines(body);
  }, []);

  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [typed, setTyped] = useState(reduce ? command.length : 0);
  const [shown, setShown] = useState(reduce ? lines.length : 0);

  useEffect(() => {
    if (typed < command.length) {
      const t = setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 500 : 28);
      return () => clearTimeout(t);
    }
    if (shown < lines.length) {
      const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 350 : 55);
      return () => clearTimeout(t);
    }
  }, [typed, shown, command.length, lines.length]);

  const done = shown >= lines.length;

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-3xl"
        aria-hidden
      />

      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 font-mono text-[11px] text-muted">
            <StatusDot tone={profile.available ? "accent" : "faint"} />
            {profile.available ? "available for backend roles" : "currently not looking"}
            <span className="hidden text-faint sm:inline">·</span>
            <span className="hidden sm:inline">{profile.location.split(" — ")[0]}</span>
          </div>

          <p className="mt-8 font-mono text-sm text-accent">// {profile.role.toLowerCase()}</p>
          <h1 className="mt-3 text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{profile.tagline}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="btn-primary">
              view projects <ArrowRight className="h-4 w-4" />
            </a>
            <a href={profile.cvFile} download="Yusuf-Novandra-CV.pdf" className="btn-ghost">
              <Download className="h-4 w-4" /> download cv
            </a>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              { k: "exp", v: `${totalYears(experience)}+ yrs` },
              { k: "projects", v: String(projects.length).padStart(2, "0") },
              { k: "core", v: stack[1]?.items[0]?.name ?? "—" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="label">{s.k}</dt>
                <dd className="mt-1 font-mono text-lg text-ink">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Window
          title="zsh — api.request"
          meta={done ? <span className="text-accent">200 OK · 12ms</span> : "pending…"}
          className="shadow-2xl shadow-black/40"
          bodyClassName="p-5 font-mono text-[12.5px] leading-6 sm:text-[13px]"
        >
          <div className="break-all">
            <span className="text-accent">❯</span> <span className="text-ink">{command.slice(0, typed)}</span>
            {typed < command.length && (
              <span className="ml-px inline-block h-4 w-[7px] translate-y-[3px] bg-ink/80 animate-blink" />
            )}
          </div>

          <div className="mt-3 min-h-[19rem] overflow-x-auto" aria-live="off">
            {shown > 0 && (
              <div className="mb-2 text-faint">
                HTTP/2 200 <span className="text-muted">content-type:</span> application/json
              </div>
            )}
            {lines.slice(0, shown).map((line, i) => (
              <div key={i} className="whitespace-pre">
                {line.map((tk, j) => (
                  <span key={j} className={TOK_CLASS[tk.t]}>
                    {tk.v}
                  </span>
                ))}
              </div>
            ))}
            {done && (
              <div className="mt-2">
                <span className="text-accent">❯</span>{" "}
                <span className="inline-block h-4 w-[7px] translate-y-[3px] bg-ink/80 animate-blink" />
              </div>
            )}
          </div>
        </Window>
      </div>
    </section>
  );
}
