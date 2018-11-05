process.env.NODE_ENV = 'production' // To increase performance

const electron        = require("electron")
const path            = require('path')
const os              = require("os")

const rootPath = path.join(__dirname) // root Path
process.env.APP_ROOT = rootPath

const BrowserWindow   = electron.BrowserWindow   // Module to control native Browser Window
const nativeImage     = electron.nativeImage    // Module to control native Image
const app             = electron.app           // Module to control app's life

const PowerMonitor  = require(path.join(rootPath, "/app/src/api/PowerMonitor"))

// Global reference of window object,
// To avaoid window being closed automatically when Js object is GCed.
var mainWindow = null;

// Constant to store location of icons
const logosPath = path.join(rootPath,'app/src/icons/')

// Constant to store specific icon sizes and their locations
const MyNoteIcons = {
        '256'       :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@256x256_n.png')),
        '128'       :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@128x128_n.png')),
        '64'        :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@64x64_n.png')),
        '48'        :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@48x48_n.png')),
        '32'        :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@32x32_n.png')),
        'ico'       :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@256x256.ico')),
        'tray'      :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@tray_n.png')), //.resize({ width: 24, height: 24 }),
        'tray-ico'  :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@256x256.ico')),
    }

// Constant to store index HTML file path
htmlFilePath = path.join('file://',rootPath,'/app/index.html')

// App Centering fn
const getCenterPos = (win, screen) => {
    let screenSize = screen.getPrimaryDisplay().size
    let appSize    = win.getSize()

    // Calculate center position
    let xPos = (screenSize.width - appSize[0]) / 2
    let yPos = (screenSize.height - appSize[1]) / 2

    return {x: xPos, y: yPos}
}

const shouldQuit = app.makeSingleInstance(() => {
    // If a second instance is initiated, focus our (main) Window
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.show()
        mainWindow.focus()
    }
});

if (shouldQuit) {
    app.quit()
}

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
})

// Called when Electron has done everything
// initialization and ready for creating browser window
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        title                   :  'mynote',
        icon                    :  os.platform() === 'win32' ? MyNoteIcons['ico'] : MyNoteIcons['256'],
        width                   :  1000,
        minWidth                :  1000,
        height                  :  600,
        minHeight               :  600,
        backgroundColor         :  'white',
        scrollBounce            :  true,
        show                    :  false,
        frame                   :  true,
    })

    // Set app in centerPos
    let centerPos = getCenterPos(mainWindow, electron.screen)
    mainWindow.setPosition(centerPos.x, centerPos.y)
    //mainWindow.webContents.setDevToolsWebContents(devtools.webContents)
    // Use this as default behaviour for menu window item
    mainWindow.webContents.openDevTools({mode: 'detach'})

    BrowserWindow.addDevToolsExtension(path.join(os.homedir(), '.config/google-chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/4.1.5_0/'))


    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        // Align the window to the center of the Screen always
        mainWindow.center()
    })

    mainWindow.loadURL(htmlFilePath)

    mainWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault()
        electron.shell.openExternal(url)
    })

    mainWindow.webContents.send('initApp', rootPath)

    mainWindow.on('closed', function() {
        mainWindow = null
    })

    // Tray manager
    const trayIcon = os.platform() === 'win32.' ? MyNoteIcons['tray-ico'] : MyNoteIcons['tray']

    // Power monitor
    // to monitor pause calls
    const powerMonitor = new PowerMonitor()
    powerMonitor.enable()
})
