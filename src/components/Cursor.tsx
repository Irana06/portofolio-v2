import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";

const INTERACTIVE = "a, button, [role='button'], summary, label, select";
const TEXT_INPUT = "input, textarea, [contenteditable='true']";

/**
 * Custom cursor for mouse users: an accent dot plus a ring that trails it. The ring grows
 * over links and buttons and tightens on click. Over text fields the system I-beam comes
 * back so typing feels normal. Touch devices never see it.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled] = useState(() => window.matchMedia("(pointer: fine)").matches);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("custom-cursor");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dx = gsap.quickTo(dot.current, "x", { duration: reduced ? 0 : 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: reduced ? 0 : 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: reduced ? 0 : 0.35, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: reduced ? 0 : 0.35, ease: "power3" });
    let mode: "idle" | "hover" | "text" = "idle";
    let shown = false;

    const setMode = (next: typeof mode) => {
      if (next === mode) return;
      mode = next;
      gsap.to(ring.current, { scale: next === "hover" ? 1.7 : 1, opacity: next === "text" ? 0 : 1, duration: 0.25 });
      gsap.to(ring.current!.firstElementChild, { opacity: next === "hover" ? 1 : 0, duration: 0.25 });
      gsap.to(dot.current, { opacity: next === "text" ? 0 : 1, scale: next === "hover" ? 0.5 : 1, duration: 0.2 });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.2 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const t = e.target as Element;
      setMode(t.closest(TEXT_INPUT) ? "text" : t.closest(INTERACTIVE) ? "hover" : "idle");
    };
    const onDown = () => gsap.to(ring.current, { scale: mode === "hover" ? 1.35 : 0.75, duration: 0.15 });
    const onUp = () => gsap.to(ring.current, { scale: mode === "hover" ? 1.7 : 1, duration: 0.2 });
    const onLeave = () => {
      shown = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="cursor-el pointer-events-none fixed left-0 top-0 z-[100] -ml-[17px] -mt-[17px] h-[34px] w-[34px] rounded-full border border-accent opacity-0"
      >
        <div className="h-full w-full rounded-full bg-accent/15 opacity-0" />
      </div>
      <div
        ref={dot}
        aria-hidden
        className="cursor-el pointer-events-none fixed left-0 top-0 z-[100] -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-accent opacity-0"
      />
    </>
  );
}
