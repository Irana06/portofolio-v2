import { profile } from "../data/portfolio";

export default function Intro() {
  return (
    <section id="top" className="page grid gap-10 pb-16 pt-10 md:grid-cols-[1fr_15rem] md:items-end md:gap-16 md:pb-24 md:pt-20">
      <div>
        <p className="meta">
          {profile.role}, {profile.location}
        </p>
        <h1 className="mt-3 text-[clamp(2.6rem,7vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.01em]">
          {profile.name}
        </h1>
        <p className="mt-7 max-w-[36rem] text-xl leading-relaxed md:text-[1.35rem]">{profile.intro}</p>

        <div className="mt-6 max-w-[36rem] space-y-3 text-muted">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {profile.availability && <p className="mt-6 font-medium">{profile.availability}</p>}

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`mailto:${profile.email}`} className="btn-primary">
            Email me
          </a>
          <a href="/cv" className="btn-plain">
            Read the CV
          </a>
        </div>
      </div>

      <figure className="order-first w-40 md:order-none md:w-full">
        <img
          src={profile.portrait}
          alt={`Portrait of ${profile.name}`}
          className="aspect-square w-full rounded-sm object-cover"
        />
      </figure>
    </section>
  );
}
