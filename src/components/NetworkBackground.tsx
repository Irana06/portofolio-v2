import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Packet = { a: number; b: number; t: number };

const LINK = 140; // px: nodes closer than this are connected
const CURSOR_REACH = 170; // px: nodes inside this radius link to the cursor and drift away from it

function readColor(name: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).join(",");
  return `rgb(${v})`;
}

/**
 * Background "network": nodes drift, link up when they're close, and now and then a packet
 * travels along a link, the same request motif as the project diagrams. Nodes near the
 * cursor link to it and move aside. Static single frame under reduced motion; paused
 * while the tab is hidden.
 */
export default function NetworkBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let colors = { dot: "", line: "", accent: "" };
    const mouse = { x: -9999, y: -9999 };
    let lastScroll = window.scrollY;
    let raf = 0;
    let lastPacket = 0;

    const loadColors = () => {
      colors = { dot: readColor("--muted"), line: readColor("--edge"), accent: readColor("--accent") };
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
      const count = Math.min(110, Math.round((w * h) / 15000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1 + Math.random() * 1.1,
      }));
      packets = [];
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      // Scrolling nudges the field the opposite way, giving the page some depth.
      const dy = (window.scrollY - lastScroll) * 0.25;
      lastScroll = window.scrollY;

      for (const n of nodes) {
        if (!reduced) {
          const mx = n.x - mouse.x;
          const my = n.y - mouse.y;
          const md = Math.hypot(mx, my);
          if (md < CURSOR_REACH && md > 0) {
            const push = (1 - md / CURSOR_REACH) * 0.6;
            n.x += (mx / md) * push;
            n.y += (my / md) * push;
          }
          n.x += n.vx;
          n.y += n.vy - dy;
          if (n.x < -20) n.x = w + 20;
          if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20;
          if (n.y > h + 20) n.y = -20;
        }
      }

      // Links between nearby nodes
      const links: [number, number][] = [];
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.line;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < LINK) {
            links.push([i, j]);
            ctx.globalAlpha = (1 - d / LINK) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Links to the cursor
      ctx.strokeStyle = colors.accent;
      for (const n of nodes) {
        const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (d < CURSOR_REACH) {
          ctx.globalAlpha = (1 - d / CURSOR_REACH) * 0.5;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Nodes
      ctx.fillStyle = colors.dot;
      for (const n of nodes) {
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Packets: a request hopping along a link
      if (!reduced) {
        if (now - lastPacket > 650 && links.length && packets.length < 6) {
          const [a, b] = links[Math.floor(Math.random() * links.length)];
          packets.push(Math.random() < 0.5 ? { a, b, t: 0 } : { a: b, b: a, t: 0 });
          lastPacket = now;
        }
        ctx.fillStyle = colors.accent;
        packets = packets.filter((p) => {
          p.t += 0.018;
          const A = nodes[p.a];
          const B = nodes[p.b];
          if (!A || !B || p.t >= 1) return false;
          ctx.globalAlpha = Math.sin(p.t * Math.PI);
          ctx.beginPath();
          ctx.arc(A.x + (B.x - A.x) * p.t, A.y + (B.y - A.y) * p.t, 2.2, 0, Math.PI * 2);
          ctx.fill();
          return true;
        });
      }
      ctx.globalAlpha = 1;
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
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      themeWatch.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}
