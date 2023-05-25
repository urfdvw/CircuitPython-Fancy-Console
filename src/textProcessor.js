import * as constants from "./constants"

export const latestTitle = (text) => {
    if (!(text.includes(constants.TITLE_START) && text.includes(constants.TITLE_END))) {
        return "";
    }

    return text.split(constants.TITLE_START).at(-1).split(constants.TITLE_END).at(0);
}

export const removeInBetween = (text, start, end) => {
    if (text.includes(end)) {
        return text.split(start).map(x => x.split(end).at(1)).join('');
    } else {
        return text.split(start)[0];
    }
}

export const aggregateConnectedVariable = (text) => {
    // if no start or ending markers
    if (!(text.includes(constants.CV_JSON_START) && text.includes(constants.CV_JSON_END))) {
        return {};
    }
    // return an object
    return text.split(constants.CV_JSON_START).slice(1).map(x =>
        JSON.parse(x.split(constants.CV_JSON_END).at(0))
    ).reduce(
        (accumulator, currentValue) => {
            return { ...accumulator, ...currentValue };
        }, {}
    );
}