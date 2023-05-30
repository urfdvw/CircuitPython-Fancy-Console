
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as constants from "./constants";

export const VariableSetBoolButton = ({
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

export const variableSetBoolButtonObj = (variableName, displayName) => {
    return {
        key: crypto.randomUUID(),
        type: "VariableSetBoolButton",
        variableName: variableName,
        displayName: displayName,
        windowed: false,
    }
}

export const variableSetBoolTitle = "Create a button that related to a bool connected variable";
