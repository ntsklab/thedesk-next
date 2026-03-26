export interface InitialInfo {
	os: string
	arch: string
	lang: string[]
	version: string
	fonts: string[]
	isFirstRun: boolean
	currentRendererAbsolutePath: string
	isStore: boolean
	isMas: boolean
	isAppx: boolean
	getPath: string
}
