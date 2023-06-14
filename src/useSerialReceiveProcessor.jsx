/**
 * This hook will process the received serial data.
 * Output should be structural text data.
 * Take the following things into considerations
 * - partation of data
 * - marking the function of each part
 * - functional sections, such as titles
 * - versions of CircuitPython
 * - convenient accessor of the structural data
 */
import { useState, useEffect } from "react";
import * as constants from "./constants";

const output2BlockText = () => {
    const extra_eol = output.split(constants.TITLE_END).join(constants.TITLE_END + '\n')

    const cv_removed = removeInBetween(
      extra_eol,
      constants.CV_JSON_START,
      constants.CV_JSON_END
    );

    const end_unified = cv_removed.split('Done').join('@');

    const splitted_by_ends = end_unified.split(globStringToRegex(
      constants.TITLE_START + "*@*" + constants.TITLE_END
    ));

    let text_blocks = [];
    for (const sec of splitted_by_ends) {
      const parts = sec.split(globStringToRegex(
        constants.TITLE_START + "*" + constants.TITLE_END
      ));
      const info = parts[0].trim();
      const content = parts.slice(1).join('').trim();
      text_blocks.push([info, content])
    }

    return text_blocks
  }

export const useSerialReceiveProcessor = (output) => {
    const [isCpy8, setIsCpy8] = useState(false);

    useEffect(()=>{
        // set version
        if (output.includes(constants.TITLE_END)) {
            setIsCpy8(true);
        }
        // 
    }, [output])
    return {isCpy8}
}