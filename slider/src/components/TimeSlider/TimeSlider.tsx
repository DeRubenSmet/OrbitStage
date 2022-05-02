import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import Block, { getBlocks } from "./Block";

import getTime from "./utils/time";

interface TimeSliderProps {
  count: number;
  date: Date;
}

const getBlockX = (count: number, index: number) => {
  let x = 492 / count + (index * 492) / count + index * 4;
  return x;
};

const TimeSlider = (months: TimeSliderProps) => {
  const [state, setState] = useState({ x: 70, y: 40, width: 50, height: 60 });
  const [blocks, setBlocks] = useState(
    getBlocks(months.count, months.date, state)
  );
  let colorBlock = "#D9D9D9";

  useEffect(() => {
    setBlocks(getBlocks(months.count, months.date, state));
  }, [state]);

  return (
    <div
      className="timeSlider"
      style={{
        border: "1px solid",
        height: "200px",
        width: "900px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
      }}
    >
      <div
        className="slider"
        style={{
          width: "500px",
          height: "150px",
          borderRadius: "7px",
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "space-around",
          alignItems: "flex-end",
          marginLeft: "30px",
          position: "relative",
          bottom: 20,
        }}
      >
        {blocks.map((block) => (
          <Block
            {...state}
            {...getBlockX(months.count, block.index)}
            key={block.index}
            {...block}
            {...colorBlock}
          />
        ))}
        <div
          style={{
            visibility: "visible",
            position: "absolute",
            width: "508px",
            height: "150px",
            border: "1px solid",
          }}
        >
          {/*@ts-ignore*/}
          <Rnd
            style={{
              visibility: "visible",
              borderLeft: "8px solid",
              borderRight: "8px solid",
              borderRadius: "5px",
              borderColor: "#A6A6A6",
              cursor: "move",
            }}
            default={{
              x: 0,
              y: 120,
              width: 20,
              height: 40,
            }}
            enableResizing={{
              top: false,
              right: true,
              left: true,
              bottom: false,
            }}
            minWidth={2}
            dragAxis="x"
            //@ts-ignore
            // onDrag={(e, data) => console.log(data)}
            bounds="parent"
            size={{
              width: state.width,
              height: state.height,
            }}
            position={{
              x: state.x,
              y: state.y,
            }}
            onDrag={(e: any, d: any) => {
              setState({ ...state, x: d.x, y: d.y });
            }}
            onResize={(e, direction, ref, delta, position) => {
              setState({
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                ...position,
              });
            }}
          ></Rnd>
        </div>
      </div>
      <div style={{ position: "absolute", left: 550, bottom: 29 }}>
        <p>
          <strong>Start: </strong>

          {getTime(state.x, months.count, months.date).toUTCString()}
        </p>
        <p>
          <strong>End: </strong>
          {getTime(
            state.x + state.width,
            //  - 500 / months.count
            months.count,
            months.date
          ).toUTCString()}
        </p>
      </div>
    </div>
  );
};

export default TimeSlider;
