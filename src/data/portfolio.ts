/**
 * ============================================================
 *  SEMUA KONTEN PORTFOLIO ADA DI FILE INI
 * ============================================================
 *  Cukup edit data di bawah — semua section (hero, about, stack,
 *  projects, experience, certificates, contact, dan halaman /cv)
 *  otomatis membaca dari sini. Tidak perlu menyentuh komponen.
 *
 *  Cari "TODO" untuk bagian yang perlu kamu isi / perbarui.
 * ============================================================
 */
import type {
  Certificate,
  Education,
  Experience,
  Project,
  Social,
  StackGroup,
} from "./types";

import avatar from "../assets/images/avatar.png";
import photoCv from "../assets/images/photo-cv.jpg";
import cvFile from "../assets/files/cv-yusuf-novandra.pdf";

import badmintoonImg from "../assets/projects/Badmintoon.jpg";
import reservationImg from "../assets/projects/Reservation.jpg";

import certBootcamp from "../assets/certificates/BootcampFE.png";
import certBootcampPdf from "../assets/certificates/bootcamp.pdf";
import certInternship from "../assets/certificates/InternshipJavan.png";
import certInternshipPdf from "../assets/certificates/internship.pdf";
import certTraining from "../assets/certificates/TrainingLaravel.png";
import certTrainingPdf from "../assets/certificates/trainingLaravel.pdf";
import certSpeaking from "../assets/certificates/PublicSpeaking.png";
import certSpeakingPdf from "../assets/certificates/PublicSpeaking.pdf";

/* ------------------------------------------------------------ */
/*  PROFILE                                                     */
/* ------------------------------------------------------------ */
export const profile = {
  name: "Yusuf Novandra",
  fullName: "Yusuf Novandra Sugiyanto",
  handle: "yusufnova",
  role: "Backend Engineer",
  location: "Sleman, Yogyakarta — Indonesia",
  timezone: "Asia/Jakarta",
  email: "kirainova11@gmail.com",
  phone: "+62 857-2584-1667",
  domain: "yushika.vercel.app",
  avatar,
  photoCv,
  cvFile,
  /** true = tampil badge "open to work" di hero & status bar */
  available: true,
  // TODO: sesuaikan tagline dengan fokus kamu sekarang
  tagline:
    "I design and build the parts users never see — APIs, data models, and services that stay fast, predictable, and boring in production.",
  // TODO: perbarui paragraf about dengan pengalaman setahun terakhir
  about: [
    "Backend-focused engineer with a full-stack background. I started out shipping Laravel + React applications end to end, and over time found myself most at home on the server side: modelling data, designing APIs, and making slow queries fast.",
    "Today I care about clean service boundaries, well-indexed relational schemas, and code that the next engineer can read without a guide. I still ship frontends when needed — but the database is where I like to spend my time.",
  ],
  /** Hal yang sedang kamu dalami — tampil di README section */
  currentlyExploring: [
    // TODO: ganti dengan skill baru yang kamu pelajari tahun ini
    "Queue workers & background jobs",
    "Caching strategies with Redis",
    "Containerised deployments",
  ],
};

/* ------------------------------------------------------------ */
/*  SOCIALS / CONTACT                                           */
/* ------------------------------------------------------------ */
export const socials: Social[] = [
  { label: "GitHub", handle: "Yusufnova06", href: "https://github.com/Yusufnova06", icon: "github" },
  { label: "LinkedIn", handle: "yusuf-novandra", href: "https://www.linkedin.com/in/yusuf-novandra-74705731a", icon: "linkedin" },
  { label: "Email", handle: "kirainova11@gmail.com", href: "mailto:kirainova11@gmail.com", icon: "mail" },
  { label: "Telegram", handle: "@Yusufnovaa", href: "https://t.me/Yusufnovaa", icon: "telegram" },
  { label: "WhatsApp", handle: "+62 857-2584-1667", href: "https://wa.me/6285725841667", icon: "whatsapp" },
];

/** Endpoint Formspree untuk form kontak */
export const contactFormEndpoint = "https://formspree.io/f/mpwyzgrn";

/* ------------------------------------------------------------ */
/*  TECH STACK                                                  */
/*  level: "daily" | "proficient" | "familiar" | "learning"     */
/* ------------------------------------------------------------ */
export const stack: StackGroup[] = [
  {
    key: "languages",
    label: "Languages",
    items: [
      { name: "PHP", level: "daily" },
      { name: "SQL", level: "proficient" },
      { name: "TypeScript", level: "proficient" },
      { name: "JavaScript", level: "proficient" },
    ],
  },
  {
    key: "frameworks",
    label: "Frameworks & Runtime",
    items: [
      { name: "Laravel", level: "daily" },
      { name: "Eloquent ORM", level: "daily" },
      { name: "Livewire", level: "familiar" },
      // TODO: tambahkan framework backend baru, misal { name: "Go / Gin", level: "learning" }
    ],
  },
  {
    key: "data",
    label: "Databases & Storage",
    items: [
      { name: "PostgreSQL", level: "daily" },
      { name: "Query Optimization", level: "proficient" },
      { name: "Redis", level: "learning" },
    ],
  },
  {
    key: "api",
    label: "API & Integration",
    items: [
      { name: "REST API Design", level: "proficient" },
      { name: "Authentication & RBAC", level: "proficient" },
      { name: "Postman", level: "daily" },
    ],
  },
  {
    key: "infra",
    label: "Infra & DevOps",
    items: [
      { name: "Docker", level: "familiar" },
      { name: "Linux (Ubuntu)", level: "familiar" },
      { name: "Git / GitHub / GitLab", level: "daily" },
      { name: "SFTP Deployment", level: "familiar" },
    ],
  },
  {
    key: "frontend",
    label: "Frontend (secondary)",
    items: [
      { name: "React", level: "proficient" },
      { name: "Inertia.js", level: "proficient" },
      { name: "Tailwind CSS", level: "proficient" },
    ],
  },
];

