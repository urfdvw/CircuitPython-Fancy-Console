import { useState, useEffect } from "react";
import * as constants from "./constants";

const useSerial = () => {
    const [port, setPort] = useState(null);
    const [output, setOutput] = useState("");
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!navigator.serial) {
            console.warn("Web Serial API not supported");
        }
    }, []);

    useEffect(() => {
        let reader;
        let active = true;

        const readData = async () => {
            while (port && port.readable && active) {
                try {
                    reader = port.readable.getReader();
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) {
                            reader.releaseLock();
                            break;
                        }
                        setOutput(
                            (prevOutput) =>
                                prevOutput.slice(-100000) +
                                new TextDecoder().decode(value)
                        );
                    }
                } catch (err) {
                    console.error("Failed to read data:", err);
                } finally {
                    reader && reader.releaseLock();
                }
            }
        };

        readData();

        return () => {
            const close = async () => {
                active = false;
                reader && (await reader.releaseLock());
            };
            close();
        };
    }, [port]);

    const connect = async () => {
        try {
            const newPort = await navigator.serial.requestPort();
            await newPort.open({ baudRate: 115200 });
            setPort(newPort);
            setConnected(true);
        } catch (err) {
            console.error("Failed to connect:", err);
        }
    };

    const sendData = async (data) => {
        if (!port || !port.writable) return;

        const writer = port.writable.getWriter();
        const encodedData = new TextEncoder().encode(data);

        try {
            await writer.write(encodedData);
        } catch (err) {
            console.error("Failed to send data:", err);
        } finally {
            writer.releaseLock();
        }
    };

    useEffect(() => {
        /**
         * This effect has two benefits
         * * There will not be any "half blocks" when staring the IDE
         * * Behaviour of CPY each time when IDE starts are consistent
         * Please ignore whatever is before the first `soft reboot` text
         */
        async function clean_start() {
            if (connected) {
                // break any current run (no effect/harm in repl)
                await sendData(constants.CTRL_C);
                // start a fresh run (No matter from REPL or code)
                await sendData(constants.CTRL_D);
            }
        }
        clean_start();
    }, [connected]);

    const disconnect = async () => {
        if (!port) return;

        const reader = port.readable.getReader();
        // Close the input stream (reader).
        if (reader) {
            await reader.cancel();
        }

        await port.close();
        setPort(null);
        setConnected(false);
        setOutput("");
    };

    return { connect, disconnect, sendData, output, connected };
};

export default useSerial;
