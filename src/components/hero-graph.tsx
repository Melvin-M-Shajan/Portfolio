const nodes = [
  [76, 86], [180, 45], [254, 132], [356, 75], [420, 174], [302, 240], [154, 228], [476, 54],
];
const edges = [[0,1],[0,6],[1,2],[2,3],[2,6],[3,4],[3,7],[4,5],[5,6],[2,5]];

export function HeroGraph() {
  return (
    <svg className="hero-graph" viewBox="0 0 540 300" aria-hidden="true">
      <defs>
        <linearGradient id="edge" x1="0" x2="1">
          <stop offset="0" stopColor="#6f7dff" stopOpacity=".15" />
          <stop offset=".5" stopColor="#a9b5ff" stopOpacity=".85" />
          <stop offset="1" stopColor="#6f7dff" stopOpacity=".15" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], index) => (
        <line
          key={index}
          className="graph-pulse"
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="url(#edge)" strokeWidth="1.5" strokeDasharray="7 9"
        />
      ))}
      {nodes.map(([x, y], index) => (
        <g className="graph-node" key={index} style={{ animationDelay: `${index * 0.16}s` }}>
          <circle cx={x} cy={y} r={index === 2 ? 16 : 9} fill="#0a0d14" stroke="#a9b5ff" strokeWidth="2" />
          <circle cx={x} cy={y} r={index === 2 ? 4 : 2.5} fill="#dce2ff" />
        </g>
      ))}
    </svg>
  );
}
