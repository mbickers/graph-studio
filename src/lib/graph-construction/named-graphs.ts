import { Edge, Graph } from '../graph';
import {
  circularLayout,
  circularLayoutPartitioned,
} from '../graph-layout/layouts';
import { range } from '../utils';

export function complete(n: number): Graph {
  const edges = range(n).flatMap((v1) =>
    range(v1 - 1).map((v2) => [v1, v2] as Edge),
  );
  return {
    numVertices: n,
    edges,
    positions: circularLayout(n),
  };
}

export function cycle(n: number): Graph {
  const edges = range(n).map((v) => [v, (v + 1) % n] as Edge);
  return {
    numVertices: n,
    edges,
    positions: circularLayout(n),
  };
}

export function completeMultipartite(partitions: number[]): Graph {
  const edges = partitions.flatMap((partitionSize, partitionIndex) => {
    const verticesPrecedingPartition = partitions
      .slice(0, partitionIndex)
      .reduce((sum, current) => sum + current, 0);
    return range(partitionSize).flatMap((vertexIndexInPartition) =>
      range(verticesPrecedingPartition).map(
        (adjacentVertex) =>
          [
            vertexIndexInPartition + verticesPrecedingPartition,
            adjacentVertex,
          ] as Edge,
      ),
    );
  });

  return {
    numVertices: partitions.reduce((sum, current) => sum + current, 0),
    edges,
    positions: circularLayoutPartitioned(partitions),
  };
}
