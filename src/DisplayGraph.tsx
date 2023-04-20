import React from 'react';

import * as Graph from './lib/graph';
import { Point } from './lib/graph-layout/geometry';
import { containLayout } from './lib/graph-layout/layouts';
import { range } from './lib/utils';

export type Element = Graph.Vertex | Graph.Edge;
export type HighlightSelection = Set<Element>;

type DisplayGraphProps = {
  graph: Graph.Graph;
  highlighted: HighlightSelection;
  hoverStart: (element: Element) => void;
  hoverEnd: (element: Element) => void;
};

export function DisplayGraph({
  graph: unnormalizedGraph,
  highlighted,
  hoverStart,
  hoverEnd,
}: DisplayGraphProps) {
  const size = 100;
  const inset = 10;
  const containedLayout = containLayout(unnormalizedGraph.positions, {
    lowerLeft: [inset, inset],
    upperRight: [size - inset, size - inset],
  });
  const flippedLayout = containedLayout.map(([x, y]) => [x, size - y] as Point);
  const graph = {
    ...unnormalizedGraph,
    positions: flippedLayout,
  };
  const vertexNodes = range(graph.numVertices).map((vertex) => {
    const [cx, cy] = graph.positions[vertex];
    return (
      <circle
        key={vertex}
        cx={cx}
        cy={cy}
        r={3}
        fill={highlighted.has(vertex) ? 'blue' : 'black'}
        onPointerEnter={() => hoverStart(vertex)}
        onPointerLeave={() => hoverEnd(vertex)}
      />
    );
  });

  const edgeNodes = [...graph.edges].map((edge) => {
    const [[x1, y1], [x2, y2]] = edge.map((vertex) => graph.positions[vertex]);
    return (
      <line
        key={Graph.edgeToString(edge)}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={highlighted.has(edge) ? 'blue' : 'black'}
        onPointerEnter={() => hoverStart(edge)}
        onPointerLeave={() => hoverEnd(edge)}
      />
    );
  });

  return (
    <>
      <p>{Graph.toString(graph)}</p>
      <svg
        version="1.1"
        width="500"
        height="500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${size} ${size}`}
      >
        {edgeNodes}
        {vertexNodes}
      </svg>
      <p>{highlighted}</p>
    </>
  );
}
