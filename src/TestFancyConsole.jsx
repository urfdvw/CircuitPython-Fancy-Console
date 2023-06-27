import React, { useState, useEffect } from "react";
import { FancyConsole } from "./FancyConsole";

const scenario_break_repl = "\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\n>>> \r\n\u001b]0;🐍Wi-Fi: off | Done | 8.0.5\u001b\\soft reboot\r\n\r\nAuto-reload is on. Simply save files over USB to run them or enter REPL to disable.\r\ncode.py output:\r\n\u001b]0;🐍Wi-Fi: off | code.py | 8.0.5\u001b\\0\r\n1\r\n2\r\n3\r\n4\r\nTraceback (most recent call last):\r\n  File \"code.py\", line 11, in <module>\r\nKeyboardInterrupt: \r\n\u001b]0;🐍Wi-Fi: off | 11@code.py KeyboardInterrupt | 8.0.5\u001b\\\r\nCode done running.\r\n\r\nPress any key to enter the REPL. Use CTRL-D to reload.\r\n\u001b]0;🐍Wi-Fi: off | REPL | 8.0.5\u001b\\\r\nAdafruit CircuitPython 8.0.5 on 2023-03-31; Adafruit Feather ESP32S2 with ESP32S2\r\n>>> a = 1\r\n>>> a\r\n1\r\n>>> "

const App = () => {
    const [output, setOutput] = useState(scenario_break_repl);
    
    return <FancyConsole output={output}></FancyConsole>
}

export default App;