import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const supportedWidgets = [
    {name: "VariableDisp", lable: "Variable Display"},
    {name: "VariableSet", lable: "Variable Set"}
]

export default function CreateWidget({ handleClick }) {
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
                    "aria-labelledby": "basic-button"
                }}
            >
                {supportedWidgets.map((wid)=><MenuItem onClick={() => {
                    handleClick(wid.name);
                    handleClose();
                    }}>{wid.lable}</MenuItem>)}
            </Menu>
        </div>
    );
}
