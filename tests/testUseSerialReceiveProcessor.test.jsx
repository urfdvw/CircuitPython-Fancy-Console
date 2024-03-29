import { describe, expect, it } from "vitest";

import {
    output_to_sessions,
    body_text_to_repl_conversation,
} from "../src/useSerialReceiveProcessor";

import * as constants from "../src/constants";

import {
    repl_scenarios,
    output_scenarios,
} from "./testUseSerialReceiveProcessor.data";

describe("test repl breaking", () => {
    it("empty", () => {
        expect(
            body_text_to_repl_conversation(repl_scenarios["empty"].in)
        ).toStrictEqual(repl_scenarios["empty"].out);
    });
    it("null", () => {
        expect(
            body_text_to_repl_conversation(repl_scenarios["null"].in)
        ).toStrictEqual(repl_scenarios["null"].out);
    });
    it("just_started", () => {
        expect(
            body_text_to_repl_conversation(repl_scenarios["just_started"].in)
        ).toStrictEqual(repl_scenarios["just_started"].out);
    });
    it("regular_runs", () => {
        expect(
            body_text_to_repl_conversation(repl_scenarios["regular_runs"].in)
        ).toStrictEqual(repl_scenarios["regular_runs"].out);
    });
    it("exec_run", () => {
        expect(
            body_text_to_repl_conversation(repl_scenarios["exec_run"].in)
        ).toStrictEqual(repl_scenarios["exec_run"].out);
    });
    it("runing_not_done", () => {
        expect(
            body_text_to_repl_conversation(repl_scenarios["runing_not_done"].in)
        ).toStrictEqual(repl_scenarios["runing_not_done"].out);
    });
    it("with_break", () => {
        expect(
            body_text_to_repl_conversation(repl_scenarios["with_break"].in)
        ).toStrictEqual(repl_scenarios["with_break"].out);
    });
});

describe("test session breaking", () => {
    it("empty", () => {
        expect(output_to_sessions(output_scenarios["empty"].in)).toStrictEqual(
            output_scenarios["empty"].out
        );
    });
    it("start_from_repl_code_running", () => {
        expect(
            output_to_sessions(
                output_scenarios["start_from_repl_code_running"].in
            )
        ).toStrictEqual(output_scenarios["start_from_repl_code_running"].out);
    });
    it("start_from_done_code_running", () => {
        expect(
            output_to_sessions(
                output_scenarios["start_from_done_code_running"].in
            )
        ).toStrictEqual(output_scenarios["start_from_done_code_running"].out);
    });
    it("start_from_code_code_running", () => {
        expect(
            output_to_sessions(
                output_scenarios["start_from_code_code_running"].in
            )
        ).toStrictEqual(output_scenarios["start_from_code_code_running"].out);
    });
    it("done_then_repl_just_started", () => {
        expect(
            output_to_sessions(
                output_scenarios["done_then_repl_just_started"].in
            )
        ).toStrictEqual(output_scenarios["done_then_repl_just_started"].out);
    });
    it("done_then_code_done", () => {
        expect(
            output_to_sessions(output_scenarios["done_then_code_done"].in)
        ).toStrictEqual(output_scenarios["done_then_code_done"].out);
    });
    it("break_repl", () => {
        expect(
            output_to_sessions(output_scenarios["break_repl"].in)
        ).toStrictEqual(output_scenarios["break_repl"].out);
    });
});
