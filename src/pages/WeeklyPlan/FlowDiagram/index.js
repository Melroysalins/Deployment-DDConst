import { InputLabel, Box, FormControl, MenuItem, Select, Button } from '@mui/material'
import React, { useState } from 'react'
import ReactFlow, { useNodesState, useEdgesState, Handle, Position } from 'reactflow'
import 'reactflow/dist/style.css'

const generateNodes = ({ id, boxes, y, minX, maxX, imageUrl, namePrefix }) => {
	const nodes = []
	const interval = (maxX - minX) / (boxes - 1)
	for (let i = 0; i < boxes; i += 1) {
		const x = minX + interval * i
		const nodeId = `${id}.${i + 1}`
		const nodeName = namePrefix ? `${namePrefix}#${i + 1}` : ``
		const position = { x, y }
		const data = { imageUrl, name: nodeName }
		nodes.push({ id: nodeId, type: 'image', data, position })
	}
	return nodes
}

const generateStartEndNode = ({ seqNumber, yPos, name = 'T/L', startX = 100, endX = 730, imageUrl }) => {
	imageUrl = `/static/svg/${imageUrl}.svg`
	const nodes = [
		{
			id: `${seqNumber}.start`,
			type: 'image',
			data: { imageUrl, name: `${name}#${seqNumber}` },
			position: { x: startX, y: yPos - 30 },
		},
		{
			id: `${seqNumber}.end`,
			type: 'image',
			data: { imageUrl, name: `${name}#${seqNumber}` },
			position: { x: endX, y: yPos - 30 },
		},
	]
	return nodes
}

const generateEdges = (startId, count, stroke = '#FFA58D') => {
	const edges = []
	edges.push({
		id: `${startId}.start-${startId}.1`,
		source: `${startId}.start`,
		target: `${startId}.1`,
		style: { stroke },
	})
	for (let i = 1; i <= count; i += 1) {
		const source = `${startId}.${i}`
		const target = `${startId}.${i + 1}`
		const edgeId = `e${i}-${i + 1}`
		const style = { stroke }
		edges.push({ id: edgeId, source, target, style })
	}
	edges.push({
		id: `${startId}.${count}-end`,
		source: `${startId}.${count}`,
		target: `${startId}.end`,
		style: { stroke },
	})

	return edges
}

const defaultNodes = [
	{
		id: '1.start',
		type: 'image',
		data: { imageUrl: '/static/svg/recTri-notStarted.svg', name: 'T/L' },
		position: { x: 100, y: 50 },
	},
	...generateNodes({
		id: '1',
		boxes: 4,
		y: 100,
		minX: 200,
		maxX: 600,
		imageUrl: '/static/svg/mh-notStarted.svg',
		namePrefix: 'M/H',
	}),
	{
		id: '1.end',
		type: 'image',
		data: { imageUrl: '/static/svg/recTri-notStarted.svg' },
		position: { x: 730, y: 50 },
	},
	{
		id: '2.start',
		type: 'image',
		data: { imageUrl: '/static/svg/recTri-notStarted.svg' },
		position: { x: 5, y: 50 },
	},
	...generateNodes({
		id: '2',
		boxes: 4,
		y: 150,
		minX: 200,
		maxX: 600,
		imageUrl: '/static/svg/mh-notStarted.svg',
		namePrefix: '',
	}),
	{
		id: '2.end',
		type: 'image',
		data: { imageUrl: '/static/svg/recTri-notStarted.svg' },
		position: { x: 800, y: 50 },
	},
	{
		id: 'new',
		type: 'nodeHeading',
		data: { name: 'New CV Section (Installation)' },
		position: { x: 300, y: 200 },
	},
	{
		id: 'old',
		type: 'nodeHeading',
		data: { name: 'Old OF Section (Demolition)' },
		position: { x: 300, y: 15 },
	},
]

const initialNodes = [...defaultNodes]

const defaultEdges = [...generateEdges('1', 4), ...generateEdges('2', 4)]
const initialEdges = [...defaultEdges]

const nodeTypes = {
	image: ({ data }) => (
		<>
			{data.name && (
				<div style={{ position: 'absolute', top: -30 }}>
					<span
						style={{ padding: '5px 10px', border: '1px solid #EDEDEF', borderRadius: 7, marginLeft: 20, fontSize: 12 }}
					>
						{data.name}
					</span>
				</div>
			)}
			<div>
				<Handle type="target" position={Position.Left} isConnectable={false} />
				<div>
					<img src={data.imageUrl} alt="Custom Node" style={{ fill: 'blue' }} />
				</div>
				<Handle type="source" position={Position.Right} id="a" isConnectable={false} />
			</div>
		</>
	),
	nodeHeading: ({ data }) => (
		<>
			<div>
				<span
					style={{
						padding: '5px 10px',
						border: '1px solid #EDEDEF',
						borderRadius: 7,
						marginLeft: 20,
						fontWeight: 500,
					}}
				>
					{data.name}
				</span>
			</div>
		</>
	),
}

const STROKE_COLOR = {
	notStarted: '#FFA58D',
	inProgress: '#8D99FF',
	completed: '#919EAB',
}

