import type { ComponentType } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { getPost, posts } from "@/content/posts";

const loaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  "graph-rag-multi-hop-reasoning": () => import("@/content/blog/graph-rag-multi-hop-reasoning.mdx"),
  "guardrails-agent-generated-sql": () => import("@/content/blog/guardrails-agent-generated-sql.mdx"),
};

export const dynamicParams = false;
export function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug); return post ? { title: post.title, description: post.description } : {};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const post = getPost(slug); const loader = loaders[slug];
  if (!post || !loader) notFound();
  const Post = (await loader()).default;
  return (
    <article className="chapter article-shell">
      <Link className="back-link" href="/blog"><ArrowLeft /> All field notes</Link>
      <div className="draft-banner">Working draft — claims and examples are not yet final.</div>
      <h1>{post.title}</h1><p className="article-deck">{post.description}</p>
      <div className="article-body"><Post /></div>
    </article>
  );
}
