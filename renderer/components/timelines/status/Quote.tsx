import type { Entity } from '@cutls/megalodon'
import Image from 'next/image'
import { Avatar, Button, FlexboxGrid, Panel } from 'rsuite'

import FailoverImg from '@/utils/failoverImg'
import { open } from '@/utils/openBrowser'
import emojify from '@/utils/emojify'
import Time from '@/components/utils/Time'
import { FormattedMessage } from 'react-intl'

type Props = {
	status: Entity.Status
	state: Entity.Status['quote_status_state']
	setStatusDetail?: () => void
	isAnimeIcon: boolean
}
const stripForQuote = (html: string) => {
	const div = document.createElement('div')
	div.innerHTML = html
	const text = div.textContent || div.innerText || ''
	const protomatch = /(https?|ftp):\/\//g
	const b = text.replace(protomatch, '').replace(/:[a-zA-Z0-9_]:/g, '')
	return b
}
const Quote: React.FC<Props> = (props) => {
	const status = props.status
	const state = props.state
	const str = `timeline.quote_state.${state}`
	const onClick = () => props.setStatusDetail()

	return state === 'accepted' ? (
		<Panel bordered bodyFill onClick={onClick} style={{ cursor: 'pointer', marginTop: '0.2em', padding: 5 }} className="link-preview-panel">
			<div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em', justifyContent: 'space-between' }}>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Avatar src={props.isAnimeIcon ? status.account.avatar : status.account.avatar_static} title={status.account.acct} alt={status.account.acct} size="xs" />
					<span dangerouslySetInnerHTML={{ __html: emojify(status.account.display_name, status.account.emojis) }} style={{ marginLeft: 2 }} />
					<span style={{ color: 'var(--rs-text-tertiary)' }}>@{status.account.acct}</span>
				</div>
				<Time style={{ color: 'var(--rs-text-tertiary)' }} time={status.created_at} />
			</div>
			<p>{stripForQuote(status.content)}</p>
		</Panel>
	) : (
		<Panel bordered bodyFill style={{ marginTop: '0.2em', padding: 5 }}>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<FormattedMessage id={str} />
				{status && <Button appearance="subtle" size="sm" onClick={onClick}>
					<FormattedMessage id="timeline.quote_state.view" />
				</Button>}
			</div>
		</Panel>
	)
}

export default Quote
