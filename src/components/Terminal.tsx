import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { contactLinks, deployment, experience, profile, projects, skills } from "../data/portfolio";
import { formatYm } from "../lib/format";

type Line = { id: number; kind: "in" | "out" | "err"; body: ReactNode };

const PROMPT = "guest@yusuf:~$";

const COMMANDS: Record<string, { about: string; run: () => ReactNode }> = {
  help: {
    about: "list the commands",
    run: () => (
      <table>
        <tbody>
          {Object.entries(COMMANDS).map(([name, c]) => (
            <tr key={name}>
              <td className="pr-6 text-term-accent">{name}</td>
              <td>{c.about}</td>
            </tr>
          ))}
          <tr>
            <td className="pr-6 text-term-accent">clear</td>
            <td>clear the screen</td>
          </tr>
        </tbody>
      </table>
    ),
  },
  whoami: {
    about: "who I am",
    run: () => (
      <>
        <div>
          {profile.name}, {profile.role.toLowerCase()}
        </div>
        <div className="text-term-muted">{profile.location}
        </div>
        {profile.availability && <div className="text-term-muted">{profile.availability}</div>}
      </>
    ),
  },
  projects: {
    about: "what I've built",
    run: () => (
      <>
        {projects.map((p) => (
          <div key={p.slug}>
            <span className="text-term-accent">{p.name}</span>{" "}
            <span className="text-term-muted">
              {p.year}, {p.status.replace("-", " ")}, {p.stack.slice(0, 2).join(" + ")}
            </span>
          </div>
        ))}
        <div className="text-term-muted">
          Details and diagrams in{" "}
          <a href="#projects" className="text-term-ink">
            § 1 Projects
          </a>
        </div>
      </>
    ),
  },
  stack: {
    about: "languages and tools",
    run: () => (
      <table>
        <tbody>
          {skills.map((g) => (
            <tr key={g.label} className="align-top">
              <td className="whitespace-nowrap pr-6 text-term-muted">{g.label.toLowerCase()}</td>
              <td>{g.items.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
  deploy: {
    about: "how I ship",
    run: () => (
      <>
        <div>
          {deployment.title} <span className="text-term-muted">({deployment.status})</span>
        </div>
        <div className="text-term-muted">
          {deployment.diagram.steps.map((n) => n.label).join(" -> ")}
        </div>
      </>
    ),
  },
  experience: {
    about: "where I've worked",
    run: () => (
      <>
        {experience.map((e) => (
          <div key={`${e.company}-${e.start}`}>
            <span className="text-term-muted">
              {formatYm(e.start)} to {formatYm(e.end)}
            </span>{" "}
            {e.role}, {e.company}
          </div>
        ))}
      </>
    ),
  },
  contact: {
    about: "how to reach me",
    run: () => (
      <>
        <div>
          email{" "}
          <a href={`mailto:${profile.email}`} className="text-term-accent">
            {profile.email}
          </a>
        </div>
        {contactLinks.map((l) => (
          <div key={l.href}>
            {l.label.toLowerCase()}{" "}
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-term-ink">
              {l.handle}
            </a>
          </div>
        ))}
      </>
    ),
  },
  cv: {
    about: "open the CV page",
    run: () => (
      <a href="/cv" className="text-term-accent">
        /cv
      </a>
    ),
  },
};

const SUGGESTED = ["help", "whoami", "projects", "stack", "deploy", "contact"];

let nextId = 0;

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    {
      id: nextId++,
      kind: "out",
      body: (
        <span className="text-term-muted">
          This terminal answers from the same data as the rest of the page. Type <span className="text-term-ink">help</span>{" "}
          or tap a command below.
        </span>
      ),
    },
  ]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const screen = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // Keep the newest output in view without scrolling the page itself.
  useEffect(() => {
    const el = screen.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    history.current.push(cmd);
    cursor.current = history.current.length;

    if (cmd === "clear") {
      setLines([]);
      return;
    }
    const entry: Line = { id: nextId++, kind: "in", body: cmd };
    const found = COMMANDS[cmd];
    const result: Line = found
      ? { id: nextId++, kind: "out", body: found.run() }
      : { id: nextId++, kind: "err", body: `command not found: ${cmd}. Try help.` };
    setLines((prev) => [...prev, entry, result]);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    run(value);
    setValue("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const h = history.current;
    if (e.key === "ArrowUp" && h.length) {
      e.preventDefault();
      cursor.current = Math.max(0, cursor.current - 1);
      setValue(h[cursor.current]);
    } else if (e.key === "ArrowDown" && h.length) {
      e.preventDefault();
      cursor.current = Math.min(h.length, cursor.current + 1);
      setValue(h[cursor.current] ?? "");
    } else if (e.key === "Tab" && value) {
      // Complete only when it changes something, so Tab still moves focus out of the input.
      const match = [...Object.keys(COMMANDS), "clear"].find((c) => c.startsWith(value.toLowerCase()));
      if (match && match !== value.toLowerCase()) {
        e.preventDefault();
        setValue(match);
      }
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-term-rule bg-term-bg font-mono text-[13px] leading-6 text-term-ink shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between border-b border-term-rule px-4 py-2 text-[12px] text-term-muted">
        <span>terminal</span>
        <span>try: help</span>
      </div>

      <div
        ref={screen}
        onClick={() => {
          // Mouse users can click anywhere to type; on touch this would pop the keyboard unasked.
          if (window.matchMedia("(pointer: fine)").matches) input.current?.focus({ preventScroll: true });
        }}
        className="h-[19rem] overflow-y-auto px-4 py-3 sm:h-[21rem]"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {lines.map((l) => (
          <div key={l.id} className={l.kind === "in" ? "mt-3 first:mt-0" : ""}>
            {l.kind === "in" ? (
              <span>
                <span className="text-term-accent">{PROMPT}</span> {l.body}
              </span>
            ) : (
              <div className={l.kind === "err" ? "text-term-accent" : ""}>{l.body}</div>
            )}
          </div>
        ))}

        <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2">
          <label htmlFor="terminal-input" className="shrink-0 text-term-accent">
            {PROMPT}
          </label>
          <input
            id="terminal-input"
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="send"
            aria-label="Type a terminal command"
            className="min-w-0 flex-1 border-b border-term-rule bg-transparent py-0.5 text-term-ink caret-term-accent outline-none focus:border-term-accent"
          />
        </form>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-term-rule px-3 py-3">
        {SUGGESTED.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => run(c)}
            className="min-h-[44px] rounded-sm border border-term-rule px-3 text-[12px] text-term-muted transition-colors hover:border-term-muted hover:text-term-ink focus-visible:text-term-ink"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
