import * as React from "react";

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
    };
};

export const variableDispTitle = "Create a Variable Display";
