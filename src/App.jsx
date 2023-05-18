import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ScrollableFeed from 'react-scrollable-feed'
// https://stackoverflow.com/a/52673227/7037749
import useSerial from "./useSerial";

const SerialConsole = () => {

    const { connect, disconnect, sendData, output, connected } = useSerial();
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        sendData(input + '\x0D');
        setInput('');
    };

    return (
        <div>
            <h2>Serial Console</h2>
            {connected ? (
                <Button variant="contained" onClick={disconnect}>Disconnect</Button>
            ) : (
                <Button variant="contained" onClick={connect}>Connect</Button>
            )}
            <div style={{ "max-height": '350pt' }}>
                <ScrollableFeed>
                    <pre>{output}</pre>
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
                        onClick={() => { sendData("\x03") }}
                    >Ctrl-C</Button>
                    <Button variant="contained"
                        onClick={() => { sendData("\x04") }}
                    >Ctrl-D</Button>
                </>
            )}
        </div>
    );
};

export default SerialConsole;
