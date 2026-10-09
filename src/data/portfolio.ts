/**
 * All portfolio content lives in this file. Every section on the site and the
 * /cv page read from here, so updating content never means editing components.
 *
 * Search for "TODO" to find the parts that still need your input.
 * Write only things that are true: a missing section is better than a made-up one.
 */
import type { Certificate, ClientSite, ContactLink, Deployment, Education, Experience, Project, SkillGroup } from "./types";

import portrait from "../assets/images/avatar.webp";
import photoCv from "../assets/images/photo-cv.jpg";
import cvFile from "../assets/files/cv-yusuf-novandra.pdf";

import badmintoonImg from "../assets/projects/Badmintoon.jpg";

import certBootcamp from "../assets/certificates/BootcampFE.png";
import certBootcampPdf from "../assets/certificates/bootcamp.pdf";
import certInternship from "../assets/certificates/InternshipJavan.png";
import certInternshipPdf from "../assets/certificates/internship.pdf";
import certTraining from "../assets/certificates/TrainingLaravel.png";
import certTrainingPdf from "../assets/certificates/trainingLaravel.pdf";
import certSpeaking from "../assets/certificates/PublicSpeaking.png";
import certSpeakingPdf from "../assets/certificates/PublicSpeaking.pdf";

export const profile = {
  name: "Yusuf Novandra",
  fullName: "Yusuf Novandra Sugiyanto",
  role: "Full-stack developer, backend focus",
  location: "Sleman, Yogyakarta",
  email: "kirainova11@gmail.com",
  phone: "+62 857-2584-1667",
  website: "yushika.my.id",
  portrait,
  photoCv,
  cvFile,
  /** Shown under the intro. Set to "" to hide it. */
  availability: "Open to backend roles, full-time or contract.",
  intro:
    "I build web applications with Laravel, React (Inertia.js), and PostgreSQL, and I look after the server side when something breaks: security incidents, hosting, and maintenance.",
  about: [
    "8 months at CV Genta Sandi Mandiri (GSM Studio) building client websites and Laravel apps, and cleaning up hacked sites. Before that, a 6-month PHP internship at PT Javan Cipta Solusi.",
  ],
  /** Things you're learning right now. Leave empty to hide the line. */
  learning: ["Go", "Flutter", "Unity"] as string[],
};

export const contactLinks: ContactLink[] = [
  { label: "GitHub", handle: "Irana06", href: "https://github.com/Irana06" },
  { label: "LinkedIn", handle: "yusuf-novandra", href: "https://www.linkedin.com/in/yusuf-novandra-74705731a" },
  { label: "Telegram", handle: "@Yusufnovaa", href: "https://t.me/Yusufnovaa" },
  { label: "WhatsApp", handle: "+62 857-2584-1667", href: "https://wa.me/6285725841667" },
];

/** Formspree endpoint used by the contact form */
export const contactFormEndpoint = "https://formspree.io/f/mpwyzgrn";

export const skills: SkillGroup[] = [
  { label: "Backend", items: ["PHP", "Laravel", "Livewire", "RESTful API", "Payment gateway (Midtrans)"] },
  { label: "Data", items: ["PostgreSQL", "MySQL"] },
  { label: "Servers and security", items: ["Website security", "Server & VPS troubleshooting", "Cloudflare Tunnel"] },
  { label: "WordPress", items: ["WordPress", "Elementor", "ACF", "Polylang"] },
  { label: "Frontend", items: ["React (Inertia.js)", "JavaScript"] },
  { label: "Tools", items: ["Git", "Railway", "Claude Code"] },
];

