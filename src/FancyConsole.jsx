import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useSerialReceiveProcessor, body_text_to_repl_conversation } from "./useSerialReceiveProcessor"

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/ext-language_tools";

const widgetStyles = {
    bgcolor: "background.paper",
    borderColor: "text.primary",
    m: 1,
    border: 1,
    padding: "10px",
    borderRadius: "16px",
    minHeight: "40px", // for the size of delet icon
};

const TextBlock = ({ info }) => {
    return <pre style={{ whiteSpace: "pre-wrap" }}>
        {info}
    </pre>
}

const CodeBlock = ({ code }) => {
    return <AceEditor
        mode="python"
        theme="tomorrow"
        maxLines="100"
        readOnly="true"
        value={code}
        style={{
            marginBottom: "10px",
        }}
    />
}

const CodeInput = () => {
    return <Box sx={widgetStyles}>
        <AceEditor
            mode="python"
            theme="tomorrow"
            maxLines="100"
        />
    </Box>
}

export const Repl = ({ body }) => {
    if (!body) {
        return <></>
    }
    const repl_conversation = body_text_to_repl_conversation(body);
    // console.log(repl_conversation)
    return (
        <>
            <TextBlock info={repl_conversation.info} />
            {
                repl_conversation.conversation.map(block => {
                    return <>
                        {block.code
                            ? <CodeBlock code={block.code} />
                            : <></>}
                        {block.results
                            ? <TextBlock info={block.results} />
                            : <></>}
                    </>
                })
            }
            {
                repl_conversation.waiting4code
                    ? <CodeInput />
                    : <></>
            }
        </>
    )
}

export const FancyConsole = ({ output }) => {
    const { isCpy8, title, sessions } = useSerialReceiveProcessor(output);
    // useEffect(() => { console.log(sessions) }, [sessions])
    return (<>
        {sessions.map(block => {
            return <>
                {block.body ? <Box sx={widgetStyles}>
                    <p>{block.is_repl ? "REPL" : "Code"}</p>
                    {
                        block.is_repl
                            ? <Repl body={block.body} />
                            : <TextBlock info={block.body} />
                    }
                </Box> : <></>}
                {block.info
                    ? <TextBlock info={block.info} />
                    : <></>}
            </>
        })}
    </>)
}