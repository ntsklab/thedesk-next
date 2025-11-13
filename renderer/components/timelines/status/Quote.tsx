import type { Entity } from '@cutls/megalodon'
import { Avatar, Button, Panel } from 'rsuite'

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
			<div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em', justifyContent: 'flex-start' }}>
				<div style={{ width: '10%' }}>
					<Avatar src={props.isAnimeIcon ? status.account.avatar : status.account.avatar_static} title={status.account.acct} alt={status.account.acct} size="xs" />
				</div>
				<div style={{ width: '70%', display: 'flex', alignItems: 'center' }}>
					<p
						dangerouslySetInnerHTML={{ __html: emojify(status.account.display_name, status.account.emojis) }}
						style={{ marginLeft: 2, overflow: 'hidden', width: '70%', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
					/>
					<p style={{ color: 'var(--rs-text-tertiary)', marginLeft: 2, marginTop: 0, width: '30%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{status.account.acct}</p>
				</div>
				<div style={{ width: '20%', display: 'flex', justifyContent: 'flex-end' }}>
					<Time style={{ color: 'var(--rs-text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} time={status.created_at} />
				</div>
			</div>
			<p dangerouslySetInnerHTML={{ __html: emojify(stripForQuote(status.content), status.emojis) }} />
		</Panel>
	) : (
		<Panel bordered bodyFill style={{ marginTop: '0.2em', padding: 5 }}>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<FormattedMessage id={str} />
				{status && (
					<Button appearance="subtle" size="sm" onClick={onClick}>
						<FormattedMessage id="timeline.quoteState.view" />
					</Button>
				)}
			</div>
		</Panel>
	)
}

export default Quote
