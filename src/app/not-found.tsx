import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { HeroGraph } from "@/components/hero-graph";

export default function NotFound() {
  return (
    <section className="not-found chapter"><div><p className="eyebrow">Route not found</p>
      <h1>This agent reached a node that does not exist.</h1><p>The graph is intact. The requested path is not.</p>
      <Link className="button button-primary" href="/"><ArrowLeft /> Return home</Link></div><HeroGraph /></section>
  );
}
