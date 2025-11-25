import type { Entity, MegalodonInterface } from '@cutls/megalodon'
import { Icon } from '@rsuite/icons'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { BsChatQuote, BsHash, BsPeople, BsSearch } from 'react-icons/bs'
import { FormattedMessage, useIntl } from 'react-intl'
import { Avatar, Form, Input, InputGroup, List, Loader } from 'rsuite'
import Status from '@/components/timelines/status/Status'
import { TheDeskContext } from '@/context'
import type { Account } from '@/entities/account'
import type { CustomEmojiCategory } from '@/entities/emoji'
import type { Server } from '@/entities/server'
import { mapCustomEmojiCategory } from '@/utils/emojiData'
import emojify from '@/utils/emojify'
import { GraphDraw } from '../utils/Graph'

type Props = {
	account: Account
	server: Server
	client: MegalodonInterface
	openMedia: (media: Array<Entity.Attachment>, index: number) => void
	openReport: (status: Entity.Status, client: MegalodonInterface) => void
	openFromOtherAccount: (status: Entity.Status) => void
	hideTrend: () => void
	setStatusDetail: (statusId: string, serverId: number, accountId?: number) => void
	setAccountDetail: (userId: string, serverId: number, accountId?: number) => void
	setTagDetail: (tag: string, serverId: number, accountId?: number) => void
}

