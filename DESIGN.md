# Design direction

Chosen by the owner (Yusuf). Future UI work on this repo follows this file, and antislop filters on top of it.

- **Feel:** a backend engineer's portfolio. Editorial typography carries the reading; the backend and DevOps character comes from real technical content (a working terminal, architecture diagrams, stack labels), not from decoration.
- **Theme:** dark by default (the audience is technical and the owner wants a dev feel), with a working light mode toggle saved per visitor.
- **Motion:** GSAP ScrollTrigger, requested by the owner.
- **Dial:** ENERGY 2 / RHYTHM 2 / MOTION 3

## Owner overrides (antislop R-37)

| Pattern | Rule | Decision |
| --- | --- | --- |
| Terminal window in the hero | R-05 (fake terminal as hero visual) | **Kept by the owner** (2026-09-30). Built as a working terminal: every command answers from `src/data/portfolio.ts`, nothing auto-types, no invented output such as latency or status codes. |

## Decisions and why

| Decision | Reason |
| --- | --- |
| Newsreader (serif) for headings and prose | Editorial voice; keeps the page reading like it was written, not generated |
| IBM Plex Sans for UI text, IBM Plex Mono for technical text | Engineering-born family; mono only where the content is technical (terminal, stack, dates, diagrams) |
| Dark `#161513` / ink `#ebe7de`; light `#f6f4ef` / `#1d1c1a` | Warm neutrals; both pairs pass WCAG AA with a wide margin (14.8:1 and 15.5:1) |
| One accent: `#e28a6d` in dark, `#9b2c1f` in light | Used for the primary button, the terminal prompt, `§` numbers, the timeline progress, and the request dot |
| `§ n` numbered sections with a margin column | Identity motif: technical documents and RFCs number their sections |
| Terminal keeps a dark surface in both themes | It is the one focal point of the hero |
| Architecture diagram per project, drawn on scroll with a travelling request dot | Motion with a purpose: it shows the order data moves through the system. Scrubbed to scroll, never looping |
| Experience timeline line fills on scroll | Shows the reader where they are in the timeline |
| All motion off under `prefers-reduced-motion` | Diagrams and timeline render complete and static |
| No icon library | Every control has a text label |

## Content rules

- Only real content. No invented numbers, testimonials, or job details. A section with no real data is hidden, not filled.
- Diagrams show only components the project really uses.
- No em dashes in copy.
