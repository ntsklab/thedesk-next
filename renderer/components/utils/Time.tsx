import dayjs from 'dayjs'
// https://github.com/iamkun/dayjs/tree/dev/src/locale
import 'dayjs/locale/ja'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import { type HTMLAttributes, useContext } from 'react'
import { TheDeskContext } from '@/context'
import { Context } from '@/i18n'

type Props = {
	time: string
	onClick?: (e: any) => void
} & HTMLAttributes<HTMLElement>

const parseDatetime = (timestamp: string) => {
	dayjs.extend(updateLocale)
	dayjs.updateLocale('en', {
		relativeTime: {
			future: 'in %s',
			past: '%s ago',
			s: 'now',
			m: '%ds',
			mm: '%dm',
			h: '%dm',
			hh: '%dh',
			d: '%dh',
			dd: '%dd',
			M: 'a month',
			MM: '%d months',
			y: 'a year',
			yy: '%d years'
		}
	})
	dayjs.extend(relativeTime)
	return dayjs(timestamp).fromNow(true)
}

export const calcFromNow = (time: Date, isJa: boolean) => {
	const sec = (Date.now() - time.getTime()) / 1000
	if (sec < 60) return isJa ? '1分未満' : '< 1 min'
	if (sec < 3600) {
		const m = Math.floor(sec / 60)
		return isJa ? `${m}分前` : `${m} min`
	}
	if (sec < 86400) {
		const h = Math.floor(sec / 3600)
		return isJa ? `${h}時間前` : `${h} h`
	}
	if (sec < 86400 * 30) {
		const d = Math.floor(sec / 86400)
		return isJa ? `${d}日前` : `${d} d`
	}
	if (sec < 86400 * 365) {
		const m = Math.floor(sec / (86400 * 30))
		return isJa ? `${m}ヶ月前` : `${m} mo`
	}
	const y = Math.floor(sec / (86400 * 365))
	return isJa ? `${y}年前` : `${y} y`
}

const Time: React.FC<Props> = (props) => {
	const { timelineConfig } = useContext(TheDeskContext)
	const { currentLang } = useContext(Context)
	const fullday = dayjs(props.time).format('YYYY/M/D H:mm:ss (A h:mm:ss)')
	const absStyle = { ...props.style, fontSize: '0.8rem' }
	const absProps = {
		title: fullday,
		style: absStyle,
		onClick: props.onClick
	}
	if (timelineConfig.time === 'absolute') {
		if (dayjs(props.time).year() !== dayjs().year()) return <time {...absProps}>{dayjs(props.time).format('YYYY/M/D H:mm')}</time>
		if (dayjs(props.time).month() !== dayjs().month()) return <time {...absProps}>{dayjs(props.time).format('M/D H:mm')}</time>
		if (dayjs(props.time).date() !== dayjs().date()) return <time {...absProps}>{dayjs(props.time).format('M/D H:mm')}</time>
		return <time {...absProps}>{dayjs(props.time).format('H:mm:ss')}</time>
	}
	if (timelineConfig.time === '12h') {
		if (dayjs(props.time).year() !== dayjs().year()) return <time {...absProps}>{dayjs(props.time).format('YYYY/M/D A h:mm')}</time>
		if (dayjs(props.time).month() !== dayjs().month()) return <time {...absProps}>{dayjs(props.time).format('M/D A h:mm')}</time>
		if (dayjs(props.time).date() !== dayjs().date()) return <time {...absProps}>{dayjs(props.time).format('M/D A h:mm')}</time>
		return <time {...absProps}>{dayjs(props.time).format('A h:mm:ss')}</time>
	}
	return (
		<time dateTime={dayjs(props.time).format('YYYY-MM-DD HH:mm:ss')} title={fullday} style={props.style} onClick={props.onClick}>
			{calcFromNow(new Date(props.time), currentLang === 'ja')}
		</time>
	)
}

export default Time
