// React Native
import React, { useState, useEffect } from "react";
// MUI
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
// Other packages
import ScrollableFeed from "react-scrollable-feed"; // https://stackoverflow.com/a/52673227/7037749
import NewWindow from "react-new-window";
// Mine
import useSerial from "./useSerial";
import {
  latestTitle,
  removeInBetween,
  aggregateConnectedVariable,
} from "./textProcessor";
import * as constants from "./constants";
// Mine widgets
import { VariableDisp, CreateVariableDisp } from "./VariableDisp";
import VariableSet from "./VariableSet"
import CreateWidget from "./CreateWidget";

const App = () => {
  // Hooks --------------------------------------
  // serial related
  const { connect, disconnect, sendData, output, connected } = useSerial();
  const [input, setInput] = useState("");
  const [connectedVariables, setConnectedVariables] = useState({});
  useEffect(() => {
    setConnectedVariables((cur_cv) => {
      return {
        ...cur_cv,
        ...aggregateConnectedVariable(output),
      };
    });
  }, [output]);
  const [rawSerialData, setRawSerialData] = useState(false);
  // widget related
  const [widgets, setWidgets] = useState([
    {
      key: "sdkfjwdkjfhsadkjfh",
      type: "VariableDisp",
      variableName: "a",
      displayName: "Value of `a` in CircuitPython",
      windowed: false,
    },
    {
      key: "fkjvhgifvbhgsjd",
      type: "VariableSet",
      windowed: false,
    },
  ]);

  const [creatingWidget, setCreatingWidget] = React.useState(""); // which create widget modal is showing

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
    sendData(input + LINE_END);
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

  return (
    <div>
      <h2>Serial Console</h2>
      <h3>{latestTitle(output)}</h3>
      {!connected && (
        <Button variant="contained" onClick={connect}>
          Connect
        </Button>
      )}
      <Switch
        checked={rawSerialData}
        onChange={() => {
          setRawSerialData((cur) => !cur);
        }}
        inputProps={{ "aria-label": "controlled" }}
      />{" "}
      Show raw serial data from MCU
      <div style={{ height: "350pt" }}>
        <ScrollableFeed>
          <pre>
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
      {connected && (
        <>
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
        </>
      )}
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
      {/* need to be changed to menu
      <FormControl fullWidth>
        <InputLabel id="simple-select-label">Add Widget</InputLabel>
        <Select
          labelId="simple-select-label"
          id="simple-select"
          value={creatingWidget}
          label="add_widget"
          onChange={(event) => {
            setCreatingWidget(event.target.value);
          }}
        >
          <MenuItem value={"VariableDisp"}>VariableDisp</MenuItem>
        </Select>
      </FormControl> */}
      <CreateWidget
        handleClick={handleCreateWidget}
      />
      <CreateVariableDisp
        open={creatingWidget === "VariableDisp"}
        onClose={onWidgetCreateClose}
        setWidgets={setWidgets}
      />
    </div>
  );
};

export default App;
