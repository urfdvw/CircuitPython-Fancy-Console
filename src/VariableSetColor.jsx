
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from '@mui/material/Box';
import useSlowChangeState from "./useSlowChangeState"


import { RgbColorPicker } from "react-colorful";
import * as constants from "./constants";

export const VariableSetColor = ({
    variableName,
    displayName,
    sendData,
}) => {
    const [color, setColor] = useState({
        r: 255,
        g: 255,
        b: 255
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
    }

    useEffect(() => {
        handleSend(color)
    }, [slowColor])

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    return (
        <>
            <span>{displayName}</span>
            <RgbColorPicker color={color} onChange={setColor} style={{ float: "right" }} />
        </>
    );
};


export const CreateVariableSetColor = ({ open, onClose, setWidgets }) => {
    const [variableName, setVariableName] = React.useState("");
    const [displayName, setDisplayName] = React.useState("");

    const handleSubmit = () => {
        setWidgets((cur) => {
            return [
                ...cur,
                // change the obj below
                {
                    key: crypto.randomUUID(),
                    type: "VariableSetColor",
                    variableName: variableName,
                    displayName: displayName,
                    windowed: false,
                },
            ];
        });
        onClose();
    };
    return (
        <Dialog open={open}>
            {/* change the title below */}
            <DialogTitle> Color picker that send a list of 3 integer between [0, 255] represent the amount of Red, Green and Blue</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Please make sure there is a connected variable created in your
                    microcontroller code.
                </DialogContentText>
                {/* change the fields if needed*/}
                <TextField
                    autoFocus
                    margin="dense"
                    label="Variable Name"
                    fullWidth
                    variant="standard"
                    value={variableName}
                    onChange={(event) => {
                        setVariableName(event.target.value);
                    }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Display Text"
                    fullWidth
                    variant="standard"
                    value={displayName}
                    onChange={(event) => {
                        setDisplayName(event.target.value);
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        onClose();
                    }}
                >
                    {" "}
                    Cancel{" "}
                </Button>
                <Button onClick={handleSubmit}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};