export default function Results(props: Props) {
	const { formatMessage } = useIntl()
	const router = useRouter()

	const [word, setWord] = useState<string>('')
	const [accounts, setAccounts] = useState<Array<Entity.Account>>([])
	const [hashtags, setHashtags] = useState<Array<Entity.Tag>>([])
	const [statuses, setStatuses] = useState<Array<Entity.Status>>([])
	const [customEmojis, setCustomEmojis] = useState<Array<CustomEmojiCategory>>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { setFocused } = useContext(TheDeskContext)
	const { setStatusDetail, setAccountDetail, setTagDetail } = props
	const focusAttr = {
		onFocus: () => setFocused(true),
		onBlur: () => setFocused(false)
	}
	useEffect(() => {
		setWord('')
		setAccounts([])
		setHashtags([])
		setStatuses([])
	}, [props.client])

	const search = async (word: string) => {
		props.hideTrend()
		setIsLoading(true)
		try {
			const res = await props.client.search(word, { limit: 5, resolve: true })
			setAccounts(res.data.accounts)
			setHashtags(res.data.hashtags)
			setStatuses(res.data.statuses)
			const emojis = await props.client.getInstanceCustomEmojis()
			setCustomEmojis(mapCustomEmojiCategory(props.server.domain, emojis.data))
		} finally {
			setIsLoading(false)
		}
	}

	const loadMoreAccount = useCallback(async () => {
		const res = await props.client.search(word, { type: 'accounts', limit: 5, offset: accounts.length })
		setAccounts((prev) => prev.concat(res.data.accounts))
	}, [word, accounts])

	const loadMoreHashtag = useCallback(async () => {
		const res = await props.client.search(word, { type: 'hashtags', limit: 5, offset: hashtags.length })
		setHashtags((prev) => prev.concat(res.data.hashtags))
	}, [word, hashtags])

	const openUser = (user: Entity.Account) => {
		router.push({ query: { user_id: user.id, server_id: props.server.id, account_id: props.server.account_id } })
	}

	const openTag = (tag: Entity.Tag) => {
		router.push({ query: { tag: tag.name, server_id: props.server.id, account_id: props.server.account_id } })
	}

	const updateStatus = (status: Entity.Status) => {
		const renew = statuses.map((s) => {
			if (s.id === status.id) {
				return status
			}
			if (s.reblog && s.reblog.id === status.id) {
				return Object.assign({}, s, { reblog: status })
			}
			if (status.reblog && s.id === status.reblog.id) {
				return status.reblog
			}
			if (status.reblog && s.reblog && s.reblog.id === status.reblog.id) {
				return Object.assign({}, s, { reblog: status.reblog })
			}
			return s
		})
		setStatuses(renew)
	}
	return (
		<>
			<div style={{ margin: '12px 0' }}>
				<Form onCheck={() => search(word)}>
					<InputGroup inside>
						<Input id="search-input" placeholder={formatMessage({ id: 'search.placeholder' })} {...setFocused} value={word} onChange={(value) => setWord(value)} />
						<InputGroup.Button disabled={isLoading} onClick={() => search(word)}>
							{isLoading ? <Loader /> : <Icon as={BsSearch} />}
						</InputGroup.Button>
					</InputGroup>
				</Form>
			</div>
			{/* hashtags */}
			{hashtags.length > 0 && (
				<div style={{ width: '100%' }}>
					<div style={{ fontSize: '1.2em', margin: '0.4em 0' }}>
						<Icon as={BsHash} style={{ fontSize: '1.2em', marginRight: '0.2em' }} />
						<FormattedMessage id="search.results.hashtags" />
					</div>
					<List>
						{hashtags.map((tag) => (
							<List.Item
								key={tag.name}
								style={{ backgroundColor: 'var(--rs-border-primary)', padding: '4px', paddingRight: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
								title={`#${tag.name}`}
							>
								<div style={{ padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} onClick={() => openTag(tag)}>
									#{tag.name}
								</div>

								<GraphDraw his={tag.history} />
							</List.Item>
						))}
						<List.Item key="more" style={{ backgroundColor: 'var(--rs-border-primary)', padding: '1em 0', textAlign: 'center', cursor: 'pointer' }} onClick={() => loadMoreHashtag()}>
							<FormattedMessage id="search.results.more" />
						</List.Item>
					</List>
				</div>
			)}
			{/* accounts */}
			{accounts.length > 0 && (
				<div style={{ width: '100%' }}>
					<div style={{ fontSize: '1.2em', margin: '0.4em 0' }}>
						<Icon as={BsPeople} style={{ fontSize: '1.2em', marginRight: '0.2em' }} />
						<FormattedMessage id="search.results.accounts" />
					</div>
					<List>
						{accounts.map((account) => (
							<List.Item key={account.id} style={{ backgroundColor: 'var(--rs-border-primary)', padding: '4px 0' }}>
								<User user={account} open={openUser} />
							</List.Item>
						))}
						<List.Item key="more" style={{ backgroundColor: 'var(--rs-border-primary)', padding: '1em 0', textAlign: 'center', cursor: 'pointer' }} onClick={() => loadMoreAccount()}>
							<FormattedMessage id="search.results.more" />
						</List.Item>
					</List>
				</div>
			)}
			{/* statuses */}
			{statuses.length > 0 && (
				<div style={{ width: '100%' }}>
					<div style={{ fontSize: '1.2em', margin: '0.4em 0' }}>
						<Icon as={BsChatQuote} style={{ fontSize: '1.2em', marginRight: '0.2em' }} />
						<FormattedMessage id="search.results.statuses" />
					</div>
					<List>
						{statuses.map((status) => (
							<List.Item key={status.id} style={{ backgroundColor: 'var(--rs-border-primary)', padding: '4px 0' }}>
								<div style={{ padding: '12px 8px', cursor: 'pointer' }}>
									<Status
										status={status}
										client={props.client}
										server={props.server}
										account={props.account}
										columnWidth={280}
										updateStatus={updateStatus}
										openMedia={props.openMedia}
										setStatusDetail={setStatusDetail}
										setAccountDetail={setAccountDetail}
										setTagDetail={setTagDetail}
										openReport={props.openReport}
										openFromOtherAccount={props.openFromOtherAccount}
										customEmojis={customEmojis}
									/>
								</div>
							</List.Item>
						))}
					</List>
				</div>
			)}
		</>
	)
}

type UserProps = {
	user: Entity.Account
	open: (user: Entity.Account) => void
}

export const User: React.FC<UserProps> = (props) => {
	const { user, open } = props
	const { timelineConfig } = useContext(TheDeskContext)
	const isAnimeIcon = timelineConfig.animation === 'yes'

	return (
		<div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => open(user)}>
			{/** icon **/}
			<div style={{ width: '56px' }}>
				<div style={{ margin: '6px' }}>
					<Avatar src={isAnimeIcon ? user.avatar : user.avatar_static} />
				</div>
			</div>
			{/** name **/}
			<div style={{ paddingRight: '8px', width: 'cac(100% - 56px)', overflow: 'hidden' }}>
				<div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
					<span dangerouslySetInnerHTML={{ __html: emojify(user.display_name, user.emojis) }} />
				</div>
				<div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
					<span style={{ color: 'var(--rs-text-tertiary)' }}>@{user.acct}</span>
				</div>
			</div>
		</div>
	)
}
