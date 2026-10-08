/**
 * All portfolio content lives in this file. Every section on the site and the
 * /cv page read from here, so updating content never means editing components.
 *
 * Search for "TODO" to find the parts that still need your input.
 * Write only things that are true: a missing section is better than a made-up one.
 */
import type { Certificate, ContactLink, Deployment, Education, Experience, Project, SkillGroup } from "./types";

import portrait from "../assets/images/avatar.png";
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
  learning: ["Go"] as string[],
};

export const contactLinks: ContactLink[] = [
  { label: "GitHub", handle: "Yusufnova06", href: "https://github.com/Yusufnova06" },
  { label: "LinkedIn", handle: "yusuf-novandra", href: "https://www.linkedin.com/in/yusuf-novandra-74705731a" },
  { label: "Telegram", handle: "@Yusufnovaa", href: "https://t.me/Yusufnovaa" },
  { label: "WhatsApp", handle: "+62 857-2584-1667", href: "https://wa.me/6285725841667" },
];

/** Formspree endpoint used by the contact form */
export const contactFormEndpoint = "https://formspree.io/f/mpwyzgrn";

export const skills: SkillGroup[] = [
  { label: "Backend", items: ["PHP", "Laravel", "RESTful API"] },
  { label: "Data", items: ["PostgreSQL", "MySQL"] },
  { label: "Servers and security", items: ["Website security", "Server & VPS troubleshooting", "Railway", "Cloudflare Tunnel"] },
  { label: "WordPress", items: ["WordPress", "Elementor", "ACF", "Polylang"] },
  { label: "Frontend", items: ["React (Inertia.js)", "JavaScript"] },
  { label: "Tools", items: ["Git", "Claude Code"] },
];

export const projects: Project[] = [
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
      nodes: [
        { id: "client", label: "Browser", note: "React via Inertia", col: 0, row: 0 },
        { id: "app", label: "Laravel", note: "auth + RBAC, CRUD", col: 0, row: 1 },
        { id: "db", label: "PostgreSQL", note: "participants, categories, transactions", col: 0, row: 2 },
      ],
      edges: [
        { from: "client", to: "app", label: "HTTP" },
        { from: "app", to: "db", label: "SQL" },
      ],
    },
    links: [],
  },
  // TODO: GSM / Script Media projects go here once you pick which ones to show.
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
      "Built client websites (media, organisations, culture, tourism) with WordPress and Elementor, from design to launch",
      "Extended Laravel apps, including a WordPress-to-billing integration and backend changes to a store app",
      "Handled security incidents: removed malware and backdoors, closed the holes, restored hacked sites",
      "Troubleshot VPS, FTP, and database issues, and rebuilt hard-to-maintain sites with Custom Post Types and ACF",
    ],
    stack: ["Laravel", "PHP", "WordPress", "MySQL"],
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

/**
 * How you ship. Projects currently go out on Railway; the home server route
 * below is being set up. Update the status when it goes live.
 */
export const deployment: Deployment = {
  title: "Home server behind Cloudflare Tunnel",
  status: "setting up",
  summary:
    "My latest project runs on Railway. I'm moving my own deployments to a home server behind Cloudflare Tunnel: no open ports, no public IP.",
  diagram: {
    nodes: [
      { id: "visitor", label: "Visitor", note: "browser", col: 0, row: 0 },
      { id: "edge", label: "Cloudflare", note: "DNS + TLS at the edge", col: 0, row: 1 },
      { id: "tunnel", label: "cloudflared", note: "outbound tunnel on the home server", col: 0, row: 2 },
      { id: "app", label: "App", note: "served on localhost", col: 0, row: 3 },
    ],
    edges: [
      { from: "visitor", to: "edge", label: "HTTPS" },
      { from: "edge", to: "tunnel", label: "tunnel" },
      { from: "tunnel", to: "app", label: "localhost" },
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
