import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useSerialReceiveProcessor } from "./useSerialReceiveProcessor"

const widgetStyles = {
    bgcolor: "background.paper",
    borderColor: "text.primary",
    m: 1,
    border: 1,
    padding: "10px",
    borderRadius: "16px",
    minHeight: "40px", // for the size of delet icon
};

export const FancyConsole = ({ output }) => {
    const { isCpy8, title, sessions } = useSerialReceiveProcessor(output);
    useEffect(() => { console.log(sessions) }, [sessions])
    return (<>
        {sessions.map(block => {
            return <>
                {block.body ? <Box sx={widgetStyles}>
                    <p>{block.is_repl ? "REPL" : "Code"}</p>
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                        {block.body}
                    </pre>
                </Box> : <></>}
                {block.info ? <pre style={{ whiteSpace: "pre-wrap" }}>
                    {block.info}
                </pre> : <></>}
            </>
        })}
    </>)
}