const defaultNewObj = { boxType: 'recTri', joinType: 'J/B', status: 'notStarted', nodes: 2 }
const App = () => {
	const [nodes, setNodes] = useNodesState(initialNodes)
	const [edges, setEdges] = useEdgesState(initialEdges)
	const [seqNumber, setseqNumber] = useState(3)
	const [newObj, setnewObj] = useState(defaultNewObj)

	const DDD = () => {
		return (
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				minZoom={1} // Disable zooming out
				maxZoom={1} // Disable zooming in
				interactionProps={{
					zoomOnScroll: false,
					panOnDrag: false,
				}}
				nodesDraggable={false} // Disable node dragging
				nodesConnectable={false}
			/>
		)
	}

	const handleNewObjChange = (e, type) => {
		setnewObj({ ...newObj, [type]: e })
	}

	const handleAdd = () => {
		console.log('newObj', newObj)
		const yPos = seqNumber * 100 - 50
		setNodes([
			...nodes,
			...generateNodes({
				id: seqNumber,
				boxes: newObj.nodes,
				y: yPos,
				minX: 200,
				maxX: 600,
				imageUrl: `/static/svg/${newObj.joinType === 'J/B' ? 'jb' : 'mh'}-${newObj.status}.svg`,
				namePrefix: newObj.joinType,
			}),
			...generateStartEndNode({ seqNumber, yPos, imageUrl: `${newObj.boxType}-${newObj.status}` }),
		])
		setEdges([...edges, ...generateEdges(seqNumber, newObj.nodes, STROKE_COLOR[newObj.status])])
		setnewObj(defaultNewObj)
		setseqNumber(seqNumber + 1)
	}

	return (
		<div style={{ height: seqNumber * 150, overflow: 'hidden' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div
					style={{
						border: '2px solid #DA4C57',
						width: '100%',
						textAlign: 'center',
						borderRight: 0,
						padding: 2,
						borderTopLeftRadius: 10,
						borderBottomLeftRadius: 10,
					}}
				>
					Complex Const section: <span style={{ color: '#DA4C57' }}>RED</span>
				</div>
				<div
					style={{
						border: '2px solid #8D99FF',
						width: '100%',
						textAlign: 'center',
						borderRight: 0,
						borderLeft: 0,
						padding: 2,
					}}
				>
					Const Section in progress: <span style={{ color: '#8D99FF' }}>BLUE</span>
				</div>
				<div
					style={{
						border: '2px solid #919EAB',
						width: '100%',
						textAlign: 'center',
						borderLeft: 0,
						padding: 2,
						borderTopRightRadius: 10,
						borderBottomRightRadius: 10,
					}}
				>
					Unconstructed: <span style={{ color: '#919EAB' }}>BLACK</span>
				</div>
			</div>

			<Box
				sx={{
					display: 'flex',
					marginTop: 2,
					alignItems: 'flex-end',
					justifyContent: 'center',
					gap: 1,
					flexWrap: 'wrap',
				}}
				mb={2}
			>
				<div>
					<FormControl style={{ width: 200 }}>
						<InputLabel>Endbox Type</InputLabel>
						<Select
							size="small"
							value={newObj.boxType}
							label="Endbox Type"
							onChange={(e) => handleNewObjChange(e.target.value, 'boxType')}
						>
							<MenuItem value={'square'}>Square</MenuItem>
							<MenuItem value={'recTri'}>Square w/ Triangle</MenuItem>
						</Select>
					</FormControl>
				</div>

				<div>
					<FormControl style={{ width: 200 }}>
						<InputLabel>Join Type</InputLabel>
						<Select
							size="small"
							value={newObj.joinType}
							label="Join Type"
							onChange={(e) => handleNewObjChange(e.target.value, 'joinType')}
						>
							<MenuItem value={'J/B'}>J/B</MenuItem>
							<MenuItem value={'M/H'}>M/H</MenuItem>
						</Select>
					</FormControl>
				</div>

				<div>
					<FormControl style={{ width: 200 }}>
						<InputLabel>Seq Number</InputLabel>
						<Select size="small" value={seqNumber} label="Seq Number" disabled>
							<MenuItem value={seqNumber}>{seqNumber}</MenuItem>
						</Select>
					</FormControl>
				</div>

				<div>
					<FormControl style={{ width: 200 }}>
						<InputLabel>Status</InputLabel>
						<Select
							size="small"
							value={newObj.status}
							label="Status"
							onChange={(e) => handleNewObjChange(e.target.value, 'status')}
						>
							<MenuItem value={'notStarted'}>Not Started</MenuItem>
							<MenuItem value={'inProgress'}>In Progress</MenuItem>
							<MenuItem value={'completed'}>Completed</MenuItem>
						</Select>
					</FormControl>
				</div>

				<div>
					<FormControl style={{ width: 200 }}>
						<InputLabel>Nodes</InputLabel>
						<Select
							size="small"
							value={newObj.nodes}
							label="Nodes"
							onChange={(e) => handleNewObjChange(e.target.value, 'nodes')}
						>
							<MenuItem value={2}>2</MenuItem>
							<MenuItem value={3}>3</MenuItem>
							<MenuItem value={4}>4</MenuItem>
						</Select>
					</FormControl>
				</div>
				<Button variant="contained" sx={{ marginLeft: 3 }} onClick={handleAdd}>
					Add New
				</Button>
			</Box>

			<DDD />
		</div>
	)
}

export default App
