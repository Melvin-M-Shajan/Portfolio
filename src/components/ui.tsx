"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useRef } from "react";

export function GlowingCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className={`glowing-card ${className}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect || !ref.current) return;
        ref.current.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
        ref.current.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
      }}
    >
      {children}
    </motion.div>
  );
}

export function HorizontalAccordion({
  items,
}: {
  items: { title: string; detail: string; image: string; alt: string }[];
}) {
  return (
    <div className="horizontal-accordion">
      {items.map((item) => (
        <article key={item.title} tabIndex={0}>
          <div className="accordion-media">
            <Image src={item.image} alt={item.alt} fill sizes="(max-width: 620px) 100vw, 45vw" />
          </div>
          <div className="accordion-copy">
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
