import React, { useState, useEffect } from "react";
import log from "loglevel";
import useConfig from "../src/useConfig";
import schema from "./testConfigSchema.json";

import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/mui";

log.setLevel("trace"); // show all

const App = () => {
    useConfig();
    const handleSubmit = (formData) => {
        log.debug("Form data:", formData);
    };
    const form_data = { a: 100 }; //unsupported fields are omitted on submit
    return (
        <Form
            schema={schema}
            validator={validator}
            formData={form_data}
            onSubmit={(e) => {
                handleSubmit(e.formData);
                log.info("form submitted");
            }}
            omitExtraData={true}
        />
    );
};

export default App;
