import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ScrollableFeed from 'react-scrollable-feed'
// https://stackoverflow.com/a/52673227/7037749
import NewWindow from "react-new-window";

import useSerial from "./useSerial";

const TITLE_START = '\x1B]0;';
const TITLE_END = '\x1B\\';
const CTRL_C = "\x03";
const CTRL_D = "\x04";
const LINE_END = '\x0D';
const CV_JSON_START = '<CV>'; // ConnectedVariableJson start
const CV_JSON_END = '</CV>';

const latestTitle = (text) => {
    return text.split(TITLE_START).at(-1).split(TITLE_END).at(0);
}

const removeInBetween = (text, start, end) => {
    if (text.includes(end)) {
        return text.split(start).map(x => x.split(end).at(1)).join('');
    } else {
        return text.split(start)[0];
    }
}

const aggregateConnectedVariable = (text) => {

    if (!(text.includes(CV_JSON_START) && text.includes(CV_JSON_END))) {
        return {};
    }

    return text.split(CV_JSON_START).slice(1).map(x =>
        JSON.parse(x.split(CV_JSON_END).at(0))
    ).reduce(
        (accumulator, currentValue) => {
            return { ...accumulator, ...currentValue };
        }, {}
    );
}

const App = () => {

    const { connect, disconnect, sendData, output, connected } = useSerial();
    const [input, setInput] = useState('');
    const [connectedVariables, setConnectedVariables] = useState({});
    const [widgets, setWidgets] = useState([
        {
            "key": "sdkfjwdkjfhsadkjfh",
            "type": "VariableDisp",
            "variableName": "a",
            "displayName": "Value of `a` in CircuitPython",
            "windowed": false
        },
        {
            "key": "fkjvhgifvbhgsjd",
            "type": "VariableSetInt",
            "variableName": "a",
            "displayName": "Change `a` to",
            "windowed": false
        }
    ])

    const handleSubmit = (e) => {
        e.preventDefault();
        sendData(input + LINE_END);
        setInput('');
    };

    useEffect(() => {
        setConnectedVariables(
            cur_cv => {
                return {
                    ...cur_cv,
                    ...aggregateConnectedVariable(output)
                };
            }
        );
    }, [output])

    const widgetStyles = {
        bgcolor: 'background.paper',
        borderColor: 'text.primary',
        m: 1,
        border: 1,
        padding: '10px',
        borderRadius: '16px',
    };

    const setWindowed = (key, value) => {
        setWidgets(cur => cur.map(
            wid => (wid.key === key) ? { ...wid, "windowed": value } : wid
        ));
    }

    const enwindow = (key) => {
        setWindowed(key, true);
    }

    const unwindow = (key) => {
        setWindowed(key, false);
    }

    return (
        <div>
            <h2>Serial Console</h2>
            <h3>{latestTitle(output)}</h3>
            {!connected && (
                <Button variant="contained" onClick={connect}>Connect</Button>
            )}
            <div style={{ "maxHeight": '350pt' }}>
                <ScrollableFeed>
                    <pre>{
                        removeInBetween(
                            removeInBetween(
                                output,
                                TITLE_START, TITLE_END
                            ),
                            CV_JSON_START, CV_JSON_END
                        )
                    }</pre>
                </ScrollableFeed>
            </div>
            {connected && (
                <>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            variant="standard"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button variant="contained" type="submit">Send</Button>
                    </form>
                    <Button variant="contained"
                        onClick={() => { sendData(CTRL_C) }}
                    >Ctrl-C</Button>
                    <Button variant="contained"
                        onClick={() => { sendData(CTRL_D) }}
                    >Ctrl-D</Button>
                </>
            )}
            {widgets.map((wid) => {
                let content;
                if (wid.type === "VariableDisp") {
                    content = (
                        <VariableDisp
                            connectedVariables={connectedVariables}
                            variableName={wid.variableName}
                            displayName={wid.displayName}
                        />
                    )
                } else if (wid.type === "VariableSetInt") {
                    content = (
                        <VariableSetInt
                            setConnectedVariables={setConnectedVariables}
                            variableName={wid.variableName}
                            displayName={wid.displayName}
                            sendData={sendData}
                        />
                    )
                }
                if (wid.windowed) {
                    return (
                        <NewWindow onUnload={
                            () => { unwindow(wid.key) }
                        }>{content}</NewWindow>
                    )
                } else {
                    return (
                        <Box sx={widgetStyles}>
                            <button onClick={
                                () => { enwindow(wid.key) }
                            }>Float to Window</button>
                            <br />
                            {content}
                        </Box>
                    )
                }
            })}
        </div>
    );
};

const VariableDisp = ({ connectedVariables, variableName, displayName }) => {
    return (
        <>
            <b>{displayName}:</b>
            {connectedVariables[variableName]}
        </>
    )
}

const VariableSetInt = ({ setConnectedVariables, variableName, displayName, sendData }) => {
    const [value, setValue] = useState(0);

    const handleSubmit = (event) => {
        event.preventDefault()
        const updatedVariable = { [variableName]: parseInt(value) } //https://stackoverflow.com/a/29077216/7037749
        sendData(JSON.stringify(updatedVariable) + LINE_END);
        setConnectedVariables(cur => {
            return {
                ...cur,
                ...updatedVariable,
            }
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                {displayName}
                <input value={value} onChange={event => {
                    setValue(event.target.value)
                }}></input>
                <button>Set</button>
            </form>
        </>
    )
}


export default App;
