import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/images/projects", { recursive: true });

const projectImages = [
  "stateful-invoice-agent",
  "codewiki",
  "knowledge-graph-search",
  "climate-etl",
  "llm-evaluation",
  "graph-rag-benchmarking",
  "reliable-tool-use",
  "geospatial-analytics",
  "graphrag-enterprise-feature",
  "multi-agent-control-platform-feature",
  "graphrag-enterprise-architecture",
  "multi-agent-control-platform-architecture",
];

await Promise.all([
  sharp("public/og-source.svg").png().toFile("public/og.png"),
  sharp("assets/source-images/melvin-headshot-studio-v2.png")
    .resize({ width: 1000, withoutEnlargement: true })
    .webp({ quality: 84, smartSubsample: true })
    .toFile("public/images/melvin-headshot-studio.webp"),
  ...projectImages.map((name) =>
    sharp(`assets/source-images/${name}.png`)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80, smartSubsample: true })
      .toFile(`public/images/projects/${name}.webp`),
  ),
]);
console.log("Generated social artwork and optimized portfolio imagery");
