// React Native
import React, { useState, useEffect } from "react";
// MUI
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel, a11yProps } from "./TabPanel";
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
  globStringToRegex,
} from "./textProcessor";
import * as constants from "./constants";
// My widgets
import {
  VariableDisp,
  variableDispObj,
  variableDispTitle,
} from "./VariableDisp";
import {
  VariableSetBoolButton,
  variableSetBoolButtonObj,
  variableSetBoolTitle,
} from "./VariableSetBoolButton";
import {
  VariableSetColor,
  variableSetColorObj,
  variableSetColorTitle,
} from "./VariableSetColor";
import VariableSet from "./VariableSet";
import { CreateWidgetMenu, CreateWidgetDiag } from "./CreateWidget";
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
    // {
    //   key: "sadfjkhsdgiofu",
    //   type: "VariableSetColor",
    //   variableName: "c",
    //   displayName: "set c",
    //   windowed: false,
    // },
  ]);
  const [widgetCreateDiag, setWidgetCreateDiag] = React.useState(<></>); // which create widget modal is showing

  // file related
  const { openDirectory, directoryReady, readFile, readDir, writeFile } =
    useFileSystem(null);

  // UI related

  const [tabValue, setTabValue] = React.useState(0);

  // fancy console split
  const output2BlockText = () => {
    const cv_removed = removeInBetween(
      output,
      constants.CV_JSON_START,
      constants.CV_JSON_END
    );

    const end_unified = cv_removed.split('Done').join('@');

    const splitted_by_ends = end_unified.split(globStringToRegex(
      constants.TITLE_START + "*@*" + constants.TITLE_END
    ));

    let text_blocks = [];
    for (const sec of splitted_by_ends) {
      console.log(sec)
      const parts = sec.split(globStringToRegex(
        constants.TITLE_START + "*" + constants.TITLE_END
      ));
      const info = parts[0].trim();
      const content = parts.slice(1).join('').trim();
      text_blocks.push([info, content])
    }

    return text_blocks
  }

  // useEffect(() => {
  //   // for debug
  //   console.log([
  //     output2BlockText()
  //   ])
  // }, [output])

  // UI elements --------------------------------------
  const obj2WidgetContent = (wid) => {
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
    } else if (wid.type === "VariableSetColor") {
      return (
        <VariableSetColor
          variableName={wid.variableName}
          displayName={wid.displayName}
          sendData={sendData}
        ></VariableSetColor>
      );
    } else {
      return {};
    }
  };

  const widgetStyles = {
    bgcolor: "background.paper",
    borderColor: "text.primary",
    m: 1,
    border: 1,
    padding: "10px",
    borderRadius: "16px",
    minHeight: "40px", // for the size of delet icon
  };

  const windowWrapper = (wid, content) => {
    return wid.windowed ? (
      <NewWindow
        key={wid.key}
        onUnload={() => {
          unwindow(wid.key);
        }}
      >
        {content}
      </NewWindow>
    ) : (
      <Box sx={widgetStyles} key={wid.key}>
        {content}
      </Box>
    );
  };

  const json2Widget = (wid) => {
    const closeButton = (
      <Tooltip title="Remove this widget">
        <IconButton
          onClick={() => {
            closeWidget(wid.key);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
    const enWindowButton = (
      <Tooltip title="Open this widget in a window">
        <IconButton
          onClick={() => {
            enwindow(wid.key);
          }}
        >
          <ArrowOutwardIcon />
        </IconButton>
      </Tooltip>
    );
    const content = obj2WidgetContent(wid);
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
    setWidgetCreateDiag(<></>);
  };

  const handleCreateWidgetMenu = (name) => {
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
    } else if (name === "VariableDisp") {
      setWidgetCreateDiag(
        <CreateWidgetDiag
          onClose={onWidgetCreateClose}
          setWidgets={setWidgets}
          open={true}
          widgetObj={variableDispObj}
          title={variableDispTitle}
        />
      );
    } else if (name === "VariableSetBoolButton") {
      setWidgetCreateDiag(
        <CreateWidgetDiag
          onClose={onWidgetCreateClose}
          setWidgets={setWidgets}
          open={true}
          widgetObj={variableSetBoolButtonObj}
          title={variableSetBoolTitle}
        />
      );
    } else if (name === "VariableSetColor") {
      setWidgetCreateDiag(
        <CreateWidgetDiag
          onClose={onWidgetCreateClose}
          setWidgets={setWidgets}
          open={true}
          widgetObj={variableSetColorObj}
          title={variableSetColorTitle}
        />
      );
    }
  };

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
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={(event, newValue) => {
            setTabValue(newValue);
          }}
          aria-label="basic tabs example"
        >
          <Tab label="Serial Console" {...a11yProps(0)} />
          <Tab label="Widgets" {...a11yProps(1)} />
          <Tab label="Fancy Console" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
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
                  <pre style={{ whiteSpace: "pre-wrap" }}>
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
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Button onClick={openDirectory}>open folder</Button>
        {directoryReady ? (
          <>
            <Button onClick={handleInstallPyLib}>
              Install Connected Vairable Library
            </Button>
            <Button
              onClick={() => {
                writeFile("widgets.json", JSON.stringify(widgets));
              }}
            >
              Save Widgets
            </Button>
            <Button
              onClick={async function () {
                setWidgets(JSON.parse(await readFile("widgets.json")));
              }}
            >
              Load Widgets
            </Button>
          </>
        ) : (
          <></>
        )}
        <CreateWidgetMenu handleClick={handleCreateWidgetMenu} />
        {widgetCreateDiag}
        {widgets.map(json2Widget)}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {output2BlockText().map(block => {
          return <>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {block[0]}
            </pre>
            <Box sx={widgetStyles}>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {block[1]}
              </pre>
            </Box>
          </>
        })}
      </TabPanel>
    </Box>
  );
};

export default App;
