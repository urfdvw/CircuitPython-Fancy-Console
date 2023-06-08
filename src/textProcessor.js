import * as constants from "./constants"

export const latestTitle = (text) => {
    if (!(text.includes(constants.TITLE_START) && text.includes(constants.TITLE_END))) {
        return "";
    }

    return text.split(constants.TITLE_START).at(-1).split(constants.TITLE_END).at(0);
}

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

export const removeInBetween = (text, start, end) => {
    const re = globStringToRegex(start + '*' + end)
    return text.split(re).join('')
}

export const aggregateConnectedVariable = (text) => {
    // if no start or ending markers
    if (!(text.includes(constants.CV_JSON_START) && text.includes(constants.CV_JSON_END))) {
        return {};
    }
    // the latest session
    text = text.split(constants.TITLE_END).at(-1);
    // return an object
    try {
        return text.split(constants.CV_JSON_START).slice(1).map(x =>
            JSON.parse(x.split(constants.CV_JSON_END).at(0))
        ).reduce(
            (accumulator, currentValue) => {
                return { ...accumulator, ...currentValue };
            }, {}
        );
    } catch (error) {
        console.error(error);
        return {};
    }
}