import React, { useState, useEffect } from "react";
import { Repl } from "../src/FancyConsole";
import Divider from '@mui/material/Divider';
import { repl_scenarios } from '../tests/testUseSerialReceiveProcessor.data'

const App = () => {
    const scenarios = Object.keys(repl_scenarios)
    return (<>
        {scenarios.map(name => <>
            <p>{name}</p>
            <Divider />
            <Repl body={repl_scenarios[name].in}></Repl>
            <Divider />
        </>)}
    </>)
}

export default App;