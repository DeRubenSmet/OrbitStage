import React from "react";
import "./App.css";
import TimeSlider from "./components/TimeSlider";

const count = 60;
const startDate = new Date(2019, 1, 1);
const endDate = new Date(2020, 8, 1);
const sliderProps = { range: 0, width: 700 };
const facts = Array(count)
  .fill(undefined)
  .map(() => ({
    // date: new Date(
    //   new Date(startDate).setDate(
    //     startDate.getDate() + Math.round(Math.random() * count)
    //   )
    // ),
    count: Math.round(Math.random() * 100),
  }));
const onChangeHandler = ({
  startDate: dateStart,
  endDate: dateEnd,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  console.log(dateStart, dateEnd);
};

function App() {
  return (
    <>
      <TimeSlider
        {...{ startDate, endDate, facts }}
        onChange={onChangeHandler}
        //debugLabels
        sliderProps={sliderProps} //style=()
      />
    </>
  );
}

export default App;
