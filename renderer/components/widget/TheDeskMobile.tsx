import { useContext, useEffect, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { BsQrCode, BsX } from 'react-icons/bs'
import { Context } from '@/theme'
import { FormattedMessage } from 'react-intl'
import qr from '../../../assets/thedesk-ios.png'

type IconButtonProps = {
	onClick: (e: React.MouseEvent) => void
	ariaLabel: string
	hoverBg: string
	color: string
	size?: number
	iconSize?: number
	style?: CSSProperties
	children: React.ReactNode
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, ariaLabel, hoverBg, color, size = 24, style, children }) => {
	const [hover, setHover] = useState(false)
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={ariaLabel}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={{
				width: size,
				height: size,
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				border: 'none',
				borderRadius: 6,
				background: hover ? hoverBg : 'transparent',
				color,
				cursor: 'pointer',
				padding: 0,
				transition: 'background 120ms ease',
				...style,
			}}
		>
			{children}
		</button>
	)
}

const TheDeskMobile: React.FC = () => {
	const { theme } = useContext(Context)
	const isDark = theme === 'dark'
	const [isShow, setIsShow] = useState(true)
	const [isShowQR, setIsShowQR] = useState(false)

	const isHidden = () => {
		const now = Date.now()
		const last = localStorage.getItem('lastHideMobile')
		if (!last) return false
		const lastTime = parseInt(last, 10)
		return now - lastTime < 1000 * 60 * 60 * 24 * 30 // 30 days
	}
	const hide = () => {
		localStorage.setItem('lastHideMobile', Date.now().toString())
		setIsShow(false)
	}

	useEffect(() => {
		setIsShow(!isHidden())
	}, [])

	useEffect(() => {
		if (!isShowQR) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsShowQR(false)
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [isShowQR])

	if (!isShow) return null

	const textColor = isDark ? '#fff' : 'var(--rs-text-active)'
	const subtleBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
	const hoverBg = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'

	const bannerStyle: CSSProperties = {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		gap: 8,
		color: textColor,
		background: subtleBg,
		borderRadius: 6,
		padding: '6px 22px 6px 8px',
		margin: '2px 4px',
	}

	const textBlockStyle: CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		gap: 2,
		lineHeight: 1.2,
	}

	const titleStyle: CSSProperties = {
		fontSize: '0.85rem',
		fontWeight: 600,
	}

	const bodyStyle: CSSProperties = {
		fontSize: '0.75rem',
		opacity: 0.75,
	}

	const dismissStyle: CSSProperties = {
		position: 'absolute',
		top: 2,
		right: 2,
	}

	const overlayStyle: CSSProperties = {
		position: 'fixed',
		inset: 0,
		backgroundColor: 'rgba(0,0,0,0.6)',
		backdropFilter: 'blur(4px)',
		WebkitBackdropFilter: 'blur(4px)',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 9999,
	}

	const qrCardStyle: CSSProperties = {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: 12,
		background: '#fff',
		borderRadius: 16,
		padding: 24,
		maxWidth: 280,
		boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
	}

	const qrLabelStyle: CSSProperties = {
		margin: 0,
		fontWeight: 600,
		fontSize: 14,
		color: '#111',
	}

	const closeStyle: CSSProperties = {
		position: 'absolute',
		top: 8,
		right: 8,
	}

	return (
		<>
			<div style={bannerStyle}>
				<IconButton
					onClick={() => setIsShowQR(true)}
					ariaLabel="Show QR code for TheDesk iOS"
					hoverBg={hoverBg}
					color={textColor}
					size={24}
				>
					<BsQrCode size={16} />
				</IconButton>
				<div style={textBlockStyle}>
					<span style={titleStyle}>
						<FormattedMessage id="navigator.thedeskIos.title" />
					</span>
					<span style={bodyStyle}>
						<FormattedMessage id="navigator.thedeskIos.text" />
					</span>
				</div>
				<IconButton
					onClick={hide}
					ariaLabel="Dismiss"
					hoverBg={hoverBg}
					color={textColor}
					size={18}
					style={dismissStyle}
				>
					<BsX size={14} />
				</IconButton>
			</div>
			{isShowQR && (
				<div style={overlayStyle} onClick={() => setIsShowQR(false)}>
					<div style={qrCardStyle} onClick={(e) => e.stopPropagation()}>
						<IconButton
							onClick={() => setIsShowQR(false)}
							ariaLabel="Close"
							hoverBg="rgba(0,0,0,0.08)"
							color="#111"
							size={26}
							style={closeStyle}
						>
							<BsX size={18} />
						</IconButton>
						<Image src={qr} alt="QR Code linking to TheDesk on the App Store" width={200} height={200} />
						<p style={qrLabelStyle}>App Store</p>
					</div>
				</div>
			)}
		</>
	)
}

export default TheDeskMobile
