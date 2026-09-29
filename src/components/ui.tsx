import { useEffect, useRef, type ReactNode } from "react";

/** Fade/slide in saat elemen masuk viewport */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** Kartu bergaya jendela editor/terminal dengan nama file di header */
export function Window({
  title,
  meta,
  children,
  className = "",
  bodyClassName = "p-5",
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={`panel overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line bg-raised/50 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex shrink-0 gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
          </span>
          <span className="truncate font-mono text-xs text-muted">{title}</span>
        </div>
        {meta && <div className="shrink-0 font-mono text-[11px] text-faint">{meta}</div>}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

const METHOD_STYLE: Record<string, string> = {
  GET: "text-accent border-accent/30 bg-accent/10",
  POST: "text-warn border-warn/30 bg-warn/10",
  SELECT: "text-info border-info/30 bg-info/10",
  TAIL: "text-violet border-violet/30 bg-violet/10",
  CAT: "text-muted border-line bg-raised",
};

export function Method({ children }: { children: string }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-px font-mono text-[10px] font-semibold tracking-wider ${
        METHOD_STYLE[children] ?? METHOD_STYLE.CAT
      }`}
    >
      {children}
    </span>
  );
}

/** Header section: nomor, "request" bergaya endpoint, judul, dan deskripsi */
export function SectionHeader({
  index,
  method,
  path,
  title,
  description,
}: {
  index: string;
  method: string;
  path: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-faint">{index}</span>
        <span className="h-px w-8 bg-line" />
        <Method>{method}</Method>
        <span className="font-mono text-xs text-muted">{path}</span>
      </div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">{title}</h2>
      {description && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{description}</p>}
    </Reveal>
  );
}

export function StatusDot({ tone = "accent" }: { tone?: "accent" | "warn" | "faint" }) {
  const color = tone === "accent" ? "bg-accent animate-pulseDot" : tone === "warn" ? "bg-warn" : "bg-faint";
  return <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${color}`} aria-hidden />;
}
