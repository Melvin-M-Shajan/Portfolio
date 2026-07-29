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
        <div className="about-image"><Image src="/images/wmremove-transformed.jpeg" alt="Professional portrait of Melvin M Shajan" width={1000} height={1254} sizes="(max-width: 800px) 100vw, 42vw" /></div>
        <div className="about-copy">
          <h2>From software foundations to agentic systems.</h2>
          <p>At NCompass Techstudio, I work across LLM orchestration, retrieval, backend services, data pipelines,
            evaluation, and observability. The goal is not a convincing prototype. It is a system that behaves
            predictably when data changes, providers fail, permissions differ, and users ask ambiguous questions.</p>
          <dl className="facts-list">
            <div><dt>Education</dt><dd>B.Tech Information Technology, Sri Krishna College of Engineering & Technology, 2021–2025</dd></div>
            <div><dt>Experience</dt><dd>NCompass Techstudio, April 2025–Present</dd></div>
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
