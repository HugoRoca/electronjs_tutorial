const { app, BrowserWindow } = require('electron')

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    // Access tools node
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile(__dirname + '//index.html')
})