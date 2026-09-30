/**
 * All portfolio content lives in this file. Every section on the site and the
 * /cv page read from here, so updating content never means editing components.
 *
 * Search for "TODO" to find the parts that still need your input.
 * Write only things that are true: a missing section is better than a made-up one.
 */
import type { Certificate, ContactLink, Education, Experience, Project, SkillGroup } from "./types";

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
  // TODO: rewrite these in your own words once you've added your latest job.
  intro:
    "I build web applications with Laravel and PostgreSQL. I started out as a full-stack developer shipping Laravel and React apps end to end, and the part I keep coming back to is the backend: how the data is modelled, how the queries run, and what the API hands to the frontend.",
  about: [
    "My first professional work was a six-month programmer internship at PT Javan Cipta Solusi in Sleman, where I worked on internal and client applications with Laravel, React, and PostgreSQL alongside senior developers.",
    "I'm currently studying Information Systems at Universitas Terbuka.",
  ],
  /** Things you're learning right now. Leave empty to hide the line. */
  // TODO: add what you've been learning this year, e.g. "queues and background jobs in Laravel".
  learning: [] as string[],
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
  { label: "Backend", items: ["Laravel", "REST APIs", "Authentication and role-based access", "Livewire"] },
  { label: "Data", items: ["PostgreSQL", "Query optimisation", "DBeaver"] },
  { label: "Tooling", items: ["Git, GitHub, GitLab", "Docker", "Postman", "Ubuntu", "FileZilla"] },
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
    links: [],
  },
  // TODO: add the backend projects from the past year here, newest first.
];

export const experience: Experience[] = [
  // TODO: add your current job here (newest first). Example shape:
  // {
  //   role: "Backend Developer",
  //   company: "Company name",
  //   companyUrl: "https://...",
  //   location: "Yogyakarta",
  //   type: "Full-time",
  //   start: "2025-02",
  //   end: null,
  //   points: ["What you built or own", "A result you can back up"],
  //   stack: ["Laravel", "PostgreSQL"],
  // },
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
