import { ArrowUp } from "lucide-react";
import { profile, socials } from "../data/portfolio";
import SocialIcon from "./SocialIcon";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="font-mono text-xs text-faint">
          <div>
            © {new Date().getFullYear()} {profile.name}
          </div>
          <div className="mt-1">
            v2.0.0 · built with React, Vite & Tailwind · <span className="text-accent">all systems operational</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={s.label}
              className="rounded-md p-2 text-faint transition-colors hover:bg-raised hover:text-ink"
            >
              <SocialIcon icon={s.icon} />
            </a>
          ))}
          <a
            href="#top"
            className="ml-2 inline-flex items-center gap-1 rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-muted hover:text-ink"
          >
            <ArrowUp className="h-3.5 w-3.5" /> top
          </a>
        </div>
      </div>
    </footer>
  );
}
