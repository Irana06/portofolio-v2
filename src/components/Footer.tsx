import { profile } from "../data/portfolio";

export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="page flex flex-col gap-2 py-8 font-sans text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.fullName}
        </p>
        <p className="flex gap-5">
          <a href="https://github.com/Irana06/portofolio-v2" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center">
            Source on GitHub
          </a>
          <a href="#top" className="inline-flex min-h-[44px] items-center">
            Back to top
          </a>
        </p>
      </div>
    </footer>
  );
}
