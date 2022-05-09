import { LinearProgress } from "@mui/material";
import { listenerCount } from "process";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import Block, { getBlocks } from "./Block";
import Labels from "./Labels";
import SliderDates from "./SliderDates";

import getTime from "./utils/time";

interface TimeSliderProps {
  startDate: Date;
  endDate: Date;
  facts: { count: number; }[];
  onChange?: ({startDate, endDate}: {startDate: Date, endDate: Date}) => void;
  debugLabels?: boolean; 
  sliderProps?: {range: number, width: number}
}

const getBlockX = (count: number, index: number) => {
  let x = 492 / count + (index * 492) / count + index * 4;
  return x;
};

const TimeSlider = ({startDate, endDate, facts, onChange, debugLabels}: TimeSliderProps) => {
  // const width =  style?.width || 560;
  const count = facts.length;
  const [state, setState] = useState({ x: 70, y: 40, width: 50, height: 60 });
  const [blocks, setBlocks] = useState(
    getBlocks(count, startDate, endDate, facts, state)
  );
  let colorBlock = "#D9D9D9";

  useEffect(() => {
    setBlocks(getBlocks(count, startDate, endDate, facts, state));
    onChange?.({ startDate: getTime(state.x, startDate, endDate), endDate: getTime(state.x + state.width, startDate, endDate)});
  }, [state]);

  return (
 <div style={{marginTop: 20, marginLeft: 20, border: "3px solid", width: 560, borderRadius: 5, //...style
}}>
    {debugLabels && <SliderDates {...state} startDate={startDate} endDate={endDate}/>}
    <div
      className="timeSlider"
      style={{
        
        height: "170px",
        width: "570px",
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
          height: "60px",
          borderRadius: "7px",
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "space-around",
          alignItems: "flex-end",
          marginLeft: 10,
          position: "relative",

        }}
      >
        {blocks.map((block) => (
          <Block
            {...state}
            {...getBlockX(count, block.index)}
            key={block.index}
            {...block}
            {...colorBlock}
          />
        ))}
        <div
          style={{
            visibility: "hidden",
            position: "absolute",
            width: "508px",
            height: "150px",
            border: "1px solid",
          }}
        >
          <Rnd
            style={{
              visibility: "visible",
              borderLeft: "8px solid",
              borderRight: "8px solid",
              borderRadius: "5px",
              borderColor: "#A6A6A6",
              cursor: "move"
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
      <Labels startDate={startDate} endDate={endDate}/>
      <Labels startDate={startDate} endDate={endDate}/>
    </div>
    </div>
  );
};

export default TimeSlider;
