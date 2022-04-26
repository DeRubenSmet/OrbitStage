import React, { useState } from "react";
import "./App.css";
import { wrap } from "module";
import { Resizable, ResizableBox } from "react-resizable";
import Draggable, { DraggableCore } from "react-draggable"; // Both at the same time
import { relative } from "path";
import { Rnd } from "react-rnd";

interface BlockType {
  date: Date;
  value: number;
  index: number;
}
const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
} as const;
const setBlocks = (count: number) => {
  let blocks: BlockType[] = [];
  for (let i = 0; i < count; i++) {
    blocks.push({
      value: Math.ceil(Math.random() * 100),
      date: new Date(),
      index: i,
    });
  }

  return blocks;
};

// const setMonths = (startYear: number, endYear: number) => {
//   const avarageYear = (endYear - startYear) * 12
// }
const blocks = setBlocks(40);
const Block = (block: BlockType) => {
  const { value, date, index } = block;

  return (
    <div
      className="blockSlider"
      style={{
        backgroundColor: "#D9D9D9",
        flex: 1,
        height: value,
        margin: "4px",
      }}
    ></div>
  );
};

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 }); //@ts-ignore
  const trackPos = (data) => {
    setPosition({ x: data.x, y: data.y });
  };
  const [state, setState] = useState({ x: 0, y: 90, width: 20, height: 40 });
  return (
    <>
      <div
        className="timeSlider"
        style={{
          border: "1px solid",
          height: "200px",
          width: "800px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div
          className="slider"
          style={{
            border: "1px solid",
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
          }}
        >
          {blocks.map((block) => (
            <Block {...block} />
          ))}{" "}
          <div
            style={{ position: "absolute", width: "508px", height: "150px" }}
          >
            {/*@ts-ignore*/}
            <Rnd
              style={{
                borderLeft: "8px solid",
                borderRight: "8px solid",
                borderRadius: "5px",
                borderColor: "#00ACC1",
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
              onDrag={(e, data) => console.log(data)}
              bounds="parent"
              size={{
                width: state.width,
                height: state.height,
              }}
              position={{
                x: state.x,
                y: state.y,
              }}
              onDragStop={(e: any, d: any) => {
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
      </div>
    </>
  );
}

export default App;
