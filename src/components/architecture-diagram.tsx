import type { DiagramEdge, DiagramNode } from "@/content/projects";

export function ArchitectureDiagram({
  nodes,
  edges,
  title,
}: {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  title: string;
}) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return (
    <figure className="architecture-figure">
      <svg viewBox="0 0 900 240" role="img" aria-labelledby="architecture-title">
        <title id="architecture-title">{title}</title>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8291ff" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const from = byId.get(edge.from);
          const to = byId.get(edge.to);
          if (!from || !to) return null;
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.x + 55} y1={from.y} x2={to.x - 12} y2={to.y}
              stroke="#8291ff" strokeOpacity=".65" strokeWidth="2" markerEnd="url(#arrow)"
            />
          );
        })}
        {nodes.map((node) => (
          <g key={node.id}>
            <rect x={node.x - 10} y={node.y - 27} width="132" height="54" rx="12" fill="var(--surface-strong)" stroke="var(--border)" />
            <circle cx={node.x + 8} cy={node.y} r="5" fill="#9dAAff" />
            <text x={node.x + 20} y={node.y + 5} fill="var(--foreground)" fontSize="13" fontFamily="var(--font-mono)">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>{title}</figcaption>
    </figure>
  );
}
