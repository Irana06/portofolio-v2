const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-07" -> "Jul 2024"; null -> "present" */
export function formatYm(ym: string | null): string {
  if (!ym) return "present";
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[(m || 1) - 1]} ${y}`;
}
