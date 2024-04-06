import { InputLabel, Box, FormControl, MenuItem, Select } from '@mui/material'
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

const generateEdges = (startId, count) => {
	const edges = []
	edges.push({
		id: `${startId}.start-${startId}.1`,
		source: `${startId}.start`,
		target: `${startId}.1`,
		style: { stroke: '#FFA58D' },
	})
	for (let i = 1; i <= count; i += 1) {
		const source = `${startId}.${i}`
		const target = `${startId}.${i + 1}`
		const edgeId = `e${i}-${i + 1}`
		const style = { stroke: '#FFA58D' }
		edges.push({ id: edgeId, source, target, style })
	}
	edges.push({
		id: `${startId}.${count}-end`,
		source: `${startId}.${count}`,
		target: `${startId}.end`,
		style: { stroke: '#FFA58D' },
	})

	return edges
}

const defaultNodes = [
	{
		id: '1.start',
		type: 'image',
		data: { imageUrl: '/static/images/flowTriangle.png', name: 'S/S' },
		position: { x: 100, y: 50 },
	},
	{
		id: '1.end',
		type: 'image',
		data: { imageUrl: '/static/images/flowTriangle.png' },
		position: { x: 720, y: 50 },
	},
	{
		id: '2.start',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png' },
		position: { x: 5, y: 50 },
	},
	{
		id: '2.end',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png' },
		position: { x: 800, y: 50 },
	},

	{
		id: '3.start',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png', name: 'T/L' },
		position: { x: 100, y: 250 },
	},
	...generateNodes({
		id: '3',
		boxes: 4,
		y: 300,
		minX: 200,
		maxX: 600,
		imageUrl: '/static/images/flowD2.png',
		namePrefix: 'M/H',
	}),
	{
		id: '3.end',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png' },
		position: { x: 720, y: 250 },
	},
	{
		id: '4.start',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png' },
		position: { x: 5, y: 250 },
	},
	...generateNodes({
		id: '4',
		boxes: 4,
		y: 350,
		minX: 200,
		maxX: 600,
		imageUrl: '/static/images/flowD2.png',
		namePrefix: '',
	}),
	{
		id: '4.end',
		type: 'image',
		data: { imageUrl: '/static/images/flowD1.png' },
		position: { x: 800, y: 250 },
	},
	{
		id: 'new',
		type: 'nodeHeading',
		data: { name: 'New CV Section (Installation)' },
		position: { x: 300, y: 15 },
	},
	{
		id: 'old',
		type: 'nodeHeading',
		data: { name: 'Old OF Section (Demolition)' },
		position: { x: 300, y: 220 },
	},
]

const initialNodes = [
	...defaultNodes,
	...generateNodes({
		id: '1',
		boxes: 3,
		y: 100,
		minX: 200,
		maxX: 600,
		imageUrl: '/static/images/flowD2.png',
		namePrefix: 'J/B',
	}),
	...generateNodes({
		id: '2',
		boxes: 3,
		y: 160,
		minX: 200,
		maxX: 600,
		imageUrl: '/static/images/flowD2.png',
		namePrefix: '',
	}),
]

const defaultEdges = [...generateEdges('3', 4), ...generateEdges('4', 4)]

const initialEdges = [...defaultEdges, ...generateEdges('1', 3), ...generateEdges('2', 3)]

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
					<img src={data.imageUrl} alt="Custom Node" />
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

const App = () => {
	const [nodes, setNodes] = useNodesState(initialNodes)
	const [edges, setEdges] = useEdgesState(initialEdges)
	const [selectedValue, setSelectedValue] = useState('3')

	// Function to handle change in dropdown value
	const handleDropdownChange = (event) => {
		const value = event.target.value
		setSelectedValue(value)
		setNodes([
			...defaultNodes,
			...generateNodes({
				id: '1',
				boxes: value,
				y: 100,
				minX: 200,
				maxX: 600,
				imageUrl: '/static/images/flowD2.png',
				namePrefix: 'J/B',
			}),
			...generateNodes({
				id: '2',
				boxes: value,
				y: 160,
				minX: 200,
				maxX: 600,
				imageUrl: '/static/images/flowD2.png',
				namePrefix: '',
			}),
		])
		setEdges([...defaultEdges, ...generateEdges('1', value), ...generateEdges('2', value)])
	}

	return (
		<div style={{ height: 550, overflow: 'hidden' }}>
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

			<Box sx={{ display: 'flex', marginTop: 2, alignItems: 'center', justifyContent: 'center', gap: 2 }}>
				<div style={{ fontWeight: 'bold' }}>Select J/B</div>
				<FormControl style={{ width: 200 }}>
					<InputLabel>J/B</InputLabel>
					<Select size="small" value={selectedValue} label="J/B" onChange={handleDropdownChange}>
						<MenuItem value={2}>2</MenuItem>
						<MenuItem value={3}>3</MenuItem>
						<MenuItem value={4}>4</MenuItem>
					</Select>
				</FormControl>
			</Box>
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
		</div>
	)
}

export default App
