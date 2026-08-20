import Image from "next/image";
import { GlowingCard } from "@/components/ui";
import { siteConfig } from "@/content/site";

export const metadata = {
  title: "About",
  description: "Background, education, languages, and current research interests of AI Engineer Melvin M Shajan.",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero chapter">
        <p className="eyebrow">Background</p>
        <h1>Building production AI with an engineer&apos;s respect for failure modes.</h1>
        <p>{siteConfig.summary}</p>
      </section>
      <section className="chapter about-grid">
        <div className="about-image"><Image src="/images/melvin-at-work.webp" alt="Melvin M Shajan working at his desk in a sunlit studio" width={1200} height={1807} sizes="(max-width: 800px) 100vw, 42vw" /></div>
        <div className="about-copy">
          <h2>From software foundations to agentic systems.</h2>
          <p>As a Software Developer at NCompass Techstudio, I worked across LLM orchestration, retrieval, backend
            services, data pipelines, evaluation, and observability. I developed, deployed, and monitored application
            and AI workloads with AWS services including EC2, S3, Lambda, RDS, Bedrock, and CloudWatch.</p>
          <p>I also delivered payroll and leave management workflows for an HRMS. Across that work, the goal was not
            a convincing prototype. It was a system that behaved predictably when data changed, providers failed,
            permissions differed, and users asked ambiguous questions.</p>
          <dl className="facts-list">
            <div><dt>Education</dt><dd>B.Tech Information Technology, Sri Krishna College of Engineering & Technology, 2021–2025</dd></div>
            <div><dt>Experience</dt><dd>Software Developer, NCompass Techstudio, April 2025 to August 2026</dd></div>
            <div><dt>Languages</dt><dd>English, Tamil, Malayalam, Hindi</dd></div>
          </dl>
        </div>
      </section>
      <section className="chapter">
        <div className="section-heading"><p className="eyebrow">Currently exploring</p><h2>The questions on my workbench right now.</h2></div>
        <div className="exploring-grid">
          {siteConfig.currentExploring.map((item) => (
            <GlowingCard key={item.title}>
              <article className="exploring-card">
                <Image src={item.image} alt={item.alt} fill sizes="(max-width: 800px) 100vw, 33vw" />
                <div className="exploring-card-copy"><h3>{item.title}</h3><p>{item.detail}</p></div>
              </article>
            </GlowingCard>
          ))}
        </div>
      </section>
    </>
  );
}
