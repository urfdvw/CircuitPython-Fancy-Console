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

export const CreateVariableDisp = ({ open, onClose, setWidgets }) => {
  const [variableName, setVariableName] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");

  const handleSubmit = () => {
    setWidgets((cur) => {
      return [
        ...cur,
        {
          key: crypto.randomUUID(),
          type: "VariableDisp",
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
      <DialogTitle> Create a Variable Display</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please make sure there is a connected variable created in your
          microcontroller code.
        </DialogContentText>
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
          label="Display Name"
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
