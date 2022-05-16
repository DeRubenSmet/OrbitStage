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
import { VerticalAlignCenter, Visibility } from "@mui/icons-material";
import { stat } from "fs";
import { style } from "@mui/system";

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
  sliderProps: { range: number; width: number };
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
  sliderProps,
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
  const [state, setState] = useState({
    x: sliderProps.range || 0,
    y: 45,
    width: sliderProps.width || 120,
    height: 110,
  });
  const [speed, setSpeed] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [marginTopBlocks, setMarginTopBlocks] = useState(0);
  const [playButtonStyle, setPlayButtonStyle] = useState({
    opacity: 0,
    bottom: 0,
visibility: 'hidden',
marginLeft: 0,
width: 60
  });
  const [resetButtonStyle, setResetButtonStyle] = useState({
    opacity: 0,
    bottom: 0,
    visibility: 'hidden',
    marginLeft: 0,
    width: 60
  });
  const [rewindButtonStyle, setRewindButtonStyle] = useState({
    opacity: 0,
    bottom: 0,
    visibility: 'hidden',
    marginLeft: 0,
    width: 60
  });
  const [forwardButtonStyle, setForwardButtonStyle] = useState({
    opacity: 0,
    bottom: 0,
    visibility: 'hidden',
    marginLeft: 0,
    width: 60
  });
  const [blocks, setBlocks] = useState(
    getBlocks(count, startDate, endDate, facts, state)
  );
  let colorBlock = "#D9D9D9";
  useInterval(() => {
    if (playBotton === "Pause" && state.width < 500) {
      if (state.x !== sliderProps.width - state.width) {
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

  const buttonSpan = (button: any, buttonStyle: any) => {
    return (
      <span
        style={{
          position: "absolute",
          visibility: buttonStyle.visibility,
          width: buttonStyle.width,
          backgroundColor: "#555",
          color: "#fff",
          textAlign: "center",
          borderRadius: "6px",
          padding: "5px 0",
          zIndex: 1,
          bottom: `${buttonStyle.bottom}%`,
          marginLeft: buttonStyle.marginLeft,
          opacity: buttonStyle.opacity,
        }}
      >
        <span
          style={{
            marginLeft: "-5px",
            content: "",
            position: "absolute",
            top: `${buttonStyle.bottom * 0.95238095}%`,
            left: "50%",
            borderWidth: "5px",
            borderStyle: "solid",
            borderColor: "#555 transparent transparent transparent",
          }}
        ></span>
        {button}
      </span>
    );
  };

  return (
    <>
      <div style={{ marginLeft: 10 }}>
        {debugLabels && (
          <SliderDates {...state} startDate={startDate} endDate={endDate} />
        )}
      </div>
      <div
        style={{
          marginTop: 20,
          marginLeft: 20,
          border: "3px solid",
          width: 518,
          borderRadius: 5, //...style
        }}
      >
        <div
          className="timeSlider"
          style={{
            height: 220,
            width: "570px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            position: "relative",
          }}
        >
          <button
            onMouseLeave={() => {
              setPlayButtonColor("#bfbfbf");
              setPlayButtonStyle({
                opacity: 0,
                bottom: 0,
                visibility: 'hidden',
                marginLeft: 3,
                width: 60
              });
            }}
            onMouseEnter={() => {
              setPlayButtonColor("#d9d9d9");
              setPlayButtonStyle({
                opacity: 1,
                bottom: 105,
                visibility: 'visible',
                marginLeft: -12,
                width: 60
              });
            }}
            onClick={() => {
              setStatePlayButton(!statePlayButton);
            }}
            style={{
              cursor: 'pointer',
              color: "white",
              height: 40,
              width: 40,
              borderRadius: 5,
              backgroundColor: playButtonColor,
              border: "none",
              position: "absolute",
              left: 120,
              top: 10,
              paddingTop: 2,
              paddingLeft: 2.5,
              display: "inline-block",
            }}
          >
            {buttonSpan(playBotton, playButtonStyle)}
            {playIconFunction()}
          </button>
          <button
            onMouseLeave={() => {
              setReplayButtonColor("#bfbfbf");
              setResetButtonStyle({
                opacity: 0,
                bottom: 0,
                visibility: 'hidden',
                marginLeft: 3,
                width: 60
              });
            }}
            onMouseEnter={() => {
              setReplayButtonColor("#d9d9d9");
              setResetButtonStyle({
                opacity: 1,
                bottom: 105,
                visibility: 'visible',
                marginLeft: -12,
                width: 60
              });
            }}
            onClick={() => {
              setStatePlayButton(true);
              setState({
                ...state,
                x: 0,
                y: state.y,
                width: sliderProps?.width || 100,
              });
              setSpeed(10);
              setMultiplier(1);
            }}
            style={{
              color: "white",
              height: 40,
              width: 40,
              borderRadius: 5,
              backgroundColor: replayButtonColor,
              border: "none",
              position: "absolute",
              left: 175,
              top: 10,
              paddingTop: 3,
              paddingLeft: 3,
            }}
            //@ts-ignore
          >
            {buttonSpan('Reset', resetButtonStyle)}
            <ReplayIcon fontSize="large"></ReplayIcon>
          </button>
          <button
            onMouseLeave={() => {
              setRewindButtonColor("#bfbfbf");
              setRewindButtonStyle({
                opacity: 0,
                bottom: 0,
                visibility: 'hidden',
                marginLeft: 3,
                width: 60
              });
            }}
            onMouseEnter={() => {
              setRewindButtonColor("#d9d9d9");
              setRewindButtonStyle({
                opacity: 1,
                bottom: 105,
                visibility: 'visible',
                marginLeft: -12,
                width: 60
              });
            }}
            onClick={() => {
              if (multiplier > 0.25) {
                setSpeed(speed + 2.5);
                setMultiplier(multiplier / 2);
              }
            }}
            style={{
              color: "white",
              height: 40,
              width: 40,
              borderRadius: 5,
              backgroundColor: rewindButtonColor,
              border: "none",
              position: "absolute",
              left: 230,
              top: 10,
              paddingTop: 3,
              paddingLeft: 2,
            }}
            //@ts-ignore
          >
            {buttonSpan('Rewind', rewindButtonStyle)}
            <FastRewindIcon fontSize="large"></FastRewindIcon>
          </button>
          <button
            onMouseLeave={() => {
              setForwardButtonColor("#bfbfbf");
              setForwardButtonStyle({
                opacity: 0,
                bottom: 0,
                visibility: 'hidden',
                marginLeft: 3,
                width: 60
              });
            }}
            onMouseEnter={() => {
              setForwardButtonColor("#d9d9d9");
              setForwardButtonStyle({
                opacity: 1,
                bottom: 105,
                visibility: 'visible',
                marginLeft: -12,
                width: 60
              });
            }}
            onClick={() => {
              if (multiplier < 4) {
                setSpeed(speed - 2.5);
                setMultiplier(multiplier * 2);
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
              left: 285,
              top: 10,
              paddingTop: 3,
              paddingLeft: 3,
            }}
            //@ts-ignore
          >
            {buttonSpan('Forward', forwardButtonStyle)}
            <FastForwardIcon fontSize="large"></FastForwardIcon>
          </button>
          <div
            style={{
              color: "white",
              height: 32,
              width: 40,
              borderRadius: 5,
              backgroundColor: "#bfbfbf",
              border: "none",
              position: "absolute",
              left: 340,
              top: 10,
              textAlign: "center",
              paddingTop: 8,
            }}
          >
            x{multiplier}
          </div>
          <div
            className="slider"
            style={{
              width: "500px",
              height: "107px",
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
                  borderWidth: 10,
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
    </>
  );
};

export default TimeSlider;
