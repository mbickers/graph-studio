import React, { useState } from 'react';
import { MatrixEditor } from './MatrixEditor';
import { iota } from './lib/matrix';

function App() {
  const [matrix, setMatrix] = useState(iota(3, 5));

  return <MatrixEditor values={matrix} setValues={setMatrix} />;
}

export default App;
