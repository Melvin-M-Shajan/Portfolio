import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { getProject, projects } from "@/content/projects";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.title, description: project.strapline } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return (
    <>
      <section className="page-hero project-hero chapter">
        <Link className="back-link" href="/projects"><ArrowLeft /> All projects</Link>
        <h1>{project.title}</h1><p>{project.strapline}</p>
        <div className="tag-list">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
      </section>
      <section className="chapter case-section"><div><p className="eyebrow">Problem</p><h2>What had to change.</h2></div><p>{project.problem}</p></section>
      <section className="chapter architecture-section">
        <div className="section-heading"><p className="eyebrow">Architecture</p><h2>How information moves through the system.</h2></div>
        <ArchitectureDiagram
          nodes={project.architecture.nodes}
          edges={project.architecture.edges}
          title={`${project.title} architecture`}
          image={project.architecture.image}
          alt={project.architecture.alt}
        />
      </section>
      <section className="chapter case-columns">
        <article><p className="eyebrow">Approach</p><h2>Engineering decisions</h2><ol>{project.approach.map((item) => <li key={item}>{item}</li>)}</ol></article>
        <article><p className="eyebrow">Challenges</p><h2>Constraints handled</h2><ol>{project.challenges.map((item) => <li key={item}>{item}</li>)}</ol></article>
      </section>
      <section className="chapter">
        <div className="section-heading"><p className="eyebrow">Outcomes</p><h2>Metrics stay empty until they are verified.</h2></div>
        <div className="metrics-grid">{project.outcomes.map((outcome) => (
          <div key={outcome.label}><span>{outcome.label}</span><strong>{outcome.value ?? "Awaiting verified metric"}</strong></div>
        ))}</div>
        <div className="project-links">
          {project.links.github ? <a className="button button-secondary" href={project.links.github} target="_blank" rel="noreferrer">GitHub repository <ArrowUpRight /></a> : <span className="muted-link">Repository is not public</span>}
          {project.links.package ? <a className="button button-secondary" href={project.links.package} target="_blank" rel="noreferrer">npm package <ArrowUpRight /></a> : null}
          {project.links.demo ? <a className="button button-secondary" href={project.links.demo} target="_blank" rel="noreferrer">Live demo <ArrowUpRight /></a> : <span className="muted-link">No public demo</span>}
        </div>
      </section>
    </>
  );
}
