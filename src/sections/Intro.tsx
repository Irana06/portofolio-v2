import { profile } from "../data/portfolio";
import Terminal from "../components/Terminal";

export default function Intro() {
  return (
    <section id="top" className="page grid gap-12 pb-16 pt-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-16">
      <div>
        <div className="flex items-center gap-4">
          <img src={profile.portrait} alt={`Portrait of ${profile.name}`} className="h-14 w-14 rounded-sm object-cover" />
          <p className="font-mono text-[13px] text-muted">
            {profile.role.toLowerCase()}
            <br />
            {profile.location}
          </p>
        </div>

        <h1 className="mt-7 text-[clamp(2.6rem,7vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.01em]">{profile.name}</h1>
        <p className="mt-6 max-w-[34rem] text-xl leading-relaxed">{profile.intro}</p>

        <div className="mt-5 max-w-[34rem] space-y-3 text-muted">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {profile.availability && <p className="mt-5 font-medium">{profile.availability}</p>}

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`mailto:${profile.email}`} className="btn-primary">
            Email me
          </a>
          <a href="/cv" className="btn-plain">
            Read the CV
          </a>
        </div>
      </div>

      <Terminal />
    </section>
  );
}
