export const MIN_X = 45
export const NODES_GAP = 75
export const START_POS = 10
const GAP_LINES_Y_AXIS = 40
const GAP_LINES_X_AXIS = 33

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
		const { pmj, joinType, statuses } = connection
		statuses.forEach((status, statusIndex) => {
			const imageUrl = `/static/svg/${pmj}-${status}.svg`

			const x = START_POS + MIN_X + index * step
			const nodeId = `${id}.${index + 1}.${statusIndex + 1}`
			const nodeName = `${JB_TYPE_MAP[joinType]}#${index + 1}`
			const position = { x, y: yPos + statusIndex * GAP_LINES_Y_AXIS } // Adjust yPos for each status
			const data = { imageUrl, name: nodeName, status }

			nodes.push({ id: nodeId, type: 'image', data, position })
		})
	})

	const headingData = { name: isDemolition ? 'Old Of Section' : 'New CV Section' }
	const headingPosition = { x: START_POS + (connections.length * NODES_GAP - MIN_X) / 2, y: 50 }
	nodes.push({ id: 'heading', type: 'nodeHeading', data: headingData, position: headingPosition })

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
	startStatuses,
	endStatuses,
	startEndLength,
}) => {
	const startX = START_POS
	const step = NODES_GAP
	const endX = startX + MIN_X + step * connectionLength

	const nodes = []
	startStatuses.forEach((startStatus, index) => {
		if (index >= startEndLength) return
		const startImageUrl = `/static/svg/${startType}-${startStatus}.svg`
		const xPosition = startX - index * GAP_LINES_X_AXIS

		nodes.push({
			id: `${seqNumber}.start.${index + 1}`,
			type: 'image',
			data: { imageUrl: startImageUrl, name: `${startName}#${index + 1}`, isEndbox: true, status: startStatus },
			position: { x: xPosition + 5, y: yPos },
		})
	})

	endStatuses.forEach((endStatus, index) => {
		if (index >= startEndLength) return
		const endImageUrl = `/static/svg/${endType}-${endStatus}.svg`
		const xPosition = endX + index * GAP_LINES_X_AXIS

		nodes.push({
			id: `${seqNumber}.end.${index + 1}`,
			type: 'image',
			data: { imageUrl: endImageUrl, name: `${endName}#${index + 1}`, isEndbox: true, status: endStatus },
			position: { x: xPosition - 5, y: yPos },
		})
	})

	return nodes
}

export const generateEdges = (startId, newObj, isDemolition) => {
    const items = newObj.currentObj[isDemolition ? 'demolitions' : 'installations'];
    const edges = [];
    const type = 'step';

    if (isDemolition) {
        // Generate edges from the start node to each status of the first connection
        newObj.currentObj.startStatuses.forEach((status, index) => {
            edges.push({
                id: `${startId}.start.${index + 1}`,
                source: `${startId}.start.${index + 1}`,
                target: `${startId}.1.${index + 1}`,
                style: { stroke: STROKE_COLOR[status] },
                type,
            });
        });

        // Generate edges between the statuses of connections
        items.forEach((item, i) => {
            item.statuses.forEach((status, j) => {
                if (i < items.length - 1) {
                    edges.push({
                        id: `${startId}.${i + 1}-${i + 2}.${j + 1}`,
                        source: `${startId}.${i + 1}.${j + 1}`,
                        target: `${startId}.${i + 2}.${j + 1}`,
                        style: { stroke: STROKE_COLOR[status] },
                        type,
                    });
                }
            });
        });

        // Generate edges from the statuses of the last connection to the end node
        newObj.currentObj.endStatuses.forEach((status, index) => {
            edges.push({
                id: `${startId}.end.${index + 1}`,
                source: `${startId}.${items.length}.${index + 1}`,
                target: `${startId}.end.${index + 1}`,
                style: { stroke: STROKE_COLOR[status] },
                type,
            });
        });
    } else {
        items.forEach((item, i) => {
            item.statuses.forEach((status, j) => {
                if (i === 0) {
                    // Generate edges from the start node to the first status of each connection
                    edges.push({
                        id: `${startId}.start.${j + 1}`,
                        source: `${startId}.start.${j + 1}`,
                        target: `${startId}.${i + 1}.${j + 1}`,
                        style: { stroke: STROKE_COLOR[status] },
                        type,
                    });
                } 
				else if (i === items.length - 1) {
					edges.push({
						id: `${startId}.end.${j + 1}`,
						source: `${startId}.${items.length-1}.${j + 1}`,
						target: `${startId}.end.${j + 1}`,
						style: { stroke: STROKE_COLOR[status] },
						type,
					});
				} 
				else {
                    edges.push({
                        id: `${startId}.${i}-${i + 1}.${j + 1}`,
                        source: `${startId}.${i}.${j + 1}`,
                        target: `${startId}.${i + 1}.${j + 1}`,
                        style: { stroke: STROKE_COLOR[status] },
                        type,
                    });
                }
            });
        });
    }

    return edges;
};

export const initialNodes = []
export const initialEdges = []

export const STROKE_COLOR = {
	notStarted: '#919EAB',
	inProgress: '#8D99FF',
	completed: '#FFA58D',
}

export const COLOR_MAP = {
	'#919EAB': 'notStarted',
	'#8D99FF': 'inProgress',
	'#FFA58D': 'completed',
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
	note: '',
}

export const defaultNewObj = {
	start: JUNCTION_BOX[0].value,
	end: JUNCTION_BOX[0].value,
	startNote: '',
	endNote: '',
	connections: [defaultConnection],
	// adding statuses and note for installations
	installations: [{ statuses: [STATUS[0].value], note: ''}],
	demolitions: [defaultConnection],
	cableType: CABLE_TYPE[0],
	namyang: NAMYUNG[0],
	// change length to array for multiple installation and demolition
	length: [600],
	length_demolition: [600],
	// startStatus: STATUS[0].value,
	// endStatus: STATUS[0].value,
	startStatuses: [STATUS[0].value],
	endStatuses: [STATUS[0].value],
	startConnector: CONNECTORS[0].value,
	endConnector: CONNECTORS[0].value,
}
