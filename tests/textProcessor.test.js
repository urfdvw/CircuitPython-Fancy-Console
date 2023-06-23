import { describe, expect, it } from 'vitest';

import {matchesInBetween, removeInBetween} from "../src/textProcessor"

import * as constants from "../src/constants";

describe('test matchesInBetween()', () => {
    it('regular case', () => {
        expect(matchesInBetween(
            "123" + constants.CV_JSON_START + "abc" + constants.CV_JSON_END + "456",
            constants.CV_JSON_START,
            constants.CV_JSON_END
        )).toStrictEqual(["abc"]);
    });
    it('two matches with text in between', () => {
        expect(matchesInBetween(
            "123" + constants.CV_JSON_START + "abc" + constants.CV_JSON_END + "456" +
            constants.CV_JSON_START + "def" + constants.CV_JSON_END + "789",
            constants.CV_JSON_START,
            constants.CV_JSON_END
        )).toStrictEqual(["abc", "def"]);
    });
    it('two matches without text in between', () => {
        expect(matchesInBetween(
            "123" + constants.CV_JSON_START + "abc" + constants.CV_JSON_END +
            constants.CV_JSON_START + "def" + constants.CV_JSON_END + "789",
            constants.CV_JSON_START,
            constants.CV_JSON_END
        )).toStrictEqual(["abc", "def"]);
    });
    it('with broken pair', () => {
        expect(matchesInBetween(
            constants.CV_JSON_END + 
            constants.CV_JSON_START + "abc" + constants.CV_JSON_END +
            constants.CV_JSON_START,
            constants.CV_JSON_START,
            constants.CV_JSON_END
        )).toStrictEqual(["abc"]);
    });
    it('empty case', () => {
        expect(matchesInBetween(
            "",
            constants.CV_JSON_START,
            constants.CV_JSON_END
        )).toStrictEqual([]);
    });
    it('null case', () => {
        expect(matchesInBetween(
            null,
            constants.CV_JSON_START,
            constants.CV_JSON_END
        )).toStrictEqual([]);
    });
});


describe('test removeInBetween()', () => {
    it('regular case', () => {
        expect(removeInBetween(
            "123" + constants.CV_JSON_START + "abc" + constants.CV_JSON_END + "456",
            constants.CV_JSON_START,
            constants.CV_JSON_END
        )).toStrictEqual(("123456"));
    });
    it('two matches with text in between', () => {
        expect(removeInBetween(
            "123" + constants.CV_JSON_START + "abc" + constants.CV_JSON_END + "456" +
            constants.CV_JSON_START + "def" + constants.CV_JSON_END + "789",
            constants.CV_JSON_START,
            constants.CV_JSON_END
        )).toStrictEqual("123456789");
    });
    it('two matches without text in between', () => {
        expect(removeInBetween(
            "123" + constants.CV_JSON_START + "abc" + constants.CV_JSON_END +
            constants.CV_JSON_START + "def" + constants.CV_JSON_END + "789",
            constants.CV_JSON_START,
            constants.CV_JSON_END
        )).toStrictEqual("123789");
    });
    it('with broken pair', () => {
        expect(removeInBetween(
            constants.CV_JSON_END + 
            constants.CV_JSON_START + "abc" + constants.CV_JSON_END +
            constants.CV_JSON_START,
            constants.CV_JSON_START,
            constants.CV_JSON_END
        )).toStrictEqual('');
    });
    it('empty case', () => {
        expect(removeInBetween(
            "",
            constants.CV_JSON_START,
            constants.CV_JSON_END
        )).toStrictEqual('');
    });
    it('null case', () => {
        expect(removeInBetween(
            null,
            constants.CV_JSON_START,
            constants.CV_JSON_END
        )).toStrictEqual('');
    });
});