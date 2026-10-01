export interface SkillGroup {
  label: string;
  items: string[];
}

/**
 * A small architecture diagram. Nodes sit on a grid (col 0-1, row 0-3);
 * edges connect node ids. Keep it to what the system really does.
 */
export interface Diagram {
  nodes: { id: string; label: string; note?: string; col: 0 | 1; row: number }[];
  edges: { from: string; to: string; label?: string }[];
}

export type ProjectStatus = "in-progress" | "finished";

export interface Project {
  slug: string;
  name: string;
  year: string;
  status: ProjectStatus;
  /** One or two sentences: what the system does and who uses it */
  summary: string;
  /** What you built. Only list work you actually did. */
  work: string[];
  stack: string[];
  image?: string;
  diagram?: Diagram;
  links?: { label: string; href: string }[];
}

export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  location?: string;
  type: string;
  /** "YYYY-MM" */
  start: string;
  /** "YYYY-MM", or null if you still work there */
  end: string | null;
  /** Optional one-line context under the company, e.g. a second company you work for */
  note?: string;
  links?: { label: string; href: string }[];
  points: string[];
  stack: string[];
}

export interface Certificate {
  name: string;
  issuer: string;
  /** "YYYY-MM" */
  date: string;
  image?: string;
  file?: string;
}

export interface Education {
  degree: string;
  school: string;
  period: string;
}

export interface ContactLink {
  label: string;
  handle: string;
  href: string;
}

/** How you deploy, shown under Skills as a diagram */
export interface Deployment {
  title: string;
  status: string;
  summary: string;
  diagram: Diagram;
}
