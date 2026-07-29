export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
};

export const posts: PostMeta[] = [
  {
    slug: "graph-rag-multi-hop-reasoning",
    title: "Why Graph-RAG beats flat vector RAG for multi-hop reasoning",
    description: "A working outline for choosing graph traversal when semantic similarity is not enough.",
    date: "Draft",
    tags: ["Graph-RAG", "Retrieval", "Evaluation"],
    draft: true,
  },
  {
    slug: "guardrails-agent-generated-sql",
    title: "Guardrails for agent-generated SQL",
    description: "A practical outline for validation, authorization, clarification, and safe execution.",
    date: "Draft",
    tags: ["Agents", "SQL", "Security"],
    draft: true,
  },
];

export const getPost = (slug: string) => posts.find((post) => post.slug === slug);
