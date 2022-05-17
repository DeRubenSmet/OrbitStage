import React, {createContext, useContext, useState} from 'react';
import logo from './logo.svg';
import './App.css';

  const NumberContext = createContext({});

function App() {
const [user, setUser] = useState('test');

  return (
    <NumberContext.Provider value={'test'}>
      <div>{}</div>
    </NumberContext.Provider>
  );
  }
export default App;
