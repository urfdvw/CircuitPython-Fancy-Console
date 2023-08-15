import { useState, useEffect } from "react";
import log from "loglevel";
log.setLevel("trace");

const useConfig = () => {
    useEffect(() => {
        log.info("useConfig mounted");
        return () => {
            log.info("useConfig unmounted");
        };
    }, []);

    return;
};

export default useConfig;
