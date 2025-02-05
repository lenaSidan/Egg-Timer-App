const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    closeApp: () => ipcRenderer.send("close-app"),
    startTimer: (time) => ipcRenderer.send("start-timer", time),
    openEggSelection: () => ipcRenderer.send("open-egg-selection"),
    onStartTimer: (callback) => ipcRenderer.on("start-timer", (_event, time) => callback(time)),
    onOpenEggSelection: (callback) => ipcRenderer.on("open-egg-selection", () => callback())
});
