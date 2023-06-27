import { describe, expect, it } from 'vitest';

import { output_to_blocks } from "../src/useSerialReceiveProcessor"

import * as constants from "../src/constants";

describe('test block breaking', () => {
    const scenario_empty = ""
    it('scenario_empty', () => {
        expect(output_to_blocks(scenario_empty)).toStrictEqual([]);
    });
    const scenario_start_from_repl_code_running = "\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\n>>> \r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\soft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n"

    it('scenario_start_from_repl_code_running', () => {
        expect(output_to_blocks(scenario_start_from_repl_code_running)).toStrictEqual([
            {
                "body": "",
                "is_repl": false,
                "info": "Auto-reload is on. Simply save files over USB to run them or enter REPL to disable.\ncode.py output:"
            },
            {
                "body": "0\n1\n2",
                "is_repl": false,
                "info": ""
            }
        ]);
    });
    const scenario_start_from_done_code_running = "\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\Auto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\n\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\nAdafruit CircuitPython 8.0.5 on 2023-03-31; Adafruit Feather ESP32S2 with ESP32S2\r\n>>> \r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\soft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n"

    it('scenario_start_from_done_code_running', () => {
        expect(output_to_blocks(scenario_start_from_done_code_running)).toStrictEqual([
            {
                "body": "",
                "is_repl": false,
                "info": "Auto-reload is on. Simply save files over USB to run them or enter REPL to disable.\ncode.py output:"
            },
            {
                "body": "0\n1\n2",
                "is_repl": false,
                "info": ""
            }
        ]);
    });
    const scenario_start_from_code_code_running = "\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\Traceback (most recent call last):\r\n  File \"code.py\", line 11, in <module>\r\nKeyboardInterrupt: \r\n\u001b]0;🐍Wi-Fi: off | 11@code.py KeyboardInterrupt | 8.0.5\u001b\\\r\nCode done running.\r\nsoft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n"

    it('scenario_start_from_code_code_running', () => {
        expect(output_to_blocks(scenario_start_from_code_code_running)).toStrictEqual([
            {
                "body": "",
                "is_repl": false,
                "info": "Auto-reload is on. Simply save files over USB to run them or enter REPL to disable.\ncode.py output:"
            },
            {
                "body": "0\n1\n2",
                "is_repl": false,
                "info": ""
            }
        ]);
    });
    const scenario_done_then_repl_just_started = "\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\Auto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\n\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\nAdafruit CircuitPython 8.0.5 on 2023-03-31; Adafruit Feather ESP32S2 with ESP32S2\r\n>>> \r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\soft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\\r\nCode done running.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\n\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\nAdafruit CircuitPython 8.0.5 on 2023-03-31; Adafruit Feather ESP32S2 with ESP32S2\r\n>>> "

    it('scenario_done_then_repl_just_started', () => {
        expect(output_to_blocks(scenario_done_then_repl_just_started)).toStrictEqual([
            {
                "body": "",
                "is_repl": false,
                "info": "Auto-reload is on. Simply save files over USB to run them or enter REPL to disable.\ncode.py output:"
            },
            {
                "body": "0\n1\n2\n3\n4\n5\n6\n7\n8\n9",
                "is_repl": false,
                "info": "Code done running.\n\nPress any key to enter the REPL. Use CTRL-D to reload."
            },
            {
                "body": "Adafruit CircuitPython 8.0.5 on 2023-03-31; Adafruit Feather ESP32S2 with ESP32S2\n>>>",
                "is_repl": true,
                "info": ""
            }
        ]);
    });
    const scenario_done_then_code_done = "\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\nAdafruit CircuitPython 8.0.5 on 2023-03-31; Adafruit Feather ESP32S2 with ESP32S2\r\n>>> \r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\soft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\\r\nCode done running.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\nsoft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\\r\nCode done running.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\n"

    it('scenario_done_then_code_done', () => {
        expect(output_to_blocks(scenario_done_then_code_done)).toStrictEqual([
            {
                "body": "",
                "is_repl": false,
                "info": "Auto-reload is on. Simply save files over USB to run them or enter REPL to disable.\ncode.py output:"
            },
            {
                "body": "0\n1\n2\n3\n4\n5\n6\n7\n8\n9",
                "is_repl": false,
                "info": "Code done running.\n\nPress any key to enter the REPL. Use CTRL-D to reload.\nsoft reboot\n\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\ncode.py output:"
            },
            {
                "body": "0\n1\n2\n3\n4\n5\n6\n7\n8\n9",
                "is_repl": false,
                "info": "Code done running.\n\nPress any key to enter the REPL. Use CTRL-D to reload."
            }
        ]);
    });
    const scenario_break_repl = "\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\n>>> \r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\soft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n3\r\n4\r\nTraceback (most recent call last):\r\n  File \"code.py\", line 11, in <module>\r\nKeyboardInterrupt: \r\n\u001b]0;🐍Wi-Fi: off | 11@code.py KeyboardInterrupt | 8.0.5\u001b\\\r\nCode done running.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\n\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\nAdafruit CircuitPython 8.0.5 on 2023-03-31; Adafruit Feather ESP32S2 with ESP32S2\r\n>>> a = 1\r\n>>> a\r\n1\r\n>>> "
    it('scenario_break_repl', () => {
        expect(output_to_blocks(scenario_break_repl)).toStrictEqual([
            {
                "body": "",
                "is_repl": false,
                "info": "Auto-reload is on. Simply save files over USB to run them or enter REPL to disable.\ncode.py output:"
            },
            {
                "body": "0\n1\n2\n3\n4\nTraceback (most recent call last):\n  File \"code.py\", line 11, in <module>\nKeyboardInterrupt:",
                "is_repl": false,
                "info": "Code done running.\n\nPress any key to enter the REPL. Use CTRL-D to reload."
            },
            {
                "body": "Adafruit CircuitPython 8.0.5 on 2023-03-31; Adafruit Feather ESP32S2 with ESP32S2\n>>> a = 1\n>>> a\n1\n>>>",
                "is_repl": true,
                "info": ""
            }
        ]);
    });
})