
import React, { useState } from "react";
import Button from "@mui/material/Button";
import * as constants from "./constants";

const VariableSetBoolButton = ({
    variableName,
    displayName,
    sendData,
}) => {
    return (
        <>
            <Button variant="contained"
                onMouseDown={() => {
                    const updatedVariable = { [variableName]: true };
                    sendData(
                        constants.CV_JSON_START +
                        JSON.stringify(updatedVariable) +
                        constants.CV_JSON_END +
                        constants.LINE_END
                    );
                }}
                onMouseUp={() => {
                    const updatedVariable = { [variableName]: false };
                    sendData(
                        constants.CV_JSON_START +
                        JSON.stringify(updatedVariable) +
                        constants.CV_JSON_END +
                        constants.LINE_END
                    );
                }}>{displayName}</Button>
        </>
    );
};
export default VariableSetBoolButton