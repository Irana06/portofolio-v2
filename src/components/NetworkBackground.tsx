import { useEffect, useRef } from "react";

type Layer = 0 | 1 | 2; // 0 far, 1 mid, 2 near
type Tint = "dot" | "ink" | "accent";
type Kind = "dot" | "server" | "db" | "code";
type Star = {
  kind: Kind;
  label: string; // for "code" stars
  flash: number; // time (ms) a packet last arrived, lights the server/db LED
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  layer: Layer;
  tint: Tint;
  phase: number; // twinkle offset
  speed: number; // twinkle speed
  hub: boolean;
};
type Packet = { a: number; b: number; t: number; v: number };
type Ripple = { x: number; y: number; t: number };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number };

const LINK = 135; // px: mid/near stars closer than this are linked
const CURSOR_REACH = 170;
const LAYER = [
  { size: [0.4, 0.9], speed: 0.06, alpha: 0.45, parallax: 0.08, pull: 0.15 },
  { size: [0.9, 1.5], speed: 0.16, alpha: 0.65, parallax: 0.2, pull: 0.45 },
  { size: [1.4, 2.2], speed: 0.28, alpha: 0.85, parallax: 0.38, pull: 0.8 },
] as const;
// Small code-ish tokens that float in the sky alongside the stars.
const TOKENS = ["{ }", "</>", "GET", "POST", "200", "SQL", "0x1F", "1010", ">_", "=>", "::", "[ ]"];
const INTERACTIVE = "a, button, input, textarea, select, label, summary, [role='button'], [role='dialog'], pre, code";

function readColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).join(",");
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Background sky of the page. Three depth layers of stars twinkle and drift with parallax;
 * some mid/near stars are backend shapes (server racks, database cylinders, code tokens);
 * mid and near stars link up into a network, a few larger hubs pulse, packets with short
 * trails hop along links (the request motif) and light a server/db LED on arrival, and a
 * meteor crosses now and then. Stars near
 * the cursor link to it and move aside; clicking empty space sends a ripple and a burst of
 * packets. A still frame under reduced motion; paused while the tab is hidden.
 */
