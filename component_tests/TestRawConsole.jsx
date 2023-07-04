import React, { useState, useEffect } from "react";
import RawConsole from "../src/RawConsole";
import Divider from '@mui/material/Divider';
import { output_scenarios } from '../tests/testUseSerialReceiveProcessor.data'

const App = () => {
    const scenarios = Object.keys(output_scenarios)
    return (<div style={{ "height": "300px" }}>
        {scenarios.map(name => <>
            <p>{name}</p>
            <Divider />
            <RawConsole
                output={output_scenarios[name].in}
                config={{
                    "raw_console": {
                        "hide_title": false,
                        "hide_cv": true
                    }
                }}
            />
            <Divider />
        </>)}
    </div>)
}

export default App;