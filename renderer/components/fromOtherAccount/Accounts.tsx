import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Modal, Radio, RadioGroup } from 'rsuite'
import type { Account } from '@/entities/account'
import type { Server } from '@/entities/server'
import { listAccounts } from '@/utils/storage'

type Props = {
	next: (server: Server, account: Account) => void
}

export default function Accounts(props: Props) {
	const [accounts, setAccounts] = useState<Array<[Account, Server]>>([])
	const [index, setIndex] = useState<number | null>(null)

	useEffect(() => {
		const f = async () => {
			const accounts = await listAccounts()
			setAccounts(accounts)
		}
		f()
	}, [])

	return (
		<>
			<Modal.Body>
				<Modal.Title>
					<FormattedMessage id="fromOtherAccount.accounts.title" />
				</Modal.Title>
				<div style={{ paddingTop: '2em' }}>
					<RadioGroup name="account" value={index} onChange={(v) => setIndex(Number.parseInt(v.toString(), 10))}>
						{accounts.map((account, i) => (
							<Radio key={account[0].id} value={i}>
								{account[0].username}@{account[1].domain}
							</Radio>
						))}
					</RadioGroup>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button appearance="primary" block onClick={() => props.next(accounts[index][1], accounts[index][0])}>
					<FormattedMessage id="fromOtherAccount.accounts.next" />
				</Button>
			</Modal.Footer>
		</>
	)
}
