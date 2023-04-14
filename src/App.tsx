import React, { useEffect, useState } from 'react';
import './App.css';
import * as GraphConstruction from './GraphConstruction';
import * as Graph from './Graph';

type Element = Graph.Vertex | Graph.Edge
type HighlightSelection = Set<Element>

type DisplayGraphProps = {
  graph: Graph.Graph
  highlighted: HighlightSelection
  hoverStart: (element: Element) => void
  hoverEnd: (element: Element) => void
}

function DisplayGraph({ graph, highlighted, hoverStart, hoverEnd }: DisplayGraphProps) {
  const size = 100
  const inset = 10
  const vertexPosition = (vertex: string) => {
    const [x, y] = graph.positions.get(vertex) as [number, number]
    return [x * (size / 2 - inset) + size / 2, y * (size / 2 - inset) + size / 2]
  }
  const vertexNodes = [...(graph.vertices)].map(vertex => {
    const [cx, cy] = vertexPosition(vertex)
    return <circle key={vertex} cx={cx} cy={cy} r={3}
    fill={highlighted.has(vertex) ? 'blue' : 'black'}
    onPointerEnter={() => hoverStart(vertex)} onPointerLeave={() => hoverEnd(vertex) }/>
  })

  const edgeNodes = [...(graph.edges)].map(edge => {
    const [[x1, y1], [x2, y2]] = edge.map(vertexPosition)
    return <line key={Graph.edgeToString(edge)} x1={x1} y1={y1} x2={x2} y2={y2}
    stroke={highlighted.has(edge) ? 'blue' : 'black'}
    onPointerEnter={() => hoverStart(edge)} onPointerLeave={() => hoverEnd(edge)}/>
  })
  return <>
    <p>{Graph.toString(graph)}</p>
    <svg version="1.1" width="500" height="500" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`}>
      {edgeNodes}
      {vertexNodes}
    </svg>
  </>
}

function App() {
  const [graph, setGraph] = useState(() => GraphConstruction.complete(7))
  const [highlighted, setHighlighted] = useState(() => new Set() as HighlightSelection)

  return <DisplayGraph graph={graph}
    highlighted={highlighted}
    hoverStart={element => {
      setHighlighted(currentHighlighted => {
        const newHighlighted = new Set(currentHighlighted)
        newHighlighted.add(element)
        return newHighlighted
      })
    }}
    hoverEnd={element => {
      setHighlighted(currentHighlighted => {
        const newHighlighted = new Set(currentHighlighted)
        newHighlighted.delete(element)
        return newHighlighted
      })
    }}/>
}

export default App;
