import { useState } from "react";

const useFileSystem = () => {
  const [directoryHandle, setDirectoryHandle] = useState(null);

  async function openDirectory() {
    setDirectoryHandle(await window.showDirectoryPicker());
  }

  async function readFile(path, opt) {
    if (!opt) {
      opt = {};
    }
    // change windows path to the world standard
    path.replace("\\", "/");
    // split path to levels
    const levels = path.split("/");
    console.log("levels", [levels]);
    console.log("levels.slice(0, -1)", [levels.slice(0, -1)]);
    try {
      // go into the directories to get the filehandle
      let curDirectoryHandle = directoryHandle;
      for (const l of levels.slice(0, -1)) {
        console.log("l", [l]);
        curDirectoryHandle = await curDirectoryHandle.getDirectoryHandle(l);
      }
      const fileHandle = await curDirectoryHandle.getFileHandle(
        levels.at(-1),
        opt
      );
      console.log(path, "found");
      const file = await fileHandle.getFile();
      const contents = await file.text();
      return String(contents);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  return { openDirectory, readFile };
};

export default useFileSystem;
