import { Edge, Graph, Vertex } from './Graph';
import { Point, pointOnUnitCircle } from './geometry';

export function normalizeLayout(
  positions: Map<Vertex, Point>,
): Map<Vertex, Point> {
  const [maxX, minX, maxY, minY] = [...positions].reduce(
    ([maxX_, minX_, maxY_, minY_], [_, [x, y]]) => [
      Math.max(maxX_, x),
      Math.min(minX_, x),
      Math.max(maxY_, y),
      Math.min(minY_, y),
    ],
    [Number.MIN_VALUE, Number.MAX_VALUE, Number.MIN_VALUE, Number.MAX_VALUE],
  );

  const updatedPositions = [...positions].map(
    ([vertex, [x, y]]): [Vertex, Point] => [
      vertex,
      [(x - minX) / (maxX - minX), (y - minY) / (maxY - minY)],
    ],
  );

  return new Map(updatedPositions);
}

function circularLayout(vertices: Vertex[]): Map<Vertex, Point> {
  const position = (vertex: Vertex, index: number): [Vertex, Point] => [
    vertex,
    pointOnUnitCircle((2 * Math.PI * index) / vertices.length + Math.PI),
  ];

  return normalizeLayout(new Map(vertices.map(position)));
}

export function complete(n: number): Graph {
  const edges = new Set<[string, string]>();
  for (let a = 1; a < n; a += 1) {
    for (let b = a + 1; b <= n; b += 1) {
      edges.add([String(a), String(b)]);
    }
  }

  const vertices = [];
  for (let a = 1; a <= n; a += 1) {
    vertices.push(`${a}`);
  }

  return {
    vertices: new Set(vertices),
    edges,
    positions: circularLayout(vertices),
  };
}

export function cycle(n: number): Graph {
  const edges = new Set<[string, string]>();
  const vertices = [];
  for (let a = 1; a <= n; a += 1) {
    vertices.push(`${a}`);
    const next = `${(a % n) + 1}`;
    edges.add([`${a}`, next]);
  }

  return {
    vertices: new Set(vertices),
    edges,
    positions: circularLayout(vertices),
  };
}

export function completeMultipartite(partitions: number[]): Graph {
  const vertices = new Set<Vertex>();
  const edges = new Set<Edge>();
  const positions = new Map();

  // Ratio between arc between partitions and arc between vertices within a partition.
  const arcRatio = 2;

  const previousInterPartitionArcs = partitions.reduce(
    (sizes, current) => [...sizes, current + sizes.at(-1)! - 1],
    [0],
  );
  const vertexArc =
    (2 * Math.PI) /
    (previousInterPartitionArcs.at(-1)! + arcRatio * partitions.length);

  // Offset angles so that first partition is centered at angle 0
  const angleOffset = (-vertexArc * (partitions[0] - 1)) / 2 + Math.PI;

  partitions.forEach((partitionSize, partitionIndex) => {
    const baseAngle =
      angleOffset +
      vertexArc * previousInterPartitionArcs[partitionIndex] +
      vertexArc * arcRatio * partitionIndex;

    for (let vertexIndex = 0; vertexIndex < partitionSize; vertexIndex += 1) {
      const vertex = `${partitionIndex + 1}.${vertexIndex + 1}`;
      vertices.add(vertex);

      const angle = baseAngle + vertexIndex * vertexArc;
      positions.set(vertex, pointOnUnitCircle(angle));

      partitions
        .slice(0, partitionIndex)
        .forEach((adjacentPartitionSize, adjacentPartitionIndex) => {
          for (
            let adjacentVertexIndex = 0;
            adjacentVertexIndex < adjacentPartitionSize;
            adjacentVertexIndex += 1
          ) {
            const adjacentVertex = `${adjacentPartitionIndex + 1}.${
              adjacentVertexIndex + 1
            }`;
            edges.add([adjacentVertex, vertex]);
          }
        });
    }
  });

  return { vertices, edges, positions };
}
