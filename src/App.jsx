import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ScrollableFeed from 'react-scrollable-feed'
// https://stackoverflow.com/a/52673227/7037749
import useSerial from "./useSerial";

const TITLE_START = '\x1B]0;';
const TITLE_END = '\x1B\\';
const CTRL_C = "\x03";
const CTRL_D = "\x04";
const LINE_END = '\x0D';

const latestTitle = (text) => {
    return text.split(TITLE_START).at(-1).split(TITLE_END).at(0);
}

const removeTitle = (text) => {
    return text.split(TITLE_START).map(x => x.split(TITLE_END).at(1)).join('')
}

const App = () => {

    const { connect, disconnect, sendData, output, connected } = useSerial();
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        sendData(input + LINE_END);
        setInput('');
    };

    return (
        <div>
            <h2>Serial Console</h2>
            <h3>{latestTitle(output)}</h3>
            {!connected && (
                <Button variant="contained" onClick={connect}>Connect</Button>
            )}
            <div style={{ "max-height": '350pt' }}>
                <ScrollableFeed>
                    <pre>{removeTitle(output)}</pre>
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
        </div>
    );
};

export default App;
