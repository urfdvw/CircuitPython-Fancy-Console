// React Native
import React, { useState, useEffect } from "react";
// MUI
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
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
import { VariableSetBoolButton, CreateVariableSetBoolButton } from "./VariableSetBoolButton"
import { VariableSetColor, CreateVariableSetColor } from "./VariableSetColor"
import VariableSet from "./VariableSet"
import CreateWidgetMenu from "./CreateWidget";
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
    // {
    //   key: "sdfgsdfgsdfg3rsdav",
    //   type: "VariableSetBoolButton",
    //   variableName: "e",
    //   displayName: "set e",
    //   windowed: false,
    // },
  ]);
  const [creatingWidget, setCreatingWidget] = React.useState(""); // which create widget modal is showing

  // file related
  const { openDirectory, directoryReady, readFile, readDir, writeFile } = useFileSystem(null);

  // UI elements --------------------------------------
  const json2WidgetContent = (wid) => {
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
    } else if (wid.type === "VariableSetBoolButton") {
      return (
        <VariableSetBoolButton
          variableName={wid.variableName}
          displayName={wid.displayName}
          sendData={sendData}
        ></VariableSetBoolButton>
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
    minHeight: "40px" // for the size of delet icon
  };

  const windowWrapper = (wid, content) => {
    return wid.windowed
      ? (
        <NewWindow
          key={wid.key}
          onUnload={() => {
            unwindow(wid.key);
          }}
        >
          {content}
        </NewWindow>
      )
      : (
        <Box sx={widgetStyles} key={wid.key}>
          {content}
        </Box>
      );
  };

  const json2Widget = (wid) => {
    const closeButton = (
      <Tooltip title="Remove this widget">
        <IconButton onClick={() => {
          closeWidget(wid.key);
        }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
    const enWindowButton = (
      <Tooltip
        title="Open this widget in a window">
        <IconButton
          onClick={() => {
            enwindow(wid.key);
          }}
        >
          <ArrowOutwardIcon />
        </IconButton>
      </Tooltip>
    );
    const content = json2WidgetContent(wid);
    return windowWrapper(
      wid,
      <>
        <div style={{ float: "right" }}>
          {closeButton}
          {wid.windowed ? <></> : enWindowButton}
        </div>
        {content}
      </>
    );
  }
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

  const handleCreateWidgetMenu = (name) => {
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
              <Box sx={widgetStyles}>
                <div style={{ height: "350pt" }}>
                  <ScrollableFeed>
                    <pre style={{ "whiteSpace": "pre-wrap" }}>
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
              </Box>
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
          {
            directoryReady
              ? <>
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
              </>
              : <></>
          }
          <CreateWidgetMenu
            handleClick={handleCreateWidgetMenu}
          />
          <CreateVariableDisp
            open={creatingWidget === "VariableDisp"}
            onClose={onWidgetCreateClose}
            setWidgets={setWidgets}
          />
          <CreateVariableSetBoolButton
            open={creatingWidget === "VariableSetBoolButton"}
            onClose={onWidgetCreateClose}
            setWidgets={setWidgets}
          />
          {widgets.map(json2Widget)}
          <VariableSetColor
            variableName="c"
            displayName={"set c"}
            sendData={sendData}
          ></VariableSetColor>
        </Grid>
      </Grid>
    </Box>
  );
};

export default App;
