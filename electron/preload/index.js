const Store = require('electron-store')
const { contextBridge, ipcRenderer } = require('electron')

const store = new Store()

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => ipcRenderer.invoke(channel, data),
  handle: (channel, callback, event, data) => ipcRenderer.on(channel, callback(event, data)),
  getStore: () => store.get('artists')
})
