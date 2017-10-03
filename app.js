process.env.NODE_ENV = 'production'; // To increase performance

const electron        = require("electron");
const notif           = require("node-notifier");
const path            = require('path');
const vuex            = require("vuex");
const vue             = require("vue");
const os              = require("os");

const rootPath = path.join(__dirname); // root Path

const BrowserWindow   = electron.BrowserWindow; // Module to control native Browser Window
const nativeImage     = electron.nativeImage;     // Module to control native Image
const app             = electron.app;                     // Module to control app's life

const ConfigManager = require(path.join(rootPath, "/app/src/client/api/configManager"));
const PowerMonitor  = require(path.join(rootPath, "/app/src/client/api/PowerMonitor"));

// Global reference of window object,
// To avaoid window being closed automatically when Js object is GCed.
var mainWindow = null;

// Constant to store location of icons
const logosPath = path.join(rootPath,'app/src/client/icons/');

// Constant to store specific icon sizes and their locations
const MyNoteIcons = {
        '256'       :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@256x256.png')),
        '128'       :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@128x128.png')),
        '64'        :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@64x64.png')),
        '48'        :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@48x48.png')),
        '32'        :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@32x32.png')),
        'ico'       :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@256x256.ico')),
        'tray'      :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@tray.png')), //.resize({ width: 24, height: 24 }),
        'tray-ico'  :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@256x256.ico')),
    };

// Constant to store index HTML file path
htmlFilePath = path.join('file://',rootPath,'/app/index.html');

const shouldQuit = app.makeSingleInstance(() => {
    // If a second instance is initiated, focus our (main) Window
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
    }
});

if (shouldQuit) {
    app.quit();
}

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
})

// Called when Electron has done everything
// initialization and ready for creating browser window
app.on('ready', function() {

    if (os.platform() !== "linux") {
        createToast();
    };

    const configManager          = new ConfigManager(app);
    const useNativeFrame         = configManager.getConfig().useNativeFrame;
    let bounds                   = configManager.getConfig().bounds;

    mainWindow = new BrowserWindow({
        title                   :  'MyNote',
        icon                    :  os.platform() === 'win32' ? MyNoteIcons['ico'] : MyNoteIcons['256'],
        x                       :  bounds.x,
        y                       :  bounds.y,
        width                   :  bounds.width,
        height                  :  bounds.height,
        minWidth                :  1000,
        minHeight               :  600,
        backgroundColor         :  'white',
        scrollBounce            :  true,
        show                    :  false,
        frame                   :  useNativeFrame,
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.loadURL(htmlFilePath);

    let webContents = mainWindow.webContents;

    webContents.on('new-window', function(event, url) {
        event.preventDefault();

    electron.shell.openExternal(url);
    })

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    // Tray manager
    const trayIcon = os.platform() === 'win32.' ? MyNoteIcons['tray-ico'] : MyNoteIcons['tray'];

    // Power monitor
    // to monitor pause calls
    const powerMonitor = new PowerMonitor();
    powerMonitor.enable();

})

/*
|=============================
| checkBounds function
| ============================
*/

function checkBounds(bounds) {
    // check if the browser window is offscreen
    //const point = { bounds.x bounds.y };
    const display = electron.screen.getDisplayNearestPoint(bounds).workArea;

    const onScreen = bounds.x >= display.x
        && bounds.x + bounds.width <= display.x + display.width
        && bounds.y >= display.y
        && bounds.y + bounds.height <= display.y + display.height;

    if(!onScreen) {
        delete bounds.x;
        delete bounds.y;
        bounds.width = 1000;
        bounds.height = 600;
    }

    return bounds;
}

// Create Toast Notification
var createToast = () => {
    var options = {
        'title': 'MyNote',
        'icon': 'app/src/client/icons/app_icon@256x256.png',
        'message': 'App is ready!',
        'sound': 'bottle',
        timeout: 2
    };

    notif.notify(options);
}