export const projects: Project[] = [
  {
    slug: "ruangkelas-lms",
    name: "RuangKelas (school LMS)",
    year: "2026",
    status: "in-review",
    context: "company project, Script Media",
    summary:
      "LMS template for schools: one install per school, with admin, teacher, student, and parent roles.",
    work: [
      "Two-layer authorization: role middleware on routes, plus data scoped per teacher, homeroom class, and approved parent",
      "Weighted final grades with an audit trail, and quizzes shuffled per student with automatic scoring",
      "Account import from Dapodik/EMIS Excel files and ZIP backup/restore, deployed on cPanel",
    ],
    stack: ["Laravel", "PHP", "Livewire", "MySQL", "Pest"],
    diagram: {
      lanes: ["Laravel app", "MySQL"],
      steps: [
        { id: "start", kind: "start", label: "User logs in", lane: 0, row: 0 },
        { id: "role", kind: "task", label: "Check role, scope data to the user", lane: 0, row: 1 },
        { id: "grade", kind: "task", label: "Teacher enters grades and quizzes", lane: 0, row: 2 },
        { id: "db", kind: "data", label: "grades, quizzes, audit log", lane: 1, row: 2 },
        { id: "pdf", kind: "task", label: "Generate PDF report card", lane: 0, row: 3 },
        { id: "end", kind: "end", label: "Report card ready", lane: 0, row: 4 },
      ],
      flows: [
        { from: "start", to: "role" },
        { from: "role", to: "grade" },
        { from: "grade", to: "db", kind: "data", label: "save" },
        { from: "grade", to: "pdf" },
        { from: "db", to: "pdf", kind: "data", label: "read" },
        { from: "pdf", to: "end" },
      ],
    },
    links: [],
  },
  {
    slug: "sewa-toko-online",
    name: "Sewa Toko Online",
    year: "2026",
    status: "in-review",
    context: "company project, Script Media",
    summary:
      "E-commerce rental platform: a storefront app for shoppers and an internal panel for plans, subscriptions, and invoices.",
    work: [
      "Two Laravel apps: toko-engine (catalog, cart, guest checkout, orders) and toko-panel (plans, tenants, recurring invoices)",
      "Midtrans payments (sandbox) and per-plan limits on products and payment channels",
      "Per-tenant database provisioning with stancl/tenancy",
    ],
    stack: ["Laravel", "PHP", "Livewire", "Midtrans", "stancl/tenancy"],
    diagram: {
      lanes: ["toko-engine", "Panel DB", "Midtrans"],
      steps: [
        { id: "start", kind: "start", label: "Shopper checks out", lane: 0, row: 0 },
        { id: "order", kind: "task", label: "Create order", lane: 0, row: 1 },
        { id: "limits", kind: "data", label: "plan limits", lane: 1, row: 1 },
        { id: "pay", kind: "task", label: "Send to payment", lane: 0, row: 2 },
        { id: "midtrans", kind: "task", label: "Shopper pays", lane: 2, row: 2 },
        { id: "paid", kind: "task", label: "Update order status", lane: 0, row: 3 },
        { id: "end", kind: "end", label: "Order paid", lane: 0, row: 4 },
      ],
      flows: [
        { from: "start", to: "order" },
        { from: "limits", to: "order", kind: "data", label: "check" },
        { from: "order", to: "pay" },
        { from: "pay", to: "midtrans", kind: "message", label: "pay" },
        { from: "midtrans", to: "paid", kind: "message", label: "status" },
        { from: "paid", to: "end" },
      ],
    },
    links: [],
  },
  {
    slug: "monshika",
    name: "Monshika",
    year: "2026",
    status: "finished",
    context: "own product, Shicomp (my business)",
    summary: "Personal finance app (Flutter). Data stays on the phone, with an optional encrypted backup.",
    work: [
      "Local-first data in SQLite (Drift): works offline, with CSV/Excel/PDF export and CSV import",
      "Optional backup to the user's own Google Drive app folder, encrypted with AES-256-GCM, scheduled in the background",
      "Live exchange rates for 200+ currencies, gold, and crypto; 8 Android home-screen widgets",
    ],
    stack: ["Flutter", "Riverpod", "SQLite (Drift)", "Google Drive API"],
    diagram: {
      lanes: ["Flutter app", "On device", "Cloud"],
      steps: [
        { id: "start", kind: "start", label: "User adds a transaction", lane: 0, row: 0 },
        { id: "save", kind: "task", label: "Save, works offline", lane: 0, row: 1 },
        { id: "db", kind: "data", label: "SQLite (Drift)", lane: 1, row: 1 },
        { id: "backup", kind: "decision", label: "Backup on?", lane: 0, row: 2 },
        { id: "local", kind: "end", label: "Stays on phone", lane: 1, row: 2 },
        { id: "encrypt", kind: "task", label: "Encrypt (AES-256)", lane: 0, row: 3 },
        { id: "drive", kind: "data", label: "Google Drive", lane: 2, row: 3 },
        { id: "end", kind: "end", label: "Backed up", lane: 0, row: 4 },
      ],
      flows: [
        { from: "start", to: "save" },
        { from: "save", to: "db", kind: "data", label: "write" },
        { from: "save", to: "backup" },
        { from: "backup", to: "local", label: "no" },
        { from: "backup", to: "encrypt", label: "yes" },
        { from: "encrypt", to: "drive", kind: "message", label: "upload" },
        { from: "encrypt", to: "end" },
      ],
    },
    links: [{ label: "Source", href: "https://github.com/Irana06/monshika" }],
  },
  {
    slug: "badmintoon-portal",
    name: "Badmintoon Portal",
    year: "2024",
    status: "finished",
    summary: "Tournament portal for participant registration, competition categories, and match scheduling.",
    work: [
      "CRUD for participants, categories, and transactions",
      "Authentication with role-based access control",
      "Relational database design in PostgreSQL",
    ],
    stack: ["Laravel", "PostgreSQL", "React (Inertia.js)"],
    image: badmintoonImg,
    diagram: {
      lanes: ["Laravel", "PostgreSQL", "React"],
      steps: [
        { id: "start", kind: "start", label: "Participant signs up", lane: 0, row: 0 },
        { id: "auth", kind: "task", label: "Log in, role check", lane: 0, row: 1 },
        { id: "register", kind: "task", label: "Register for a category", lane: 0, row: 2 },
        { id: "db", kind: "data", label: "participants", lane: 1, row: 2 },
        { id: "page", kind: "task", label: "Show the schedule", lane: 2, row: 3 },
        { id: "end", kind: "end", label: "Schedule on screen", lane: 2, row: 4 },
      ],
      flows: [
        { from: "start", to: "auth" },
        { from: "auth", to: "register" },
        { from: "register", to: "db", kind: "data", label: "save" },
        { from: "register", to: "page", label: "Inertia" },
        { from: "page", to: "end" },
      ],
    },
    links: [],
  },
];

