import { useRef, useState } from "react";
import { certificates } from "../data/portfolio";
import type { Certificate } from "../data/types";
import { formatYm } from "../lib/format";
import Section from "../components/Section";

export default function Certificates() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<Certificate | null>(null);

  if (certificates.length === 0) return null;

  const open = (c: Certificate) => {
    setCurrent(c);
    dialog.current?.showModal();
  };

  return (
    <Section id="certificates" number={4} title="Certificates">
      <ul className="divide-y divide-rule border-y border-rule">
        {certificates.map((c) => (
          <li key={c.name} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div className="min-w-0">
              <p>{c.name}</p>
              <p className="meta">
                {c.issuer} · {formatYm(c.date)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              {c.image && (
                <button type="button" onClick={() => open(c)} className="btn-plain !min-h-[40px] !px-3 !text-sm">
                  View
                </button>
              )}
              {c.file && (
                <a
                  href={c.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-plain !min-h-[40px] !px-3 !text-sm"
                  aria-label={`${c.name}, PDF`}
                >
                  PDF
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Native dialog: Escape closes it and focus returns to the button that opened it */}
      <dialog
        ref={dialog}
        onClose={() => setCurrent(null)}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        aria-labelledby="cert-dialog-title"
        className="w-[min(56rem,calc(100vw-2rem))] rounded-sm border border-rule bg-paper p-0 text-ink backdrop:bg-black/60"
      >
        {current && (
          <div>
            <div className="flex items-start justify-between gap-4 border-b border-rule p-4">
              <h3 id="cert-dialog-title" className="text-lg leading-snug">
                {current.name}
              </h3>
              <button type="button" onClick={() => dialog.current?.close()} className="btn-plain !min-h-[40px] !px-3 !text-sm">
                Close
              </button>
            </div>
            <img src={current.image} alt={`Certificate: ${current.name}`} className="max-h-[70vh] w-full bg-white object-contain" />
          </div>
        )}
      </dialog>
    </Section>
  );
}
