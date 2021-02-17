const { app, BrowserWindow, ipcMain, dialog } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');
}

ipcMain.on('source:select', (event) => {
  let pastas = dialog.showOpenDialogSync({
    properties: ['openDirectory', 'multiSelections'],
  });
  win.webContents.send('source:selected', pastas);
});

ipcMain.on('destination:select', (event) => {
  let pasta = dialog.showOpenDialogSync({
    properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
  });
  win.webContents.send('destination:selected', pasta);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
