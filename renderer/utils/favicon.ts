import * as cheerio from 'cheerio'
import superagent from 'superagent'
import url from 'url'
const sizeCalc = (size: string) => {
	const [x, y] = size.split('x').map((e) => parseInt(e))
	return (x || 0) * (y || 0)
}
export async function getFavicon(domain: string) {
	try {
		const instanceData = await fetch(`https://${domain}/api/v2/instance`)
		const instance = await instanceData.json()
		const icons = instance.icon
		if (!icons || icons.length === 0) throw new Error('No icon found from instance meta data')
		const sortedIcons = icons.sort((a: any, b: any) => sizeCalc(b.size) - sizeCalc(a.size))
		return sortedIcons[0].src
	} catch {
		let file = null
		const result = await superagent.get(`https://${domain}`)
		const $ = cheerio.load(result.text)
		file = $('link[rel=icon]').attr('href')
		if (!file) file = 'favicon.ico'
		file = url.resolve(`https://${domain}`, file)
		return file
	}
}
