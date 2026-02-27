import { useEffect } from "react";
import gsap from "gsap";

export function usePageReveal(ref, deps = []) {
  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    }, ref);

    return () => ctx.revert();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
