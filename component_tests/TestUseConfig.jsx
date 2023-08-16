import React, { useState, useEffect } from "react";
import log from "loglevel";
import useConfig from "../src/useConfig";

import validator from "@rjsf/validator-ajv8";
import Form from '@rjsf/mui';



log.setLevel("trace"); // show all

const App = () => {
    useConfig();
    const schema = {
        title: "Test form",
        type: "string",
    };
    return <Form schema={schema} validator={validator} />;
};

export default App;
