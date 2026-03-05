import dayjs from 'dayjs'
// https://github.com/iamkun/dayjs/tree/dev/src/locale
import 'dayjs/locale/ja'
import { useContext, useEffect, useState } from 'react'
import { Button, Divider, Input, Popover, useToaster, Whisper } from 'rsuite'
import { Icon } from '@rsuite/icons'
import { BsGear, BsSun, BsX } from 'react-icons/bs'
import { FormattedMessage, useIntl } from 'react-intl'
import { Context } from '@/theme'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(LocalizedFormat)
import { timezones } from '@/utils/timezones'

interface Props {
	isShow: boolean
	setIsShow: (v: boolean) => void
	isOnlyOne: boolean
}
const Clock: React.FC<Props> = (props) => {
	const [ntp, setNtp] = useState('ntp.nict.jp')
	const [timezone, setTimezone] = useState(dayjs.tz.guess())
	const { formatMessage } = useIntl()
	const { theme } = useContext(Context)
	const isDark = theme === 'dark'
	const { isShow, setIsShow, isOnlyOne } = props
	const [diff, setDiff] = useState<number>(0)
	const [clock, setClock] = useState<number>(Date.now())
	const toaster = useToaster()
	const get = (key: string) => {
		const config = JSON.parse(localStorage.getItem('clock') || '{}')
		return config[key] || null
	}
	const save = (key: string) => {
		const config = JSON.parse(localStorage.getItem('clock') || '{}')
		config[key] = key === 'ntpServer' ? ntp : timezone
		localStorage.setItem('clock', JSON.stringify(config))
		if (key === 'ntpServer') {
			window.electronAPI.getNtpTime(ntp)
		} else if (key === 'timezone') {
			setTimezone(timezone)
		}
	}

	useEffect(() => {
		if (!isShow) return
		window.electronAPI.currentNtpTime((event, data) => {
			if (data) {
				const ntpTime = new Date(data)
				const localTime = new Date()
				const diff = ntpTime.getTime() - localTime.getTime()
				setDiff(diff)
			}
		})
		window.electronAPI.getNtpTime(get('ntpServer') || 'ntp.nict.jp')
		const interval = setInterval(() => {
			console.log('fetching ntp time')
			window.electronAPI.getNtpTime(get('ntpServer') || 'ntp.nict.jp')
		}, 60000)
		const clockInterval = setInterval(() => {
			setClock(Date.now())
		}, 100)
		return () => {
			clearInterval(interval)
			clearInterval(clockInterval)
		}
	}, [isShow])
	useEffect(() => {
		const config = JSON.parse(localStorage.getItem('clock') || '{}')
		setNtp(config.ntpServer || 'ntp.nict.jp')
		setIsShow(config.isShow || false)
		setTimezone(config.timezone || dayjs.tz.guess())
	}, [])
	const badgeStyle = { backgroundColor: isDark ? 'var(--rs-gray-700)' : 'var(--rs-gray-300)', color: isDark ? 'white' : 'var(--rs-text-active)', fontSize: '0.7em', padding: '0 4px', borderRadius: 4 }
	const now = dayjs(clock + diff).tz(timezone)
	const tzOffsets = now.utcOffset() / 60
	const tzSign = tzOffsets >= 0 ? `+${tzOffsets}` : `-${tzOffsets}`
	const currentTz = timezones.find((tz) => tz.timezone === timezone)
	const isSummerTime = tzOffsets !== currentTz.offset
	return (
		<>
			{isShow ? (
				<div style={{ color: isDark ? 'white' : 'var(--rs-text-active)', display: 'flex', alignItems: 'center' }}>
					<div style={{ fontSize: '1.3em', marginLeft: 4, marginRight: 4 }}>{dayjs(now).format('LTS')}</div>
					<div>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<span style={badgeStyle} title={formatMessage({ id: `widget.clock.ntpHint${diff >= 0 ? 'Ahead' : 'Behind'}` }, { sec: Math.floor(Math.abs(diff) / 100) / 10, server: ntp })}>
									NTP
								</span>
								<div style={{ width: 2 }} />
								<span style={badgeStyle} title={timezone}>
									{tzSign}
									{isSummerTime && <Icon as={BsSun} style={{ transform: 'translateY(-1px)' }} />}
								</span>
							</div>
							<Whisper
								placement="top"
								controlId="control-id-context-menu"
								trigger="click"
								preventOverflow={true}
								speaker={({ className, left, top, onClose }, ref) => (
									<Popover ref={ref} className={className} style={{ left, top, padding: 10, marginLeft: 10 }}>
										<div style={{ padding: 10 }}>
											<FormattedMessage id="widget.clock.ntpServer" />
											<Input value={ntp} onChange={(value) => setNtp(value)} onBlur={() => save('ntpServer')} />
											<Divider style={{ margin: '8px 0' }} />
											<FormattedMessage id="widget.clock.timezone" />
											<select value={timezone} className="rs-input" onChange={(e) => setTimezone(e.target.value)} onBlur={() => save('timezone')} style={{ width: '100%' }}>
												{timezones.map((tz) => (
													<option key={tz.timezone} value={tz.timezone}>
														{tz.name}
													</option>
												))}
											</select>
											<Divider style={{ margin: '8px 0' }} />
											<Button block appearance="ghost" onClick={() => setIsShow(false)}>
												<Icon as={BsX} />
												<span style={{ marginLeft: 4 }}>
													<FormattedMessage id="widget.hide" />
												</span>
											</Button>
										</div>
									</Popover>
								)}
							>
								<Button appearance="subtle" size="xs" style={{ marginLeft: 8 }}>
									<Icon as={BsGear} />
								</Button>
							</Whisper>
						</div>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							{now.format('l')}({now.format('ddd')})
						</div>
					</div>
					{!isOnlyOne && <div style={{ height: 24, marginLeft: 8, marginRight: 8, borderRightWidth: 1, borderRightColor: 'var(--rs-gray-300)', borderRightStyle: 'solid' }} />}
				</div>
			) : null}
		</>
	)
}

export default Clock
