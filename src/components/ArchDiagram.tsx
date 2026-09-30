import { useLayoutEffect, useRef } from "react";
import type { Diagram } from "../data/types";
import { gsap } from "../lib/gsap";

const PAD = 14;
const ROW = 98;
const NODE_H = 58;
const CHAR_W = 6.2; // approx. width of one 10.5px mono character, for wrapping notes

function wrap(text: string, width: number): string[] {
  const max = Math.floor((width - 20) / CHAR_W);
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

/**
 * Architecture diagram for a project. As the reader scrolls, each connection
 * draws in the order data flows, and a request dot travels along it, so the
 * order of the system reads without extra text.
 */
export default function ArchDiagram({ diagram, name }: { diagram: Diagram; name: string }) {
  const root = useRef<SVGSVGElement>(null);

  const twoCols = diagram.nodes.some((n) => n.col === 1);
  const W = 300;
  const nodeW = twoCols ? 130 : W - PAD * 2;
  const colX = [PAD, W - PAD - 110];
  const widthOf = (col: number) => (col === 0 ? nodeW : 110);
  const rows = Math.max(...diagram.nodes.map((n) => n.row)) + 1;
  const H = PAD * 2 + (rows - 1) * ROW + NODE_H;

  const box = Object.fromEntries(
    diagram.nodes.map((n) => {
      const x = colX[n.col];
      const y = PAD + n.row * ROW;
      const w = widthOf(n.col);
      return [n.id, { x, y, w, cx: x + w / 2, cy: y + NODE_H / 2 }];
    }),
  );

  const edges = diagram.edges.map((e) => {
    const a = box[e.from];
    const b = box[e.to];
    let d: string;
    let lx: number;
    let ly: number;
    if (Math.abs(a.cx - b.cx) < 1 || (a.x === b.x && b.y > a.y)) {
      // straight down
      d = `M ${a.x + 40} ${a.y + NODE_H} V ${b.y}`;
      lx = a.x + 48;
      ly = (a.y + NODE_H + b.y) / 2 + 4;
    } else if (a.y === b.y) {
      // straight across
      d = `M ${a.x + a.w} ${a.cy} H ${b.x}`;
      lx = (a.x + a.w + b.x) / 2 - 11;
      ly = a.cy - 8;
    } else {
      d = `M ${a.x + a.w} ${a.cy} H ${b.cx} V ${b.y}`;
      lx = b.cx + 6;
      ly = a.cy - 8;
    }
    return { ...e, d, lx, ly };
  });

  const label = diagram.edges
    .map((e) => {
      const from = diagram.nodes.find((n) => n.id === e.from)?.label;
      const to = diagram.nodes.find((n) => n.id === e.to)?.label;
      return `${from} to ${to}${e.label ? ` (${e.label})` : ""}`;
    })
    .join(", ");

  useLayoutEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const paths = gsap.utils.toArray<SVGPathElement>(svg.querySelectorAll("[data-edge]"));
      const nodes = gsap.utils.toArray<SVGGElement>(svg.querySelectorAll("[data-node]"));
      const labels = gsap.utils.toArray<SVGTextElement>(svg.querySelectorAll("[data-edge-label]"));
      const dot = svg.querySelector<SVGCircleElement>("[data-dot]");

      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(nodes.slice(1), { opacity: 0.25 });
      gsap.set(labels, { opacity: 0 });
      gsap.set(dot, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 85%", end: "bottom 40%", scrub: 0.6 },
      });

      diagram.edges.forEach((e, i) => {
        const target = nodes.find((n) => n.dataset.node === e.to);
        tl.to(paths[i], { strokeDashoffset: 0, duration: 1, ease: "none" })
          .set(dot, { opacity: 1 }, "<")
          .to(dot, { duration: 1, ease: "none", motionPath: { path: paths[i], align: paths[i], alignOrigin: [0.5, 0.5] } }, "<")
          .to(labels[i], { opacity: 1, duration: 0.3 }, "<0.4")
          .to(target ?? {}, { opacity: 1, duration: 0.3 }, ">-0.1");
      });
      tl.to(dot, { opacity: 0, duration: 0.3 });
    });

    return () => mm.revert();
  }, [diagram]);

  return (
    <svg
      ref={root}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Architecture of ${name}: ${label}`}
      className="w-full max-w-[22rem] font-mono"
    >
      {edges.map((e) => (
        <g key={`${e.from}-${e.to}`}>
          <path data-edge d={e.d} fill="none" className="stroke-edge" strokeWidth={1.25} />
          {e.label && (
            <text data-edge-label x={e.lx} y={e.ly} className="fill-muted" fontSize={10}>
              {e.label}
            </text>
          )}
        </g>
      ))}

      {diagram.nodes.map((n) => {
        const b = box[n.id];
        const notes = n.note ? wrap(n.note, b.w) : [];
        return (
          <g key={n.id} data-node={n.id}>
            <rect x={b.x} y={b.y} width={b.w} height={NODE_H} rx={4} className="fill-raised stroke-edge" strokeWidth={1} />
            <text x={b.x + 10} y={b.y + 22} className="fill-ink" fontSize={13}>
              {n.label}
            </text>
            {notes.map((line, i) => (
              <text key={line} x={b.x + 10} y={b.y + 38 + i * 12} className="fill-muted" fontSize={10.5}>
                {line}
              </text>
            ))}
          </g>
        );
      })}

      <circle data-dot r={4} cx={0} cy={0} opacity={0} className="fill-accent" />
    </svg>
  );
}
