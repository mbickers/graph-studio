export type Vertex = string;
export type Edge = [Vertex, Vertex];
export type Graph = {
  vertices: Set<Vertex>;
  edges: Set<Edge>;
  positions: Map<Vertex, [number, number]>;
};

export const copy = ({ vertices, edges, positions }: Graph) => ({
  vertices: new Set(vertices),
  edges: new Set(edges),
  positions: new Map(positions),
});

export function edgeToString([a, b]: Edge) {
  return `(${a}, ${b})`;
}

export function toString(graph: Graph) {
  const vertices = [...graph.vertices].join(', ');
  const edges = [...graph.edges].map(edgeToString).join(', ');

  return `({${vertices}}, {${edges}})`;
}

export const empty: Graph = {
  vertices: new Set(),
  edges: new Set(),
  positions: new Map(),
};

export function validGraphOrEmpty({
  vertices,
  edges,
  positions,
}: Graph): Graph {
  if (![...vertices].every((vertex) => positions.get(vertex))) {
    return empty;
  }

  if (![...edges].every(([a, b]) => vertices.has(a) && vertices.has(b))) {
    return empty;
  }

  return { vertices, edges, positions };
}
