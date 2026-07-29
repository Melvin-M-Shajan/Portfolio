import Image from "next/image";
import Link from "next/link";
import { ArrowRight, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { HeroGraph } from "@/components/hero-graph";
import { GlowingCard, HorizontalAccordion } from "@/components/ui";
import { PinnedWorkStory, ScrubStatement } from "@/components/motion-sections";
import { SkillMarquee } from "@/components/skill-marquee";
import { SiteFooter } from "@/components/site-footer";
import { projects } from "@/content/projects";
import { siteConfig, workHighlights } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <section className="hero chapter">
        <div className="hero-copy">
          <p className="eyebrow">{siteConfig.role} · Chennai, India</p>
          <h1>{siteConfig.headline}</h1>
          <p className="hero-summary">{siteConfig.summary}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/projects">Explore case studies <ArrowRight weight="bold" /></Link>
            <a className="button button-secondary" href={siteConfig.resumeUrl} download>Download resume <DownloadSimple weight="bold" /></a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="portrait-frame">
            <Image src="/images/melvin-headshot-transparent.webp" alt="Professional portrait of Melvin M Shajan" width={1024} height={1536}
              sizes="(max-width: 780px) 92vw, 36vw" priority />
          </div>
          <HeroGraph />
        </div>
      </section>

      <section className="chapter featured-work">
        <div className="section-heading">
          <p className="eyebrow">Selected systems</p>
          <h2>Engineering depth, explained as case studies.</h2>
          <p>Problem, architecture, hard constraints, and verified outcomes—without inflated metrics.</p>
        </div>
        <div className="project-bento">
          <GlowingCard className="bento-a">
            <Link href={`/projects/${projects[0].slug}`} className="card-link group">
              <span className="card-index">Graph + vector retrieval</span>
              <h3>{projects[0].title}</h3><p>{projects[0].strapline}</p><ArrowRight size={24} />
            </Link>
          </GlowingCard>
          <GlowingCard className="bento-b">
            <Link href={`/projects/${projects[1].slug}`} className="card-link group">
              <span className="card-index">Safe agent execution</span>
              <h3>{projects[1].title}</h3><p>{projects[1].strapline}</p><ArrowRight size={24} />
            </Link>
          </GlowingCard>
          <GlowingCard className="bento-c bento-visual-card">
            <div className="mini-network" aria-hidden="true"><span /><span /><span /><span /><span /></div>
            <h3>Evaluation before confidence.</h3>
            <p>200+ benchmark questions track faithfulness, relevance, and graph coverage.</p>
          </GlowingCard>
          <GlowingCard className="bento-d">
            <div className="card-static"><span className="card-index">Data engineering</span>
              <h3>96 GB climate pipeline</h3><p>Compressed NetCDF to analytics-ready PostgreSQL through Apache NiFi.</p></div>
          </GlowingCard>
          <GlowingCard className="bento-e">
            <div className="card-static"><span className="card-index">Production stance</span>
              <h3>Fallbacks are features.</h3><p>Guardrails, RLS, provider failover, retries, and execution traces belong in the architecture.</p></div>
          </GlowingCard>
        </div>
      </section>

      <section className="chapter statement-chapter"><ScrubStatement /></section>
      <PinnedWorkStory />

      <section className="chapter inline-story">
        <h2>I connect models, data, and controls into one operable system.</h2>
        <HorizontalAccordion items={workHighlights.slice(0, 4).map((item) => ({ ...item }))} />
      </section>

      <section className="chapter marquee-chapter"><p className="eyebrow">Working vocabulary</p><SkillMarquee /></section>
      <SiteFooter />
    </>
  );
}
