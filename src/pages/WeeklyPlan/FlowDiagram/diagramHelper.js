export const MIN_X = 200
export const NAMYUNG = ['XLPE', 'OF', 'Other']
export const CABLE_TYPE = ['154kV', '345kV', '746kV']
export const JUNCTION_BOX = [
	{ label: 'T/R', value: 'recTri' },
	{ label: 'S/S', value: 'square' },
]
export const JB_TYPE = [
	{ label: 'J/B', value: 'jb' },
	{ label: 'M/H', value: 'mh' },
]
export const CONNECTORS = [
	{ label: 'EB-A', value: 'EB-A' },
	{ label: 'EB-G', value: 'EB-G' },
]
export const PMJ = ['IJ', 'NJ', 'Pass']
export const STATUS = [
	{ label: 'Not Started', value: 'notStarted' },
	{ label: 'In Progress', value: 'inProgress' },
	{ label: 'Completed', value: 'completed' },
]

export const JB_TYPE_MAP = {
	jb: 'J/B',
	mh: 'M/H',
}
export const JUNCTION_BOX_MAP = {
	recTri: 'T/R',
	square: 'S/S',
}

export const STATUS_MAP = {
	notStarted: 'Not Started',
	inProgress: 'In Progress',
	completed: 'Completed',
}

export const generateNodesFromConnections = ({ id, connections, yPos, length = 600 }) => {
	const nodes = []
	const step = (length - MIN_X) / connections.length
	connections.forEach((connection, index) => {
		const { joinType, status } = connection
		const imageUrl = `/static/svg/${joinType}-${status}.svg`

		const start = MIN_X + index * step
		const x = (start + (start + step)) / 2
		const nodeId = `${id}.${index + 1}`
		const nodeName = `${JB_TYPE_MAP[joinType]}#${index + 1}`
		const position = { x, y: yPos }
		const data = { imageUrl, name: nodeName, status }
		nodes.push({ id: nodeId, type: 'image', data, position })
	})

	return nodes
}

export const generateStartEndNode = ({
	seqNumber,
	yPos,
	startName,
	endName,
	startX = 100,
	endX = 730,
	start,
	end,
	startStatus,
	endStatus,
}) => {
	start = `/static/svg/${start}-${startStatus}.svg`
	end = `/static/svg/${end}-${endStatus}.svg`
	const nameNumber = 1
	const nodes = [
		{
			id: `${seqNumber}.start`,
			type: 'image',
			data: { imageUrl: start, name: `${startName}#${nameNumber}`, isEndbox: true, status: startStatus },
			position: { x: startX, y: yPos - 10 },
		},
		{
			id: `${seqNumber}.end`,
			type: 'image',
			data: { imageUrl: end, name: `${endName}#${nameNumber}`, isEndbox: true, status: endStatus },
			position: { x: endX, y: yPos - 10 },
		},
	]
	return nodes
}

export const generateEdges = (startId, newObj) => {
	const count = newObj.connections.length
	const edges = []
	const type = 'step'
	edges.push({
		id: `${startId}.start`,
		source: `${startId}.start`,
		target: `${startId}.1`,
		style: { stroke: STROKE_COLOR[newObj.startStatus] },
		type,
	})
	for (let i = 1; i <= count; i += 1) {
		const source = `${startId}.${i}`
		const target = `${startId}.${i + 1}`
		const edgeId = `e${i}-${i + 1}`
		const style = { stroke: STROKE_COLOR[newObj.connections[i - 1].status] }
		edges.push({ id: edgeId, source, target, style, type })
	}
	edges.push({
		id: `${startId}-end`,
		source: `${startId}.${count}`,
		target: `${startId}.end`,
		style: { stroke: STROKE_COLOR[newObj.endStatus] },
		type,
	})

	return edges
}

export const initialNodes = []
export const initialEdges = []

export const STROKE_COLOR = {
	notStarted: '#FFA58D',
	inProgress: '#8D99FF',
	completed: '#919EAB',
}

export function getStrokeStatusByColor(color) {
	const entry = Object.entries(STROKE_COLOR).find(([_, value]) => value === color)
	return entry ? entry[0] : null
}

export const defaultConnection = {
	joinType: JB_TYPE[0].value,
	pmj: PMJ[0],
	status: STATUS[0].value,
}

export const defaultNewObj = {
	start: JUNCTION_BOX[0].value,
	end: JUNCTION_BOX[0].value,
	connections: [defaultConnection],
	cableType: CABLE_TYPE[0],
	namyang: NAMYUNG[0],
	length: 600,
	startStatus: STATUS[0].value,
	endStatus: STATUS[0].value,
	startConnector: CONNECTORS[0].value,
	endConnector: CONNECTORS[0].value,
}
