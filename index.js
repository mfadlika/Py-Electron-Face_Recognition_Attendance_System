const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const { setupGetHandlers } = require("./handlers/getHandlers");
const { setupPostHandlers } = require("./handlers/postHandlers");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Reference to the preload.js file
      nodeIntegration: false, // Ensure this is set to false for security
      contextIsolation: true, // Make sure contextIsolation is enabled
    },
  });

  const isDev = !app.isPackaged;
  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "/front/build/index.html")}`;
  mainWindow.loadURL(startURL);
  mainWindow.on("closed", () => (mainWindow = null));
});

setupGetHandlers(ipcMain);
setupPostHandlers(ipcMain);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
