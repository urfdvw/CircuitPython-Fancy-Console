import React, { useState, useEffect } from "react";
import useSlowChangeState from "./useSlowChangeState";
import { RgbColorPicker } from "react-colorful";
import * as constants from "./constants";

export const VariableSetColor = ({ variableName, displayName, sendData }) => {
  const [color, setColor] = useState({
    r: 255,
    g: 255,
    b: 255,
  });

  // send data on change
  const slowColor = useSlowChangeState(color, 0.3);

  const handleSend = (color) => {
    const updatedVariable = { [variableName]: [color.r, color.g, color.b] };
    sendData(
      constants.CV_JSON_START +
        JSON.stringify(updatedVariable) +
        constants.CV_JSON_END +
        constants.LINE_END
    );
  };

  useEffect(() => {
    handleSend(color);
  }, [slowColor]);

  return (
    <>
      <span>{displayName}</span>
      <RgbColorPicker
        color={color}
        onChange={setColor}
        onMouseUp={() => {
          handleSend(color);
        }}
        onMouseLeave={() => {
          handleSend(color);
        }}
      />
    </>
  );
};

export const variableSetColorObj = (variableName, displayName) => {
  return {
    key: crypto.randomUUID(),
    type: "VariableSetColor",
    variableName: variableName,
    displayName: displayName,
    windowed: false,
  };
};

export const variableSetColorTitle =
  "Color picker that send a list of 3 integer between [0, 255] represent the amount of Red, Green and Blue";
