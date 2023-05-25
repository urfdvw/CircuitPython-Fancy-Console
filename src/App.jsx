// React Native
import React, { useState, useEffect } from 'react';
// MUI
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
// Other packages
import ScrollableFeed from 'react-scrollable-feed' // https://stackoverflow.com/a/52673227/7037749
import NewWindow from "react-new-window";
// Mine
import useSerial from "./useSerial";
import {
    latestTitle,
    removeInBetween,
    aggregateConnectedVariable
} from "./textProcessor"
import * as constants from "./constants"
// Mine widgets
import { VariableDisp, CreateVariableDisp } from "./VariableDisp";


const App = () => {
    // Hooks --------------------------------------
    // serial related
    const { connect, disconnect, sendData, output, connected } = useSerial();
    const [input, setInput] = useState('');
    const [connectedVariables, setConnectedVariables] = useState({});
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

    // widget related
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

    // UI elements --------------------------------------
    const widgetDisplaySelector = (wid) => {
        if (wid.type === "VariableDisp") {
            return (
                <VariableDisp
                    connectedVariables={connectedVariables}
                    variableName={wid.variableName}
                    displayName={wid.displayName}
                />
            )
        } else if (wid.type === "VariableSetInt") {
            return (
                <VariableSetInt
                    setConnectedVariables={setConnectedVariables}
                    variableName={wid.variableName}
                    displayName={wid.displayName}
                    sendData={sendData}
                />
            )
        }
    }

    const widgetStyles = {
        bgcolor: 'background.paper',
        borderColor: 'text.primary',
        m: 1,
        border: 1,
        padding: '10px',
        borderRadius: '16px',
    };

    const windowWrapper = (wid, content) => {
        if (wid.windowed) {
            return (
                <NewWindow
                    key={wid.key}
                    onUnload={
                        () => { unwindow(wid.key) }
                    }
                >
                    {content}
                </NewWindow>
            )
        } else {
            return (
                <Box sx={widgetStyles} key={wid.key}>
                    <button onClick={
                        () => { enwindow(wid.key) }
                    }>Float to Window</button>
                    <br />
                    {content}
                </Box>
            )
        }
    }
    // handler --------------------------------------
    // serial related
    const handleSend2MCU = (e) => {
        e.preventDefault();
        sendData(input + LINE_END);
        setInput('');
    };

    // widget related
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

    const closeWidget = (key) => {
        setWidgets(cur => cur.filter(
            wid => wid.key !== key
        ));
    }

    // add widget test
    const [open, setOpen] = React.useState(true);

    return (
        <div>
            <h2>Serial Console</h2>
            <h3>{latestTitle(output)}</h3>
            {!connected && (
                <Button variant="contained" onClick={connect}>Connect</Button>
            )}
            <div style={{ "height": '350pt' }}>
                <ScrollableFeed>
                    <pre>{
                        removeInBetween(
                            removeInBetween(
                                output,
                                constants.TITLE_START, constants.TITLE_END
                            ),
                            constants.CV_JSON_START, constants.CV_JSON_END
                        )
                    }</pre>
                </ScrollableFeed>
            </div>
            {connected && (
                <>
                    <form onSubmit={handleSend2MCU}>
                        <TextField
                            variant="standard"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button variant="contained" type="submit">Send</Button>
                    </form>
                    <Button variant="contained"
                        onClick={() => { sendData(constants.CTRL_C) }}
                    >Ctrl-C</Button>
                    <Button variant="contained"
                        onClick={() => { sendData(constants.CTRL_D) }}
                    >Ctrl-D</Button>
                </>
            )}
            {widgets.map((wid) => {
                const closeButton = <button onClick={() => { closeWidget(wid.key) }}>x</button>;
                const content = widgetDisplaySelector(wid);
                return windowWrapper(
                    wid,
                    <>
                        {closeButton}
                        {content}
                    </>
                )
            })}
            <CreateVariableDisp open={open} setOpen={setOpen} setWidgets={setWidgets} />
        </div>
    );
};



const VariableSetInt = ({ setConnectedVariables, variableName, displayName, sendData }) => {
    const [value, setValue] = useState(0);

    const handleSubmit = (event) => {
        event.preventDefault()
        const updatedVariable = { [variableName]: parseInt(value) } //https://stackoverflow.com/a/29077216/7037749
        sendData(constants.CV_JSON_START + JSON.stringify(updatedVariable) + constants.CV_JSON_END + constants.LINE_END);
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
