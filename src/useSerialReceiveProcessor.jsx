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
import {
  globStringToRegex,
  matchesInBetween,
  removeInBetween,
} from "./textProcessor";

export const useSerialReceiveProcessor = (output) => {
  const [isCpy8, setIsCpy8] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    // set version
    if (output.includes(constants.TITLE_END)) {
      setIsCpy8(true);
    }

    // break titles into lines
    const extra_eol = output.split(constants.TITLE_END).join(constants.TITLE_END + '\n')

    // remove connected variables
    const cv_removed = removeInBetween(
      extra_eol,
      constants.CV_JSON_START,
      constants.CV_JSON_END
    );

    // break received text into session blocks
    setSessions(cv_removed.split(constants.SESSION_BREAK).map(x => x.trim()));

    // Title related fucntions (Cpy 8+)
    if (!isCpy8) {
      return
    }

    // get latest title
    setTitle(matchesInBetween(cv_removed, constants.TITLE_START, constants.TITLE_END).at(-1))

    // split each session in to blocks
    setSessions((cur)=>{
      return cur.map((sec => {
        const parts = sec.split(globStringToRegex(
          constants.TITLE_START + "*" + constants.TITLE_END
        ));
        return {
          "head":parts.at(0).trim(),
          "body":parts.slice(1,-1).join('').trim(),
          "tail":parts.at(-1)
        }
      }))
    })
  }, [output])
  return { isCpy8, title, sessions }
}