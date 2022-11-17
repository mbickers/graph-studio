import { addEdges, Edge, empty } from "./Graph"

export function complete(n: number) {
  const edges: Edge[] = []
  for (let a = 1; a < n; a++) {
    for (let b = a + 1; b <= n; b++) {
      edges.push([String(a), String(b)])
    }
  }

  return addEdges(empty, edges)
}
