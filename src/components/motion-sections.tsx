"use client";

import { useEffect, useRef } from "react";
import { workHighlights } from "@/content/site";

const statement =
  "Production AI is not a prompt. It is retrieval quality, tool contracts, permissions, evaluation, fallbacks, observability, and careful failure design working as one system.";

export function ScrubStatement() {
  const root = useRef<HTMLParagraphElement>(null);
  const words = statement.split(" ");

  useEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        gsap.fromTo(".scrub-word", { opacity: 0.12 }, {
          opacity: 1,
          stagger: 0.06,
          scrollTrigger: {
            trigger: element,
            start: "top 78%",
            end: "bottom 40%",
            scrub: 1,
          },
        });
      }, element);
      revert = () => context.revert();
    }, { rootMargin: "300px" });
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
      revert?.();
    };
  }, []);

  return (
    <p ref={root} className="scrub-statement">
      {words.map((word, index) => (
        <span className="scrub-word" key={`${word}-${index}`}>{word} </span>
      ))}
    </p>
  );
}

export function PinnedWorkStory() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current;
    const heading = title.current;
    if (!section || !heading || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 900px)", () => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 18%",
          end: "bottom 70%",
          pin: heading,
          pinSpacing: false,
        });
      });
      revert = () => media.revert();
    }, { rootMargin: "300px" });
    observer.observe(section);
    return () => {
      cancelled = true;
      observer.disconnect();
      revert?.();
    };
  }, []);

  return (
    <section ref={root} className="chapter work-story">
      <div ref={title} className="work-story-title">
        <p className="eyebrow">Inside production</p>
        <h2>Systems I have helped move from idea to operation.</h2>
      </div>
      <div className="work-story-list">
        {workHighlights.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
