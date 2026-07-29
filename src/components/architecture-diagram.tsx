import Image from "next/image";
import type { DiagramEdge, DiagramNode } from "@/content/projects";

export function ArchitectureDiagram({
  nodes,
  edges,
  title,
  image,
  alt,
}: {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  title: string;
  image: string;
  alt: string;
}) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return (
    <figure className="architecture-figure">
      <div className="architecture-media">
        <Image src={image} alt={alt} fill sizes="(max-width: 800px) 100vw, 1180px" />
        <div className="architecture-media-caption"><span>System map</span><strong>{title}</strong></div>
      </div>
      <ol className="architecture-node-list">
        {nodes.map((node, index) => <li key={node.id}><span>{String(index + 1).padStart(2, "0")}</span>{node.label}</li>)}
      </ol>
      <ul className="sr-only">
        {edges.map((edge) => {
          const from = byId.get(edge.from);
          const to = byId.get(edge.to);
          return from && to ? <li key={`${edge.from}-${edge.to}`}>{from.label} connects to {to.label}</li> : null;
        })}
      </ul>
      <figcaption>{title}</figcaption>
    </figure>
  );
}
