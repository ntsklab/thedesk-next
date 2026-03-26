import { useContext, useEffect, useState } from 'react'
import { Button, useToaster } from 'rsuite'
import Image from 'next/image'
import { Icon } from '@rsuite/icons'
import { BsCpu, BsMemory, BsQrCode, BsX } from 'react-icons/bs'
import { Context } from '@/theme'
import { FormattedMessage } from 'react-intl'
import qr from '../../../assets/thedesk-ios.png'

const TheDeskMobile: React.FC = (props) => {
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
	return (
		<>
			{isShow ? (
				<div style={{ color: isDark ? 'white' : 'var(--rs-text-active)', display: 'flex', alignItems: 'center', marginLeft: 4, marginRight: 4, paddingLeft: 4, paddingRight: 4 }}>
					<div style={{ marginRight: 8, cursor: 'pointer' }} onClick={() => setIsShowQR(true)}>
						<BsQrCode size={15} />
					</div>
					<div>
						<p style={{ fontWeight: 'bold', fontSize: '1rem', marginTop: 0 }}>
							<FormattedMessage id="navigator.thedeskIos.title" />
							<Button appearance="subtle" size="xs" style={{ marginLeft: 8 }} onClick={() => hide()}>
								<Icon as={BsX} />
							</Button>
						</p>
						<p style={{ marginTop: 0 }}>
							<FormattedMessage id="navigator.thedeskIos.text" />
						</p>
					</div>
					{isShowQR && (
						<div
							style={{
								position: 'fixed',
								width: '100vw',
								height: '100vh',
								top: 0,
								left: 0,
								backgroundColor: 'rgba(0,0,0,0.5)',
                                flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								zIndex: 9999,
								display: 'flex',
								alignContent: 'center',
								justifyItems: 'center'
							}}
							onClick={() => setIsShowQR(false)}
						>
							<Image src={qr} alt="QR Code" width={200} height={200} />
                            <p>AppStore</p>
						</div>
					)}
				</div>
			) : null}
		</>
	)
}

export default TheDeskMobile
