import React, { useState, useEffect } from "react";
import { FancyConsole } from "./FancyConsole";
import Divider from '@mui/material/Divider';
import { output_scenarios } from '../tests/testUseSerialReceiveProcessor.data'

const App = () => {
    const scenarios = Object.keys(output_scenarios)
    console.log(scenarios.map(name => output_scenarios[name].in))
    return (<>
        {scenarios.map(name => <>
            <p>{name}</p>
            <Divider />
            <FancyConsole output={output_scenarios[name].in}></FancyConsole>
            <Divider />
        </>)}
    </>)
}

export default App;