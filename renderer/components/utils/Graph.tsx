import { Entity } from '@cutls/megalodon'

export function GraphDraw({ his }: { his: Entity.Tag['history'] }) {
	if (!his || !his[0]?.uses) return null
	const max = Math.max.apply(null, [
		parseInt(his[0].uses.toString(), 10),
		parseInt(his[1].uses.toString(), 10),
		parseInt(his[2].uses.toString(), 10),
		parseInt(his[3].uses.toString(), 10),
		parseInt(his[4].uses.toString(), 10),
		parseInt(his[5].uses.toString(), 10),
		parseInt(his[6].uses.toString(), 10)
	])
	const six = 50 - (parseInt(his[6].uses.toString(), 10) / max) * 50
	const five = 50 - (parseInt(his[5].uses.toString(), 10) / max) * 50
	const four = 50 - (parseInt(his[4].uses.toString(), 10) / max) * 50
	const three = 50 - (parseInt(his[3].uses.toString(), 10) / max) * 50
	const two = 50 - (parseInt(his[2].uses.toString(), 10) / max) * 50
	const one = 50 - (parseInt(his[1].uses.toString(), 10) / max) * 50
	const zero = 50 - (parseInt(his[0].uses.toString(), 10) / max) * 50
	const ratio = 30 / 25
	const height = 40
	return (
		<svg version="1.1" viewBox="0 0 60 50" width={height * ratio} height={height}>
			<g>
				<path d={`M0,${six} L10,${five} 20,${four} 30,${three} 40,${two} 50,${one} 60,${zero} 61,61 0,61`} style={{ stroke: '#0f8c0c', fill: 'rgba(13,113,19,.25)', strokeWidth: 1 }}></path>
			</g>
		</svg>
	)
}
