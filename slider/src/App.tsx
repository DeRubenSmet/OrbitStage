import React from "react";
import "./App.css";
import TimeSlider from "./components/TimeSlider";

const count = 10;
const startDate = new Date(2019, 11, 17);
const endDate = new Date(startDate).setDate(startDate.getDate() + count);
const facts = Array(100).fill(undefined).map(() => ({date: new Date(new Date(startDate).setDate(startDate.getDate() + Math.round(Math.random() * count)))}));

const months = {count: 10, date: new Date(2019, 11, 17)}
function App() {

  return (
    <>
      <TimeSlider {...months} />
    </>
  );
}

{
  /* <TimeSlider months=[{count, date}] timeUpdated = {(startDate, endDate) => console.log(startDate, endDate)} /> */
}

export default App;
