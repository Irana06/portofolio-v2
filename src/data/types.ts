export interface SkillGroup {
  label: string;
  items: string[];
}

/**
 * A small BPMN-style flow. Lanes are columns (the app's lane first); steps sit on
 * a grid of lane x row and the flow reads top to bottom.
 * Keep it to what the system really does.
 */
export type FlowStepKind = "start" | "task" | "decision" | "data" | "end";

export interface Diagram {
  lanes: string[];
  steps: { id: string; kind: FlowStepKind; label: string; lane: number; row: number }[];
  /**
   * sequence: the next step (solid). data: reads or writes a data store (dotted).
   * message: a call to an outside service (dashed).
   * route "hv" goes sideways first, then down; the default for a step in another
   * lane and row is down first, then sideways.
   */
  flows: { from: string; to: string; label?: string; kind?: "sequence" | "data" | "message"; route?: "hv" | "vh" }[];
}

export type ProjectStatus = "in-progress" | "in-review" | "finished";

export interface Project {
  slug: string;
  name: string;
  year: string;
  status: ProjectStatus;
  /** Optional short context shown next to the status, e.g. "company project" */
  context?: string;
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

/** A client website listed compactly (one line each), not as a full project card */
export interface ClientSite {
  name: string;
  /** What the site is and what you did, in a few words */
  note: string;
  href?: string;
}
