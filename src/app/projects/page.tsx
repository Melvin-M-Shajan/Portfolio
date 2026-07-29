import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { GlowingCard, HorizontalAccordion } from "@/components/ui";
import { projects } from "@/content/projects";
import { workHighlights } from "@/content/site";

export const metadata = {
  title: "Projects",
  description: "AI engineering case studies covering Graph-RAG, multi-agent control, safe SQL, and production infrastructure.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="page-hero chapter"><p className="eyebrow">Case studies</p><h1>Architecture decisions, trade-offs, and outcomes.</h1>
        <p>Each project is structured around the problem it solved and the engineering required to make it dependable.</p></section>
      <section className="chapter project-list">
        {projects.map((project, index) => (
          <GlowingCard key={project.slug}>
            <Link href={`/projects/${project.slug}`} className="project-row group">
              <span className="project-row-number">0{index + 1}</span>
              <div><h2>{project.title}</h2><p>{project.strapline}</p>
                <div className="tag-list">{project.technologies.slice(0, 6).map((tech) => <span key={tech}>{tech}</span>)}</div></div>
              <ArrowUpRight size={28} weight="bold" />
            </Link>
          </GlowingCard>
        ))}
      </section>
      <section className="chapter"><div className="section-heading"><p className="eyebrow">Work highlights</p>
        <h2>Production work beyond the two featured systems.</h2></div>
        <HorizontalAccordion items={workHighlights.map((item) => ({ ...item }))} /></section>
    </>
  );
}
