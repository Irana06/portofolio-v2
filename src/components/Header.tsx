import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { profile } from "../data/portfolio";
import { gsap } from "../lib/gsap";

const LINKS = [
  { href: "#projects", label: "Projects" },
  { href: "#journey", label: "Request flow" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#certificates", label: "Certificates" },
  { href: "#contact", label: "Contact" },
];

function useTheme() {
  const [dark, setDark] = useState(() => !document.documentElement.classList.contains("light"));

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("light", !next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage can be blocked (private mode); the toggle still works for this visit.
    }
    setDark(next);
  };

  return { dark, toggle };
}

/** Highlights the nav link for the section currently in view. */
function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const els = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function Drawer({ open, onClose, theme }: { open: boolean; onClose: () => void; theme: ReturnType<typeof useTheme> }) {
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // GSAP owns the panel's transform (a Tailwind translate class would stack with it), so start it offscreen here.
  useLayoutEffect(() => {
    gsap.set(panel.current, { xPercent: 100 });
  }, []);

  // Slide the panel in from the right; links stagger in after it.
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = reduced ? 0 : 1;
    if (open) {
      gsap.set([panel.current, backdrop.current], { visibility: "visible" });
      gsap.to(backdrop.current, { opacity: 1, duration: 0.25 * d });
      gsap.fromTo(panel.current, { xPercent: 100 }, { xPercent: 0, duration: 0.45 * d, ease: "power3.out" });
      gsap.fromTo(
        panel.current!.querySelectorAll("[data-drawer-item]"),
        { x: 24, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.35 * d, stagger: 0.04 * d, delay: 0.12 * d, ease: "power2.out" },
      );
      closeBtn.current?.focus();
    } else {
      gsap.to(backdrop.current, { opacity: 0, duration: 0.2 * d });
      gsap.to(panel.current, {
        xPercent: 100,
        duration: 0.3 * d,
        ease: "power3.in",
        onComplete: () => gsap.set([panel.current, backdrop.current], { visibility: "hidden" }),
      });
    }
  }, [open]);

  // Escape closes, and the page behind does not scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div className="md:hidden">
      <div ref={backdrop} onClick={onClose} aria-hidden className="invisible fixed inset-0 z-40 bg-black/50 opacity-0" />
      <div
        ref={panel}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="invisible fixed inset-y-0 right-0 z-50 flex w-[82vw] max-w-[20rem] flex-col border-l border-rule bg-paper"
      >
        <div className="flex min-h-[4.5rem] items-center justify-between border-b border-rule px-5">
          <span className="font-mono text-[13px] text-muted">menu</span>
          <button ref={closeBtn} type="button" onClick={onClose} className="min-h-[44px] rounded-sm border border-edge px-3 font-sans text-sm">
            Close
          </button>
        </div>

        <nav aria-label="Main" className="flex-1 overflow-y-auto px-5 py-4">
          <ol>
            {LINKS.map((l, i) => (
              <li key={l.href} data-drawer-item>
                <a
                  href={l.href}
                  onClick={onClose}
                  className="flex min-h-[52px] items-baseline gap-3 border-b border-rule text-xl no-underline"
                >
                  <span className="font-mono text-[12px] text-accent">§ {i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ol>
          <a data-drawer-item href="/cv" className="btn-plain mt-6 w-full">
            Read the CV
          </a>
        </nav>

        <div data-drawer-item className="border-t border-rule px-5 py-4 font-sans text-sm">
          <a href={`mailto:${profile.email}`} className="block break-all">
            {profile.email}
          </a>
          <button type="button" onClick={theme.toggle} className="mt-2 min-h-[44px] text-muted hover:text-ink">
            {theme.dark ? "Switch to light mode" : "Switch to dark mode"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const active = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-30 border-b transition-colors duration-300 ${
          scrolled ? "border-rule bg-paper/85 backdrop-blur-md" : "border-transparent"
        }`}
      >
        <div className="page flex min-h-[4.5rem] items-center justify-between gap-6">
          <a href="#top" className="inline-flex min-h-[44px] items-center text-lg font-medium no-underline">
            {profile.name}
          </a>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={active === l.href ? "location" : undefined}
                className={`flex min-h-[44px] items-center px-2.5 font-sans text-sm no-underline transition-colors hover:text-ink ${
                  active === l.href ? "text-accent" : "text-muted"
                }`}
              >
                {l.label}
              </a>
            ))}
            <a href="/cv" className="flex min-h-[44px] items-center px-2.5 font-sans text-sm text-muted no-underline hover:text-ink">
              CV
            </a>
            <span className="mx-1 h-4 w-px bg-rule" aria-hidden />
            <button
              type="button"
              onClick={theme.toggle}
              className="min-h-[44px] rounded-sm px-2 font-sans text-sm text-muted hover:text-ink"
            >
              {theme.dark ? "Light mode" : "Dark mode"}
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="min-h-[44px] rounded-sm border border-edge px-4 font-sans text-sm md:hidden"
          >
            Menu
          </button>
        </div>
      </header>
      <Drawer open={open} onClose={() => setOpen(false)} theme={theme} />
    </>
  );
}
