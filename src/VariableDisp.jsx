import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export const VariableDisp = ({
  connectedVariables,
  variableName,
  displayName,
}) => {
  return (
    <>
      <b>{displayName}: </b>
      {String(connectedVariables[variableName])}
    </>
  );
};

export const variableDispObj = (variableName, displayName) => {
  return {
    key: crypto.randomUUID(),
    type: "VariableDisp",
    variableName: variableName,
    displayName: displayName,
    windowed: false,
  }
}

export const variableDispTitle = "Create a Variable Display";
