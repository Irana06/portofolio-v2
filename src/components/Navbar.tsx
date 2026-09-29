import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "../data/portfolio";
import { StatusDot } from "./ui";

const NAV = [
  { id: "about", path: "/about" },
  { id: "stack", path: "/stack" },
  { id: "projects", path: "/projects" },
  { id: "experience", path: "/experience" },
  { id: "certificates", path: "/certs" },
  { id: "contact", path: "/contact" },
];

function useActiveSection() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return active;
}

export default function Navbar() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-line bg-bg/85 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-6" aria-label="Main">
        <a href="#top" className="group flex items-center gap-1 font-mono text-sm text-ink">
          <span className="text-accent">~/</span>
          <span>{profile.handle}</span>
          <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-px bg-accent/80 animate-blink" aria-hidden />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className={`rounded-md px-3 py-1.5 font-mono text-[13px] transition-colors ${
                  active === n.id ? "bg-raised text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {n.path}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
            <StatusDot tone={profile.available ? "accent" : "faint"} />
            {profile.available ? "open to work" : "heads down"}
          </span>
          <a href="/cv" className="btn-ghost !py-1.5">
            resume
          </a>
        </div>

        <button
          type="button"
          className="-mr-2 rounded-md p-2 text-muted hover:text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line lg:hidden">
          <ul className="container-page grid gap-1 py-4">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 font-mono text-sm text-muted hover:bg-raised hover:text-ink"
                >
                  <span>
                    <span className="text-faint">GET </span>
                    {n.path}
                  </span>
                  {active === n.id && <span className="text-[11px] text-accent">active</span>}
                </a>
              </li>
            ))}
            <li className="mt-2 flex items-center justify-between px-3">
              <span className="flex items-center gap-2 font-mono text-[11px] text-muted">
                <StatusDot tone={profile.available ? "accent" : "faint"} />
                {profile.available ? "open to work" : "heads down"}
              </span>
              <a href="/cv" className="btn-ghost !py-1.5">
                resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
