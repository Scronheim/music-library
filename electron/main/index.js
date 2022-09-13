import { app, BrowserWindow, shell, ipcMain, dialog, Menu } from 'electron'
import { release } from 'os'
import { join } from 'path'
import Store from 'electron-store'
import windowStateKeeper from 'electron-window-state'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'

import { parseArtistFolder } from '../utils'

const store = new Store()
// store.clear()

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

Menu.setApplicationMenu(null)

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, '../..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
  preload: join(__dirname, '../../../electron/preload/index.js'),
}

const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(ROOT_PATH.dist, 'index.html')
let win
async function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1300,
    defaultHeight: 800,
  })
  const options = {
    title: 'Main window',
    icon: join(ROOT_PATH.public, 'favicon.ico'),
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      preload: ROOT_PATH.preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: true,
    },
  }

  win = new BrowserWindow(options)

  mainWindowState.manage(win)

  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(async () => {
  await installExtension(VUEJS3_DEVTOOLS)
  ipcMain.handle('openFolderDialog', async () => {
    const options = {
      properties: ['openDirectory']
    }
    const pathsArray = await dialog.showOpenDialog(win, options)
    await parseArtistFolder(pathsArray)
    return store.get('artists', [])
  })

  ipcMain.handle('getCollection', async () => {
    return store.get('artists', [])
  })

  ipcMain.handle('saveCollection', async (event, collection) => {
    store.set('artists', JSON.parse(collection))
  })

  ipcMain.handle('clearCollection', async () => {
    store.clear()
    return store.get('artists', [])
  })

  ipcMain.handle('playTrack', async (event, track) => {
    console.log(track)
  })

  await createWindow()
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {

    },
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}/#${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})
