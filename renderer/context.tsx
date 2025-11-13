import { createContext, useState } from 'react'
import { defaultSetting, type Settings } from './entities/settings'
import type { Reply } from './entities/reply'

export const TheDeskContext = createContext({
	timelineConfig: defaultSetting.timeline,
	saveTimelineConfig: (_config: Settings['timeline']) => {},
	focused: false,
	setFocused: (_focused: boolean) => {},
	reply: null as (Reply | null),
	setReply: (_d: Reply | null) => {}
})
export const TimelineRefreshContext = createContext({
	timelineRefresh: (_str: boolean) => {}
})
export const TheDeskProviderWrapper: React.FC = (props) => {
	const [focused, setFocused] = useState(false)
	const [timelineConfig, setTimelineConfig] = useState<Settings['timeline']>(defaultSetting.timeline)
	const saveTimelineConfig = (config: Settings['timeline']) => setTimelineConfig(config)
	const [reply, setReply] = useState<Reply | null>(null)

	return <TheDeskContext.Provider value={{ timelineConfig, saveTimelineConfig, focused, setFocused, reply, setReply }}>{props.children}</TheDeskContext.Provider>
}
