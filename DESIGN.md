# Design direction

Chosen by the owner (Yusuf) on 2026-09-30. Future UI work on this repo follows this file, and antislop filters on top of it.

- **Feel:** editorial and calm. The page should read like a carefully set technical document, not a product landing page.
- **Theme:** light by default, with a working dark mode toggle (saved per visitor).
- **Dial:** ENERGY 1 / RHYTHM 2 / MOTION 1

## Decisions and why

| Decision | Reason |
| --- | --- |
| Serif (Newsreader) for headings and body | Editorial voice: long-form reading that feels written, not generated |
| IBM Plex Sans for small UI text (nav, dates, labels) | Engineering-born typeface, kept small so it supports the serif instead of competing |
| Paper `#f6f4ef` and ink `#1d1c1a`, dark `#161513` and `#ebe7de` | Warm neutrals like printed paper; both pairs pass WCAG AA with a wide margin |
| One accent: oxblood `#9b2c1f` (dark: `#e28a6d`) | Like an editor's red pen: only on the primary button, link hover, and focus rings |
| `§ n` numbered sections with a margin column | Identity motif: technical documents and RFCs number their sections, which suits a backend engineer |
| Section spacing varies (projects and contact get more room than skills) | RHYTHM 2: content weight decides the spacing, not a template |
| No animation beyond hover colour changes | MOTION 1: calm page; nothing moves unless the visitor acts |
| No icons | Every link and control has a text label; icons would add a library look without adding meaning |
| Real screenshots only, no illustrations | Evidence over decoration |

## Content rules

- Only real content. No invented numbers, testimonials, or job details. A section with no real data is hidden, not filled.
- No em dashes in copy.
