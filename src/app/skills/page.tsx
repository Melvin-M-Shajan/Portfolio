import { SkillMarquee } from "@/components/skill-marquee";
import { skills } from "@/content/site";

export const metadata = { title: "Skills", description: "Languages, AI frameworks, databases, engineering tools, and production systems experience." };

export default function SkillsPage() {
  return (
    <>
      <section className="page-hero chapter"><p className="eyebrow">Capabilities</p><h1>A stack organized around dependable AI delivery.</h1>
        <p>From retrieval and agent orchestration to backend services, data movement, evaluation, and observability.</p></section>
      <section className="chapter skill-groups">{Object.entries(skills).map(([group, items]) => (
        <article key={group}><h2>{group}</h2><div className="tag-list large">{items.map((item) => <span key={item}>{item}</span>)}</div></article>
      ))}</section>
      <section className="chapter marquee-chapter"><p className="eyebrow">Across the stack</p><SkillMarquee /></section>
    </>
  );
}
