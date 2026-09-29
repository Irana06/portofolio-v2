import { stack } from "../data/portfolio";
import type { Level } from "../data/types";
import { Reveal, SectionHeader } from "../components/ui";

const LEVELS: Record<Level, { bars: number; label: string; color: string }> = {
  daily: { bars: 4, label: "daily", color: "bg-accent" },
  proficient: { bars: 3, label: "proficient", color: "bg-info" },
  familiar: { bars: 2, label: "familiar", color: "bg-warn" },
  learning: { bars: 1, label: "learning", color: "bg-violet" },
};

function LevelBar({ level }: { level: Level }) {
  const l = LEVELS[level];
  return (
    <span className="flex items-center gap-1" title={l.label} aria-label={l.label}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={`h-2.5 w-1.5 rounded-sm ${i < l.bars ? l.color : "bg-line"}`} />
      ))}
    </span>
  );
}

export default function Stack() {
  return (
    <section id="stack" className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeader
          index="02"
          method="GET"
          path="/stack"
          title="Tech stack"
          description="The tools I reach for when building and running backend systems — grouped by layer, rated by how often I actually use them."
        />

        <Reveal className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="label">stack.yaml</span>
          {(Object.keys(LEVELS) as Level[]).map((k) => (
            <span key={k} className="flex items-center gap-2 font-mono text-[11px] text-muted">
              <LevelBar level={k} /> {k}
            </span>
          ))}
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((group, gi) => (
            <Reveal key={group.key} delay={gi * 60} className="panel p-6 transition-colors hover:border-faint/60">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-mono text-sm">
                  <span className="tok-key">{group.key}</span>
                  <span className="text-faint">:</span>
                </h3>
                <span className="text-xs text-faint">{group.label}</span>
              </div>
              <ul className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <li key={item.name} className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[13px] text-ink/90">
                      <span className="text-faint">- </span>
                      {item.name}
                    </span>
                    <LevelBar level={item.level} />
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
