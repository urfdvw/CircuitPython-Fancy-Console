import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const supportedWidgets = [
    { name: "VariableDisp", lable: "Variable Display" },
    { name: "VariableSetBoolButton", lable: "Button" },
    { name: "VariableSetColor", lable: "Color Picker" },
    { name: "VariableSet", lable: "Variable Set" },
];

export function CreateWidgetMenu({ handleClick }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClickButton = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                variant="contained"
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClickButton}
            >
                New Widget
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                {supportedWidgets.map((wid) => (
                    <MenuItem
                        key={wid.name}
                        onClick={() => {
                            handleClick(wid.name);
                            handleClose();
                        }}
                    >
                        {wid.lable}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

export const CreateWidgetDiag = ({
    open,
    onClose,
    setWidgets,
    widgetObj,
    title,
}) => {
    const [variableName, setVariableName] = React.useState("");
    const [displayName, setDisplayName] = React.useState("");

    return (
        <Dialog open={open}>
            <DialogTitle> {title} </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please make sure there is a connected variable created in
                    your microcontroller code.
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
                <Button
                    onClick={() => {
                        setWidgets((cur) => {
                            return [
                                ...cur,
                                // change the obj below
                                widgetObj(variableName, displayName),
                            ];
                        });
                        onClose();
                    }}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};
