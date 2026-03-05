import { useContext, useEffect, useState } from 'react'
import { useToaster } from 'rsuite'
import { Icon } from '@rsuite/icons'
import { BsCpu, BsMemory } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import { Context } from '@/theme'
interface SystemInfo {
	cpu: {
		model: string
		speed: number
		times: {
			user: number
			nice: number
			sys: number
			idle: number
			irq: number
		}
	}
	memory: number
	freeMemory: number
	uptime: number
}
interface Props {
	isShow: boolean
	setIsShow: (v: boolean) => void
	isOnlyOne: boolean
}
const System: React.FC<Props> = (props) => {
	const { formatMessage } = useIntl()
	const { theme } = useContext(Context)
	const isDark = theme === 'dark'
	const { isShow, setIsShow, isOnlyOne } = props
	const toaster = useToaster()
	const [info, setInfo] = useState<SystemInfo | null>(null)

	useEffect(() => {
		if (!isShow) return
		window.electronAPI.currentSystemInfo((event, data) => {
			setInfo(data)
		})
		window.electronAPI.getSystemInfo()
		const interval = setInterval(() => window.electronAPI.getSystemInfo(), 2000)
		return () => clearInterval(interval)
	}, [isShow])
	useEffect(() => {
		const config = JSON.parse(localStorage.getItem('system') || '{}')
		setIsShow(config.isShow || false)
	}, [])
	const usedMemory = info ? info.memory - info.freeMemory : 0
	const toGB = (v: number) => (v / 1024 / 1024 / 1024).toFixed(2)
	return (
		<>
			{isShow ? (
				<div style={{ color: isDark ? 'white' : 'var(--rs-text-active)', display: 'flex', alignItems: 'center', marginLeft: 4, marginRight: 4 }}>
					{info && (
						<div>
							<div>
								<Icon as={BsCpu} style={{ marginRight: 4 }} />
								{info.cpu.model} {(info.cpu.speed / 1000).toFixed(2)} GHz
							</div>
							<div>
								<Icon as={BsMemory} style={{ marginRight: 4 }} />
								{toGB(usedMemory)} GB / {toGB(info.memory)} GB
							</div>
						</div>
					)}
					{!isOnlyOne && <div style={{ height: 24, marginLeft: 8, marginRight: 8, borderRightWidth: 1, borderRightColor: 'var(--rs-gray-300)', borderRightStyle: 'solid' }} />}
				</div>
			) : null}
		</>
	)
}

export default System
