
import React, { useState } from "react";
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import * as constants from "./constants";

const VariableSet = ({
    connectedVariables,
    sendData,
}) => {
    const [variableName, setVariableName] = useState('');
    const [value, setValue] = useState(0);
    const [type, setType] = useState("int");

    const handleSubmit = (event) => {
        event.preventDefault();
        let variableValue;
        if (type === "int") {
            variableValue = parseInt(value);
        } else if (type === "float") {
            variableValue = parseFloat(value);
        } else if (type === "string") {
            variableValue = String(value);
        } else if (type === "json") {
            try {
                variableValue = JSON.parse(value);
            } catch {
                alert('Input is not a valid json');
            }
        }
        const updatedVariable = { [variableName]: variableValue }; //https://stackoverflow.com/a/29077216/7037749
        sendData(
            constants.CV_JSON_START +
            JSON.stringify(updatedVariable) +
            constants.CV_JSON_END +
            constants.LINE_END
        );
        // don't up date variable value on web directly, let the change reflected by update echo
    };
    return (
        <>
            <Autocomplete
                disableClearable
                id="combo-box-demo"
                value={variableName}
                onChange={(e, newValue) => {
                    setVariableName(newValue.label);
                }}
                options={
                    Object.keys(connectedVariables).map(key => {
                        return {
                            label: key
                        }
                    })
                }
                sx={{ width: 100 }}
                renderInput={(params) => <TextField {...params} label="Variable" />}
            />
            <TextField
                value={value}
                onChange={(event) => {
                    setValue(event.target.value);
                }}
                label="value"
            ></TextField>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">type</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    value={type}
                    label="type"
                    onChange={(e) => {
                        setType(e.target.value);
                    }}
                >
                    <MenuItem value={"int"}>int</MenuItem>
                    <MenuItem value={"float"}>float</MenuItem>
                    <MenuItem value={"string"}>string</MenuItem>
                    <MenuItem value={"json"}>json</MenuItem>
                </Select>
            </FormControl>
            <Button variant="contained" onClick={handleSubmit}>Set</Button>
        </>
    );
};
export default VariableSet