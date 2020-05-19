"use strict";

import { app, protocol, BrowserWindow } from "electron";
import {
  createProtocol,
  installVueDevtools,
} from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";

let home;
let about;

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function createWindow(winVar, devPath, prodPath) {
  winVar = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    winVar.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath);
    if (!process.env.IS_TEST) {
      winVar.webContents.openDevTools();
    }
  } else {
    createProtocol("app");
    winVar.loadURL(`app://./${prodPath}`);
  }
  winVar.on("closed", () => {
    winVar = null;
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (home === null) {
    createWindow(home, "homepage", "homepage.html");
  }
  if (about === null) {
    createWindow(about, "aboutpage", "aboutpage.html");
  }
});

app.on("ready", async () => {
  // install vue devtools
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installVueDevtools();
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow(home, "homepage", "homepage.html");
  createWindow(about, "aboutpage", "aboutpage.html");
});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
