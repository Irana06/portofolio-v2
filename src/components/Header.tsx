import { useState } from "react";
import { profile } from "../data/portfolio";

const LINKS = [
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
  { href: "/cv", label: "CV" },
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

function ThemeToggle({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <button
      type="button"
      onClick={toggle}
      className="min-h-[44px] rounded-sm px-2 font-sans text-sm text-muted hover:text-ink"
    >
      {dark ? "Light mode" : "Dark mode"}
    </button>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  return (
    <header className="page">
      <div className="flex min-h-[4.5rem] items-center justify-between gap-6">
        <a href="#top" className="inline-flex min-h-[44px] items-center text-lg font-medium no-underline">
          {profile.name}
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex min-h-[44px] items-center px-2.5 font-sans text-sm text-muted no-underline hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <span className="mx-1 h-4 w-px bg-rule" aria-hidden />
          <ThemeToggle {...theme} />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle {...theme} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="min-h-[44px] rounded-sm border border-edge px-3 font-sans text-sm"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-rule pb-3 md:hidden">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] items-center border-b border-rule font-sans text-[15px] no-underline"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
