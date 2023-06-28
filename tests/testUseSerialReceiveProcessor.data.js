export const repl_scenarios = {
    "empty": {
        "in": "",
        "out": []
    },
    "null": {
        "in": null,
        "out": []
    },
}

export const output_scenarios = {
    "empty":{
        "in": "",
        "out": []
    },
    "start_from_repl_code_running": {
        "in": "\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\n>>> \r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\soft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n",
        "out": [
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
        ]
    },
    "start_from_done_code_running": {
        "in": "\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\Auto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\n\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\nAdafruit CircuitPython 8.0.5 on 2023-03-31; Adafruit Feather ESP32S2 with ESP32S2\r\n>>> \r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\soft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n",
        "out": [
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
        ]
    },
    "start_from_code_code_running": {
        "in": "\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\Traceback (most recent call last):\r\n  File \"code.py\", line 11, in <module>\r\nKeyboardInterrupt: \r\n\u001b]0;🐍Wi-Fi: off | 11@code.py KeyboardInterrupt | 8.0.5\u001b\\\r\nCode done running.\r\nsoft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n",
        "out": [
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
        ]
    },
    "done_then_repl_just_started": {
        "in": "\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\Auto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\n\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\nAdafruit CircuitPython 8.0.5 on 2023-03-31; Adafruit Feather ESP32S2 with ESP32S2\r\n>>> \r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\soft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\\r\nCode done running.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\n\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\nAdafruit CircuitPython 8.0.5 on 2023-03-31; Adafruit Feather ESP32S2 with ESP32S2\r\n>>> ",
        "out": [
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
        ]
    },
    "done_then_code_done": {
        "in": "\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\nAdafruit CircuitPython 8.0.5 on 2023-03-31; Adafruit Feather ESP32S2 with ESP32S2\r\n>>> \r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\soft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\\r\nCode done running.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\nsoft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\\r\nCode done running.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\n",
        "out": [
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
        ]
    },
    "break_repl": {
        "in": "\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\n>>> \r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\soft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n3\r\n4\r\nTraceback (most recent call last):\r\n  File \"code.py\", line 11, in <module>\r\nKeyboardInterrupt: \r\n\u001b]0;🐍Wi-Fi: off | 11@code.py KeyboardInterrupt | 8.0.5\u001b\\\r\nCode done running.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\n\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\nAdafruit CircuitPython 8.0.5 on 2023-03-31; Adafruit Feather ESP32S2 with ESP32S2\r\n>>> a = 1\r\n>>> a\r\n1\r\n>>> ",
        "out": [
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
        ]
    }
}