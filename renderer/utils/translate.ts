import type { Settings as SettingsType } from '@/entities/settings'

export const translate = async (timelineConfig: SettingsType['timeline'], content: string) => {
	const language = localStorage.getItem('lang') || window.navigator.language
	const provider = timelineConfig.translateProvider
	const endpoint = timelineConfig.translateEndpoint
	const model = timelineConfig.translateModel
	const key = timelineConfig.translateKey
	const prompt = timelineConfig.translatePrompt

	if (!endpoint || !model || !key) throw null
	if (provider !== 'deepl' && provider !== 'deeplPro') {
		const body = {
			model,
			messages: [
				{
					role: 'user',
					content: prompt.replace('{language}', language).replace('{content}', content)
				}
			]
		}
		const req = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${key}`
			},
			body: JSON.stringify(body)
		})
		const res = await req.json()
		return res.choices[0].message.content.trim()
	} else {
        const langSplit = language.split('-')[0]
		const body = { text: [content], target_lang: langSplit.toUpperCase() }
		const deepl = provider === 'deeplPro' ? `https://api.deepl.com/v2/translate` : 'https://api-free.deepl.com/v2/translate'
		const req = await fetch(deepl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `DeepL-Auth-Key ${key}`
			},
			body: JSON.stringify(body)
		})
		const res = await req.json()
        return res.translations[0].text.trim()
	}
}
