import type { HTMLAttributes, ReactElement } from 'react'
import { Button, IconButton } from 'rsuite'

type Props = {
	icon: ReactElement
	count?: number
	onClick?: () => void
	disabled?: boolean
	className?: string
	activating?: boolean
	deactivating?: boolean
} & HTMLAttributes<HTMLElement>

const ActionButton: React.FC<Props> = (props) => {
	const className = () => {
		if (props.activating) return 'activating'
		if (props.deactivating) return 'deactivating'
		return ''
	}
	if (typeof props.count === 'number')
		return (
			<Button appearance="link" className={`${props.className} no-line-link ${className()}`} onClick={props.onClick} disabled={props.disabled} title={props.title}>
				{props.icon}
				<span style={{ marginLeft: 2, marginTop: 2 }}>{props.count}</span>
			</Button>
		)
	if (props.count === null)
		return (
			<Button appearance="link" className={`${props.className} no-line-link ${className()}`} onClick={props.onClick} disabled={props.disabled} title={props.title}>
				{props.icon}
				<span style={{ marginLeft: 2, marginTop: 2, opacity: 0 }}>0</span>
			</Button>
		)
	return <IconButton appearance="link" className={`${props.className} ${className()}`} icon={props.icon} onClick={props.onClick} disabled={props.disabled} title={props.title} />
}

export default ActionButton
