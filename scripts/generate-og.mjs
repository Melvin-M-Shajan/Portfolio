import sharp from "sharp";
import { mkdir } from "node:fs/promises";

await mkdir("public/images/projects", { recursive: true });

const projectImages = [
  "stateful-invoice-agent",
  "codewiki",
  "knowledge-graph-search",
  "climate-etl",
];

await Promise.all([
  sharp("public/og-source.svg").png().toFile("public/og.png"),
  sharp("assets/source-images/melvin-headshot-studio.png")
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
