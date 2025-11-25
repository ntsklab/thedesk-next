import { Icon } from '@rsuite/icons'
import Image from 'next/image'
import { BsGithub } from 'react-icons/bs'
import { FormattedMessage } from 'react-intl'
import { Button, FlexboxGrid, Heading, List, Modal } from 'rsuite'
import { open } from '@/utils/openBrowser'
import desk from '../../../assets/desk.png'
import { packages, thirdparty } from '../../thirdparty'

type Props = {
	open: boolean
	onClose: () => void
}
const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<span
			style={{
				display: 'inline-block',
				padding: '3px 7px',
				margin: '0 2px',
				fontSize: '0.9em',
				lineHeight: '1.4',
				fontWeight: 'bold',
				color: 'black',
				backgroundColor: '#EDF2F7',
				borderRadius: '4px',
				boxShadow: 'inset 0 -1px 0 rgba(0,0,0,.25)',
				fontFamily: 'ui-monospace, monospace'
			}}
		>
			{children}
		</span>
	)
}
const KbdShortcut: React.FC<Props> = (props) => {
	return (
		<Modal backdrop="static" keyboard={true} open={props.open} onClose={props.onClose}>
			<Modal.Header>
				<Heading>
					<FormattedMessage id="settings.kbd.title" />
				</Heading>
			</Modal.Header>
			<Modal.Body>
				<div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
					<div style={{ width: 40, display: 'flex', justifyContent: 'flex-end' }}>
						<Kbd>N</Kbd>
					</div>
					:<FormattedMessage id="settings.kbd.n" />
				</div>
				<div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
					<div style={{ width: 40, display: 'flex', justifyContent: 'flex-end' }}>
						<Kbd>M</Kbd>
					</div>
					:<FormattedMessage id="settings.kbd.m" />
				</div>
				<div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
					<div style={{ width: 40, display: 'flex', justifyContent: 'flex-end' }}>
						<Kbd>Esc</Kbd>
					</div>
					:<FormattedMessage id="settings.kbd.esc" />
				</div>
				<div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
					<div style={{ width: 40, display: 'flex', justifyContent: 'flex-end' }}>
						<Kbd>S</Kbd>
					</div>
					:<FormattedMessage id="settings.kbd.s" />
				</div>
				<div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
					<div style={{ width: 100, display: 'flex', justifyContent: 'flex-end' }}>
						<Kbd>Ctrl</Kbd>+<Kbd>Enter</Kbd>
					</div>
					:<FormattedMessage id="settings.kbd.ctrlEnter" />
				</div>
			</Modal.Body>
		</Modal>
	)
}

export default KbdShortcut
