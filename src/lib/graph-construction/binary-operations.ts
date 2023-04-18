import { Edge, Graph } from '../graph';
import { productLayout } from '../graph-layout/layouts';
import { range } from '../utils';

export function union() {}

export function cartesianProduct(graph1: Graph, graph2: Graph): Graph {
  const vertex = (vertex1: number, vertex2: number) =>
    vertex1 * graph2.numVertices + vertex2;
  const edges1 = range(graph1.numVertices).flatMap((g1_vertex) =>
    graph2.edges.map(
      (g2_edge) =>
        [vertex(g1_vertex, g2_edge[0]), vertex(g1_vertex, g2_edge[1])] as Edge,
    ),
  );

  const edges2 = range(graph2.numVertices).flatMap((g2_vertex) =>
    graph1.edges.map(
      (g1_edge) =>
        [vertex(g1_edge[0], g2_vertex), vertex(g1_edge[1], g2_vertex)] as Edge,
    ),
  );

  return {
    numVertices: graph1.numVertices * graph2.numVertices,
    edges: [...edges1, ...edges2],
    positions: productLayout(graph1.positions, graph2.positions),
  };
}
