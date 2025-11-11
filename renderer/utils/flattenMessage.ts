export function flattenMessages(nestedMessages: { [key: string]: any }, prefix = ''): { [key: string]: string } {
	return Object.keys(nestedMessages).reduce((messages, key) => {
		const value = nestedMessages[key]
		const prefixedKey = prefix ? `${prefix}.${key}` : key

		if (typeof value === 'string') {
			messages[prefixedKey] = value
		} else {
			// biome-ignore lint/performance/noAccumulatingSpread: <unknown>
			Object.assign(messages, flattenMessages(value, prefixedKey))
		}

		return messages
	}, {})
}
