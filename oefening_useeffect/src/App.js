import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';

function App() {
  const [test, setTest] = useState(0);

  useEffect( () => { console.log(test) });
  return (
    <div>
      <h3 onClick={() => {setTest(test + 1)}}>{test}</h3> 
    </div>
  );
}

export default App;

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';

function App() {
  const [test, setTest] = useState(0);

  useEffect( () => { console.log(test) }, []);
  return (
    <div>
      <h3 onClick={() => {setTest(test + 1)}}>{test}</h3> 
    </div>
  );
}

export default App;

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';

function App() {
  const [test, setTest] = useState(0);

  useEffect( () => { console.log(test) }, [test]);
  return (
    <div>
      <h3 onClick={() => {setTest(test + 1)}}>{test}</h3> 
    </div>
  );
}

export default App;
