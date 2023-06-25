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

export const output_to_blocks = (output) => {
  // empty input shortcut
  if (! output) {
    return []
  }

  // Special case: when starting from REPL, `>>>` is postponed, so add it manually until there is input
  if (! removeInBetween(output, constants.TITLE_START, constants.TITLE_END)) {
    output += '>>>'
  }

  // change line ending
  const unix_line_ending = output.split('\r').join('');

  // break titles into lines (for better title regex matching)
  const extra_eol = unix_line_ending.split(constants.TITLE_END).join(constants.TITLE_END)

  // replace Done with @, so that @ will be the only indicator of block ending
  const end_unified = extra_eol.split(globStringToRegex(
    constants.TITLE_START + "*Done*" + constants.TITLE_END
  )).join(
    constants.TITLE_START + "@" + constants.TITLE_END
  );

  // split by code running stops
  const splitted_by_ends = end_unified.split(globStringToRegex(
    constants.TITLE_START + "*@*" + constants.TITLE_END
  ));

  // split contents with blocks
  let text_blocks = [];
  for (const sec of splitted_by_ends) {
    const parts = splitByInBetween(sec, constants.TITLE_START, constants.TITLE_END)
    // titles will not have any usage beneath this line
    let info = "";
    let body = "";
    if (parts.length > 0) {
      info = parts[0].trim();
      body = parts.slice(1).join('').trim();
    }
    text_blocks.push({
      "info": info,
      "body": body
    })
  }

  // shift info and result by 1
  let re_orged_text_blocks = [];
  if (text_blocks.at(0).info.length > 0) {
    re_orged_text_blocks.push({
      "body": "",
      "info": text_blocks.at(0).info
    })
  }
  for (let i = 0; i < text_blocks.length - 1; i++) {
    re_orged_text_blocks.push({
      "body": text_blocks[i].body,
      "info": text_blocks[i + 1].info
    })
  }
  if (text_blocks.at(-1).body.length > 0) {
    re_orged_text_blocks.push({
      "body": text_blocks.at(-1).body,
      "info": ""
    })
  }

  return re_orged_text_blocks
}

export const useSerialReceiveProcessor = (output) => {
  /**
   * Break serial inputs into structural texts
   */
  const [isCpy8, setIsCpy8] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [title, setTitle] = useState("");

  // useEffect(() => {
  //   // set version
  //   if (output.includes(constants.TITLE_END)) {
  //     setIsCpy8(true);
  //   }

  //   // related functions only support CPY8+
  //   if (!isCpy8) {
  //     return
  //   }

  //   // change line ending
  //   const unix_line_ending = output.split('\r').join('');

  //   // break titles into lines (for better title regex matching)
  //   const extra_eol = unix_line_ending.split(constants.TITLE_END).join(constants.TITLE_END + '\n')

  //   // replace Done with @, so that @ will be the only indicator of block ending
  //   const end_unified = extra_eol.split(globStringToRegex(
  //     constants.TITLE_START + "*Done*" + constants.TITLE_END
  //   )).join(
  //     constants.TITLE_START + "@" + constants.TITLE_END
  //   );

  //   // split by code running stops
  //   const splitted_by_ends = end_unified.split(globStringToRegex(
  //     constants.TITLE_START + "*@*" + constants.TITLE_END
  //   ));

  //   // split contents with blocks
  //   let text_blocks = [];
  //   for (const sec of splitted_by_ends) {
  //     const parts = sec.split(globStringToRegex(
  //       constants.TITLE_START + "*" + constants.TITLE_END
  //     ));
  //     const info = parts[0].trim();
  //     const body = parts.slice(1).join('').trim();
  //     text_blocks.push({
  //       "info": info,
  //       "body": body
  //     })
  //   }

  //   // shift info and result by 1
  //   let re_orged_text_blocks = [];
  //   if (text_blocks.at(0).info.length > 0) {
  //     re_orged_text_blocks.push({
  //       "body": "",
  //       "info": text_blocks.at(0).info
  //     })
  //   }
  //   for (let i = 0; i < text_blocks.length - 1; i++) {
  //     re_orged_text_blocks.push({
  //       "body": text_blocks[i].body,
  //       "info": text_blocks[i + 1].info
  //     })
  //   }
  //   if (text_blocks.at(-1).body.length > 0) {
  //     re_orged_text_blocks.push({
  //       "body": text_blocks.at(-1).body,
  //       "info": ""
  //     })
  //   }

  //   // mark if REPL block
  //   let repo_marked = []
  //   for (const block of re_orged_text_blocks) {
  //     if (block.body.includes("\n>>>")) {
  //       const repl_conversations = block.body.split('\n>>>')
  //       let repl_blocks = [{
  //         "input": "",
  //         "output": repl_conversations.at(0)
  //       }]
  //       for (const conv of repl_conversations.slice(1)) {
  //         const input = conv.split('\n').at(0).trim();
  //         const output = conv.split('\n').slice(1).join('\n');
  //         repl_blocks.push(
  //           {
  //             "input": input.startsWith('exec("""')
  //               ? matchesInBetween(input, 'exec("""', '"""').at(0).split('\\n').join('\n')//TODO: some issues here
  //               : input,
  //             "output": output
  //           }
  //         )
  //       }
  //       repo_marked.push({
  //         "repl": true,
  //         "body": repl_blocks,
  //         "info": block.info
  //       });
  //     } else {
  //       repo_marked.push({
  //         "repl": false,
  //         ...block
  //       });
  //     }
  //   }

  //   console.log(repo_marked)

  // }, [output])
  return { isCpy8, title, sessions }
}