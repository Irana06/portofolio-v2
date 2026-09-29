import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { certificates } from "../data/portfolio";
import type { Certificate } from "../data/types";
import { Reveal, SectionHeader, Window } from "../components/ui";

function Preview({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={cert.name}
      onClick={onClose}
    >
      <div className="panel w-full max-w-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
          <span className="truncate font-mono text-xs text-muted">{cert.name}</span>
          <button type="button" onClick={onClose} className="rounded p-1 text-muted hover:bg-raised hover:text-ink" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        {cert.image && <img src={cert.image} alt={cert.name} className="max-h-[70vh] w-full bg-white object-contain" />}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 font-mono text-xs">
          <span className="text-faint">
            {cert.issuer} · {cert.date}
          </span>
          {cert.file && (
            <a href={cert.file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
              open pdf <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Certificates() {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeader
          index="05"
          method="SELECT"
          path="* FROM certifications"
          title="Certifications"
          description="Courses, bootcamps, and programs I've completed. Select a row to preview the certificate."
        />

        <Reveal>
          <Window title="psql — portfolio" meta="read-only" bodyClassName="">
            <div className="border-b border-line px-5 py-4 font-mono text-[13px]">
              <span className="text-accent">portfolio=#</span>{" "}
              <span className="tok-bool">SELECT</span> <span className="text-ink">issued_at, name, issuer, category</span>{" "}
              <span className="tok-bool">FROM</span> <span className="text-ink">certifications</span>{" "}
              <span className="tok-bool">ORDER BY</span> <span className="text-ink">issued_at</span>{" "}
              <span className="tok-bool">DESC</span>
              <span className="text-faint">;</span>
            </div>

            {/* Table — md and up */}
            <table className="hidden w-full text-left md:table">
              <thead>
                <tr className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-faint">
                  <th className="px-5 py-3 font-normal">issued_at</th>
                  <th className="px-5 py-3 font-normal">name</th>
                  <th className="px-5 py-3 font-normal">issuer</th>
                  <th className="px-5 py-3 font-normal">category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {certificates.map((c) => (
                  <tr
                    key={c.name}
                    tabIndex={0}
                    onClick={() => setSelected(c)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSelected(c))}
                    className="cursor-pointer align-top transition-colors hover:bg-raised/60 focus-visible:bg-raised/60"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-muted">{c.date}</td>
                    <td className="px-5 py-4 text-sm text-ink">{c.name}</td>
                    <td className="px-5 py-4 text-sm text-muted">{c.issuer}</td>
                    <td className="px-5 py-4">
                      <span className="chip">{c.category}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Stacked rows — mobile */}
            <ul className="divide-y divide-line md:hidden">
              {certificates.map((c) => (
                <li key={c.name}>
                  <button type="button" onClick={() => setSelected(c)} className="w-full px-5 py-4 text-left hover:bg-raised/60">
                    <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-faint">
                      <span>{c.date}</span>
                      <span className="chip">{c.category}</span>
                    </div>
                    <div className="mt-2 text-sm text-ink">{c.name}</div>
                    <div className="mt-1 text-xs text-muted">{c.issuer}</div>
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-line px-5 py-3 font-mono text-xs text-faint">
              ({certificates.length} rows)
            </div>
          </Window>
        </Reveal>
      </div>

      {selected && <Preview cert={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
