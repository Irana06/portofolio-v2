export type Level = "daily" | "proficient" | "familiar" | "learning";

export interface StackItem {
  name: string;
  level: Level;
}

export interface StackGroup {
  /** Nama grup, tampil sebagai key di "stack.yaml" */
  key: string;
  label: string;
  items: StackItem[];
}

export type ProjectStatus = "live" | "in-progress" | "archived";

export interface Project {
  slug: string;
  name: string;
  /** Satu kalimat ringkas tentang apa yang dikerjakan service ini */
  summary: string;
  /** Poin teknis: arsitektur, keputusan desain, optimasi, dll. */
  highlights: string[];
  stack: string[];
  status: ProjectStatus;
  year: string;
  /** Metrik opsional, misal { label: "p95 latency", value: "120ms" } */
  metrics?: { label: string; value: string }[];
  links?: { label: string; href: string }[];
  image?: string;
}

export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  type: string;
  /** Format "YYYY-MM" supaya bisa diurutkan & ditampilkan seperti log */
  start: string;
  /** Kosongkan / isi null jika masih bekerja di sana */
  end: string | null;
  points: string[];
  stack: string[];
}

export interface Certificate {
  name: string;
  issuer: string;
  category: string;
  /** Format "YYYY-MM" */
  date: string;
  image?: string;
  file?: string;
}

export interface Education {
  degree: string;
  school: string;
  period: string;
}

export interface Social {
  label: string;
  handle: string;
  href: string;
  icon: "github" | "linkedin" | "telegram" | "instagram" | "mail" | "whatsapp";
}
