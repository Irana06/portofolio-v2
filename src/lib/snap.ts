import { gsap } from "./gsap";

const PIECES = "h1, h2, h3, p, li, figure, button, a, img, svg, form, table, label, input, textarea";

let running = false;

/**
 * The terminal's "rm -rf /" joke: everything on screen drifts away like dust,
 * then comes back a few seconds later. Nothing is removed from the page.
 */
export function snapPage(onBack: () => void) {
  if (running) return;
  running = true;

  const inView = (el: Element) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
  };
  // Outermost matching pieces only, so a link inside a list item doesn't move twice.
  const all = [...document.querySelectorAll<HTMLElement>(`:is(header, main, footer) :is(${PIECES})`)];
  const pieces = all.filter(
    (el) => inView(el) && !el.closest("[data-snap-keep]") && !all.some((other) => other !== el && other.contains(el)),
  );

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Hold the scroll position without hiding the scrollbar (hiding it shifts the whole layout),
  // and clip pieces drifting past the right edge so no horizontal scrollbar appears.
  const block = (e: Event) => e.preventDefault();
  const keys = (e: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key) && !(e.target instanceof HTMLInputElement)) e.preventDefault();
  };
  window.addEventListener("wheel", block, { passive: false });
  window.addEventListener("touchmove", block, { passive: false });
  window.addEventListener("keydown", keys);
  const clipped = [document.documentElement, document.body];
  const prevOverflowX = clipped.map((el) => el.style.overflowX);
  clipped.forEach((el) => (el.style.overflowX = "clip"));

  const finish = () => {
    gsap.set(pieces, { clearProps: "opacity,transform,filter" });
    window.removeEventListener("wheel", block);
    window.removeEventListener("touchmove", block);
    window.removeEventListener("keydown", keys);
    clipped.forEach((el, k) => (el.style.overflowX = prevOverflowX[k]));
    running = false;
    onBack();
  };

  // blur looks like dust but costs too much on phones
  const blur = window.innerWidth >= 768;
  const tl = gsap.timeline({ onComplete: finish });
  if (reduced) {
    tl.to(pieces, { opacity: 0, duration: 0.6 }).to(pieces, { opacity: 1, duration: 0.6 }, "+=5");
    return;
  }
  tl.to(pieces, {
    opacity: 0,
    x: () => gsap.utils.random(30, 120),
    y: () => gsap.utils.random(-90, -20),
    rotation: () => gsap.utils.random(-12, 12),
    filter: blur ? "blur(3px)" : "none",
    duration: 1.4,
    ease: "power2.in",
    stagger: { each: 0.04, from: "random" },
  }).to(pieces, {
    opacity: 1,
    x: 0,
    y: 0,
    rotation: 0,
    filter: blur ? "blur(0px)" : "none",
    duration: 0.9,
    ease: "power3.out",
    stagger: { each: 0.025, from: "random" },
  }, "+=5");
}
