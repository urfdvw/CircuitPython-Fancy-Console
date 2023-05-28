
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


export const CreateVariableSetBoolButton = ({ open, onClose, setWidgets }) => {
    const [variableName, setVariableName] = React.useState("");
    const [displayName, setDisplayName] = React.useState("");

    const handleSubmit = () => {
        setWidgets((cur) => {
            return [
                ...cur,
                // change the obj below
                {
                    key: crypto.randomUUID(),
                    type: "VariableSetBoolButton",
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
            <DialogTitle> Create a button that related to a bool connected variable</DialogTitle>

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
                    label="Text on button"
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