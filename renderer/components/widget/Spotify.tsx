import { useContext, useEffect, useMemo, useState } from 'react'
import { useToaster, Image, Progress } from 'rsuite'
import { Icon } from '@rsuite/icons'
import { BsCpu, BsMemory } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import { Context } from '@/theme'
import { INowPlaying, nowplaying } from '@/utils/nowplaying'

interface Props {
	isShow: boolean
	setIsShow: (v: boolean) => void
	isOnlyOne: boolean
}
const Spotify: React.FC<Props> = (props) => {
	const { formatMessage } = useIntl()
	const { theme } = useContext(Context)
	const isDark = theme === 'dark'
	const { isShow, setIsShow, isOnlyOne } = props
	const toaster = useToaster()
	const [info, setInfo] = useState<INowPlaying | null>(null)
	const [position, setPosition] = useState(0)
	const get = async () => {
		const data = await nowplaying('spotify', (message, duration) => {})
		if (!data) return
		setInfo(data)
		setPosition(data.position || 0)
	}
	useEffect(() => {
		if (!info || !info.duration || !info.isPlaying) return
		if (position - 1000 >= info.duration) {
			get()
		}
		if (!info.isPlaying) return
		const interval = setTimeout(() => {
			setPosition((v) => v + 1000)
		}, 1000)
		return () => clearTimeout(interval)
	}, [info, position])
	useEffect(() => {
		if (!isShow) return
		get()
		const interval = setInterval(() => get(), 30000)
		return () => {
			clearInterval(interval)
		}
	}, [isShow])
	useEffect(() => {
		const config = JSON.parse(localStorage.getItem('spotify') || '{}')
		setIsShow(config.isShow || false)
	}, [])
	const file = info && info.file ? info.file : null
	const MemorizedImage = useMemo(() => {
		const image = file ? URL.createObjectURL(file) : null
		return <Image src={image} alt="cover" width={30} height={30} style={{ borderRadius: 10, marginRight: 8, cursor: 'pointer' }} />
	}, [file])
	const percent = info && (info.duration ? ((position || 0) / info.duration) * 100 : 0)
	return (
		<>
			{isShow ? (
				<div style={{ color: isDark ? 'white' : 'var(--rs-text-active)', display: 'flex', alignItems: 'center', marginLeft: 4, marginRight: 4 }}>
					{info && info.song && (
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<div title={formatMessage({ id: 'widget.spotify.hint' })} onClick={() => get()}>
								{MemorizedImage}
							</div>
							<div>
								<div style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{info.song}</div>
								<div style={{ fontSize: '0.8em', color: isDark ? 'var(--rs-gray-300)' : 'var(--rs-gray-700)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
									{info.album} - {info.artist}
								</div>
								<Progress style={{ padding: 0 }} status={info.isPlaying ? 'active' : 'success'} strokeWidth={2} showInfo={false} percent={percent} />
							</div>
						</div>
					)}
					{!isOnlyOne && <div style={{ height: 24, marginLeft: 8, marginRight: 8, borderRightWidth: 1, borderRightColor: 'var(--rs-gray-300)', borderRightStyle: 'solid' }} />}
				</div>
			) : null}
		</>
	)
}

export default Spotify
