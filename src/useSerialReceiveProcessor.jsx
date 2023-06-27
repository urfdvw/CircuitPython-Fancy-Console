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
  splitByInBetween,
} from "./textProcessor";

export const output_to_sessions = (output) => {
  // empty input shortcut
  if (! output) {
    return []
  }

  // wait for the first soft reboot and remove anything before that
  if (! output.includes(constants.SOFT_REBOOT)){
    return []
  }
  output = output.split(constants.SOFT_REBOOT).slice(1).join(constants.SOFT_REBOOT).trimStart();

  // change line ending
  const unix_line_ending = output.split('\r').join('');

  // break titles into lines (for better title regex matching)
  const extra_eol = unix_line_ending.split(constants.TITLE_END).join(constants.TITLE_END)

  // replace Done with @, so that @ will be the only indicator of session ending
  const end_unified = extra_eol.split(globStringToRegex(
    constants.TITLE_START + "*Done*" + constants.TITLE_END
  )).join(
    constants.TITLE_START + "@" + constants.TITLE_END
  );

  // split by code running stops
  const splitted_by_ends = end_unified.split(globStringToRegex(
    constants.TITLE_START + "*@*" + constants.TITLE_END
  ));

  // split contents with sessions
  let text_sessions = [];
  for (const sec of splitted_by_ends) {
    // get first title and mark repl
    const titles = matchesInBetween(sec, constants.TITLE_START, constants.TITLE_END)
    const is_repl = titles.length ? titles[0].includes('REPL') : false;
    // split body and info
    const parts = splitByInBetween(sec, constants.TITLE_START, constants.TITLE_END)
    let info = "";
    let body = "";
    if (parts.length > 0) {
      info = parts[0].trim();
      body = parts.slice(1).join('').trim();
    }
    text_sessions.push({
      "info": info,
      "body": body,
      "is_repl": is_repl,
    })
  } // titles will not have any usage beneath this line

  // shift info and result by 1
  let re_orged_text_sessions = [];
  if (text_sessions.at(0).info.length > 0) {
    re_orged_text_sessions.push({
      "body": "",
      "is_repl": false,
      "info": text_sessions.at(0).info
    })
  }
  for (let i = 0; i < text_sessions.length - 1; i++) {
    re_orged_text_sessions.push({
      "body": text_sessions[i].body,
      "is_repl": text_sessions[i].is_repl,
      "info": text_sessions[i + 1].info
    })
  }
  if (text_sessions.at(-1).body.length > 0) {
    re_orged_text_sessions.push({
      "body": text_sessions.at(-1).body,
      "is_repl": text_sessions.at(-1).is_repl,
      "info": ""
    })
  }

  return re_orged_text_sessions
}

export const useSerialReceiveProcessor = (output) => {
  /**
   * Break serial inputs into structural texts
   */
  const [isCpy8, setIsCpy8] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    // set version
    if (output.includes(constants.TITLE_END)) {
      setIsCpy8(true);
    } else {
      return
    }

    // code below only support CPY8+
    setSessions(output_to_sessions(output))
  }, [output])

  return { isCpy8, title, sessions }
}