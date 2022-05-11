import React from "react";
import "./App.css";
import TimeSlider from "./components/TimeSlider";

const count = 60;
const startDate = new Date(2019, 1, 1);
const endDate = new Date(2026, 11, 1);
const sliderProps = {range: 14, width: 20}
const facts = Array(count)
  .fill(undefined)
  .map(() => ({
    // date: new Date(
    //   new Date(startDate).setDate(
    //     startDate.getDate() + Math.round(Math.random() * count)
    //   )
    // ),
    count: Math.round(Math.random() * 100)
  }));
const onChangeHandler = ({startDate: dateStart, endDate: dateEnd}: {startDate: Date, endDate: Date}) => {
  console.log(dateStart, dateEnd);
}

function App() {
  return (
    <>
      <TimeSlider {...{ startDate, endDate, facts }} onChange={onChangeHandler} debugLabels sliderProps={sliderProps} //style=()
      />
    </>
  );
}

{
  /* <TimeSlider months=[{count, date}] timeUpdated = {(startDate, endDate) => console.log(startDate, endDate)} /> */
}

export default App;
