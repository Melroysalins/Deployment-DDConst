export const MIN_X = 100
export const NODES_GAP = 150
export const NAMYUNG = ['XLPE', 'OF', 'Other']
export const CABLE_TYPE = ['154kV', '345kV', '746kV']
export const JUNCTION_BOX = [
	{ label: 'S/S', value: 'SS' },
	{ label: 'T/R', value: 'TR' },
]
export const JB_TYPE = [
	{ label: 'M/H', value: 'mh' },
	{ label: 'J/B', value: 'jb' },
]
export const CONNECTORS = [
	{ label: 'EB-A', value: 'square' },
	{ label: 'EB-G', value: 'recTri' },
]
export const PMJ = ['NJ', 'IJ', 'Pass']
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
	recTri: 'EB-G',
	square: 'EB-A',
}

export const STATUS_MAP = {
	notStarted: 'Not Started',
	inProgress: 'In Progress',
	completed: 'Completed',
}

export const generateNodesFromConnections = ({ id, connections, yPos, isDemolition }) => {
	const nodes = []
	const step = NODES_GAP
	connections.forEach((connection, index) => {
		const { pmj, joinType, status } = connection
		const imageUrl = `/static/svg/${pmj}-${status}.svg`

		const x = MIN_X + index * step
		const nodeId = `${id}.${index + 1}`
		const nodeName = `${pmj}#${index + 1}`
		const position = { x, y: yPos }
		const data = { imageUrl, name: nodeName, status }
		nodes.push({ id: nodeId, type: 'image', data, position })
	})

	const data = { name: isDemolition ? 'Old Of Section (Demolition)' : 'New CV Section (Installation)' }
	const position = { x: (connections.length * NODES_GAP - MIN_X) / 2, y: 50 }
	nodes.push({ id: 'heading', type: 'nodeHeading', data, position })

	return nodes
}

export const generateStartEndNode = ({
	seqNumber,
	yPos,
	startName,
	endName,
	connectionLength,
	startType,
	endType,
	startStatus,
	endStatus,
}) => {
	const startX = 0 // Fixed starting position for startX
	const step = NODES_GAP // Fixed 25px difference between each connection
	const endX = MIN_X + step * connectionLength
	const startImageUrl = `/static/svg/${startType}-${startStatus}.svg`
	const endImageUrl = `/static/svg/${endType}-${endStatus}.svg`
	const nameNumber = 1

	const nodes = [
		{
			id: `${seqNumber}.start`,
			type: 'image',
			data: { imageUrl: startImageUrl, name: `${startName}#${nameNumber}`, isEndbox: true, status: startStatus },
			position: { x: startX, y: yPos - 10 },
		},
		{
			id: `${seqNumber}.end`,
			type: 'image',
			data: { imageUrl: endImageUrl, name: `${endName}#${nameNumber}`, isEndbox: true, status: endStatus },
			position: { x: endX, y: yPos - 10 },
		},
	]
	return nodes
}

export const generateEdges = (startId, newObj, isDemolition) => {
	const count = newObj[isDemolition ? 'demolitions' : 'connections'].length
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
		const style = isDemolition
			? { stroke: STROKE_COLOR[newObj.demolitions[i - 1].status] }
			: { stroke: STROKE_COLOR[newObj.connections[i - 1].status] }
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
	notStarted: '#919EAB',
	inProgress: '#8D99FF',
	completed: '#FFA58D',
}

export function getStrokeStatusByColor(color) {
	const entry = Object.entries(STROKE_COLOR).find(([_, value]) => value === color)
	return entry ? entry[0] : null
}

export const defaultConnection = {
	joinType: JB_TYPE[0].value,
	pmj: PMJ[0],
	// status: STATUS[0].value,
	statuses: [STATUS[0].value],
}

export const defaultNewObj = {
	start: JUNCTION_BOX[0].value,
	end: JUNCTION_BOX[0].value,
	connections: [defaultConnection],
	demolitions: [defaultConnection],
	cableType: CABLE_TYPE[0],
	namyang: NAMYUNG[0],
	length: 600,
	length_demolition: 600,
	// startStatus: STATUS[0].value,
	// endStatus: STATUS[0].value,
	startStatuses: [STATUS[0].value],
	endStatuses: [STATUS[0].value],
	startConnector: CONNECTORS[0].value,
	endConnector: CONNECTORS[0].value,
}
