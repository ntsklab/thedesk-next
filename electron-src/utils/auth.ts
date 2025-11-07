import { BrowserWindow } from 'electron'
import { AuthRequest } from 'electron-native-auth'

export const auth = async (url: string, callbackScheme: string, window: BrowserWindow) => {
	if (AuthRequest.isAvailable()) {
		const req = new AuthRequest({
			url,
			callbackScheme,
			windowHandle: window.getNativeWindowHandle()
		})

		const result = await req.start()
        return result
	} else {
		console.error('Native auth request unavailable :(')
	}
}
