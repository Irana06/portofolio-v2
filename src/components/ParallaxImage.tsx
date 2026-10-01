import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

/** A screenshot that drifts slightly inside its frame while scrolling, giving the page some depth. */
export default function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const frame = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        frame.current!.querySelector("img"),
        { yPercent: -6 },
        { yPercent: 6, ease: "none", scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={frame} className="group overflow-hidden rounded-sm border border-rule">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full scale-[1.14] transition-transform duration-500 group-hover:scale-[1.18]"
      />
    </div>
  );
}
