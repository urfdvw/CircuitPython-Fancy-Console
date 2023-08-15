import React, { useState, useEffect } from "react";
import log from "loglevel";
import useConfig from "../src/useConfig";

log.setLevel("trace"); // show all

const App = () => {
    useConfig();
    return <></>;
};

export default App;
