export type Edge = [string, string]

export type Graph = {
  vertices: Set<string>
  edges: Set<Edge>
}

const copy = ({ vertices, edges }: Graph) => ({ vertices: new Set(vertices), edges: new Set(edges) })

export function addEdges(graph: Graph, edges: Edge[]) {
  const newGraph = copy(graph)
  edges.forEach(([a, b]) => {
    newGraph.vertices.add(a)
    newGraph.vertices.add(b)
    const edge: Edge = a < b ? [a, b] : [b, a]
    newGraph.edges.add(edge)
  })

  return newGraph
}

export function toString(graph: Graph) {
  const vertices = [...graph.vertices].join(', ')
  const edges = [...graph.edges].map(([a, b]) => `(${a}, ${b})`).join(', ')

  return `({${vertices}}, {${edges}})`
}

export const empty: Graph = { vertices: new Set<string>(), edges: new Set<Edge>() }