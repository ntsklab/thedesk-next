import { useContext, useEffect, useState } from 'react'
import { useToaster, Image, Progress } from 'rsuite'
import { Icon } from '@rsuite/icons'
import { BsCpu, BsMemory } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import { Context } from '@/theme'
import { getUnknownAA, nowplaying } from '@/utils/nowplaying'

interface Props {
	isShow: boolean
	setIsShow: (v: boolean) => void
	isOnlyOne: boolean
}
type IFile = { text: string; file: File; title: string; song: string; album: string; artist: string; isPlaying?: boolean; position?: number; duration?: number }
const AppleMusic: React.FC<Props> = (props) => {
	const { formatMessage } = useIntl()
	const { theme } = useContext(Context)
	const isDark = theme === 'dark'
	const { isShow, setIsShow, isOnlyOne } = props
	const toaster = useToaster()
	const [info, setInfo] = useState<IFile | null>(null)
	const get = async () => {
		console.log('fetching apple music info')
		const data = await nowplaying('appleMusic', (message, duration) => {})
		if (!data) return
		setInfo(data)
	}
	const artwork = async () => {
		if (!info || info.file) return
		const langStr = localStorage.getItem('lang') || 'en-US'
		const [_, country] = langStr.split('-')
		const file = await getUnknownAA(`${info.title} ${info.album}`, country || 'US')
		if (file) setInfo({ ...info, file })
	}
	useEffect(() => {
		if (!isShow) return
		get()
		const interval = setInterval(() => get(), 2000)
		return () => {
			clearInterval(interval)
		}
	}, [isShow])
	useEffect(() => {
		const config = JSON.parse(localStorage.getItem('appleMusic') || '{}')
		setIsShow(config.isShow || false)
	}, [])
	return (
		<>
			{isShow ? (
				<div style={{ color: isDark ? 'white' : 'var(--rs-text-active)', display: 'flex', alignItems: 'center', marginLeft: 4, marginRight: 4 }}>
					{info && info.song && (
						<div style={{ display: 'flex', alignItems: 'center' }}>
							{info.file ? <div>
								<Image src={URL.createObjectURL(info.file)} alt="cover" width={30} height={30} style={{ borderRadius: 10, marginRight: 8 }} />
							</div> : <div style={{ width: 30, height: 30, borderRadius: 10, marginRight: 8, backgroundColor: isDark ? 'var(--rs-gray-700)' : 'var(--rs-gray-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={artwork}>
								?
							</div>}
							<div>
								<div style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{info.song}</div>
								<div style={{ fontSize: '0.8em', color: isDark ? 'var(--rs-gray-300)' : 'var(--rs-gray-700)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
									{info.album} - {info.artist}
								</div>
							</div>
						</div>
					)}
					{!isOnlyOne && <div style={{ height: 24, marginLeft: 8, marginRight: 8, borderRightWidth: 1, borderRightColor: 'var(--rs-gray-300)', borderRightStyle: 'solid' }} />}
				</div>
			) : null}
		</>
	)
}

export default AppleMusic
