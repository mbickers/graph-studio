import React, { useEffect, useState } from 'react';
import './App.css';
import * as Graph from './Graph';
import * as GraphConstruction from './GraphConstruction';

function GraphEditor() {

}

function App() {
  const [graph, setGraph] = useState(GraphConstruction.complete(5))

  return <>
    <p>{Graph.toString(graph)}</p>
  </>;
}

export default App;
