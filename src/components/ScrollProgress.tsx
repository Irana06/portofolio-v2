import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

/** A thin bar at the top that fills as the page is read, so visitors know how much is left. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
      );
    });
    return () => ctx.revert();
  }, []);

  return <div ref={bar} aria-hidden className="fixed inset-x-0 top-0 z-40 h-[3px] origin-left bg-accent" />;
}
