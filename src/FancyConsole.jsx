import * as React from "react";
import Box from "@mui/material/Box";
import { useSerialReceiveProcessor } from "./useSerialReceiveProcessor"
export const FancyConsole = ({ output }) => {
    const { isCpy8, title, sessions } = useSerialReceiveProcessor(output);
    return (<>
        {/* {sessions.map(block => {
            return <> // TODO: This is not working
                <Box sx={widgetStyles}>
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                        {block.body}
                    </pre>
                </Box>
                <pre style={{ whiteSpace: "pre-wrap" }}>
                    {block.info}
                </pre>
            </>
        })} */}
        <p>{sessions[0].body}</p>
        <p>{sessions[0].info}</p>
        
    </>)
}