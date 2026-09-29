import { useEffect, useState } from "react";
import { certificates, experience, profile, projects, stack } from "../data/portfolio";
import { totalYears } from "../lib/format";
import { Reveal, SectionHeader, Window } from "../components/ui";

function useLocalTime(timeZone: string) {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);
  return time;
}

export default function About() {
  const time = useLocalTime(profile.timezone);
  const current = experience.find((e) => e.end === null);
  const db = stack.find((g) => g.key === "data")?.items[0]?.name ?? "—";

  const metrics = [
    { label: "experience", value: `${totalYears(experience)}`, unit: "yrs" },
    { label: "projects", value: String(projects.length).padStart(2, "0"), unit: "shipped" },
    { label: "certifications", value: String(certificates.length).padStart(2, "0"), unit: "earned" },
    { label: "primary db", value: db, unit: "" },
  ];

  return (
    <section id="about" className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeader
          index="01"
          method="CAT"
          path="README.md"
          title="About"
          description="Full-stack by training, backend by choice."
        />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="min-w-0">
            <Window title="README.md" meta="markdown" bodyClassName="p-6 md:p-8">
              <p className="font-mono text-sm text-faint">
                <span className="text-accent">#</span> {profile.fullName}
              </p>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted">
                {profile.about.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <p className="mt-8 font-mono text-sm text-faint">
                <span className="text-accent">##</span> currently exploring
              </p>
              <ul className="mt-3 space-y-2">
                {profile.currentlyExploring.map((x) => (
                  <li key={x} className="flex items-start gap-3 font-mono text-[13px] text-ink/90">
                    <span className="text-faint">- [ ]</span>
                    {x}
                  </li>
                ))}
              </ul>
            </Window>
          </Reveal>

          <Reveal delay={120} className="flex min-w-0 flex-col gap-6">
            <div className="panel p-5">
              <div className="flex items-center justify-between">
                <span className="label">metrics</span>
                <span className="font-mono text-[11px] text-faint">auto-computed</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line">
                {metrics.map((m) => (
                  <div key={m.label} className="bg-surface p-4">
                    <div className="label !normal-case !tracking-normal">{m.label}</div>
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="font-mono text-2xl text-ink">{m.value}</span>
                      {m.unit && <span className="font-mono text-[11px] text-faint">{m.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel divide-y divide-line font-mono text-[13px]">
              {[
                { k: "role", v: profile.role },
                { k: "currently", v: current ? `${current.role} @ ${current.company}` : "open to opportunities" },
                { k: "location", v: profile.location },
                { k: "local_time", v: `${time} WIB` },
              ].map((row) => (
                <div key={row.k} className="flex items-start justify-between gap-4 px-5 py-3">
                  <span className="text-faint">{row.k}</span>
                  <span className="min-w-0 break-words text-right text-ink/90">{row.v}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
