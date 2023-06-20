import { Margin } from "@mui/icons-material";
import * as constants from "./constants"

export function globStringToRegex(str) {
    // https://stackoverflow.com/a/13818704/7037749
    return new RegExp(preg_quote(str).replace(/\\\*/g, '.*').replace(/\\\?/g, '.'), 'g');
}
function preg_quote(str, delimiter) {
    // http://kevin.vanzonneveld.net
    // +   original by: booeyOH
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: preg_quote("$40");
    // *     returns 1: '\$40'
    // *     example 2: preg_quote("*RRRING* Hello?");
    // *     returns 2: '\*RRRING\* Hello\?'
    // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

export function matchesInBetween(text, start, end) {
    if (text == null) {
        return [];
    }
    text = text.split(end).join(end + ' \n '); // to break 2 possible results in different lines
    const re = globStringToRegex(start + '*' + end);
    let matches = text.match(re);
    if (matches === null) { // the line above will return null if no matches (so strange)
        matches = [];
    }
    return matches.map(x => x.slice(start.length, -end.length)); // remove the markers
}


export const latestTitle = (text) => {
    // migrated to useSerialReceiveProcessor
    const matches = matchesInBetween(text, constants.TITLE_START, constants.TITLE_END);
    return matches.at(-1);
}


export const removeInBetween = (text, start, end) => {
    const re = globStringToRegex(start + '*' + end)
    return text.split(re).join('')
}

export const aggregateConnectedVariable = (text) => {
    const cvBlocks = matchesInBetween(text, constants.CV_JSON_START, constants.CV_JSON_END)
    var ConnectedVariable = {}
    for (const b of cvBlocks) {
        ConnectedVariable = { ...ConnectedVariable, ...JSON.parse(b) }
    }
    return ConnectedVariable
}