require("electron-reload")(__dirname);

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require(
"path");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 520,
    resizable: false,
    fullscreen: false,
    fullscreenable: false,
    frame: true,  // Включаем стандартную панель
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });
  mainWindow.setMenu(null);
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["default-src 'self'; script-src 'self'"],
      },
    });
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // if (!app.isPackaged) {
  //   mainWindow.webContents.openDevTools();
  // }
};

app.whenReady().then(createWindow);

ipcMain.on("close-app", () => {
  app.quit();
});

ipcMain.on("start-timer", (_event, time) => {
  console.log(`Starting timer for ${time} seconds...`);
  mainWindow.webContents.send("start-timer", time);
});

ipcMain.on("open-egg-selection", () => {
  console.log("Opening egg selection...");
  mainWindow.webContents.send("open-egg-selection");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
