export type SiteConfig = {
  name: string;
  role: string;
  headline: string;
  summary: string;
  email: string;
  resumeUrl: string;
  formEndpoint: string | null;
  analyticsEnabled: boolean;
  social: { label: string; href: string }[];
  currentExploring: { title: string; detail: string }[];
};

export const siteConfig: SiteConfig = {
  name: "Melvin M Shajan",
  role: "AI Engineer",
  headline: "I build production\nmulti-agent systems\nthat ship, not demos.",
  summary:
    "AI Engineer specializing in agentic AI, Graph-RAG, multi-agent LLM systems, and the infrastructure that keeps them reliable in production.",
  email: "melvinshajan555@gmail.com",
  resumeUrl: "/melvin-m-shajan-resume.pdf",
  formEndpoint: process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? null,
  analyticsEnabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  social: [
    { label: "GitHub", href: "https://github.com/Melvin-M-Shajan" },
    { label: "LinkedIn", href: "https://linkedin.com/in/melvin-shajan-731a66225/" },
  ],
  currentExploring: [
    { title: "LLM evaluation", detail: "Measuring faithfulness, tool-use quality, and recovery behavior." },
    { title: "Graph-RAG benchmarking", detail: "Testing multi-hop retrieval against flat vector baselines." },
    { title: "Reliable tool use", detail: "Designing agents that clarify, validate, and fail safely." },
  ],
};

export const skills = {
  Languages: ["Python", "JavaScript", "TypeScript", "SQL"],
  "AI frameworks": ["LangGraph", "LangChain", "OpenAI API", "Anthropic API", "LangSmith"],
  "AI systems": ["Agentic AI", "Multi-Agent Systems", "RAG", "Graph-RAG", "LLM Evaluation"],
  Data: ["PostgreSQL", "Neo4j", "Weaviate", "Vector Databases", "PostGIS"],
  Engineering: ["React", "FastAPI", "NestJS", "REST APIs", "Docker"],
  Tools: ["Git", "Linux", "Apache NiFi", "Apache Superset", "Claude Code"],
} as const;

export const workHighlights = [
  {
    title: "Stateful invoice agent",
    detail: "Orchestrated 10+ backend APIs through multi-turn LangGraph workflows with Together AI and Langfuse.",
    image: "/images/projects/stateful-invoice-agent.webp",
    alt: "A paper invoice routed through a network of precision backend modules",
  },
  {
    title: "CodeWiki",
    detail: "Generated architecture graphs and commit insights for any GitHub repository, cutting onboarding time by 30%.",
    image: "/images/projects/codewiki.webp",
    alt: "An exploded software repository model revealing architecture and commit branches",
  },
  {
    title: "Knowledge-graph search",
    detail: "Built Neo4j graph and vector retrieval for context-aware search across enterprise data.",
    image: "/images/projects/knowledge-graph-search.webp",
    alt: "A physical knowledge field with a highlighted retrieval path across related entities",
  },
  {
    title: "Climate ETL",
    detail: "Automated 96 GB of Copernicus NetCDF ingestion into analytics-ready PostgreSQL using Apache NiFi.",
    image: "/images/projects/climate-etl.webp",
    alt: "Layered climate rasters transformed into an ordered analytics-ready data stack",
  },
  {
    title: "Geospatial analytics",
    detail: "Delivered PostGIS and Apache Superset dashboards that replaced spreadsheet-based validation.",
    image: "/images/projects/climate-etl.webp",
    alt: "Layered climate and terrain data prepared for geospatial analytics",
  },
] as const;