/**
 * Websites from GSM Studio / Script Media, listed one line each under Projects.
 * Link only sites that are live on their own domain (not previews or staging).
 */
export const clientSites: ClientSite[] = [
  { name: "AMAN (Aliansi Masyarakat Adat Nusantara)", note: "client, organisation profile website" },
  { name: "AJMAN (Asosiasi Jurnalis Masyarakat Adat Nusantara)", note: "client, organisation website" },
  { name: "GPI (Garasi Performance Institute)", note: "client, institute website" },
  { name: "Yudi Ahmad Tajudin", note: "client, personal profile website" },
  { name: "Atmakanta", note: "client, rebuild of the site on a new model" },
  { name: "Pondok Panggung", note: "client, maintenance and continued development", href: "https://pondokpanggung.com" },
  { name: "Script Media", note: "company's own website, contributed", href: "https://script-media.net" },
];

export const experience: Experience[] = [
  {
    role: "Project Developer",
    company: "CV Genta Sandi Mandiri (GSM Studio)",
    location: "Mergangsan, Yogyakarta",
    type: "WordPress, Laravel & server maintenance",
    start: "2026-04",
    end: "2026-10",
    note: "Also worked on Script Media projects.",
    links: [{ label: "script-media.net", href: "https://script-media.net" }],
    points: [
      "Built e-commerce and school LMS products in Laravel for Script Media",
      "Extended Laravel apps, including a WordPress-to-billing integration and backend changes to a store app",
      "Handled security incidents: removed malware and backdoors, closed the holes, restored hacked sites; troubleshot VPS, FTP, and database issues",
      "Built client websites (media, organisations, culture, tourism) with WordPress and Elementor, from design to launch",
    ],
    stack: ["Laravel", "PHP", "Livewire", "WordPress", "MySQL"],
  },
  {
    role: "WordPress Developer (training)",
    company: "CV Genta Sandi Mandiri (GSM Studio)",
    location: "Mergangsan, Yogyakarta",
    type: "Training",
    start: "2026-02",
    end: "2026-04",
    points: ["Learned WordPress development end to end (themes, plugins, Elementor, Custom Post Types, ACF) on internal projects"],
    stack: [],
  },
  {
    role: "PHP Programmer (intern)",
    company: "PT Javan Cipta Solusi",
    companyUrl: "https://javan.co.id",
    location: "Sleman, Yogyakarta",
    type: "Internship",
    start: "2024-07",
    end: "2025-01",
    points: [
      "Built and maintained full-stack web apps with Laravel and React (Inertia.js)",
      "Wrote, tested, and shipped new features with the team",
      "Debugged and fixed issues in existing applications",
    ],
    stack: ["Laravel", "PostgreSQL", "React (Inertia.js)"],
  },
];

