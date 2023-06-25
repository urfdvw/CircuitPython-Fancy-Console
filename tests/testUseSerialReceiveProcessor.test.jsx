import { describe, expect, it } from 'vitest';

import { output_to_blocks } from "../src/useSerialReceiveProcessor"

import * as constants from "../src/constants";

const scenario_empty = ""
const scenario_start_from_code = "\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\Auto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\n"
const scenario_start_from_repl = "\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\"
const scenario_repl_to_code_running = "\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\soft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\\u001b]0;🐍Wi-Fi: No IP | code.py | 8.0.5\u001b\\ESP32-S2 WebClient Test\r\nMy MAC addr: ['0x7c', '0xdf', '0xa1', '0x9c', '0xca', '0x9a']\r\nAvailable WiFi networks:\r\n\u001b]0;🐍Wi-Fi: No IP | code.py | 8.0.5\u001b\\\tMyAltice E23C2F\t\tRSSI: -41\tChannel: 6\r\n\u001b]0;🐍"
describe('test block breaking', () => {
    it('scenario_empty', () => {
        expect(output_to_blocks(scenario_empty)).toStrictEqual([]);
    });
    it('scenario_start_from_code', () => {
        expect(output_to_blocks(scenario_start_from_code)).toStrictEqual([
            {
                "body": "",
                "info": "Auto-reload is on. Simply save files over USB to run them or enter REPL to disable.\n\nPress any key to enter the REPL. Use CTRL-D to reload."
            }
        ]);
    });
    it('scenario_start_from_repl', () => {
        expect(output_to_blocks(scenario_start_from_repl)).toStrictEqual([
            {
                "body": ">>>",
                "info": ""
            }
        ]);
    });
    it('scenario_repl_to_code_running', () => {
        expect(output_to_blocks(scenario_repl_to_code_running)).toStrictEqual([
            {
                "body": "",
                "info": "soft reboot\n\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\ncode.py output:"
            },
            {
                "body": "ESP32-S2 WebClient Test\nMy MAC addr: ['0x7c', '0xdf', '0xa1', '0x9c', '0xca', '0x9a']\nAvailable WiFi networks:\n\tMyAltice E23C2F\t\tRSSI: -41\tChannel: 6",
                "info": ""
            }
        ]);
    });
})