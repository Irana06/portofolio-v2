import type { Experience } from "../data/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseYm(ym: string): Date {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, (m || 1) - 1, 1);
}

/** "2024-07" -> "Jul 2024" */
export function formatYm(ym: string | null): string {
  if (!ym) return "Present";
  const d = parseYm(ym);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function monthsBetween(start: string, end: string | null): number {
  const s = parseYm(start);
  const e = end ? parseYm(end) : new Date();
  return Math.max(1, (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1);
}

/** Durasi satu pengalaman, misal "1 yr 3 mos" */
export function duration(start: string, end: string | null): string {
  const total = monthsBetween(start, end);
  const y = Math.floor(total / 12);
  const m = total % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
  if (m) parts.push(`${m} mo${m > 1 ? "s" : ""}`);
  return parts.join(" ");
}

/** Total pengalaman kerja dalam tahun (dibulatkan 0.5) */
export function totalYears(items: Experience[]): number {
  const months = items.reduce((acc, x) => acc + monthsBetween(x.start, x.end), 0);
  return Math.round((months / 12) * 2) / 2;
}
