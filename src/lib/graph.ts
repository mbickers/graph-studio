import { Point } from './graph-layout/geometry';
import { range } from './utils';

export type Vertex = number;
export type Edge = [Vertex, Vertex];
export type Graph = {
  numVertices: number;
  edges: Edge[];
  positions: Point[];
};

export function edgeToString([a, b]: Edge) {
  return `(${a}, ${b})`;
}

export function toString(graph: Graph) {
  const vertices = range(graph.numVertices)
    .map((vertex) => vertex + 1)
    .join(', ');
  const edges = [...graph.edges].map(edgeToString).join(', ');

  return `({${vertices}}, {${edges}})`;
}

export const empty: Graph = {
  numVertices: 0,
  edges: [],
  positions: [],
};
