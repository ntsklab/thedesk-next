const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
	writeText: (text: string) => {
		ipcRenderer.send('writeText', text)
	},
	openBrowser: (url: string) => {
		ipcRenderer.send('openBrowser', url)
	},
	openAppDataFolder: () => {
		ipcRenderer.send('openAppDataFolder')
	},
	requestInitialInfo: (init: boolean) => {
		ipcRenderer.send('requestInitialInfo', init)
	},
	requestAppleMusic: (fallback: boolean) => {
		ipcRenderer.send('requestAppleMusic', { fallback })
	},
	imageOperation: (image: string, operation: 'copy' | 'download') => {
		ipcRenderer.send('imageOperation', { image, operation })
	},
	fetch: () => {
		ipcRenderer.send('fetch')
	},
	hardRefresh: () => {
		ipcRenderer.send('hardRefresh')
	},
	onInitialInfo: (callback: (event: Electron.IpcRendererEvent, data: any) => void) => {
		ipcRenderer.on('initialInfo', callback)
	},
	appleMusic: (callback: (event: Electron.IpcRendererEvent, data: any) => void) => {
		ipcRenderer.on('appleMusic', callback)
	},
	customUrl: (callback: (event: Electron.IpcRendererEvent, data: any) => void) => {
		ipcRenderer.on('customUrl', callback)
	},
	fetchFinish: (callback: (event: Electron.IpcRendererEvent, data: any) => void) => {
		ipcRenderer.on('fetchFinish', callback)
	},
})
export type {}
