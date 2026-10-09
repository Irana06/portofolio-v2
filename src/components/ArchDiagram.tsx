import { useId, useLayoutEffect, useRef, useState } from "react";
import type { Diagram, FlowStepKind } from "../data/types";
import { gsap } from "../lib/gsap";

const W = 360;
const HEAD = 28; // lane title row
const ROW = 72;
const TASK_H = 44;
const DATA_H = 46;
const EVENT_R = 11;
const GATE = 15; // half the diagonal of a decision diamond
const CHAR_W = 6.3; // approx. width of one 10.5px mono character, for wrapping labels

type Kind = NonNullable<Diagram["flows"][number]["kind"]>;

function wrap(text: string, width: number): string[] {
  const max = Math.max(4, Math.floor(width / CHAR_W));
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

/** Text lines centred vertically on y. */
function Lines({ lines, x, y, anchor, className, size = 10.5 }: { lines: string[]; x: number; y: number; anchor: "start" | "middle"; className: string; size?: number }) {
  const lh = size + 2.5;
  const top = y - ((lines.length - 1) * lh) / 2 + size * 0.35;
  return (
    <text x={x} textAnchor={anchor} className={className} fontSize={size}>
      {lines.map((l, i) => (
        <tspan key={l} x={x} y={top + i * lh}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

/**
 * A project's flow drawn BPMN-style: lanes as columns with the app's lane first,
 * a start event, tasks, decisions, data stores, and an end event. The flow draws
 * itself in order as the reader scrolls.
 */
export default function ArchDiagram({ diagram, name }: { diagram: Diagram; name: string }) {
  const root = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, "");
  const [active, setActive] = useState<string | null>(null);
  const [canMove, setCanMove] = useState(false);

  const laneW = W / diagram.lanes.length;
  const rows = Math.max(...diagram.steps.map((s) => s.row)) + 1;
  const H = HEAD + rows * ROW;

  // Geometry of every step: anchor x for vertical flows, and its four sides.
  const geo = Object.fromEntries(
    diagram.steps.map((s) => {
      const x0 = s.lane * laneW;
      const cx = x0 + laneW / 2;
      const cy = HEAD + s.row * ROW + ROW / 2;
      let half: number; // half width
      let halfH: number;
      let ax = cx;
      if (s.kind === "task") {
        half = laneW / 2 - 8;
        halfH = TASK_H / 2;
      } else if (s.kind === "data") {
        half = Math.min(laneW / 2 - 8, 56);
        halfH = DATA_H / 2;
      } else if (s.kind === "decision") {
        half = GATE;
        halfH = GATE;
      } else {
        // events sit at the left of their lane, label to the right
        ax = x0 + 22;
        half = EVENT_R;
        halfH = EVENT_R;
      }
      const left = ax - half;
      const right = ax + half;
      return [s.id, { ...s, x0, cx: ax, cy, ax, top: cy - halfH, bottom: cy + halfH, left, right }];
    }),
  );

  const flows = diagram.flows.map((f) => {
    const a = geo[f.from];
    const b = geo[f.to];
    const kind: Kind = f.kind ?? "sequence";
    const narrow = (k: FlowStepKind) => k === "start" || k === "end" || k === "decision";
    let pts: [number, number][];
    let lx: number;
    let ly: number;
    let la: "start" | "middle" = "middle";

    if (a.lane === b.lane) {
      // straight down the lane; use the narrower shape's x so the line stays straight
      const x = narrow(a.kind) ? a.ax : narrow(b.kind) ? b.ax : a.ax;
      const down = b.cy > a.cy;
      pts = [
        [x, down ? a.bottom : a.top],
        [x, down ? b.top : b.bottom],
      ];
      lx = x + 6;
      ly = (pts[0][1] + pts[1][1]) / 2 + 3;
      la = "start";
    } else if (a.row === b.row) {
      const toRight = b.cx > a.cx;
      pts = [
        [toRight ? a.right : a.left, a.cy],
        [toRight ? b.left : b.right, b.cy],
      ];
      lx = (pts[0][0] + pts[1][0]) / 2;
      ly = a.kind === "decision" ? a.cy + 13 : a.cy - 6;
    } else if (f.route === "hv") {
      const toRight = b.cx > a.cx;
      const down = b.cy > a.cy;
      pts = [
        [toRight ? a.right : a.left, a.cy],
        [b.ax, a.cy],
        [b.ax, down ? b.top : b.bottom],
      ];
      lx = (pts[0][0] + pts[1][0]) / 2;
      ly = a.cy - 6;
    } else {
      // down (or up) out of the source's lane first, then across into the target's side
      const toRight = b.cx > a.cx;
      const down = b.cy > a.cy;
      pts = [
        [a.ax, down ? a.bottom : a.top],
        [a.ax, b.cy],
        [toRight ? b.left : b.right, b.cy],
      ];
      lx = (pts[1][0] + pts[2][0]) / 2;
      ly = b.cy - 6;
    }

    const d = pts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
    // arrowhead along the last segment
    const [p1, p2] = [pts[pts.length - 2], pts[pts.length - 1]];
    const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) || 1;
    const ux = (p2[0] - p1[0]) / len;
    const uy = (p2[1] - p1[1]) / len;
    const back = 7;
    const side = 3.6;
    const head = `M ${p2[0]} ${p2[1]} L ${p2[0] - ux * back - uy * side} ${p2[1] - uy * back + ux * side} L ${p2[0] - ux * back + uy * side} ${p2[1] - uy * back - ux * side} Z`;
    // a label needs room: skip it on very short side-by-side links (the screen-reader text keeps it)
    const room = pts.length === 2 && pts[0][1] === pts[1][1] ? Math.abs(pts[1][0] - pts[0][0]) : Infinity;
    const label = room < 40 ? undefined : f.label;
    return { ...f, label, kind, d, head, start: pts[0], lx, ly, la };
  });

  const stepLabel = (id: string) => diagram.steps.find((s) => s.id === id)?.label;
  const description = diagram.flows
    .map((f) => `${stepLabel(f.from)} to ${stepLabel(f.to)}${f.label ? ` (${f.label})` : ""}`)
    .join(", ");

  useLayoutEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      setCanMove(true);
      const masks = gsap.utils.toArray<SVGPathElement>(svg.querySelectorAll("[data-edge-mask]"));
      const paths = gsap.utils.toArray<SVGPathElement>(svg.querySelectorAll("[data-edge]"));
      const heads = gsap.utils.toArray<SVGElement>(svg.querySelectorAll("[data-head]"));
      const labels = gsap.utils.toArray<SVGElement>(svg.querySelectorAll("[data-edge-label]"));
      const nodes = gsap.utils.toArray<SVGGElement>(svg.querySelectorAll("[data-node]"));
      const dot = svg.querySelector<SVGCircleElement>("[data-dot]");
      const first = diagram.flows[0]?.from;

      masks.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(nodes.filter((n) => n.dataset.node !== first), { opacity: 0.25 });
      gsap.set([...labels, ...heads], { opacity: 0 });
      gsap.set(dot, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 85%", end: "bottom 45%", scrub: 0.6 },
      });

      diagram.flows.forEach((f, i) => {
        const target = nodes.find((n) => n.dataset.node === f.to);
        tl.to(masks[i], { strokeDashoffset: 0, duration: 1, ease: "none" })
          .set(dot, { opacity: 1 }, "<")
          .to(dot, { duration: 1, ease: "none", motionPath: { path: paths[i], align: paths[i], alignOrigin: [0.5, 0.5] } }, "<")
          .to(svg.querySelectorAll(`[data-edge-label="${i}"]`), { opacity: 1, duration: 0.3 }, "<0.4")
          .to(heads[i], { opacity: 1, duration: 0.15 }, ">-0.15")
          .to(target ?? {}, { opacity: 1, duration: 0.3 }, "<");
      });
      tl.to(dot, { opacity: 0, duration: 0.3 });
      return () => setCanMove(false);
    });

    return () => mm.revert();
  }, [diagram]);

  /** Sends one dot through the whole flow, in order, on demand. */
  function replay() {
    const svg = root.current;
    if (!svg) return;
    const paths = gsap.utils.toArray<SVGPathElement>(svg.querySelectorAll("[data-edge]"));
    const dot = svg.querySelector<SVGCircleElement>("[data-replay-dot]");
    gsap.set(svg.querySelectorAll("[data-edge-mask]"), { strokeDashoffset: 0 });
    gsap.set(svg.querySelectorAll("[data-node],[data-edge-label],[data-head]"), { opacity: 1 });
    const tl = gsap.timeline();
    tl.set(dot, { opacity: 1 });
    paths.forEach((p, i) => {
      const id = diagram.flows[i].to;
      tl.to(dot, { duration: 0.7, ease: "power1.inOut", motionPath: { path: p, align: p, alignOrigin: [0.5, 0.5] } })
        .call(() => setActive(id))
        .to({}, { duration: 0.25 });
    });
    tl.to(dot, { opacity: 0, duration: 0.2 }).call(() => setActive(null));
  }

  const lit = (from: string, to: string) => active !== null && (from === active || to === active);
  const usedSteps = new Set(diagram.steps.map((s) => s.kind));
  const usedFlows = new Set(flows.map((f) => f.kind));

  return (
    <div className="w-full max-w-[26rem]">
      <svg ref={root} viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`Flow of ${name}: ${description}`} className="w-full font-mono">
        {/* pool and lanes */}
        <rect x={0} y={0} width={W} height={H} rx={6} className="fill-paper" />
        {diagram.lanes.map((lane, i) => (
          <g key={lane}>
            {i % 2 === 1 && <rect x={i * laneW} y={0} width={laneW} height={H} className="fill-raised" opacity={0.55} />}
            <text x={i * laneW + laneW / 2} y={18} textAnchor="middle" fontSize={10.5} className={i === 0 ? "fill-ink" : "fill-muted"}>
              {lane}
            </text>
            {i > 0 && <line x1={i * laneW} y1={0} x2={i * laneW} y2={H} className="stroke-rule" strokeDasharray="3 3" />}
          </g>
        ))}
        <line x1={0} y1={HEAD} x2={W} y2={HEAD} className="stroke-rule" />
        <rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={6} fill="none" className="stroke-rule" />

        <defs>
          {flows.map((f, i) => (
            <mask key={i} id={`${uid}-m${i}`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
              <path data-edge-mask d={f.d} fill="none" stroke="white" strokeWidth={8} />
            </mask>
          ))}
        </defs>

        {flows.map((f, i) => {
          const on = lit(f.from, f.to);
          const stroke = on ? "stroke-accent" : "stroke-edge";
          return (
            <g key={`${f.from}-${f.to}`}>
              <g mask={`url(#${uid}-m${i})`}>
                <path
                  data-edge
                  d={f.d}
                  fill="none"
                  className={`transition-[stroke] duration-200 ${stroke}`}
                  strokeWidth={on ? 2 : 1.3}
                  strokeDasharray={f.kind === "data" ? "2 3" : f.kind === "message" ? "6 4" : undefined}
                />
                {f.kind === "message" && <circle cx={f.start[0]} cy={f.start[1]} r={3} className={`fill-paper ${stroke}`} strokeWidth={1.2} />}
              </g>
              <path
                data-head
                d={f.head}
                strokeWidth={1.2}
                strokeLinejoin="round"
                className={f.kind === "sequence" ? (on ? "fill-accent stroke-accent" : "fill-edge stroke-edge") : `fill-paper ${stroke}`}
              />
              {f.label && (
                <text data-edge-label={i} x={f.lx} y={f.ly} textAnchor={f.la} className={on ? "fill-accent" : "fill-muted"} fontSize={10}>
                  {f.label}
                </text>
              )}
            </g>
          );
        })}

        {diagram.steps.map((s) => {
          const g = geo[s.id];
          const on = active === s.id;
          const stroke = on ? "stroke-accent" : "stroke-edge";
          let shape: JSX.Element;
          if (s.kind === "task") {
            shape = (
              <>
                <rect x={g.left} y={g.top} width={g.right - g.left} height={TASK_H} rx={9} className={`fill-raised transition-[stroke] duration-200 ${stroke}`} strokeWidth={on ? 2 : 1.2} />
                <Lines lines={wrap(s.label, g.right - g.left - 14)} x={g.cx} y={g.cy} anchor="middle" className="fill-ink" />
              </>
            );
          } else if (s.kind === "data") {
            const w = g.right - g.left;
            const ry = 5;
            shape = (
              <>
                <path
                  d={`M ${g.left} ${g.top + ry} A ${w / 2} ${ry} 0 0 1 ${g.right} ${g.top + ry} V ${g.bottom - ry} A ${w / 2} ${ry} 0 0 1 ${g.left} ${g.bottom - ry} Z`}
                  className={`fill-raised transition-[stroke] duration-200 ${stroke}`}
                  strokeWidth={on ? 2 : 1.2}
                />
                <path d={`M ${g.left} ${g.top + ry} A ${w / 2} ${ry} 0 0 0 ${g.right} ${g.top + ry}`} fill="none" className={stroke} strokeWidth={on ? 2 : 1.2} />
                <Lines lines={wrap(s.label, w - 10)} x={g.cx} y={g.cy + 3} anchor="middle" className="fill-ink" size={10} />
              </>
            );
          } else if (s.kind === "decision") {
            shape = (
              <>
                <path
                  d={`M ${g.cx} ${g.top} L ${g.right} ${g.cy} L ${g.cx} ${g.bottom} L ${g.left} ${g.cy} Z`}
                  className={`fill-raised transition-[stroke] duration-200 ${stroke}`}
                  strokeWidth={on ? 2 : 1.2}
                />
                <path d={`M ${g.cx - 5} ${g.cy - 5} L ${g.cx + 5} ${g.cy + 5} M ${g.cx + 5} ${g.cy - 5} L ${g.cx - 5} ${g.cy + 5}`} className={stroke} strokeWidth={1.4} />
                <Lines lines={wrap(s.label, g.x0 + laneW - g.right - 8)} x={g.right + 6} y={g.top - 4} anchor="start" className="fill-ink" />
              </>
            );
          } else {
            shape = (
              <>
                <circle cx={g.cx} cy={g.cy} r={EVENT_R} className={`fill-raised transition-[stroke] duration-200 ${on ? "stroke-accent" : s.kind === "end" ? "stroke-ink" : "stroke-edge"}`} strokeWidth={s.kind === "end" ? 3 : on ? 2 : 1.3} />
                <Lines lines={wrap(s.label, g.x0 + laneW - g.right - 12)} x={g.right + 7} y={g.cy} anchor="start" className="fill-ink" />
              </>
            );
          }
          return (
            <g
              key={s.id}
              data-node={s.id}
              tabIndex={0}
              role="button"
              aria-pressed={on}
              aria-label={`${s.label}. Highlight its connections`}
              onMouseEnter={() => setActive(s.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(s.id)}
              onBlur={() => setActive(null)}
              onClick={() => setActive((a) => (a === s.id ? null : s.id))}
              className="cursor-pointer outline-none [&:focus-visible>*:first-child]:stroke-accent [&:focus-visible>*:first-child]:[stroke-width:2]"
            >
              {shape}
            </g>
          );
        })}

        <circle data-dot r={4} cx={0} cy={0} opacity={0} className="fill-accent" />
        <circle data-replay-dot r={5} cx={0} cy={0} opacity={0} className="fill-accent" />
      </svg>

      <Legend steps={usedSteps} flows={usedFlows} />

      <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[12px] text-muted">
        {canMove && (
          <button type="button" onClick={replay} className="min-h-[44px] rounded-sm border border-edge px-3 text-ink hover:border-accent hover:text-accent">
            replay flow
          </button>
        )}
        <span>hover or tap a step to trace it</span>
      </div>
    </div>
  );
}

