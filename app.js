process.env.NODE_ENV = 'production' // To increase performance

const electron        = require("electron")
const path            = require('path')
const os              = require("os")
const fs              = require('fs')

const rootPath = path.join(__dirname) // root Path

process.env.APP_ROOT = rootPath
process.env.APP_VERSION = '0.2.0-b'

const BrowserWindow   = electron.BrowserWindow   // Module to control native Browser Window
const nativeImage     = electron.nativeImage    // Module to control native Image
const app             = electron.app           // Module to control app's life
const Menu            = electron.Menu           // For Window Top Bar Menu
const shell           = electron.shell         // For triggering launching browser to open external internet links
const ipcMain         = electron.ipcMain       // For handling events from render process

const PowerMonitor  = require(path.join(rootPath, "/app/src/api/PowerMonitor"))

// Global reference of window object,
// To avaoid window being closed automatically when Js object is GCed.
var mainWindow = null
var serviceWorker = null

// Constant to store location of icons
const logosPath = path.join(rootPath,'app/src/icons/')

// Constant to store specific icon sizes and their locations
const MyNoteIcons = {
        '256'       :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@256x256.png')),
        '128'       :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@128x128.png')),
        '64'        :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@64x64.png')),
        '48'        :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@48x48.png')),
        '32'        :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@32x32.png')),
        'ico'       :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@256x256.ico')),
        'tray'      :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@tray.png')),
        'tray-ico'  :  nativeImage.createFromPath(path.join(logosPath, 'app_icon@256x256.ico')),
    }

// Constant to store index HTML file path
htmlFilePath = path.join('file://', rootPath, path.sep, 'app', path.sep, 'index.html')

// Constant to store serviceWorker HTML file path
const serviceWorkerDefaultURL = path.join('file://', path.resolve(), 'app', path.sep, 'src', path.sep, 'public', path.sep, 'serviceWorker.html')

