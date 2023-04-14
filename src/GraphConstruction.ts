import { Graph, validGraphOrEmpty } from "./Graph"

export function complete(n: number): Graph {
  const edges = new Set<[string, string]>()
  for (let a = 1; a < n; a++) {
    for (let b = a + 1; b <= n; b++) {
      edges.add([String(a), String(b)])
    }
  }

  const vertices = new Set<string>()
  const positions = new Map()
  for (let a = 1; a <= n; a++) {
    vertices.add(`${a}`)

    let angle = 2 * Math.PI * (a - 1) / n + Math.PI
    positions.set(`${a}`, [Math.sin(angle), Math.cos(angle)])
  }

  return validGraphOrEmpty({vertices, edges, positions})
}