/* ------------------------------------------------------------ */
/*  PROJECTS                                                    */
/*  status: "live" | "in-progress" | "archived"                 */
/* ------------------------------------------------------------ */
export const projects: Project[] = [
  {
    slug: "reservation-system",
    name: "Reservation System",
    summary:
      "Table reservation backend for restaurants — online booking, food & beverage pre-orders, real-time availability, and email confirmations.",
    highlights: [
      "Availability engine that resolves overlapping bookings per table and time slot",
      "Order and reservation flows wrapped in DB transactions to keep stock and slots consistent",
      "Queued email notifications for booking confirmations",
    ],
    stack: ["Laravel", "PostgreSQL", "Inertia", "React"],
    status: "in-progress",
    year: "2025",
    image: reservationImg,
    links: [],
  },
  {
    slug: "badmintoon-portal",
    name: "Badmintoon Portal",
    summary:
      "Badminton tournament platform for participant registration, player profiles, competition categories, and match scheduling.",
    highlights: [
      "Relational schema for participants, categories, and transactions — normalised and indexed for reporting queries",
      "Authentication with role-based access control for admins, committees, and players",
      "Full CRUD modules backed by validated form requests and policies",
    ],
    stack: ["Laravel", "PostgreSQL", "Inertia", "React", "Tailwind"],
    status: "archived",
    year: "2024",
    image: badmintoonImg,
    links: [],
  },
  // TODO: tambahkan project backend dari setahun terakhir. Contoh:
  // {
  //   slug: "order-service",
  //   name: "Order Service",
  //   summary: "REST API untuk ...",
  //   highlights: ["...", "..."],
  //   stack: ["Laravel", "Redis", "Docker"],
  //   status: "live",
  //   year: "2026",
  //   metrics: [{ label: "p95 latency", value: "120ms" }],
  //   links: [{ label: "source", href: "https://github.com/..." }],
  // },
];

/* ------------------------------------------------------------ */
/*  EXPERIENCE  (urutkan dari yang terbaru)                      */
/* ------------------------------------------------------------ */
export const experience: Experience[] = [
  {
    // TODO: ganti dengan pekerjaan kamu setahun terakhir
    role: "Backend Developer",
    company: "Your Company",
    location: "Yogyakarta",
    type: "Full-time",
    start: "2025-02",
    end: null,
    points: [
      "TODO: describe the services / APIs you own",
      "TODO: a measurable impact (e.g. reduced query time by 60%)",
      "TODO: infra or process you improved",
    ],
    stack: ["Laravel", "PostgreSQL"],
  },
  {
    role: "PHP & React Programmer Intern",
    company: "PT Javan Cipta Solusi",
    companyUrl: "https://javan.co.id",
    location: "Sleman, Yogyakarta",
    type: "Internship · 6 months",
    start: "2024-07",
    end: "2025-01",
    points: [
      "Built internal and client-facing web applications with Laravel and React (TypeScript)",
      "Implemented CRUD modules and optimised backend database queries for better performance",
      "Designed and consumed RESTful APIs; shipped features through Git-based review and Agile sprints",
      "Assisted in debugging, testing, and deployment of existing applications",
    ],
    stack: ["Laravel", "PostgreSQL", "React", "TypeScript", "GitLab"],
  },
];

/* ------------------------------------------------------------ */
/*  EDUCATION                                                   */
/* ------------------------------------------------------------ */
export const education: Education[] = [
  { degree: "Bachelor of Information Systems (ongoing)", school: "Universitas Terbuka", period: "2025 — present" },
  { degree: "Vocational High School — Software Engineering", school: "SMK Muhammadiyah Pakem", period: "2022 — 2025" },
];

/* ------------------------------------------------------------ */
/*  CERTIFICATES (urutkan dari yang terbaru)                     */
/* ------------------------------------------------------------ */
export const certificates: Certificate[] = [
  {
    name: "Internship Program — Programmer",
    issuer: "PT Javan Cipta Solusi",
    category: "internship",
    date: "2025-01",
    image: certInternship,
    file: certInternshipPdf,
  },
  {
    name: "Mini Bootcamp — Optimalisasi Task dengan Alurkerja untuk Front End",
    issuer: "Geek Academy",
    category: "bootcamp",
    date: "2024-11",
    image: certBootcamp,
    file: certBootcampPdf,
  },
  {
    name: "Meningkatkan Kemampuan Dasar Pemrograman Web dengan Pelatihan dan Pengembangan Framework",
    issuer: "HIMA Teknik Komputer — Universitas Teknologi Yogyakarta",
    category: "training",
    date: "2024-05",
    image: certTraining,
    file: certTrainingPdf,
  },
  {
    name: "Let's Be A Great Master of Ceremony",
    issuer: "Prodamat — MPAI UAD",
    category: "soft-skill",
    date: "2023-11",
    image: certSpeaking,
    file: certSpeakingPdf,
  },
];

/* ------------------------------------------------------------ */
/*  LANGUAGES (untuk halaman /cv)                               */
/* ------------------------------------------------------------ */
export const languages = [
  { name: "Indonesian", level: "Native" },
  { name: "English", level: "Intermediate" },
];
