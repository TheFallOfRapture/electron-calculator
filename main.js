const {app, BrowserWindow} = require("electron")

let win

function createWindow() {
    win = new BrowserWindow({width: 268, height: 412})
    win.loadURL(`file://${__dirname}/app/html/index.html`)
    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if (process.platform != "darwin") {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})
