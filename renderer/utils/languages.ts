import languages from './languageNative.json'

type Language = {
	languageCode: string
	english: string
	native: string
	speakerRanking: number
	value: string
	label: string
}

export const languagesDefault = languages.map((d) => ({ ...d, value: d.languageCode, label: d.native })) as Array<Language>
export const sortedLanguages = structuredClone(languagesDefault).sort((a, b) => {
	if ((a.speakerRanking || 999) < (b.speakerRanking || 999)) return -1
	if ((a.speakerRanking || 999) > (b.speakerRanking || 999)) return 1
	return 0
})
