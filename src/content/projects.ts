export type DiagramNode = { id: string; label: string; x: number; y: number };
export type DiagramEdge = { from: string; to: string };

export type ProjectCaseStudy = {
  slug: string;
  title: string;
  strapline: string;
  problem: string;
  approach: string[];
  challenges: string[];
  outcomes: { label: string; value: string | null }[];
  technologies: string[];
  featureImage: string;
  featureAlt: string;
  links: { github: string | null; demo: string | null; package: string | null };
  architecture: { image: string; alt: string; nodes: DiagramNode[]; edges: DiagramEdge[] };
};

export const projects: ProjectCaseStudy[] = [
  {
    slug: "multi-agent-control-platform",
    title: "Multi-Agent Control Platform",
    strapline: "Natural language to safe SQL through supervised specialist agents.",
    problem:
      "Business users needed conversational access to PostgreSQL without allowing destructive SQL or hiding how requests were routed and executed.",
    approach: [
      "Used a Supervisor Agent to route requests through SQL generation, execution, formatting, and diagram agents, with minified live schema context grounding each request in available tables and columns.",
      "Added SQL validation and runtime Row Level Security context switching to block destructive queries, reduce injection risk, and preserve existing PostgreSQL permissions.",
      "Built Gemini and Groq fallback chains with retry handling so analysis could remain available when a model provider failed.",
      "Created a ReactFlow, Recharts, and Mermaid.js observability dashboard so operators could inspect routing, execution, and failure behavior.",
    ],
    challenges: [
      "Keeping generated SQL read-only and grounded in the live database schema.",
      "Recovering cleanly from model-provider and database failures.",
      "Making multi-agent execution understandable to operators.",
    ],
    outcomes: [
      { label: "Query success rate", value: null },
      { label: "Median response time", value: null },
      { label: "Manual analysis saved", value: null },
    ],
    technologies: ["NestJS", "TypeScript", "LangChain", "Gemini", "Groq", "PostgreSQL", "TypeORM", "Zod", "RxJS", "React", "ReactFlow", "Recharts", "Mermaid.js", "npm"],
    featureImage: "/images/projects/multi-agent-control-platform-feature.webp",
    featureAlt: "A supervisor routes a natural-language query through specialist, validation, database, and response modules",
    links: {
      github: "https://github.com/Melvin-M-Shajan/multi-agent-control-platform",
      demo: "https://multi-agent-control-platform-demo.vercel.app/",
      package: "https://www.npmjs.com/package/melcp",
    },
    architecture: {
      image: "/images/projects/multi-agent-control-platform-architecture.webp",
      alt: "A query passes through supervisor routing, specialist agents, validation, PostgreSQL, and response formatting",
      nodes: [
        { id: "query", label: "User query", x: 35, y: 110 },
        { id: "supervisor", label: "Supervisor", x: 200, y: 110 },
        { id: "agents", label: "Specialist agents", x: 385, y: 55 },
        { id: "guardrails", label: "Validation gate", x: 385, y: 165 },
        { id: "database", label: "PostgreSQL", x: 585, y: 110 },
        { id: "response", label: "Verified response", x: 770, y: 110 },
      ],
      edges: [
        { from: "query", to: "supervisor" },
        { from: "supervisor", to: "agents" },
        { from: "supervisor", to: "guardrails" },
        { from: "agents", to: "database" },
        { from: "guardrails", to: "database" },
        { from: "database", to: "response" },
      ],
    },
  },
  {
    slug: "graphrag-enterprise",
    title: "GraphRAG-Enterprise",
    strapline: "Hybrid graph and vector retrieval for multi-hop enterprise reasoning.",
    problem:
      "Flat vector search could retrieve semantically similar passages, but it struggled to preserve entity relationships across multi-hop questions and continuously changing enterprise sources.",
    approach: [
      "Combined Neo4j traversal with Weaviate dense retrieval behind a LangGraph orchestration layer.",
      "Built an Apache NiFi pipeline to hydrate graph and vector stores from structured and unstructured sources.",
      "Created a LangSmith evaluation suite spanning 200+ benchmark questions for faithfulness, relevance, and graph coverage.",
    ],
    challenges: [
      "Balancing graph expansion depth against latency.",
      "Keeping entity identities consistent across ingestion runs.",
      "Evaluating answers that require evidence from multiple retrieval modes.",
    ],
    outcomes: [
      { label: "Answer accuracy", value: null },
      { label: "P95 latency", value: null },
      { label: "Cost per query", value: null },
    ],
    technologies: ["Neo4j", "LangGraph", "Weaviate", "FastAPI", "Apache NiFi", "PostgreSQL", "LangSmith", "Anthropic API", "React"],
    featureImage: "/images/projects/graphrag-enterprise-feature.webp",
    featureAlt: "Enterprise documents flowing into graph and vector retrieval systems before converging on evidence",
    links: { github: null, demo: null, package: null },
    architecture: {
      image: "/images/projects/graphrag-enterprise-architecture.webp",
      alt: "Enterprise sources branching into graph and vector stores before hybrid retrieval produces a grounded answer",
      nodes: [
        { id: "sources", label: "Enterprise sources", x: 40, y: 110 },
        { id: "nifi", label: "NiFi ETL", x: 220, y: 110 },
        { id: "neo4j", label: "Neo4j", x: 405, y: 55 },
        { id: "weaviate", label: "Weaviate", x: 405, y: 165 },
        { id: "retrieval", label: "Hybrid retrieval", x: 590, y: 110 },
        { id: "llm", label: "LLM answer", x: 780, y: 110 },
      ],
      edges: [
        { from: "sources", to: "nifi" },
        { from: "nifi", to: "neo4j" },
        { from: "nifi", to: "weaviate" },
        { from: "neo4j", to: "retrieval" },
        { from: "weaviate", to: "retrieval" },
        { from: "retrieval", to: "llm" },
      ],
    },
  },
];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
