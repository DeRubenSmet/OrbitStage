import React, {useContext} from 'react';
import logo from './logo.svg';
import './App.css';



function App() {
  //@ts-ignore
  const NumberContext = React.createContext();
  function Display(){
  const value = useContext(NumberContext)
  //@ts-ignore
  return <div>feggfgsr {value}</div>;
}
  return (
    <Display></Display>
  );
}

export default App;
