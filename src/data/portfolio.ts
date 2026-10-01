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
import reservationImg from "../assets/projects/Reservation.jpg";

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
  role: "Backend developer",
  location: "Sleman, Yogyakarta",
  email: "kirainova11@gmail.com",
  phone: "+62 857-2584-1667",
  website: "yushika.vercel.app",
  portrait,
  photoCv,
  cvFile,
  /** Shown under the intro. Set to "" to hide it. */
  availability: "Open to backend roles, full-time or contract.",
  // TODO: rewrite these in your own words when you have a moment.
  intro:
    "I build web applications with Laravel and PostgreSQL. I started out as a full-stack developer shipping Laravel and React apps end to end, and the part I keep coming back to is the backend: how the data is modelled, how the queries run, and what the API hands to the frontend.",
  about: [
    "Since February 2026 I've worked in Project Development at CV Genta Sandi Mandiri, first as a trainee and from April as an internal employee, on projects for GSM and Script Media: Laravel e-commerce and LMS builds, WordPress sites, client maintenance, and fixing servers that had been hacked.",
    "Before that I did a six-month programmer internship at PT Javan Cipta Solusi in Sleman, working on internal and client applications with Laravel, React, and PostgreSQL alongside senior developers.",
    "I'm currently studying Information Systems at Universitas Terbuka.",
  ],
  /** Things you're learning right now. Leave empty to hide the line. */
  learning: ["self-hosting on a home server behind Cloudflare Tunnel"] as string[],
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
  { label: "Languages", items: ["PHP", "SQL", "TypeScript", "JavaScript"] },
  { label: "Backend", items: ["Laravel", "REST APIs", "Authentication and role-based access", "Livewire", "WordPress", "Backend problem solving"] },
  { label: "Data", items: ["PostgreSQL", "Query optimisation", "DBeaver"] },
  { label: "Deployment and servers", items: ["Fixing hacked servers", "Railway", "Cloudflare Tunnel (setting up)", "Docker", "Ubuntu", "FileZilla"] },
  { label: "Tooling", items: ["Git, GitHub, GitLab", "Claude Code", "Postman"] },
  { label: "Frontend, when needed", items: ["React", "Inertia.js", "Tailwind CSS"] },
  // TODO: add the tools you picked up this year.
];

export const projects: Project[] = [
  {
    slug: "reservation-system",
    name: "Reservation System",
    year: "2025",
    status: "in-progress",
    summary:
      "A table reservation system for a restaurant. Customers book a table online, order food and drinks ahead, see which tables are free, and get an email confirmation.",
    work: [
      "Online table booking and food and drink ordering, stored in PostgreSQL",
      "Table availability shown to customers as they book",
      "Email confirmation sent after each reservation",
    ],
    stack: ["Laravel", "PostgreSQL", "Inertia.js", "React"],
    image: reservationImg,
    diagram: {
      nodes: [
        { id: "client", label: "Browser", note: "React via Inertia", col: 0, row: 0 },
        { id: "app", label: "Laravel", note: "booking + ordering", col: 0, row: 1 },
        { id: "mail", label: "Mail", note: "confirmation", col: 1, row: 1 },
        { id: "db", label: "PostgreSQL", note: "bookings, orders", col: 0, row: 2 },
      ],
      edges: [
        { from: "client", to: "app", label: "HTTP" },
        { from: "app", to: "db", label: "SQL" },
        { from: "app", to: "mail", label: "send" },
      ],
    },
    // TODO: add { label: "Source", href: "https://github.com/..." } if the repo is public.
    links: [],
  },
  {
    slug: "badmintoon-portal",
    name: "Badmintoon Portal",
    year: "2024",
    status: "finished",
    summary:
      "A portal for running a badminton tournament: participant registration, player profiles, competition categories, and match scheduling.",
    work: [
      "CRUD modules for participants, competition categories, and transactions",
      "User authentication with role-based access control",
      "The relational database design, optimised for efficient data handling",
    ],
    stack: ["Laravel", "PostgreSQL", "Inertia.js", "React", "Tailwind CSS"],
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
  // TODO: add the backend projects from the past year here, newest first.
];

export const experience: Experience[] = [
  {
    role: "Project Development",
    company: "CV Genta Sandi Mandiri",
    // TODO: add companyUrl once you remember the GSM website
    location: "Mergangsan, Yogyakarta",
    type: "Internal employee",
    start: "2026-04",
    end: "2026-10",
    note: "Contracted by CV Genta Sandi Mandiri. I also work on projects for Script Media.",
    links: [{ label: "script-media.net", href: "https://script-media.net" }],
    points: [
      "Built an e-commerce site and a learning management system (LMS) with Laravel",
      "Developed websites with WordPress",
      "Maintained existing client projects and fixed bugs in them",
      "Fixed servers that had been hacked",
    ],
    stack: ["Laravel", "PHP", "WordPress"],
  },
  {
    role: "Project Development (training)",
    company: "CV Genta Sandi Mandiri",
    location: "Mergangsan, Yogyakarta",
    type: "Training",
    start: "2026-02",
    end: "2026-04",
    // TODO: what you learned or worked on during training
    points: [],
    stack: [],
  },
  {
    role: "PHP & React Programmer Intern",
    company: "PT Javan Cipta Solusi",
    companyUrl: "https://javan.co.id",
    location: "Sleman, Yogyakarta",
    type: "Internship",
    start: "2024-07",
    end: "2025-01",
    points: [
      "Helped build internal and client web applications with Laravel and React (TypeScript)",
      "Implemented CRUD modules and optimised backend database queries",
      "Worked with senior developers through Git and Agile sprints",
      "Got hands-on with REST API development and deployment workflows",
    ],
    stack: ["Laravel", "PostgreSQL", "React", "TypeScript", "GitLab"],
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
    "My latest project runs on Railway. I'm moving my own deployments to a home server exposed through Cloudflare Tunnel, so the server needs no open ports or public IP.",
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
  { degree: "Vocational High School, Software Engineering", school: "SMK Muhammadiyah Pakem", period: "2022 to 2025" },
];

export const certificates: Certificate[] = [
  {
    name: "Internship Program, Programmer",
    issuer: "PT Javan Cipta Solusi",
    date: "2025-01",
    image: certInternship,
    file: certInternshipPdf,
  },
  {
    name: "Mini Bootcamp: Optimalisasi Task dengan Alurkerja untuk Front End",
    issuer: "Geek Academy",
    date: "2024-11",
    image: certBootcamp,
    file: certBootcampPdf,
  },
  {
    name: "Meningkatkan Kemampuan Dasar Pemrograman Web dengan Pelatihan dan Pengembangan Framework",
    issuer: "Computer Engineering Student Association, Universitas Teknologi Yogyakarta",
    date: "2024-05",
    image: certTraining,
    file: certTrainingPdf,
  },
  {
    name: "Let's Be A Great Master of Ceremony",
    issuer: "Prodamat, MPAI UAD",
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
