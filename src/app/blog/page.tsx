import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { posts } from "@/content/posts";

export const metadata = { title: "Blog", description: "Draft technical writing on Graph-RAG, agent safety, evaluation, and production LLM systems." };

export default function BlogPage() {
  return (
    <>
      <section className="page-hero chapter"><p className="eyebrow">Field notes</p><h1>Writing through the hard parts of production AI.</h1>
        <p>Working drafts become published posts only after the examples and claims are reproducible.</p></section>
      <section className="chapter post-list">{posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card group">
          <div><span>{post.date}</span><span>{post.draft ? "Working draft" : "Published"}</span></div>
          <h2>{post.title}</h2><p>{post.description}</p>
          <div className="tag-list">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><ArrowRight />
        </Link>
      ))}</section>
    </>
  );
}
