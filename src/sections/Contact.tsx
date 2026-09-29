import { useState, type FormEvent } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import { contactFormEndpoint, profile, socials } from "../data/portfolio";
import SocialIcon from "../components/SocialIcon";
import { Method, Reveal, SectionHeader } from "../components/ui";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok"; ms: number }
  | { kind: "error"; message: string };

const inputClass =
  "w-full rounded-md border border-line bg-bg px-3 py-2.5 font-mono text-[13px] text-ink placeholder:text-faint/70 transition-colors focus:border-accent/60 focus:outline-none";

export default function Contact() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ kind: "sending" });
    const t0 = performance.now();
    try {
      const res = await fetch(contactFormEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText || "Request failed"}`);
      form.reset();
      setState({ kind: "ok", ms: Math.round(performance.now() - t0) });
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Network error" });
    }
  }

  return (
    <section id="contact" className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <SectionHeader
          index="06"
          method="POST"
          path="/contact"
          title="Get in touch"
          description="Hiring for a backend role, need an API built, or just want to talk databases? Send a request — I usually respond within a day."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Reveal className="flex min-w-0 flex-col gap-6">
            <div className="panel divide-y divide-line">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-raised/60"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-raised text-muted group-hover:text-accent">
                    <SocialIcon icon={s.icon} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[11px] text-faint">{s.label.toLowerCase()}</span>
                    <span className="block truncate text-sm text-ink/90">{s.handle}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="min-w-0">
            <form onSubmit={onSubmit} className="panel overflow-hidden">
              <div className="flex items-center gap-3 border-b border-line bg-raised/50 px-4 py-3">
                <Method>POST</Method>
                <span className="truncate font-mono text-xs text-muted">
                  https://{profile.domain}/api/v1/messages
                </span>
              </div>

              <div className="border-b border-line px-5 py-3 font-mono text-[11px] text-faint">
                <span className="tok-key">Content-Type</span>: application/json
              </div>

              <div className="space-y-4 p-5">
                <div className="font-mono text-[13px] text-faint">{"{"}</div>
                <div className="grid gap-4 pl-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[12px] tok-key">"name"</span>
                    <input name="name" required autoComplete="name" placeholder="Jane Doe" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[12px] tok-key">"email"</span>
                    <input name="email" type="email" required autoComplete="email" placeholder="jane@company.com" className={inputClass} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block font-mono text-[12px] tok-key">"message"</span>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Hi Yusuf, we're building…"
                      className={`${inputClass} resize-y`}
                    />
                  </label>
                </div>
                <div className="font-mono text-[13px] text-faint">{"}"}</div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
                <div className="font-mono text-xs" aria-live="polite">
                  {state.kind === "idle" && <span className="text-faint">ready</span>}
                  {state.kind === "sending" && <span className="text-warn">sending request…</span>}
                  {state.kind === "ok" && (
                    <span className="text-accent">
                      201 Created · {state.ms}ms — thanks, I'll get back to you soon.
                    </span>
                  )}
                  {state.kind === "error" && (
                    <span className="text-danger">
                      {state.message} — try emailing {profile.email}
                    </span>
                  )}
                </div>
                <button type="submit" disabled={state.kind === "sending"} className="btn-primary disabled:opacity-60">
                  send request <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