export default function NetworkBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let packets: Packet[] = [];
    let ripples: Ripple[] = [];
    let meteors: Meteor[] = [];
    let c = { dot: "", ink: "", line: "", accent: "" };
    const mouse = { x: -9999, y: -9999, px: 0, py: 0 }; // px/py: smoothed offset from centre, for parallax
    let lastScroll = window.scrollY;
    let raf = 0;
    let lastPacket = 0;
    let nextMeteor = performance.now() + rand(3000, 7000);

    const loadColors = () => {
      c = { dot: readColor("--muted"), ink: readColor("--ink"), line: readColor("--edge"), accent: readColor("--accent") };
    };
    const rgba = (rgb: string, a: number) => `rgba(${rgb},${a})`;

    const makeStar = (layer: Layer, hub = false): Star => {
      const L = LAYER[layer];
      const roll = Math.random();
      // Far stars stay as dots; about a quarter of mid/near stars become backend shapes.
      const shape = Math.random();
      const kind: Kind = hub
        ? Math.random() < 0.5
          ? "server"
          : "db"
        : layer === 0 || shape > 0.27
          ? "dot"
          : shape < 0.08
            ? "server"
            : shape < 0.15
              ? "db"
              : "code";
      return {
        kind,
        label: TOKENS[Math.floor(Math.random() * TOKENS.length)],
        flash: -1e9,
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-1, 1) * L.speed,
        vy: rand(-1, 1) * L.speed,
        r: hub ? rand(2.4, 3.2) : rand(L.size[0], L.size[1]),
        layer,
        tint: hub || roll < 0.1 ? "accent" : roll < 0.3 ? "ink" : "dot",
        phase: Math.random() * Math.PI * 2,
        speed: rand(0.6, 1.8),
        hub,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      el.width = w * dpr;
      el.height = h * dpr;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const area = (w * h) / 10000;
      const far = Math.min(90, Math.round(area * 0.55));
      const mid = Math.min(60, Math.round(area * 0.38));
      const near = Math.min(22, Math.round(area * 0.14));
      const hubs = w < 640 ? 2 : 4;
      stars = [
        ...Array.from({ length: far }, () => makeStar(0)),
        ...Array.from({ length: mid }, () => makeStar(1)),
        ...Array.from({ length: near }, () => makeStar(2)),
        ...Array.from({ length: hubs }, () => makeStar(1, true)),
      ];
      packets = [];
    };

    // Screen position including parallax from the cursor (near layers shift more).
    const pos = (s: Star) => {
      const k = LAYER[s.layer].pull * 18;
      return { x: s.x - mouse.px * k, y: s.y - mouse.py * k };
    };

    const sendPacket = (a: number, b: number) => {
      if (packets.length < 14) packets.push({ a, b, t: 0, v: rand(0.012, 0.022) });
    };

    // A rack unit: case, two dividers, and an LED per slot. The LED lights when a packet arrives.
    const drawServer = (x: number, y: number, k: number, col: string, a: number, lit: number) => {
      const w2 = 8 * k;
      const h2 = 10 * k;
      ctx.strokeStyle = rgba(col, a);
      ctx.lineWidth = 1;
      ctx.strokeRect(x - w2, y - h2, w2 * 2, h2 * 2);
      for (let r = 1; r < 3; r++) {
        const ly = y - h2 + (h2 * 2 * r) / 3;
        ctx.beginPath();
        ctx.moveTo(x - w2, ly);
        ctx.lineTo(x + w2, ly);
        ctx.stroke();
      }
      for (let r = 0; r < 3; r++) {
        const ly = y - h2 + (h2 * 2 * (r + 0.5)) / 3;
        ctx.fillStyle = r === 0 && lit > 0 ? rgba(c.accent, Math.min(1, 0.35 + lit)) : rgba(col, a * 0.6);
        ctx.beginPath();
        ctx.arc(x + w2 - 3 * k, ly, 1.1 * k, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(col, a * 0.45);
        ctx.fillRect(x - w2 + 2.5 * k, ly - 0.5, 6 * k, 1);
      }
    };

    // A database cylinder; its top ring glows when a packet arrives.
    const drawDb = (x: number, y: number, k: number, col: string, a: number, lit: number) => {
      const rx = 7 * k;
      const ry = 2.6 * k;
      const top = y - 7 * k;
      const bottom = y + 7 * k;
      ctx.strokeStyle = rgba(col, a);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - rx, top);
      ctx.lineTo(x - rx, bottom);
      ctx.ellipse(x, bottom, rx, ry, 0, Math.PI, 0, true);
      ctx.lineTo(x + rx, top);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI);
      ctx.stroke();
      ctx.strokeStyle = lit > 0 ? rgba(c.accent, Math.min(1, 0.35 + lit)) : rgba(col, a);
      ctx.beginPath();
      ctx.ellipse(x, top, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const time = now / 1000;

      const dy = reduced ? 0 : window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      if (!reduced) {
        const tx = mouse.x < 0 ? 0 : (mouse.x - w / 2) / w;
        const ty = mouse.y < 0 ? 0 : (mouse.y - h / 2) / h;
        mouse.px += (tx - mouse.px) * 0.05;
        mouse.py += (ty - mouse.py) * 0.05;
      }

      // Move
      for (const s of stars) {
        if (reduced) continue;
        const L = LAYER[s.layer];
        if (s.layer > 0) {
          const p = pos(s);
          const mx = p.x - mouse.x;
          const my = p.y - mouse.y;
          const md = Math.hypot(mx, my);
          if (md < CURSOR_REACH && md > 0) {
            const push = (1 - md / CURSOR_REACH) * 0.5 * L.pull;
            s.x += (mx / md) * push;
            s.y += (my / md) * push;
          }
        }
        s.x += s.vx;
        s.y += s.vy - dy * L.parallax;
        if (s.x < -30) s.x = w + 30;
        if (s.x > w + 30) s.x = -30;
        if (s.y < -30) s.y = h + 30;
        if (s.y > h + 30) s.y = -30;
      }

      const P = stars.map(pos);

      // Links between nearby mid/near stars
      const links: [number, number][] = [];
      ctx.lineWidth = 1;
      for (let i = 0; i < stars.length; i++) {
        if (stars[i].layer === 0) continue;
        for (let j = i + 1; j < stars.length; j++) {
          if (stars[j].layer === 0) continue;
          const reach = stars[i].hub || stars[j].hub ? LINK * 1.35 : LINK;
          const d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y);
          if (d < reach) {
            links.push([i, j]);
            ctx.strokeStyle = rgba(c.line, (1 - d / reach) * 0.32);
            ctx.beginPath();
            ctx.moveTo(P[i].x, P[i].y);
            ctx.lineTo(P[j].x, P[j].y);
            ctx.stroke();
          }
        }
      }

      // Links to the cursor
      for (let i = 0; i < stars.length; i++) {
        if (stars[i].layer === 0) continue;
        const d = Math.hypot(P[i].x - mouse.x, P[i].y - mouse.y);
        if (d < CURSOR_REACH) {
          ctx.strokeStyle = rgba(c.accent, (1 - d / CURSOR_REACH) * 0.45);
          ctx.beginPath();
          ctx.moveTo(P[i].x, P[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Stars and backend shapes, twinkling; hubs get a slow pulsing halo
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(time * s.speed + s.phase);
        const a = LAYER[s.layer].alpha * (s.hub ? 1 : tw);
        const col = s.tint === "accent" ? c.accent : s.tint === "ink" ? c.ink : c.dot;
        const { x, y } = P[i];
        const lit = Math.max(0, 1 - (now - s.flash) / 600); // LED glow fades over 0.6s
        if (s.hub) {
          const pulse = reduced ? 0.5 : (Math.sin(time * 1.2 + s.phase) + 1) / 2;
          ctx.strokeStyle = rgba(c.accent, 0.25 * (1 - pulse) + 0.06);
          ctx.beginPath();
          ctx.arc(x, y, 16 + pulse * 8, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (s.kind === "server") {
          drawServer(x, y, s.hub ? 1.15 : s.layer === 2 ? 0.95 : 0.75, s.hub ? c.ink : col, s.hub ? 0.45 : a * 0.6, lit);
        } else if (s.kind === "db") {
          drawDb(x, y, s.hub ? 1.15 : s.layer === 2 ? 0.95 : 0.75, s.hub ? c.ink : col, s.hub ? 0.45 : a * 0.6, lit);
        } else if (s.kind === "code") {
          ctx.font = `${s.layer === 2 ? 11 : 9.5}px 'IBM Plex Mono', monospace`;
          ctx.fillStyle = rgba(col, a * 0.55);
          ctx.fillText(s.label, x, y);
        } else {
          if (s.layer === 2) {
            // soft glow on the nearest stars
            ctx.fillStyle = rgba(col, a * 0.12);
            ctx.beginPath();
            ctx.arc(x, y, s.r * 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = rgba(col, a);
          ctx.beginPath();
          ctx.arc(x, y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduced) {
        // Packets, leaving more often from hubs
        if (now - lastPacket > 520 && links.length) {
          const fromHub = links.filter(
            ([a, b]) => stars[a].hub || stars[b].hub || stars[a].kind === "server" || stars[b].kind === "server" || stars[a].kind === "db" || stars[b].kind === "db",
          );
          const pool = fromHub.length && Math.random() < 0.6 ? fromHub : links;
          const [a, b] = pool[Math.floor(Math.random() * pool.length)];
          // Aim at the server/db end when there is one, so requests visibly "arrive".
          const isBox = (k: number) => stars[k].kind === "server" || stars[k].kind === "db";
          if (isBox(a) && !isBox(b)) sendPacket(b, a);
          else sendPacket(a, b);
          lastPacket = now;
        }
        packets = packets.filter((p) => {
          p.t += p.v;
          const A = P[p.a];
          const B = P[p.b];
          if (!A || !B) return false;
          if (p.t >= 1) {
            stars[p.b].flash = now; // the receiving server/db lights up
            return false;
          }
          const x = A.x + (B.x - A.x) * p.t;
          const y = A.y + (B.y - A.y) * p.t;
          const tail = Math.max(0, p.t - 0.18);
          const fade = Math.sin(p.t * Math.PI);
          const g = ctx.createLinearGradient(A.x + (B.x - A.x) * tail, A.y + (B.y - A.y) * tail, x, y);
          g.addColorStop(0, rgba(c.accent, 0));
          g.addColorStop(1, rgba(c.accent, 0.8 * fade));
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(A.x + (B.x - A.x) * tail, A.y + (B.y - A.y) * tail);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.lineWidth = 1;
          ctx.fillStyle = rgba(c.accent, fade);
          ctx.beginPath();
          ctx.arc(x, y, 2.1, 0, Math.PI * 2);
          ctx.fill();
          return true;
        });

        // Click ripples
        ripples = ripples.filter((r) => {
          r.t += 0.016;
          if (r.t >= 1) return false;
          ctx.strokeStyle = rgba(c.accent, 0.5 * (1 - r.t));
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(r.x, r.y, 12 + r.t * 160, 0, Math.PI * 2);
          ctx.stroke();
          ctx.lineWidth = 1;
          return true;
        });

        // Meteors
        if (now > nextMeteor) {
          const fromLeft = Math.random() < 0.5;
          meteors.push({
            x: fromLeft ? rand(-50, w * 0.4) : rand(w * 0.6, w + 50),
            y: rand(-40, h * 0.35),
            vx: (fromLeft ? 1 : -1) * rand(7, 10),
            vy: rand(2.5, 4),
            life: 1,
          });
          nextMeteor = now + rand(6000, 12000);
        }
        meteors = meteors.filter((m) => {
          m.x += m.vx;
          m.y += m.vy;
          m.life -= 0.012;
          if (m.life <= 0 || m.x < -200 || m.x > w + 200 || m.y > h + 100) return false;
          const len = 14;
          const g = ctx.createLinearGradient(m.x - m.vx * len, m.y - m.vy * len, m.x, m.y);
          g.addColorStop(0, rgba(c.ink, 0));
          g.addColorStop(1, rgba(c.ink, 0.75 * m.life));
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(m.x - m.vx * len, m.y - m.vy * len);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
          ctx.lineWidth = 1;
          return true;
        });
      }
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    // Clicking or tapping empty space (not a scroll gesture): a ripple, and nearby stars fire packets outward.
    const onDown = (e: MouseEvent) => {
      if (reduced || (e.target as Element).closest(INTERACTIVE)) return;
      ripples.push({ x: e.clientX, y: e.clientY, t: 0 });
      const near = stars
        .map((s, i) => ({ i, d: Math.hypot(pos(s).x - e.clientX, pos(s).y - e.clientY), s }))
        .filter((n) => n.s.layer > 0 && n.d < 220)
        .sort((a, b) => a.d - b.d)
        .slice(0, 8);
      for (const n of near) {
        const far = stars.findIndex((s, j) => j !== n.i && s.layer > 0 && Math.hypot(s.x - n.s.x, s.y - n.s.y) < LINK * 1.3);
        if (far >= 0) sendPacket(n.i, far);
      }
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(loop);
    };
    const onResize = () => {
      resize();
      if (reduced) draw(0);
    };

    // Repaint with the new palette when the theme toggles.
    const themeWatch = new MutationObserver(() => {
      loadColors();
      if (reduced) draw(0);
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    loadColors();
    resize();
    if (reduced) draw(0);
    else raf = requestAnimationFrame(loop);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onDown);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      themeWatch.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onDown);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}
