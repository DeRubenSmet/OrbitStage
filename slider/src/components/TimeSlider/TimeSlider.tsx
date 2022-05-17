import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import PauseIcon from "@mui/icons-material/Pause";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ReplayIcon from "@mui/icons-material/Replay";
import React from "react";
import { useEffect, useRef, useState, useContext } from "react";
import { Rnd } from "react-rnd";
import { createContext } from "vm";
import Block, { getBlocks } from "./Block";
import Labels from "./Labels";
import SliderDates from "./SliderDates";
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
  const width = createContext({});
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
    x: sliderProps.range,
    y: 45,
    width: sliderProps.width,
    height: 110,
  });
  const [speed, setSpeed] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [marginTopBlocks, setMarginTopBlocks] = useState(0);
  const [playButtonStyle, setPlayButtonStyle] = useState({
    opacity: 0,
    bottom: 0,
    visibility: "hidden",
    marginLeft: 0,
    width: (sliderProps.width / 510) * 60,
  });
  const [resetButtonStyle, setResetButtonStyle] = useState({
    opacity: 0,
    bottom: 0,
    visibility: "hidden",
    marginLeft: 0,
    width: (sliderProps.width / 510) * 60,
  });
  const [rewindButtonStyle, setRewindButtonStyle] = useState({
    opacity: 0,
    bottom: 0,
    visibility: "hidden",
    marginLeft: 0,
    width: (sliderProps.width / 510) * 60,
  });
  const [forwardButtonStyle, setForwardButtonStyle] = useState({
    opacity: 0,
    bottom: 0,
    visibility: "hidden",
    marginLeft: 0,
    width: (sliderProps.width / 510) * 60,
  });
  const [blocks, setBlocks] = useState(
    getBlocks(count, startDate, endDate, facts, state, sliderProps.width)
  );
  let colorBlock = "#D9D9D9";
  useInterval(() => {
    if (
      playBotton === "Pause" &&
      state.width < (sliderProps.width / 510) * 500
    ) {
      if (state.x < sliderProps.width - state.width) {
        setState({
          ...state,
          x: state.x + (sliderProps.width / 510) * 1,
          y: state.y,
        });
      } else {
        setState({ ...state, x: 0, y: state.y });
      }
    }
  }, speed);
  useEffect(() => {
    setBlocks(
      getBlocks(count, startDate, endDate, facts, state, sliderProps.width)
    );
    onChange?.({
      startDate: getTime(state.x, startDate, endDate, sliderProps.width),
      endDate: getTime(
        state.x + state.width,
        startDate,
        endDate,
        sliderProps.width
      ),
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
      <div style={{ marginLeft: (sliderProps.width / 510) * 10 }}>
        {debugLabels && (
          <SliderDates
            {...state}
            startDate={startDate}
            endDate={endDate}
            widthTotal={sliderProps.width}
          />
        )}
      </div>
      <div
        style={{
          marginTop: (sliderProps.width / 510) * 20,
          marginLeft: (sliderProps.width / 510) * 20,
          border: "3px solid",
          width: (sliderProps.width / 510) * 518,
          borderRadius: 5, //...style
        }}
      >
        <div
          className="timeSlider"
          style={{
            height: 220,
            width: (sliderProps.width / 510) * 570,
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
                visibility: "hidden",
                marginLeft: 3,
                width: (sliderProps.width / 510) * 60,
              });
            }}
            onMouseEnter={() => {
              setPlayButtonColor("#d9d9d9");
              setPlayButtonStyle({
                opacity: 1,
                bottom: 105,
                visibility: "visible",
                marginLeft: (sliderProps.width / 510) * -12,
                width: (sliderProps.width / 510) * 60,
              });
            }}
            onClick={() => {
              setStatePlayButton(!statePlayButton);
            }}
            style={{
              cursor: "pointer",
              color: "white",
              height: 40,
              width: (sliderProps.width / 510) * 40,
              borderRadius: 5,
              backgroundColor: playButtonColor,
              border: "none",
              position: "absolute",
              left: (sliderProps.width / 510) * 120,
              top: 10,
              paddingTop: 2,
              paddingLeft: (sliderProps.width / 510) * 2.5,
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
                visibility: "hidden",
                marginLeft: (sliderProps.width / 510) * 3,
                width: (sliderProps.width / 510) * 60,
              });
            }}
            onMouseEnter={() => {
              setReplayButtonColor("#d9d9d9");
              setResetButtonStyle({
                opacity: 1,
                bottom: 105,
                visibility: "visible",
                marginLeft: (sliderProps.width / 510) * -12,
                width: (sliderProps.width / 510) * 60,
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
              cursor: "pointer",
              color: "white",
              height: 40,
              width: (sliderProps.width / 510) * 40,
              borderRadius: 5,
              backgroundColor: replayButtonColor,
              border: "none",
              position: "absolute",
              left: (sliderProps.width / 510) * 175,
              top: 10,
              paddingTop: 3,
              paddingLeft: (sliderProps.width / 510) * 3,
            }}
            //@ts-ignore
          >
            {buttonSpan("Reset", resetButtonStyle)}
            <ReplayIcon fontSize="large"></ReplayIcon>
          </button>
          <button
            onMouseLeave={() => {
              setRewindButtonColor("#bfbfbf");
              setRewindButtonStyle({
                opacity: 0,
                bottom: 0,
                visibility: "hidden",
                marginLeft: (sliderProps.width / 510) * 3,
                width: (sliderProps.width / 510) * 60,
              });
            }}
            onMouseEnter={() => {
              setRewindButtonColor("#d9d9d9");
              setRewindButtonStyle({
                opacity: 1,
                bottom: 105,
                visibility: "visible",
                marginLeft: (sliderProps.width / 510) * -12,
                width: (sliderProps.width / 510) * 60,
              });
            }}
            onClick={() => {
              if (multiplier > 0.25) {
                setSpeed(speed + 2.5);
                setMultiplier(multiplier / 2);
              }
            }}
            style={{
              cursor: "pointer",
              color: "white",
              height: 40,
              width: (sliderProps.width / 510) * 40,
              borderRadius: 5,
              backgroundColor: rewindButtonColor,
              border: "none",
              position: "absolute",
              left: (sliderProps.width / 510) * 230,
              top: 10,
              paddingTop: 3,
              paddingLeft: (sliderProps.width / 510) * 2,
            }}
            //@ts-ignore
          >
            {buttonSpan("Rewind", rewindButtonStyle)}
            <FastRewindIcon fontSize="large"></FastRewindIcon>
          </button>
          <button
            onMouseLeave={() => {
              setForwardButtonColor("#bfbfbf");
              setForwardButtonStyle({
                opacity: 0,
                bottom: 0,
                visibility: "hidden",
                marginLeft: (sliderProps.width / 510) * 3,
                width: (sliderProps.width / 510) * 60,
              });
            }}
            onMouseEnter={() => {
              setForwardButtonColor("#d9d9d9");
              setForwardButtonStyle({
                opacity: 1,
                bottom: 105,
                visibility: "visible",
                marginLeft: (sliderProps.width / 510) * -12,
                width: (sliderProps.width / 510) * 60,
              });
            }}
            onClick={() => {
              if (multiplier < 4) {
                setSpeed(speed - 2.5);
                setMultiplier(multiplier * 2);
              }
            }}
            style={{
              cursor: "pointer",
              color: "white",
              height: 40,
              width: (sliderProps.width / 510) * 40,
              borderRadius: 5,
              backgroundColor: forwardButtonColor,
              border: "none",
              position: "absolute",
              left: (sliderProps.width / 510) * 285,
              top: 10,
              paddingTop: 3,
              paddingLeft: (sliderProps.width / 510) * 3,
            }}
            //@ts-ignore
          >
            {buttonSpan("Forward", forwardButtonStyle)}
            <FastForwardIcon fontSize="large"></FastForwardIcon>
          </button>
          <div
            style={{
              cursor: "default",
              color: "white",
              height: 32,
              width: (sliderProps.width / 510) * 40,
              borderRadius: 5,
              backgroundColor: "#bfbfbf",
              border: "none",
              position: "absolute",
              left: (sliderProps.width / 510) * 340,
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
              width: (sliderProps.width / 510) * 500,
              height: "107px",
              borderRadius: "7px",
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              justifyContent: "space-around",
              alignItems: "flex-end",
              marginLeft: (sliderProps.width / 510) * 10,
              position: "relative",
            }}
          >
            {blocks.map((block) => (
              <Block
                widthTotal={sliderProps.width}
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
                width: (sliderProps.width / 510) * 508,
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
                  borderWidth: (sliderProps.width / 510) * 10,
                  cursor: "move",
                }}
                default={{
                  x: 0,
                  y: 120,
                  width: (sliderProps.width / 510) * 20,
                  height: 40,
                }}
                enableResizing={{
                  top: false,
                  right: true,
                  left: true,
                  bottom: false,
                }}
                minWidth={(sliderProps.width / 510) * 2}
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
          <Labels
            startDate={startDate}
            endDate={endDate}
            width={sliderProps.width}
          />
        </div>
      </div>
    </>
  );
};

export default TimeSlider;
