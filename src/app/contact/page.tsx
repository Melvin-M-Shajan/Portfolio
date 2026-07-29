import { EnvelopeSimple, GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/content/site";

export const metadata = { title: "Contact", description: "Contact AI Engineer Melvin M Shajan about agentic AI, Graph-RAG, and production LLM systems." };

export default function ContactPage() {
  return (
    <>
      <section className="page-hero chapter"><p className="eyebrow">Contact</p><h1>Bring the system problem, not a polished brief.</h1>
        <p>I am happy to discuss agent architecture, retrieval quality, evaluation, safe data access, or the infrastructure around them.</p></section>
      <section className="chapter contact-grid">
        <div className="contact-links">
          <a href={`mailto:${siteConfig.email}`}><EnvelopeSimple size={24} /><span>Email<strong>{siteConfig.email}</strong></span></a>
          <a href={siteConfig.social[1].href} target="_blank" rel="noreferrer"><LinkedinLogo size={24} /><span>LinkedIn<strong>Professional profile</strong></span></a>
          <a href={siteConfig.social[0].href} target="_blank" rel="noreferrer"><GithubLogo size={24} /><span>GitHub<strong>Code and repositories</strong></span></a>
        </div><ContactForm />
      </section>
    </>
  );
}