// To strore any failed shortcuts
const failedShorcuts = []

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
    serviceWorker = new BrowserWindow({height: 1200, width: 1200, title: 'ServiceWorker', show: false})

    // Load serviceWorker default page
    serviceWorker.loadURL(serviceWorkerDefaultURL)

    mainWindow = new BrowserWindow({
        title                   :  'mynote',
        icon                    :  os.platform() === 'win32' ? MyNoteIcons['ico'] : MyNoteIcons['256'],
        width                   :  1230,
        minWidth                :  1230,
        height                  :  650,
        minHeight               :  650,
        backgroundColor         :  'white',
        scrollBounce            :  true,
        show                    :  false,
        frame                   :  true,
        center                  :  true
    })

    BrowserWindow.addDevToolsExtension(path.join(os.homedir(), '.config/google-chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/4.1.5_0/'))

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    ipcMain.on('quit-app', (event, arg) => {
        app.quit()
    })

    ipcMain.on('toggle-dev-tools', (event, arg) => {
        mainWindow.webContents.toggleDevTools()
    })

    ipcMain.on('reload-window', (event, arg) => {
        mainWindow.reload()
    })

    ipcMain.on('setWindowSize', (event, arg) => {
        if (mainWindow.isMaximized()) {
            mainWindow.webContents.send('enter-fullscreen', 'in Fullscreen')
        } else {
            mainWindow.webContents.send('leave-fullscreen', 'not Fullscreen')
        }
    })

    ipcMain.on('exportAll', (event, arg) => {
        fs.writeFile(arg.path, JSON.stringify(arg.notes), (err) => {
            if (err) {
                event.sender.send('exportedAll-status', false)
            }

            event.sender.send('exportedAll-status', true)
        })
    })

    // Load Actual App Content
    mainWindow.loadURL(htmlFilePath)

    ipcMain.on('signal-export', (event, arg) => {
        serviceWorker.webContents.send("printPDF", arg)
    })

    ipcMain.on('pdfReady', (event, pdfName) => {
        serviceWorker.webContents.printToPDF({printBackground: true}, (err, data) => {
            if (data) {
                fs.writeFile(pdfName, data, (err) => {
                    if (err) {
                        mainWindow.webContents.send('export-pdf-response', {pdf: data, status: false})
                    }

                    mainWindow.webContents.send('export-pdf-response', {pdf: data, status: true})
                })
            }
        })
    })

    mainWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault()
        electron.shell.openExternal(url)
    })

    /////////////////////// EOD

    // Watch certain events to adapt App content properly
    mainWindow.on('maximize', () => {
        mainWindow.webContents.send('enter-fullscreen', 'in Fullscreen')
    })

    mainWindow.on('unmaximize', () => {
        mainWindow.webContents.send('leave-fullscreen', 'not Fullscreen')
    })

    mainWindow.on('closed', function() {
        mainWindow = null
        serviceWorker = null

        app.quit()
    })

    serviceWorker.on('closed', function() {
        serviceWorker = null
    })

    /////////////////////// EOD

    // Tray manager
    const trayIcon = os.platform() === 'win32' ? MyNoteIcons['tray-ico'] : MyNoteIcons['tray']

    // Power monitor
    // to monitor pause calls
    const powerMonitor = new PowerMonitor()
    powerMonitor.enable()

    // Create menu for main window
    const template = [
        // Menu:- File, Edit, View, Help
        {
            label: 'File',
            submenu: [
                {
                    label: 'Add New',
                    accelerator: 'CommandOrControl+N',
                    click() {
                        mainWindow.webContents.send('short_newNote', null)
                    }
                },
                {
                    label: 'Export...',
                    accelerator: 'CommandOrControl+E',
                    click() {
                        mainWindow.webContents.send('short_exportNote', null)
                    }
                },
                {type: 'separator'},
                {
                    label: 'Quit',
                    accelerator: 'CommandOrControl+Q',
                    click() {app.quit()}
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    role: 'undo'
                },
                {
                    label: 'Redo',
                    role: 'redo'
                },
                {type: 'separator'},
                {
                    label: 'Cut',
                    role: 'cut'
                },
                {
                    label: 'Copy',
                    role: 'copy'
                },
                {
                    label: 'Paste',
                    role: 'paste'
                },
                {
                    label: 'Select All',
                    role: 'selectall'
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Maximize Window',
                    click() {
                        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
                    }
                },
                {
                    label: 'Minimize Window',
                    role: 'minimize'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Sidepane',
                    submenu: [
                        {
                            label: 'Toggle Sidepane',
                            accelerator: 'CommandOrControl+H',
                            click() {
                                mainWindow.webContents.send('short_hideSidenav', null)
                            }
                        },
                        {
                            label: 'Toggle Toolset Buttons',
                            accelerator: 'CommandOrControl+G',
                            click() {
                                mainWindow.webContents.send('short_toggleTools', null)
                            }
                        }
                    ]
                },
                {
                    label: 'Toggle Search',
                    accelerator: 'CommandOrControl+F',
                    click() {
                        mainWindow.webContents.send('short_toggleSearch', null)
                    }
                },
                {type: 'separator'},
                {
                    label: 'Toggle Night Mode',
                    accelerator: 'CommandOrControl+T',
                    click() {
                        mainWindow.webContents.send('short_toggleNightmode', null)
                    }
                },
                {type: 'separator'},
                {
                    label: 'Toggle Markdown Preview',
                    accelerator: 'CommandOrControl+Shift+M',
                    click() {
                        mainWindow.webContents.send('short_toggleMD', null)
                    }
                },
                {type: 'separator'},
                {
                    label: 'Preferences',
                    accelerator: 'CommandOrControl+,',
                    click() {
                        mainWindow.webContents.send('short_openSettings')
                    }
                }
            ]
        },
        {
            label: 'Format',
            submenu: [
                {
                    label: 'Heading',
                    submenu: [
                        {
                            label: 'Heading 1',
                            accelerator: 'CommandOrControl+1',
                            click() {
                                mainWindow.webContents.send('short_insert_heading', 1)
                            }
                        },
                        {
                            label: 'Heading 2',
                            accelerator: 'CommandOrControl+2',
                            click() {
                                mainWindow.webContents.send('short_insert_heading', 2)
                            }
                        },
                        {
                            label: 'Heading 3',
                            accelerator: 'CommandOrControl+3',
                            click() {
                                mainWindow.webContents.send('short_insert_heading', 3)
                            }
                        },
                        {
                            label: 'Heading 4',
                            accelerator: 'CommandOrControl+4',
                            click() {
                                mainWindow.webContents.send('short_insert_heading', 4)
                            }
                        },
                        {
                            label: 'Heading 5',
                            accelerator: 'CommandOrControl+5',
                            click() {
                                mainWindow.webContents.send('short_insert_heading', 5)
                            }
                        },
                        {
                            label: 'Heading 6',
                            accelerator: 'CommandOrControl+6',
                            click() {
                                mainWindow.webContents.send('short_insert_heading', 6)
                            }
                        },
                        {type: 'separator'},
                        {
                            label: 'Increase Font Size',
                            accelerator: 'CommandOrControl+=',
                            click() {
                                mainWindow.webContents.send('short_incFontSize', null)
                            }
                        },
                        {
                            label: 'Decrease Font Size',
                            accelerator: 'CommandOrControl+-',
                            click() {
                                mainWindow.webContents.send('short_decFontSize', null)
                            }
                        }
                    ]
                },
                {
                    label: 'Paragraph',
                    submenu: [
                        {
                            label: 'Insert...',
                            submenu: [
                                {
                                    label: 'Code Block',
                                    accelerator: 'Alt+CommandOrControl+C',
                                    click() {
                                        mainWindow.webContents.send('short_insert_md_block', 'code')
                                    }
                                },
                                {
                                    label: 'Quote Block',
                                    accelerator: 'Alt+CommandOrControl+Q',
                                    click() {
                                        mainWindow.webContents.send('short_insert_md_block', 'quote')
                                    }
                                },
                                {
                                    label: 'Math Block',
                                    accelerator: 'Alt+CommandOrControl+M',
                                    click() {
                                        mainWindow.webContents.send('short_insert_md_block', 'math')
                                    }
                                },
                                {type: 'separator'},
                                {
                                    label: 'Ordered List',
                                    accelerator: 'Alt+CommandOrControl+O',
                                    click() {
                                        mainWindow.webContents.send('short_insert_list', 'ordered')
                                    }
                                },
                                {
                                    label: 'Bullet List',
                                    accelerator: 'Alt+CommandOrControl+B',
                                    click() {
                                        mainWindow.webContents.send('short_insert_list', 'bullet')
                                    }
                                },
                                {
                                    label: 'Task List',
                                    accelerator: 'Alt+CommandOrControl+X',
                                    click() {
                                        mainWindow.webContents.send('short_insert_list', 'task')
                                    }
                                },
                                {type: 'separator'},
                                {
                                    label: 'Horizontal Line',
                                    accelerator: 'Alt+CommandOrControl+L',
                                    click() {
                                        mainWindow.webContents.send('short_insert_hr')
                                    }
                                }
                            ]
                        },
                        {
                            type: 'separator'
                        },
                        {
                            label: 'Strong',
                            accelerator: 'CommandOrControl+B',
                            click() {
                                mainWindow.webContents.send('short_insert_symbol', 'bold')
                            }
                        },
                        {
                            label: 'Italics',
                            accelerator: 'CommandOrControl+I',
                            click() {
                                mainWindow.webContents.send('short_insert_symbol', 'italics')
                            }
                        },
                        {
                            label: 'Inline Code',
                            accelerator: 'CommandOrControl+`',
                            click() {
                                mainWindow.webContents.send('short_insert_symbol', 'inline-code')
                            }
                        },
                        {
                            label: 'Strike',
                            accelerator: 'CommandOrControl+D',
                            click() {
                                mainWindow.webContents.send('short_insert_symbol', 'strike-through')
                            }
                        },
                        {
                            type: 'separator'
                        },
                        {
                            label: 'Hyperlink',
                            accelerator: 'CommandOrControl+L',
                            click() {
                                mainWindow.webContents.send('short_insert_link', 'link')
                            }
                        },
                        {
                            label: 'Image',
                            accelerator: 'Alt+CommandOrControl+I',
                            click() {
                                mainWindow.webContents.send('short_insert_image', 'image')
                            }
                        }
                    ]
                }
            ]
        },
        {
            label: 'Developer',
            submenu: [
                {
                    label: 'Reload Window',
                    role: 'reload',
                    accelerator: 'CommandOrControl+R'
                },
                {
                    label: 'Force Reload Window',
                    accelerator: 'Shift+CommandOrControl+R',
                    role: 'forcereload'
                },
                {
                    label: 'Toggle Developr Tools',
                    accelerator: 'Shift+CommandOrControl+I',
                    role: 'toggledevtools'
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'View License',
                    click() {
                        shell.openExternal('https://github.com/Zero-1729/mynote#license')
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: `Version ${process.env.APP_VERSION}`,
                    enabled: false
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Markdown Cheetsheet',
                    click() {shell.openExternal('https://spec.commonmark.org/0/28')}
                },
                {
                    type: 'separator'
                },
                {
                    label: 'MyNote Shortcuts',
                    click() {shell.openExternal('https://github.com/Zero-1729/mynote/app/src/public/docs/mynote_shortcuts.pdf')}
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Learn More',
                    click() {shell.openExternal('https://github.com/Zero-1729/mynote#readme')}
                }
            ]
        }
    ]

    // Attach menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
    //////////////////////// EOD
})