/** Key to the shapes, listing only the ones this diagram uses. */
function Legend({ steps, flows }: { steps: Set<FlowStepKind>; flows: Set<Kind> }) {
  const items: { key: string; icon: JSX.Element; text: string }[] = [
    { key: "start", text: "start", icon: <circle cx={8} cy={7} r={5} fill="none" className="stroke-edge" strokeWidth={1.3} /> },
    { key: "task", text: "step", icon: <rect x={1} y={2} width={14} height={10} rx={3} fill="none" className="stroke-edge" strokeWidth={1.2} /> },
    { key: "decision", text: "decision", icon: <path d="M 8 1 L 14 7 L 8 13 L 2 7 Z" fill="none" className="stroke-edge" strokeWidth={1.2} /> },
    {
      key: "data",
      text: "data store",
      icon: <path d="M 3 3.5 A 5 1.8 0 0 1 13 3.5 V 11 A 5 1.8 0 0 1 3 11 Z M 3 3.5 A 5 1.8 0 0 0 13 3.5" fill="none" className="stroke-edge" strokeWidth={1.1} />,
    },
    { key: "end", text: "end", icon: <circle cx={8} cy={7} r={5} fill="none" className="stroke-ink" strokeWidth={2.4} /> },
    { key: "sequence", text: "next step", icon: <path d="M 1 7 H 15" className="stroke-edge" strokeWidth={1.3} /> },
    { key: "data-flow", text: "reads / writes", icon: <path d="M 1 7 H 15" className="stroke-edge" strokeWidth={1.3} strokeDasharray="2 3" /> },
    { key: "message", text: "outside service", icon: <path d="M 1 7 H 15" className="stroke-edge" strokeWidth={1.3} strokeDasharray="5 3" /> },
  ];
  const shown = items.filter((it) =>
    it.key === "data-flow" ? flows.has("data") : it.key === "sequence" || it.key === "message" ? flows.has(it.key as Kind) : steps.has(it.key as FlowStepKind),
  );
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11.5px] text-muted" aria-label="Diagram key">
      {shown.map((it) => (
        <li key={it.key} className="inline-flex items-center gap-1.5">
          <svg width={16} height={14} viewBox="0 0 16 14" aria-hidden>
            {it.icon}
          </svg>
          {it.text}
        </li>
      ))}
    </ul>
  );
}
