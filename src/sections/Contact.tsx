import { useState, type FormEvent } from "react";
import { contactFormEndpoint, contactLinks, profile } from "../data/portfolio";
import Section from "../components/Section";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "failed" };

const field =
  "mt-1.5 w-full rounded-sm border border-edge bg-paper px-3 py-2.5 font-sans text-base text-ink placeholder:text-muted";

export default function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch(contactFormEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus({ kind: "sent" });
    } catch {
      setStatus({ kind: "failed" });
    }
  }

  return (
    <Section id="contact" number={5} title="Contact" spacing="py-16 md:py-24">
      <p className="text-xl md:text-2xl">
        Email is the quickest way to reach me:
        <a href={`mailto:${profile.email}`} className="mt-1 block w-fit decoration-accent [overflow-wrap:anywhere]">
          {profile.email}
        </a>
      </p>

      <ul className="mt-6 grid gap-x-8 gap-y-1 font-sans text-[15px] sm:grid-cols-2">
        {contactLinks.map((l) => (
          <li key={l.href}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2">
              <span className="text-muted">{l.label}</span>
              <span>{l.handle}</span>
            </a>
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmit} className="mt-12 max-w-xl space-y-5 border-t border-rule pt-8">
        <p>Or leave a message here and I'll reply by email.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block font-sans text-sm font-medium">
            Name
            <input name="name" required autoComplete="name" placeholder="Your name" className={field} />
          </label>
          <label className="block font-sans text-sm font-medium">
            Email
            <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} />
          </label>
        </div>
        <label className="block font-sans text-sm font-medium">
          Message
          <textarea name="message" required rows={5} placeholder="What would you like to talk about?" className={`${field} resize-y`} />
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={status.kind === "sending"} className="btn-primary disabled:cursor-wait disabled:opacity-70">
            {status.kind === "sending" ? "Sending…" : "Send message"}
          </button>
          <p role="status" className="font-sans text-sm">
            {status.kind === "sent" && "Message sent. I'll reply to the address you gave."}
            {status.kind === "failed" && (
              <span>
                The message didn't go through. Please email me at{" "}
                <a href={`mailto:${profile.email}`}>{profile.email}</a> instead.
              </span>
            )}
          </p>
        </div>
      </form>
    </Section>
  );
}
