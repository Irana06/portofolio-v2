# Design direction

Chosen by the owner (Yusuf). Future UI work on this repo follows this file, and antislop filters on top of it.

- **Feel:** a backend engineer's portfolio. Editorial typography carries the reading; the backend and DevOps character comes from real technical content (a working terminal, architecture diagrams, stack labels), not from decoration.
- **Theme:** dark by default (the audience is technical and the owner wants a dev feel), with a working light mode toggle saved per visitor.
- **Motion:** GSAP ScrollTrigger, requested by the owner.
- **Layout:** full width (owner request, 2026-10-01). Content runs edge to edge with a growing side gutter; long text keeps a 68ch measure.
- **Dial:** ENERGY 3 / RHYTHM 3 / MOTION 3 (raised by the owner, who found the calmer version plain)

## Owner overrides (antislop R-37)

| Pattern | Rule | Decision |
| --- | --- | --- |
| Terminal window in the hero | R-05 (fake terminal as hero visual) | **Kept by the owner** (2026-09-30). Built as a working terminal: every command answers from `src/data/portfolio.ts`, nothing auto-types, no invented output such as latency or status codes. |
| Particle background | R-07 (background pattern), R-19 (endless motion) | **Requested by the owner** (2026-10-01), made more varied on request: a starfield in three depth layers (parallax on scroll and cursor), twinkling stars in neutral, bright, and accent tints, pulsing hub nodes, a network linking mid/near stars, packets with short trails hopping along links (the request motif), an occasional meteor, and a ripple plus packet burst when empty space is clicked. Low opacity behind text, paused when the tab is hidden, a still frame under reduced motion. |
| Custom cursor | Not a named pattern; noted because it replaces a system control | **Requested by the owner** (2026-10-01). Mouse only; the system I-beam returns in text fields and the system pointer returns while a dialog is open. |

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
| "Inside a request" pinned section (desktop) | Scrolling moves one booking request sideways through each layer of the stack, with a rail showing the current layer. It shows backend thinking instead of claiming it. Plain list on phones and with reduced motion |
| Diagram nodes highlight their connections on hover/tap; "replay request" button | Lets the visitor trace the flow themselves instead of only watching it |
| Skill explorer | Each skill shows the real projects and jobs that use it, computed from the data; an honest empty state when none do |
| Name rises letter by letter on load; section titles slide in once | Sets the pace at the top of each part of the page, runs once |
| Reading progress bar | Shows how much of the page is left |
| Screenshot parallax, certificate preview following the cursor (desktop) | Depth and a quick look without opening the dialog |
| Sticky header with active-section highlight | Navigation stays one click away on a long page, and shows where the reader is |
| Mobile menu as a side drawer | Owner request; numbered like the sections, closes on link tap, Escape, or backdrop tap, and locks page scroll while open |
| All motion off under `prefers-reduced-motion` | Diagrams and timeline render complete and static |
| No icon library | Every control has a text label |

## Content rules

- Only real content. No invented numbers, testimonials, or job details. A section with no real data is hidden, not filled.
- Diagrams show only components the project really uses.
- No em dashes in copy.