export const deployment: Deployment = {
  title: "Home server behind Cloudflare Tunnel",
  status: "live",
  summary:
    "My own projects run on a home server behind Cloudflare Tunnel: no open ports, no public IP.",
  diagram: {
    lanes: ["Home server", "Cloudflare", "Visitor"],
    steps: [
      { id: "start", kind: "start", label: "Deploy a project", lane: 0, row: 0 },
      { id: "app", kind: "task", label: "App runs on localhost", lane: 0, row: 1 },
      { id: "tunnel", kind: "task", label: "cloudflared, no open ports", lane: 0, row: 2 },
      { id: "edge", kind: "task", label: "DNS + TLS", lane: 1, row: 2 },
      { id: "end", kind: "end", label: "Site over HTTPS", lane: 2, row: 3 },
    ],
    flows: [
      { from: "start", to: "app" },
      { from: "app", to: "tunnel" },
      { from: "tunnel", to: "edge", kind: "message", label: "tunnel" },
      { from: "edge", to: "end", label: "HTTPS" },
    ],
  },
};

export const education: Education[] = [
  { degree: "Bachelor of Information Systems (in progress)", school: "Universitas Terbuka", period: "2025 to present" },
  { degree: "Vocational High School, Software Engineering", school: "SMKS Muhammadiyah Pakem", period: "Aug 2022 to May 2025" },
];

export const certificates: Certificate[] = [
  {
    name: "Program Pemagangan di PT Javan Cipta Solusi",
    issuer: "PT Javan Cipta Solusi",
    date: "2025-01",
    image: certInternship,
    file: certInternshipPdf,
  },
  {
    name: "Mini BootCamp: Optimalisasi Task dengan Alurkerja untuk Front End",
    issuer: "Geek Academy",
    date: "2024-11",
    image: certBootcamp,
    file: certBootcampPdf,
  },
  {
    name: "Meningkatkan Kemampuan Dasar Pemrograman Web dengan Pelatihan dan Pengembangan Framework",
    issuer: "Himpunan Mahasiswa Teknik Komputer, Universitas Teknologi Yogyakarta",
    date: "2024-05",
    image: certTraining,
    file: certTrainingPdf,
  },
  {
    name: "Let's Be A Great Master of Ceremony",
    issuer: "Prodamat-MPAI UAD",
    date: "2023-11",
    image: certSpeaking,
    file: certSpeakingPdf,
  },
];

/** Shown on the /cv page */
export const languages = [
  { name: "Indonesian", level: "Native" },
  { name: "English", level: "Basic to intermediate" },
];
