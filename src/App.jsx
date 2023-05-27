// React Native
import React, { useState, useEffect } from "react";
// MUI
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Grid from '@mui/material/Grid';
// Other packages
import ScrollableFeed from "react-scrollable-feed"; // https://stackoverflow.com/a/52673227/7037749
import NewWindow from "react-new-window";
// Mine
import useSerial from "./useSerial";
import useFileSystem from "./useFileSystem";
import {
  latestTitle,
  removeInBetween,
  aggregateConnectedVariable,
} from "./textProcessor";
import * as constants from "./constants";
// My widgets
import { VariableDisp, CreateVariableDisp } from "./VariableDisp";
import VariableSet from "./VariableSet"
import VariableSetBoolButton from "./VariableSetBoolButton"
import CreateWidget from "./CreateWidget";
// My data
import matcher_py from "../CIRCUITPY/matcher.txt";
import connected_variables_py from "../CIRCUITPY/connected_variables.txt";

const App = () => {
  // Hooks --------------------------------------
  // serial related
  const { connect, disconnect, sendData, output, connected } = useSerial();
  const [input, setInput] = useState("");
  const [connectedVariables, setConnectedVariables] = useState({});
  useEffect(() => {
    setConnectedVariables(aggregateConnectedVariable(output));
  }, [output]);
  const [rawSerialData, setRawSerialData] = useState(false);
  // widget related
  const [widgets, setWidgets] = useState([
    // // examples
    // {
    //   key: "sdkfjwdkjfhsadkjfh",
    //   type: "VariableDisp",
    //   variableName: "a",
    //   displayName: "Value of `a` in CircuitPython",
    //   windowed: false,
    // },
    // {
    //   key: "fkjvhgifvbhgsjd",
    //   type: "VariableSet",
    //   windowed: false,
    // },
  ]);
  const [creatingWidget, setCreatingWidget] = React.useState(""); // which create widget modal is showing

  // file related
  const { openDirectory, readFile, readDir, writeFile } = useFileSystem(null);

  // UI elements --------------------------------------
  const widgetDisplaySelector = (wid) => {
    if (wid.type === "VariableDisp") {
      return (
        <VariableDisp
          connectedVariables={connectedVariables}
          variableName={wid.variableName}
          displayName={wid.displayName}
        />
      );
    } else if (wid.type === "VariableSet") {
      return (
        <VariableSet
          connectedVariables={connectedVariables}
          sendData={sendData}
        />
      );
    }
  };

  const widgetStyles = {
    bgcolor: "background.paper",
    borderColor: "text.primary",
    m: 1,
    border: 1,
    padding: "10px",
    borderRadius: "16px",
  };

  const windowWrapper = (wid, content) => {
    if (wid.windowed) {
      return (
        <NewWindow
          key={wid.key}
          onUnload={() => {
            unwindow(wid.key);
          }}
        >
          {content}
        </NewWindow>
      );
    } else {
      return (
        <Box sx={widgetStyles} key={wid.key}>
          <button
            onClick={() => {
              enwindow(wid.key);
            }}
          >
            Float to Window
          </button>
          <br />
          {content}
        </Box>
      );
    }
  };
  // handler --------------------------------------
  // serial related
  const handleSend2MCU = (e) => {
    e.preventDefault();
    sendData(input + constants.LINE_END);
    setInput("");
  };

  // widget related
  const setWindowed = (key, value) => {
    setWidgets((cur) =>
      cur.map((wid) => (wid.key === key ? { ...wid, windowed: value } : wid))
    );
  };

  const enwindow = (key) => {
    setWindowed(key, true);
  };

  const unwindow = (key) => {
    setWindowed(key, false);
  };

  const closeWidget = (key) => {
    setWidgets((cur) => cur.filter((wid) => wid.key !== key));
  };

  const onWidgetCreateClose = () => {
    setCreatingWidget("");
  };

  const handleCreateWidget = (name) => {
    setCreatingWidget(name) // handled by modal if exisits
    if (name === "VariableSet") {
      setWidgets((cur) => {
        return [
          ...cur,
          {
            key: crypto.randomUUID(),
            type: "VariableSet",
            windowed: false,
          },
        ];
      });
    }
  }

  const handleInstallPyLib = () => {
    // https://stackoverflow.com/a/64788876/7037749
    fetch(matcher_py)
      .then((r) => r.text())
      .then((text) => {
        writeFile("lib/matcher.py", text);
      });
    fetch(connected_variables_py)
      .then((r) => r.text())
      .then((text) => {
        writeFile("lib/connected_variables.py", text);
      });
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h2>Serial Console</h2>
          {!connected && (
            <Button variant="contained" onClick={connect}>
              Connect
            </Button>
          )}
          {connected && (
            <>
              <h3>{latestTitle(output)}</h3>
              <Button
                variant="contained"
                onClick={() => {
                  sendData(constants.CTRL_C);
                }}
              >
                Ctrl-C
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  sendData(constants.CTRL_D);
                }}
              >
                Ctrl-D
              </Button>
              <Switch
                checked={rawSerialData}
                onChange={() => {
                  setRawSerialData((cur) => !cur);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />{" "}
              Raw
              <div style={{ height: "350pt" }}>
                <ScrollableFeed>
                  <pre style={{"white-space": "pre-wrap"}}>
                    {rawSerialData
                      ? output
                      : removeInBetween(
                        removeInBetween(
                          output,
                          constants.TITLE_START,
                          constants.TITLE_END
                        ),
                        constants.CV_JSON_START,
                        constants.CV_JSON_END
                      )}
                  </pre>
                </ScrollableFeed>
              </div>
              <form onSubmit={handleSend2MCU}>
                <TextField
                  variant="standard"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button variant="contained" type="submit">
                  Send
                </Button>
              </form>
            </>
          )}
        </Grid>

        <Grid item xs={6}>
          <h2>Variable Widgets</h2>
          <Button onClick={openDirectory}>open folder</Button>
          <Button onClick={handleInstallPyLib}>
            Install Connected Vairable Library
          </Button>
          <Button onClick={() => {
            writeFile('widgets.json', JSON.stringify(widgets))
          }}>
            Save Widgets
          </Button>
          <Button onClick={async function () {
            setWidgets(JSON.parse(await readFile('widgets.json')))
          }}>
            Load Widgets
          </Button>
          <CreateWidget
            handleClick={handleCreateWidget}
          />
          <CreateVariableDisp
            open={creatingWidget === "VariableDisp"}
            onClose={onWidgetCreateClose}
            setWidgets={setWidgets}
          />
          {widgets.map((wid) => {
            const closeButton = (
              <button
                onClick={() => {
                  closeWidget(wid.key);
                }}
              >
                x
              </button>
            );
            const content = widgetDisplaySelector(wid);
            return windowWrapper(
              wid,
              <>
                {closeButton}
                {content}
              </>
            );
          })}
          <VariableSetBoolButton
            variableName='e'
            displayName='set e'
            sendData={sendData}
          ></VariableSetBoolButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default App;
