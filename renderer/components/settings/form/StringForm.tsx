import { useEffect, useState } from 'react'
import { Input } from 'rsuite'

type Props = {
	label: string
	hint?: string
	value: string
	onChange: (value: string) => void
	fontSize?: string | number
	row?: number
}
function StringForm(props: Props) {
	const [v, setV] = useState(props.value.toString())
	const isMultiline = props.row && props.row > 1
	useEffect(() => console.log(props.value), [props.value])
	return (
		<>
			<p style={{ marginTop: 15, marginBottom: 5, fontSize: props.fontSize || 20, fontWeight: 'bold' }}>{props.label}</p>
			{props.hint && <p style={{ marginBottom: 10 }}>{props.hint}</p>}
			{isMultiline ? (
				<Input as="textarea" value={v} onChange={(value) => setV(value.toString())} onBlur={() => props.onChange(v)} rows={props.row} />
			) : (
				<Input value={v} onChange={(value) => setV(value.toString())} onBlur={() => props.onChange(v)} />
			)}
		</>
	)
}
export default StringForm
