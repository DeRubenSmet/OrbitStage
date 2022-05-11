import { Icon, LinearProgress } from "@mui/material";
import { wait } from "@testing-library/user-event/dist/utils";
import { listenerCount } from "process";
import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import Block, { getBlocks } from "./Block";
import Labels from "./Labels";
import SliderDates from "./SliderDates";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import getTime from "./utils/time";

interface TimeSliderProps {
  startDate: Date;
  endDate: Date;
  facts: { count: number }[];
  onChange?: ({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }) => void;
  debugLabels?: boolean;
  sliderProps?: { range: number; width: number };
}

const getBlockX = (count: number, index: number) => {
  let x = 492 / count + (index * 492) / count + index * 4;
  return x;
};

//@ts-ignore
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      //@ts-ignore
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const TimeSlider = ({
  startDate,
  endDate,
  facts,
  onChange,
  debugLabels,
}: TimeSliderProps) => {
  // const width =  style?.width || 560;
  const count = facts.length;
  const [playButtonColor, setPlayButtonColor] = useState("#bfbfbf");
  const [statePlayButton, setStatePlayButton] = useState(true);
  const [playBotton, setPlayButton] = useState("Play");
  const [playIcon, setPlayIcon] = useState("PlayCircleIcon");
  const [replayButtonColor, setReplayButtonColor] = useState("#bfbfbf");
  const [rewindButtonColor, setRewindButtonColor] = useState("#bfbfbf");
  const [forwardButtonColor, setForwardButtonColor] = useState("#bfbfbf");
  const [state, setState] = useState({ x: 70, y: 40, width: 50, height: 60 });
  const [speed, setSpeed] = useState(10);
  const [blocks, setBlocks] = useState(
    getBlocks(count, startDate, endDate, facts, state)
  );
  let colorBlock = "#D9D9D9";
  useInterval(() => {
    if (playBotton === "Pause" && state.width < 500) {
      if (state.x !== 510 - state.width) {
        setState({ ...state, x: state.x + 1, y: state.y });
      } else {
        setState({ ...state, x: 0, y: state.y });
      }
    }
  }, speed);
  useEffect(() => {
    setBlocks(getBlocks(count, startDate, endDate, facts, state));
    onChange?.({
      startDate: getTime(state.x, startDate, endDate),
      endDate: getTime(state.x + state.width, startDate, endDate),
    });
  }, [state]);

  useEffect(() => {
    setSpeed(speed);
  }, [setSpeed]);

  useEffect(() => {
    if (statePlayButton === true) {
      setPlayButton("Play");
      setPlayIcon("PlayCircleIcon");
    } else {
      setPlayButton("Pause");
      setPlayIcon("PauseIcon");
    }
  }, [statePlayButton, state]);
  const playIconFunction = () => {
    if (playIcon === "PlayCircleIcon") {
      return <PlayCircleIcon fontSize="large"></PlayCircleIcon>;
    } else {
      return <PauseIcon fontSize="large"></PauseIcon>;
    }
  };
  return (
    <div
      style={{
        marginTop: 20,
        marginLeft: 20,
        border: "3px solid",
        width: 560,
        borderRadius: 5, //...style
      }}
    >
      {debugLabels && (
        <SliderDates {...state} startDate={startDate} endDate={endDate} />
      )}
      <button
        onMouseLeave={() => {
          setPlayButtonColor("#bfbfbf");
        }}
        onMouseEnter={() => {
          setPlayButtonColor("#d9d9d9");
        }}
        onClick={() => {
          setStatePlayButton(!statePlayButton);
        }}
        style={{
          color: "white",
          height: 40,
          width: 40,
          borderRadius: 5,
          backgroundColor: playButtonColor,
          border: "none",
          position: "absolute",
          left: 325,
          top: 45,
          paddingTop: 2,
          paddingLeft: 2,
        }}
        //@ts-ignore
      >
        {playIconFunction()}
      </button>
      <button
        onMouseLeave={() => {
          setReplayButtonColor("#bfbfbf");
        }}
        onMouseEnter={() => {
          setReplayButtonColor("#d9d9d9");
        }}
        onClick={() => {
          setStatePlayButton(true);
          setState({ ...state, x: 0, y: state.y });
          setSpeed(10);
        }}
        style={{
          color: "white",
          height: 40,
          width: 40,
          borderRadius: 5,
          backgroundColor: replayButtonColor,
          border: "none",
          position: "absolute",
          left: 380,
          top: 45,
          paddingTop: 3,
          paddingLeft: 3,
        }}
        //@ts-ignore
      >
        <ReplayIcon fontSize="large"></ReplayIcon>
      </button>
      <button
        onMouseLeave={() => {
          setRewindButtonColor("#bfbfbf");
        }}
        onMouseEnter={() => {
          setRewindButtonColor("#d9d9d9");
        }}
        onClick={() => {
          setSpeed(speed + 5);
        }}
        style={{
          color: "white",
          height: 40,
          width: 40,
          borderRadius: 5,
          backgroundColor: rewindButtonColor,
          border: "none",
          position: "absolute",
          left: 435,
          top: 45,
          paddingTop: 3,
          paddingLeft: 3,
        }}
        //@ts-ignore
      >
        <FastRewindIcon fontSize="large"></FastRewindIcon>
      </button>
      <button
        onMouseLeave={() => {
          setForwardButtonColor("#bfbfbf");
        }}
        onMouseEnter={() => {
          setForwardButtonColor("#d9d9d9");
        }}
        onClick={() => {
          if (speed !== 0) {
            setSpeed(speed - 5);
          }
        }}
        style={{
          color: "white",
          height: 40,
          width: 40,
          borderRadius: 5,
          backgroundColor: forwardButtonColor,
          border: "none",
          position: "absolute",
          left: 490,
          top: 45,
          paddingTop: 3,
          paddingLeft: 3,
        }}
        //@ts-ignore
      >
        <FastForwardIcon fontSize="large"></FastForwardIcon>
      </button>
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
        <Labels startDate={startDate} endDate={endDate} />
      </div>
    </div>
  );
};

export default TimeSlider;
